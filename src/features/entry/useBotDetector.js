import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * useBotDetector
 *
 * Tracks multiple behavioural signals to detect automated/bot form submissions.
 *
 * Signals tracked:
 *  - navigator.webdriver   → Selenium / WebDriver flag
 *  - hasMouseMoved         → Did the user move their mouse at all?
 *  - timeOnPage (ms)       → How long since the hook mounted?
 *  - avgKeystrokeDelay(ms) → Average time between keystrokes (<10ms = bot)
 *  - maxInputJump          → Largest single-event character delta (>10 = pasted/bot)
 *  - honeypotFilled        → Was a hidden honeypot field filled?
 *  - totalKeystrokes       → Total number of keystrokes recorded
 *  - backspaceCount        → How many times Backspace was pressed (0 with many keys = bot)
 *
 * Usage:
 *   const { getBotSignals, onKeystroke, onInputChange, honeypotProps } = useBotDetector();
 *
 *   // Attach onKeystroke to onKeyDown of text inputs
 *   // Attach onInputChange to onChange of text inputs (pass new value string)
 *   // Spread honeypotProps onto a hidden <input> field in your form
 *   // Call getBotSignals() at submit time to get the full report
 */
export default function useBotDetector() {
    const mountTime = useRef(Date.now());

    // Mouse movement
    const [hasMouseMoved, setHasMouseMoved] = useState(false);

    // Keystroke timing
    const lastKeyTime = useRef(null);
    const keystrokeDelays = useRef([]);
    const backspaceCount = useRef(0);

    // Input jump (detect large single-event value changes)
    const prevInputLength = useRef({});
    const maxInputJump = useRef(0);

    // Honeypot
    const [honeypot, setHoneypot] = useState('');

    // navigator.webdriver check (run once)
    const isWebDriver = useRef(
        typeof navigator !== 'undefined' && navigator.webdriver === true
    );

    // Mouse move — set once
    useEffect(() => {
        if (hasMouseMoved) return;
        const handler = () => setHasMouseMoved(true);
        window.addEventListener('mousemove', handler, { once: true });
        window.addEventListener('touchstart', handler, { once: true });
        return () => {
            window.removeEventListener('mousemove', handler);
            window.removeEventListener('touchstart', handler);
        };
    }, [hasMouseMoved]);

    /**
     * Call this on onKeyDown of any text input.
     * Pass the native keyboard event so Backspace can be detected.
     */
    const onKeystroke = useCallback((e) => {
        const now = Date.now();
        if (lastKeyTime.current !== null) {
            const delay = now - lastKeyTime.current;
            keystrokeDelays.current.push(delay);
        }
        lastKeyTime.current = now;

        // Track backspace presses
        if (e && (e.key === 'Backspace' || e.key === 'Delete')) {
            backspaceCount.current += 1;
        }
    }, []);

    /**
     * Call this on onChange of any text input, passing a unique fieldKey and new value string.
     * fieldKey should be something like the QId or field name.
     */
    const onInputChange = useCallback((fieldKey, newValue) => {
        const newLen = typeof newValue === 'string' ? newValue.length : 0;
        const prevLen = prevInputLength.current[fieldKey] || 0;
        const delta = newLen - prevLen;
        if (delta > maxInputJump.current) {
            maxInputJump.current = delta;
        }
        prevInputLength.current[fieldKey] = newLen;
    }, []);

    /**
     * Call at submit time to get all collected signals.
     */
    const getBotSignals = useCallback(() => {
        const delays = keystrokeDelays.current;
        const avgKeystrokeDelay = delays.length > 0
            ? Math.round(delays.reduce((a, b) => a + b, 0) / delays.length)
            : null;

        const timeOnPage = Date.now() - mountTime.current;

        // Bot score: count how many signals fire
        let botScore = 0;
        const flags = [];

        if (isWebDriver.current) { botScore += 3; flags.push('webdriver'); }
        if (!hasMouseMoved)       { botScore += 2; flags.push('no_mouse_move'); }
        if (timeOnPage < 3000)    { botScore += 2; flags.push('too_fast'); }
        if (maxInputJump.current > 10) { botScore += 2; flags.push('input_jump'); }
        if (avgKeystrokeDelay !== null && avgKeystrokeDelay < 10) {
            botScore += 2; flags.push('fast_keystrokes');
        }
        if (honeypot !== '')      { botScore += 5; flags.push('honeypot_filled'); }
        // No backspace at all + significant typing = suspicious (bots type perfectly)
        const totalKeys = keystrokeDelays.current.length + (lastKeyTime.current !== null ? 1 : 0);
        if (backspaceCount.current === 0 && totalKeys > 15) {
            botScore += 1; flags.push('no_backspace');
        }

        // Risk level
        let riskLevel = 'low';
        if (botScore >= 5) riskLevel = 'medium';
        if (botScore >= 8) riskLevel = 'high';

        return {
            isWebDriver: isWebDriver.current,
            hasMouseMoved,
            timeOnPage,
            avgKeystrokeDelay,
            totalKeystrokes: delays.length + (lastKeyTime.current !== null ? 1 : 0),
            backspaceCount: backspaceCount.current,
            maxInputJump: maxInputJump.current,
            honeypotFilled: honeypot !== '',
            botScore,
            riskLevel,
            flags,
        };
    }, [hasMouseMoved, honeypot]);

    /**
     * Spread these props onto a visually hidden <input> in your form.
     * Bots will fill it; humans won't.
     */
    const honeypotProps = {
        type: 'text',
        name: 'website_url',           // common bot target field names
        value: honeypot,
        onChange: (e) => setHoneypot(e.target.value),
        autoComplete: 'off',
        tabIndex: -1,
        'aria-hidden': true,
        style: {
            position: 'absolute',
            left: '-9999px',
            top: '-9999px',
            opacity: 0,
            height: 0,
            width: 0,
            overflow: 'hidden',
            pointerEvents: 'none',
        },
    };

    return {
        getBotSignals,
        onKeystroke,
        onInputChange,
        honeypotProps,
    };
}
