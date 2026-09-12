import React, { useState, useMemo } from 'react';
import useBotDetector from '../../../hooks/useBotDetector';
import { useSelector } from 'react-redux';
import { getTranslationsByCountryId } from '../../../locales';
import { themeClasses } from '../../../theme/themeConfig';
import { ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import Button from '../../../components/button/Button';
import OptionCard from '../../../components/optionCard/OptionCard';

// --------------------------------------------------------------------------------
// Standard Survey Question Data
// --------------------------------------------------------------------------------

const ATTENTION_CHECKS = [
    { id: 'ac1', question: 'What is 2 + 3?', options: ['3', '4', '5', '6'], correctValue: '5' },
    { id: 'ac2', question: 'What is 10 - 4?', options: ['4', '5', '6', '7'], correctValue: '6' },
    { id: 'ac3', question: 'How many days are there in a week?', options: ['5', '6', '7', '8'], correctValue: '7' },
    { id: 'ac4', question: 'What is 3 x 3?', options: ['6', '7', '8', '9'], correctValue: '9' },
    { id: 'ac5', question: 'How many months are in a year?', options: ['10', '11', '12', '13'], correctValue: '12' },
    { id: 'ac6', question: 'Please select the number that comes after 4.', options: ['3', '4', '5', '6'], correctValue: '5' },
    { id: 'ac7', question: 'What is the opposite of "hot"?', options: ['Warm', 'Cool', 'Cold', 'Dry'], correctValue: 'Cold' },
    { id: 'ac8', question: 'Is the word "Definitelly" spelled correctly? Please select "No".', options: ['Yes', 'No', 'Maybe', "I don't know"], correctValue: 'No' },
    { id: 'ac9', question: 'To show that you are paying attention, please select "Apple" from the options.', options: ['Apple', 'Banana', 'Orange', 'Grape'], correctValue: 'Apple' },
    { id: 'ac10', question: 'What is the opposite of "Day"?', options: ['Night', 'Morning', 'Afternoon', 'Evening'], correctValue: 'Night' },
    { id: 'ac12', question: 'Please ignore the following question and just select "Blue". What is your favorite color?', options: ['Blue', 'Red', 'Green', 'Yellow'], correctValue: 'Blue' },
    { id: 'ac15', question: 'For this question, simply choose the word "Guitar".', options: ['Guitar', 'Piano', 'Violin', 'Drums'], correctValue: 'Guitar' },
    { id: 'ac17', question: 'Do you know the meaning of "rwkrf"?', options: ['Yes', 'No'], correctValue: 'No' }
];

const OPEN_ENDED_POOL = [
    { id: 'oe1', question: 'What do you typically look for in a quality product?', placeholder: 'Please explain your reasoning in 2-3 sentences...' },
    { id: 'oe2', question: 'How has your shopping behavior changed over the past year?', placeholder: 'Please provide specific examples...' },
    { id: 'oe3', question: 'What is the most important factor when choosing a new brand?', placeholder: 'Describe what matters most to you...' },
    { id: 'oe4', question: 'If you could improve one thing about online shopping, what would it be?', placeholder: 'Share your thoughts and ideas...' },
    { id: 'oe5', question: 'Describe a recent positive customer service experience.', placeholder: 'What made it stand out to you?' }
];

const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

// --------------------------------------------------------------------------------
// Reusable Layout Component matching demographicsIsSinglePageScreening.js
// --------------------------------------------------------------------------------

const SurveyLayout = ({ badge, question, subtitle, children, onNext, nextLabel, nextDisabled, snackError }) => (
    <div className={`fixed inset-0 w-full h-[100dvh] flex flex-col justify-between overflow-hidden text-slate-900 ${themeClasses.mainBackground} selection:bg-indigo-100 selection:text-indigo-900 z-[9999]`}>
        {/* Dynamic ambient survey backdrop */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
            <div className={`absolute -top-32 -left-32 w-96 h-96 rounded-full ${themeClasses.ambientOrb1}`} />
            <div className={`absolute top-1/4 -right-32 w-96 h-96 rounded-full ${themeClasses.ambientOrb2}`} />
            <div className={`absolute -bottom-32 left-1/3 w-96 h-96 rounded-full ${themeClasses.ambientOrb3}`} />
        </div>
        
        {/* Top Header Section */}
        <div className="flex-shrink-0 w-full px-4 sm:px-6 pt-4 pb-2 z-20">
            <div className="w-full max-w-xl mx-auto animate-question-next">
                {badge && (
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full shadow-2xs border ${themeClasses.typography.labelSmall} ${themeClasses.bg.pill} ${themeClasses.text.pill}`}>
                            <Sparkles className="w-3 h-3 text-indigo-600" />
                            {badge}
                        </span>
                    </div>
                )}
                
                <h2 className={`mt-1 ${themeClasses.typography.headlineLarge} ${themeClasses.text.primary}`}>
                    {question}
                </h2>
                
                {subtitle && (
                    <div className="mt-1.5 flex items-center justify-between gap-2">
                        <p className={`${themeClasses.typography.bodyMedium} ${themeClasses.text.secondary}`}>
                            {subtitle}
                        </p>
                    </div>
                )}

                {snackError && (
                    <div className={`mt-3 flex items-start gap-2.5 px-4 py-3 rounded-xl shadow-sm animate-in fade-in slide-in-from-top-1 border ${themeClasses.bg.error} ${themeClasses.text.error}`}>
                        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" strokeWidth={2.5} />
                        <p className="text-sm font-semibold tracking-tight">{snackError}</p>
                    </div>
                )}
            </div>
        </div>

        {/* Scrollable Content Section */}
        <div className="relative flex-1 min-h-0 w-full flex flex-col items-center overflow-hidden z-20">
            <div className="w-full h-full overflow-y-auto overscroll-contain px-4 sm:px-6 py-2 flex flex-col items-center relative">
                <div className={`w-full max-w-xl flex flex-col pb-6 pt-1 transition-all duration-200 my-auto`}>
                    {children}
                </div>
            </div>
        </div>

        {/* Bottom Button Section */}
        <div className={`flex-shrink-0 sticky bottom-0 z-30 w-full pt-2.5 pb-4 px-4 sm:px-6 ${themeClasses.surfaceBlur}`}>
            <div className="w-full max-w-xl mx-auto space-y-2.5">
                <Button 
                    className="w-full" 
                    onClick={onNext} 
                    disabled={nextDisabled} 
                    icon={ArrowRight}
                >
                    {nextLabel}
                </Button>
            </div>
        </div>
    </div>
);

// --------------------------------------------------------------------------------
// Step 1 - Attention Check
// --------------------------------------------------------------------------------

const AttentionCheckStep = ({ config, onNext }) => {
    const [answer, setAnswer] = useState(null);
    const [snackError, setSnackError] = useState("");
    const { getBotSignals, onInputChange, honeypotProps } = useBotDetector();
    
    const rawCountryId = useSelector(state => state.participant.demographicsData.countryCode);
    const translations = useMemo(() => getTranslationsByCountryId(rawCountryId), [rawCountryId]);
    
    const handleNext = () => {
        if (!answer) {
            setSnackError(translations?.errors?.attentionCheckError || "Please select an answer to continue.");
            return;
        }
        const passed = answer === config.correctValue;
        const botSignals = getBotSignals();
        onNext({ passed, questionId: config.id, answer, botSignals });
    };

    return (
        <SurveyLayout
            badge={translations?.surveyQuestions?.attentionCheckBadge || "ATTENTION CHECK"}
            question={config.question}
            subtitle="Select one option to continue"
            onNext={handleNext}
            nextDisabled={!answer}
            nextLabel={translations?.surveyQuestions?.buttons?.next || "Next"}
            snackError={snackError}
            setSnackError={setSnackError}
        >
            <input {...honeypotProps} />
            <div className="w-full flex flex-col">
                {config.options.map((opt, idx) => {
                    const isSelected = answer === opt;
                    return (
                        <OptionCard
                            key={idx}
                            idx={idx}
                            option={{ OId: idx, optionText: opt }}
                            isSelected={isSelected}
                            onClick={() => {
                                setSnackError("");
                                setAnswer(opt);
                                onInputChange('attentionCheck', opt);
                            }}
                        />
                    );
                })}
            </div>
        </SurveyLayout>
    );
};

// --------------------------------------------------------------------------------
// Step 2 - Open-Ended
// --------------------------------------------------------------------------------

const OpenEndedStep = ({ config, onNext }) => {
    const [answer, setAnswer] = useState('');
    const [snackError, setSnackError] = useState("");
    const [isCopied, setIsCopied] = useState(0);
    const [isPasted, setIsPasted] = useState(0);
    const [isAutoFillDetected, setIsAutoFillDetected] = useState(0);
    const lastLengthRef = React.useRef(0);
    
    const { getBotSignals, onKeystroke, onInputChange, honeypotProps } = useBotDetector();
    const rawCountryId = useSelector(state => state.participant.demographicsData.countryCode);
    const translations = useMemo(() => getTranslationsByCountryId(rawCountryId), [rawCountryId]);

    const handleNext = () => {
        if (!answer.trim()) { 
            setSnackError(translations?.errors?.openEndedCheckError || "Please enter your thoughts before continuing.");
            return; 
        }
        const botSignals = getBotSignals();
        onNext({ 
            openEndedId: config.id, 
            question: config.question, 
            answer: answer.trim(), 
            isCopied, 
            isPasted, 
            isAutoFillDetected, 
            botSignals 
        });
    };

    return (
        <SurveyLayout
            badge={translations?.surveyQuestions?.openEndedBadge || ""}
            question={config.question}
            subtitle="Type your answer below"
            onNext={handleNext}
            nextLabel={translations?.surveyQuestions?.buttons?.submitContinue || "Submit & Continue"}
            snackError={snackError}
            setSnackError={setSnackError}
        >
            <input {...honeypotProps} />
            <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-xs p-1 pb-0">
                <textarea
                    className="w-full min-h-[160px] p-4 bg-transparent text-[15.5px] leading-relaxed text-slate-900 placeholder:text-slate-400 outline-none resize-y"
                    placeholder={config.placeholder}
                    value={answer}
                    maxLength={1000}
                    autoComplete="new-password"
                    onCopy={() => setIsCopied(1)}
                    onPaste={() => setIsPasted(1)}
                    onKeyDown={(e) => { if (onKeystroke) onKeystroke(e); }}
                    onChange={e => { 
                        const newLength = e.target.value.length;
                        if (newLength - lastLengthRef.current > 20) {
                            setIsAutoFillDetected(1);
                        }
                        lastLengthRef.current = newLength;
                        setSnackError("");
                        setAnswer(e.target.value); 
                        onInputChange('openEnded', e.target.value); 
                    }}
                />
                <div className="w-full border-t border-slate-100 p-2.5 flex justify-end">
                    <span className="text-[12px] font-semibold text-slate-400">
                        {answer.length} / 1000 {translations?.characters || "Characters"}
                    </span>
                </div>
            </div>
        </SurveyLayout>
    );
};

// --------------------------------------------------------------------------------
// Main orchestrator
// --------------------------------------------------------------------------------

const STEPS = ['attention', 'openEnded'];

const SurveyQuestions = ({ onComplete }) => {
    const rawCountryId = useSelector(state => state.participant.demographicsData.countryCode);
    const translations = useMemo(() => getTranslationsByCountryId(rawCountryId), [rawCountryId]);
    
    const attentionConfig = useMemo(() => {
        const question = pickRandom(ATTENTION_CHECKS);
        return {
            ...question,
            question: translations?.surveyQuestions?.attentionChecks?.[question.id] || question.question,
            options: question.options.map(option => translations?.surveyQuestions?.attentionChecks?.options?.[option] || option),
            correctValue: translations?.surveyQuestions?.attentionChecks?.options?.[question.correctValue] || question.correctValue
        };
    }, [translations]);

    const openEndedConfig = useMemo(() => {
        const question = pickRandom(OPEN_ENDED_POOL);
        return {
            ...question,
            question: translations?.surveyQuestions?.openEnded?.[question.id] || question.question,
            placeholder: translations?.surveyQuestions?.openEnded?.placeholder || question.placeholder
        };
    }, [translations]);

    const [stepIndex, setStepIndex] = useState(0);
    const [results, setResults] = useState({});

    const advance = (key, data) => {
        const updated = { ...results, [key]: data };
        setResults(updated);
        if (stepIndex < STEPS.length - 1) {
            setStepIndex(stepIndex + 1);
        } else {
            onComplete(updated);
        }
    };

    if (STEPS[stepIndex] === 'attention') {
        return <AttentionCheckStep config={attentionConfig} onNext={data => advance('attentionCheck', data)} />;
    }

    if (STEPS[stepIndex] === 'openEnded') {
        return <OpenEndedStep config={openEndedConfig} onNext={data => advance('openEnded', data)} />;
    }

    return null;
};

export default SurveyQuestions;
