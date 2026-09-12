import React, { useEffect } from 'react';
import { themeClasses, themeColors } from '../../theme/themeConfig';

const MyLoader = () => {
    useEffect(() => {
        const originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = originalStyle;
        };
    }, []);

    // Set custom CSS variables for the animations to pick up theme colors
    const loaderStyle = {
        '--loader-color': themeColors.loader.textColor,
        '--loader-rgb': '91, 33, 182' // Default RGB fallback if needed
    };

    return (
        <div 
            className={`fixed inset-0 w-full h-[100dvh] flex items-center justify-center z-[9999] loader-fade-in relative overflow-hidden select-none p-4 sm:p-6 ${themeClasses.mainBackground}`}
            style={loaderStyle}
        >
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
                <div className={`w-[560px] h-[560px] rounded-full blur-3xl aura-anim ${themeClasses.ambientOrb1}`}></div>
            </div>

            <main role="status" aria-live="polite" className="relative z-10 flex flex-col items-center justify-center text-center w-full max-w-xs sm:max-w-sm mx-auto">
                <div className="relative flex items-center justify-center mb-8 mx-auto">
                    
                    {/* Radar scanning pulse rings */}
                    <div className="absolute w-36 h-36 rounded-full border border-brandLoader-text/30 radar-ring-1 pointer-events-none"></div>
                    <div className="absolute w-36 h-36 rounded-full border border-brandLoader-text/20 radar-ring-2 pointer-events-none"></div>
                    <div className="absolute w-32 h-32 bg-brandLoader-text/15 rounded-full blur-xl aura-anim pointer-events-none"></div>

                    {/* Survey Document Assembly Graphic */}
                    <div className="relative clipboard-float filter drop-shadow-[0_18px_32px_rgba(109,40,217,0.2)] flex items-center justify-center">
                        <svg width="120" height="146" viewBox="0 0 116 142" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <linearGradient id="boardGrad" x1="12" y1="12" x2="104" y2="136" gradientUnits="userSpaceOnUse">
                                    <stop offset="0%" stopColor={themeColors.background.gradientVia} />
                                    <stop offset="100%" stopColor={themeColors.background.gradientTo} />
                                </linearGradient>

                                <linearGradient id="clipGrad" x1="40" y1="2" x2="76" y2="20" gradientUnits="userSpaceOnUse">
                                    <stop offset="0%" stopColor={themeColors.loader.textColor} />
                                    <stop offset="100%" stopColor={themeColors.primary.gradientFrom} />
                                </linearGradient>

                                <linearGradient id="penGrad" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor={themeColors.primary.gradientHoverFrom} />
                                    <stop offset="50%" stopColor={themeColors.loader.textColor} />
                                    <stop offset="100%" stopColor={themeColors.primary.gradientTo} />
                                </linearGradient>

                                <filter id="subtleGlow" x="-20%" y="-20%" width="140%" height="140%">
                                    <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor={themeColors.loader.textColor} floodOpacity="0.3"/>
                                </filter>
                            </defs>

                            {/* Clipboard Outer Frame */}
                            <rect x="8" y="10" width="100" height="126" rx="18" fill="url(#boardGrad)" stroke={themeColors.background.gradientTo} strokeWidth="1.8"/>

                            {/* Survey Form Sheet */}
                            <rect x="15" y="18" width="86" height="111" rx="12" fill="#ffffff" stroke="#f1f5f9" strokeWidth="1.2"/>

                            {/* 1. Header Bar */}
                            <rect x="23" y="27" width="38" height="4" rx="2" fill="#cbd5e1" opacity="0.85"/>

                            {/* 2. Checklist Row: Checkbox + Long Choice Bar */}
                            <g className="anim-row-check">
                                <rect x="23" y="36" width="17" height="17" rx="5" fill={themeColors.loader.textColor} className="anim-checkbox"/>
                                <path d="M27.5 44.5L30.5 47.5L35.5 41.5" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="anim-check"/>
                                <rect x="45" y="41.5" width="46" height="6.5" rx="3.25" fill={themeColors.loader.textColor} opacity="0.95" className="anim-line-1"/>
                            </g>

                            {/* 3. First Subline */}
                            <rect x="23" y="58" width="28" height="3.5" rx="1.75" fill="#e2e8f0"/>

                            {/* 4. Five Golden/Orange Rating Stars */}
                            <g className="stars-group">
                                <path className="anim-star-1" d="M27 64.5L28.2 67L31 67.3L29 69.2L29.5 72L27 70.6L24.5 72L25 69.2L23 67.3L25.8 67Z" fill="#f59e0b"/>
                                <path className="anim-star-2" d="M38 64.5L39.2 67L42 67.3L40 69.2L40.5 72L38 70.6L35.5 72L36 69.2L34 67.3L36.8 67Z" fill="#f59e0b"/>
                                <path className="anim-star-3" d="M49 64.5L50.2 67L53 67.3L51 69.2L51.5 72L49 70.6L46.5 72L47 69.2L45 67.3L47.8 67Z" fill="#f59e0b"/>
                                <path className="anim-star-4" d="M60 64.5L61.2 67L64 67.3L62 69.2L62.5 72L60 70.6L57.5 72L58 69.2L56 67.3L58.8 67Z" fill="#f59e0b"/>
                                <path className="anim-star-5" d="M71 64.5L72.2 67L75 67.3L73 69.2L73.5 72L71 70.6L68.5 72L69 69.2L67 67.3L69.8 67Z" fill="#f59e0b"/>
                            </g>

                            {/* 5. Second Subline */}
                            <rect x="23" y="77.5" width="32" height="3.5" rx="1.75" fill="#e2e8f0"/>

                            {/* 6. Slider Question Row */}
                            <g className="slider-group">
                                <rect x="23" y="87" width="58" height="5" rx="2.5" fill="#f1f5f9"/>
                                <rect x="23" y="87" width="42" height="5" rx="2.5" fill={themeColors.loader.textColor} className="anim-slider-track"/>
                                <circle cx="65" cy="89.5" r="5.5" fill={themeColors.loader.textColor} stroke="#ffffff" strokeWidth="1.8" filter="url(#subtleGlow)" className="anim-slider-knob"/>
                            </g>

                            {/* Metallic Top Clip */}
                            <g>
                                <rect x="38" y="3" width="40" height="15" rx="7.5" fill="url(#clipGrad)" filter="url(#subtleGlow)"/>
                                <rect x="41" y="5" width="34" height="2.5" rx="1.25" fill={themeColors.background.gradientTo} opacity="0.6"/>
                                <circle cx="58" cy="10.5" r="3.2" fill="#ffffff"/>
                                <circle cx="58" cy="10.5" r="1.6" fill={themeColors.loader.textColor}/>
                            </g>

                            {/* Survey Pen / Stylus */}
                            <g transform="translate(86, 114) rotate(-35)" className="survey-pen-group">
                                <path d="M0,0 L-2.5,-5 L2.5,-5 Z" fill={themeColors.primary.gradientTo}/>
                                <path d="M-2.5,-5 L2.5,-5 L3.2,-8 L-3.2,-8 Z" fill={themeColors.primary.gradientHoverTo}/>
                                <rect x="-3.2" y="-10" width="6.4" height="2" rx="0.5" fill={themeColors.background.gradientVia}/>
                                <rect x="-3.2" y="-28" width="6.4" height="18" rx="1" fill="url(#penGrad)"/>
                                <line x1="-1.2" y1="-26" x2="-1.2" y2="-12" stroke="#ffffff" strokeWidth="0.8" strokeLinecap="round" opacity="0.6"/>
                                <rect x="-3.2" y="-32" width="6.4" height="4" rx="2" fill={themeColors.primary.gradientFrom}/>
                            </g>
                        </svg>
                    </div>
                </div>

                <h1 className={`m-0 text-center ${themeClasses.typography.headlineLarge} ${themeClasses.text.primary}`}>
                    Hang tight!
                </h1>

                <p className={`mt-2.5 flex items-center justify-center gap-1.5 ${themeClasses.typography.bodyLarge} ${themeClasses.text.secondary}`}>
                    <span>Searching and assembling your survey</span>
                    <span className="inline-flex items-center gap-1 ml-0.5" aria-hidden="true">
                        <span className="dot-1 w-1.5 h-1.5 rounded-full bg-brandLoader-text"></span>
                        <span className="dot-2 w-1.5 h-1.5 rounded-full bg-brandLoader-text"></span>
                        <span className="dot-3 w-1.5 h-1.5 rounded-full bg-brandLoader-text"></span>
                    </span>
                </p>
            </main>
        </div>
    )
}

export default MyLoader;
