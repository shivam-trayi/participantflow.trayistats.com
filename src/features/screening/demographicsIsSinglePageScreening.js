import { useState, useRef, useEffect, useMemo } from 'react';
import { themeClasses } from '../../theme/themeConfig';
import { ChevronDown, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import Button from '../../components/button/Button';
import OptionCard from '../../components/optionCard/OptionCard';
import ProgressBar from '../../components/progressBar/ProgressBar';
import SearchBox from '../../components/searchBox/SearchBox';
import DataNotFound from '../../components/dataNotFound/DataNotFound';
import { useDispatch, useSelector } from 'react-redux';
import { checkUserQuotaAction, logAttentionCheckResponse } from "../../store/slices/participantSlice"
import { analyzeIPRanker } from "../../utils/ipRanker";
import { startSpinner } from "../../store/slices/loaderSlice";
import DragAndDropGame from './ui/DragAndDropGame';
import SurveyQuestions from './ui/SurveyQuestions';
import { COUNTRY_CODE, ZIP_REGEX, ZIP_EXAMPLES } from '../../utils/countrylangMapping';
import { getTranslationsByCountryId } from '../../locales';
import useBotDetector from '../../hooks/useBotDetector';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import useDebounce from '../../hooks/useDebounce';


const validateZipByCountry = (zip, langId) => {
    const countryCode = COUNTRY_CODE[langId] || null;
    const regex = ZIP_REGEX[countryCode];
    if (!regex) return true;
    return regex.test(zip);
}

function getNewModeInputTextElement(q, value, setVal, error, setErrors, onPasteDetected, onKeystroke, placeholderTranslations = {}) {
    return (
        <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-xs p-4">
            <input
                type="text"
                value={value || ""}
                onChange={(e) => setVal(e.target.value)}
                className="w-full h-11 sm:h-[50px] px-3.5 sm:px-4 text-[14px] sm:text-[15.5px] rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                placeholder={(typeof placeholderTranslations === "string" && placeholderTranslations) ? placeholderTranslations : "Type your answer here..."}
                onCopy={(e) => { if (q?.IsZipValidate === 1 || q?.DemoId == 3) e.preventDefault(); }}
                onPaste={(e) => {
                    if (onPasteDetected) onPasteDetected();
                    if (q?.IsZipValidate === 1 || q?.DemoId == 3) e.preventDefault();
                }}
                onKeyDown={onKeystroke}
                autoComplete="off"
            />
        </div>
    );
}

function getNewModeRadioOptions(q, value, setVal) {
    return (
        <div className="w-full flex flex-col">
            {q.QuestionAnswerCodes.map((option, idx) => {
                const isSelected = String(value) === String(option.OId);
                return (
                    <OptionCard
                        key={`${option.OId}-${idx}`}
                        option={option}
                        isSelected={isSelected}
                        onClick={() => setVal(option.OId)}
                        idx={idx}
                        isMulti={false}
                    />
                );
            })}
        </div>
    );
}

const ControlledDropdown = ({ q, value, setVal, searchQuery }) => {
    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    const displayedOptions = useMemo(() => {
        if (!q || !q.QuestionAnswerCodes) return [];
        if (!debouncedSearchQuery.trim()) return q.QuestionAnswerCodes;
        return q.QuestionAnswerCodes.filter(opt =>
            opt.optionText.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
        );
    }, [q, debouncedSearchQuery]);



    return (
        <div className="w-full flex flex-col">


            {displayedOptions.length === 0 ? (
                <DataNotFound searchQuery={searchQuery} />
            ) : (
                <div key={searchQuery} className="w-full flex flex-col">
                    {displayedOptions.map((option, idx) => {
                        const isSelected = String(value) === String(option.OId);
                        return (
                            <OptionCard
                                key={`${option.OId}-${idx}`}
                                option={option}
                                isSelected={isSelected}
                                onClick={() => setVal(option.OId)}
                                idx={idx}
                                isMulti={false}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
};

const GetMultiSelectDropDown = ({ q, value, setVal, searchQuery }) => {
    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    const displayedOptions = useMemo(() => {
        if (!q || !q.QuestionAnswerCodes) return [];
        if (!debouncedSearchQuery.trim()) return q.QuestionAnswerCodes;
        return q.QuestionAnswerCodes.filter(opt =>
            opt.optionText.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
        );
    }, [q, debouncedSearchQuery]);



    const toggleSelect = (id) => {
        let selectedValues = value ? String(value).split(",") : [];
        if (selectedValues.includes(String(id))) {
            selectedValues = selectedValues.filter(v => v !== String(id));
        } else {
            selectedValues.push(String(id));
        }
        setVal(selectedValues.join(","));
    };

    return (
        <div className="w-full flex flex-col">


            {displayedOptions.length === 0 ? (
                <DataNotFound searchQuery={searchQuery} />
            ) : (
                <div key={searchQuery} className="w-full flex flex-col">
                    {displayedOptions.map((option, idx) => {
                        const isSelected = value ? String(value).split(",").includes(String(option.OId)) : false;
                        return (
                            <OptionCard
                                key={`${option.OId}-${idx}`}
                                option={option}
                                isSelected={isSelected}
                                onClick={() => toggleSelect(option.OId)}
                                idx={idx}
                                isMulti={true}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
};

const DemographicsIsSinglePageScreening = () => {
    const dispatch = useDispatch();
    const allDemos = useSelector(state => state.participant.demographicsData);
    const [userAnswer, setUserAnswer] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const [canScrollMore, setCanScrollMore] = useState(false);
    const optionsContainerRef = useRef(null);
    const [errors, setErrors] = useState({});
    const [isCopied, setIsCopied] = useState({});
    const [submissionAlert, setSubmissionAlert] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGameActive, setIsGameActive] = useState(false);
    const [smartFilterResult, setSmartFilterResult] = useState(-1);
    const [isIPRankerEnabled, setIsIPRankerEnabled] = useState(false);
    const [surveyDone, setSurveyDone] = useState(false);
    const [surveyResults, setSurveyResults] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    const q = allDemos?.allDemos?.[currentQuestionIndex];

    useEffect(() => {
        setSearchQuery("");
    }, [currentQuestionIndex]);

    const displayedOptions = useMemo(() => {
        if (!q || !q.QuestionAnswerCodes) return [];
        if (!searchQuery.trim()) return q.QuestionAnswerCodes;
        return q.QuestionAnswerCodes.filter(opt =>
            opt.optionText.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [q, searchQuery]);



    const isSearchEnabledForQuestion = useMemo(() => {
        if (!q || !q.QuestionAnswerCodes) return false;
        const options = q.QuestionAnswerCodes;
        if (options.length < 12) return false;
        const isMostlyShort = options.every(opt => String(opt.optionText).length <= 5);
        if (isMostlyShort && options.length < 40) return false;
        return true;
    }, [q]);

    const checkScrollAndOverflow = () => {
        if (!optionsContainerRef.current) return;
        const el = optionsContainerRef.current;
        const contentChild = el.firstElementChild;
        if (!contentChild) return;

        // Compare actual content height against container to avoid flex margin bugs
        const hasDomOverflow = contentChild.scrollHeight > el.clientHeight;

        const remaining = el.scrollHeight - el.scrollTop - el.clientHeight;
        setCanScrollMore(hasDomOverflow && remaining > 15);
    };

    const handleContainerScroll = () => checkScrollAndOverflow();

    const handleScrollMoreClick = () => {
        if (optionsContainerRef.current) {
            optionsContainerRef.current.scrollBy({ top: 240, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        setSearchQuery('');
        setCanScrollMore(false);
        if (optionsContainerRef.current) optionsContainerRef.current.scrollTop = 0;
        checkScrollAndOverflow();
        const timer = setTimeout(checkScrollAndOverflow, 60);
        return () => clearTimeout(timer);
    }, [currentQuestionIndex]);

    // Recalculate scroll when search changes (after child debounce of 300ms)
    useEffect(() => {
        const timer = setTimeout(checkScrollAndOverflow, 350);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Handle window resize to recalculate scroll overflow (Hidden Bug Fix)
    useEffect(() => {
        const handleResize = () => {
            checkScrollAndOverflow();
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const questionRefs = useRef({});
    const { getBotSignals, onKeystroke, onInputChange, honeypotProps } = useBotDetector();
    const rawCountryId = useSelector(
        state => state.participant.demographicsData.countryCode
    );
    const translations = useMemo(
        () => getTranslationsByCountryId(rawCountryId),
        [rawCountryId]
    );

    const createTimeout = (ms) =>
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Fingerprint request timed out")), ms)
        );

    useEffect(() => {
        if (allDemos?.isDemoEnabled && allDemos?.isSmartRespFilterEnabled === 1) {
            setIsGameActive(true);
        }
        if (allDemos?.isDemoEnabled && allDemos?.isIpRankerAnalysisEnabled === 1) {
            setIsIPRankerEnabled(true);
        }
    }, [allDemos]);


    useEffect(() => {
        setUserAnswer({});
        setErrors({});
        setIsCopied({});
        setSurveyDone(false);
        setSurveyResults(null);
        setCurrentQuestionIndex(0);
    }, [allDemos]);
    const handleGameComplete = (data) => {
        setSmartFilterResult(data.finalScore);
        setIsGameActive(false);
    };

    const handleSurveyComplete = (results) => {
        console.log('Survey Results:', results);
        setSurveyResults(results);
        setSurveyDone(true);
        dispatch(logAttentionCheckResponse({ ...results, PID: allDemos.PID, CookieId: allDemos.cookieId }))
    };

    const setAnswerForQ = (qid, value) => {
        setUserAnswer(prev => ({ ...prev, [qid]: value }));
        if (errors[qid]) {
            setErrors(prev => ({ ...prev, [qid]: false }));
        }
    };

    const handleNext = () => {
        let newErrors = {};

        const val = userAnswer[q.QId];
        let hasError = false;

        if (!val || val === "" || (Array.isArray(val) && val.length === 0)) {
            newErrors[q.QId] = translations?.errors?.required || "This question is required";
            hasError = true;
        } else if (q?.IsZipValidate === 1 || q?.DemoId == 3) {
            const globalCountryCode = q?.lang_code || rawCountryId;
            const isValid = validateZipByCountry(val, globalCountryCode);
            if (!isValid) {
                const countryCode = COUNTRY_CODE[globalCountryCode] || null;
                const example = ZIP_EXAMPLES[countryCode];
                const invalidZipMsg = translations?.errors?.invalidZip || "Invalid ZIP format";
                newErrors[q.QId] = example ? `${invalidZipMsg} (e.g. ${example})` : invalidZipMsg;
                hasError = true;
            }
        } else if (q.queryType === "range" || q.queryType === 5) {
            if (!/^\d+$/.test(val)) {
                newErrors[q.QId] = translations?.errors?.onlyNumbers || "Only numbers are allowed.";
                hasError = true;
            } else {
                const numVal = parseInt(val, 10);
                if (numVal < 18 || numVal > 99) {
                    newErrors[q.QId] = translations?.errors?.range || "Age must be between 18 and 99.";
                    hasError = true;
                }
            }
        }

        if (hasError) {
            setErrors(prev => ({ ...prev, ...newErrors }));
            setSubmissionAlert(true);
            return;
        }

        setErrors(prev => ({ ...prev, [q.QId]: undefined }));

        if (currentQuestionIndex < allDemos.allDemos.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            handleBulkSubmit();
        }
    };

    const handleBack = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
            setErrors({});
        }
    };

    const handleBulkSubmit = async () => {
        let newErrors = {};
        let firstErrorQId = null;
        const userResponse = [{
            bodyData: [],
            behiviouralData: {}
        }]
        allDemos.allDemos.forEach(q => {
            const val = userAnswer[q.QId];
            if (!val || val === "" || (Array.isArray(val) && val.length === 0)) {
                newErrors[q.QId] = translations?.errors?.required || "This question is required";
                if (!firstErrorQId) firstErrorQId = q.QId;
            } else if (q?.IsZipValidate === 1 || q?.DemoId == 3) {
                const globalCountryCode = q?.lang_code || rawCountryId;
                const isValid = validateZipByCountry(val, globalCountryCode);
                if (!isValid) {
                    const countryCode = COUNTRY_CODE[globalCountryCode] || null;
                    const example = ZIP_EXAMPLES[countryCode];
                    const invalidZipMsg = translations?.errors?.invalidZip || "Invalid ZIP format";
                    newErrors[q.QId] = example ? `${invalidZipMsg} (e.g. ${example})` : invalidZipMsg;
                    if (!firstErrorQId) firstErrorQId = q.QId;
                }
            } else if (q.queryType === "range" || q.queryType === 5) {
                if (!/^\d+$/.test(val)) {
                    newErrors[q.QId] = translations?.errors?.onlyNumbers || "Only numbers are allowed.";
                    if (!firstErrorQId) firstErrorQId = q.QId;
                } else {
                    const numVal = parseInt(val, 10);
                    if (numVal < 18 || numVal > 99) {
                        newErrors[q.QId] = translations?.errors?.range || "Age must be between 18 and 99.";
                        if (!firstErrorQId) firstErrorQId = q.QId;
                    }
                }
            }
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setSubmissionAlert(true);
            if (firstErrorQId) {
                const node = questionRefs.current[firstErrorQId];
                if (node) {
                    node.scrollIntoView({ behavior: "smooth", block: "center" });
                    const input = node.querySelector('input,select,textarea');
                    if (input) input.focus();
                }
            }
            return;
        }

        setErrors({});
        setIsSubmitting(true);

        try {
            const allQuestions = allDemos.allDemos;
            let results = [];

            for (let i = 0; i < allQuestions.length; i++) {
                const currentQuestionData = allQuestions[i];
                let userGivenAnswer = userAnswer[currentQuestionData.QId];
                let isCorrect = false;
                let userAnserText = [];
                if ((currentQuestionData.queryType == "dropdown") || currentQuestionData.queryType == 1) {
                    isCorrect = currentQuestionData.correctAnswerCode.includes(+userGivenAnswer);
                    let opt = currentQuestionData.QuestionAnswerCodes.find(x => String(x.OId) == String(userGivenAnswer));
                    if (opt) userAnserText.push(opt.optionText);
                    userGivenAnswer = [userGivenAnswer];

                } else if ((currentQuestionData.queryType == "radio") || (currentQuestionData.queryType == 2)) {
                    isCorrect = currentQuestionData.correctAnswerCode.includes(+userGivenAnswer);
                    let opt = currentQuestionData.QuestionAnswerCodes.find(x => String(x.OId) == String(userGivenAnswer));
                    if (opt) userAnserText.push(opt.optionText);
                    userGivenAnswer = [userGivenAnswer];

                } else if ((currentQuestionData.queryType == "multiselect") || (currentQuestionData.queryType == 4)) {
                    if (typeof userGivenAnswer == 'string') {
                        userGivenAnswer = userGivenAnswer.split(",").map(Number);
                    } else if (!Array.isArray(userGivenAnswer)) {
                        userGivenAnswer = [Number(userGivenAnswer)];
                    }
                    isCorrect = userGivenAnswer.some(v => currentQuestionData.correctAnswerCode.includes(v));
                    for (let key of userGivenAnswer) {
                        let opt = currentQuestionData.QuestionAnswerCodes.find(x => String(x.OId) == String(key));
                        if (opt) userAnserText.push(opt.optionText);
                    }

                } else if ((currentQuestionData.queryType == "range") || (currentQuestionData.queryType == 5)) {
                    isCorrect = currentQuestionData.correctAnswerCode.includes(+userGivenAnswer);
                    userAnserText.push(userGivenAnswer);
                    userGivenAnswer = [userGivenAnswer];

                } else if ((currentQuestionData.queryType == "text") || (currentQuestionData.queryType == 3)) {
                    if (currentQuestionData?.IsZipValidate == 1 && currentQuestionData.QId != 669) {
                        if (currentQuestionData.correctAnswerCode.length) {
                            isCorrect = currentQuestionData.correctAnswerCode.includes(userGivenAnswer);
                        } else {
                            isCorrect = true;
                        }
                    } else {
                        isCorrect = true;
                    }
                    userAnserText.push(userGivenAnswer);
                    userGivenAnswer = [userGivenAnswer];
                }

                results.push({ userGivenAnswer, userAnserText, isCorrect });
            }

            const botSignals = getBotSignals();
            for (let i = 0; i < allQuestions.length; i++) {
                const currentQuestionData = allQuestions[i];
                const { userGivenAnswer, userAnserText, isCorrect } = results[i];
                userResponse[0].bodyData.push({
                    PID: allDemos.PID,
                    userAnswer: userGivenAnswer,
                    QId: currentQuestionData.QId,
                    isCorrect: isCorrect,
                    smartFilterResult,
                    userAnswerText: userAnserText,
                    isCopied: isCopied[currentQuestionData.QId] ? 1 : 0,
                    isPasted: isCopied[currentQuestionData.QId] ? 1 : 0,
                    botSignals
                })
            }

            let behiviouralData = null;
            localStorage.removeItem('ipranker_cache');
            let timeTakenInAnalysis = new Date().getTime();
            let ipRankerResult = { success: false };
            if (isIPRankerEnabled) {
                dispatch(startSpinner());
                try {
                    ipRankerResult = await Promise.race([
                        analyzeIPRanker(),
                        createTimeout(7000)
                    ]);
                } catch (error) {
                    ipRankerResult.success = false;
                }
                if (ipRankerResult.success) behiviouralData = ipRankerResult.payload;
            }
            timeTakenInAnalysis = new Date().getTime() - timeTakenInAnalysis;
            userResponse[0].behiviouralData = {
                behiviouralData,
                timeTakenInAnalysis,
                iprankerResponse: ipRankerResult.success,
                botSignals
            }

            userResponse[0].surveyData = surveyResults;

            dispatch(checkUserQuotaAction(userResponse));

            setIsSubmitting(false);

        } catch (error) {
            console.error("Submission Error", error);
            setIsSubmitting(false);
        }
    };

    if (isGameActive) {
        return (
            <Box>
                <DragAndDropGame onComplete={handleGameComplete} />
            </Box>
        );
    }

    if (allDemos?.isDemoEnabled && allDemos?.IsAttentionCheckEnabled == 1 && !surveyDone) {
        return <SurveyQuestions onComplete={handleSurveyComplete} />;
    }


    if (!q) return null;




    const val = userAnswer[q.QId] || "";
    const error = errors[q.QId];
    let optionsUI = "";
    if (q.queryType == 1 || q.queryType == "dropdown") {
        optionsUI = <ControlledDropdown q={q} value={val} setVal={(v) => setAnswerForQ(q.QId, v)} searchQuery={searchQuery} />;
    } else if (q.queryType == 2 || q.queryType == "radio") {
        optionsUI = getNewModeRadioOptions(q, val, (v) => setAnswerForQ(q.QId, v));
    } else if (q.queryType == 4 || q.queryType == "multiselect") {
        optionsUI = <GetMultiSelectDropDown q={q} value={val} setVal={(v) => setAnswerForQ(q.QId, v)} searchQuery={searchQuery} />;
    } else {
        const showTextFieldError = (q.queryType == "range" || q.queryType == 5) && error && error != "This question is required";
        optionsUI = getNewModeInputTextElement(q, val, (v) => { setUserAnswer(prev => ({ ...prev, [q.QId]: v })); onInputChange(q.QId, v); }, showTextFieldError ? error : null, setErrors, () => setIsCopied(prev => ({ ...prev, [q.QId]: 1 })), onKeystroke, translations?.errors, translations?.placeholder?.enterAnswer);
    }

    const isSingle = q.queryType == 1 || q.queryType == 2 || q.queryType == "dropdown" || q.queryType == "radio";
    const isMulti = q.queryType == 4 || q.queryType == "multiselect";
    const isText = !isSingle && !isMulti;

    const progressPercent = Math.round(((currentQuestionIndex + 1) / allDemos.allDemos.length) * 100);

    return (
        <div className={`fixed inset-0 w-full h-[100dvh] flex flex-col justify-between overflow-hidden text-slate-900 ${themeClasses.mainBackground} selection:bg-indigo-100 selection:text-indigo-900 z-[9999]`}>
            {/* Dynamic ambient survey backdrop */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
                <div className={`absolute -top-32 -left-32 w-96 h-96 rounded-full ${themeClasses.ambientOrb1}`} />
                <div className={`absolute top-1/4 -right-32 w-96 h-96 rounded-full ${themeClasses.ambientOrb2}`} />
                <div className={`absolute -bottom-32 left-1/3 w-96 h-96 rounded-full ${themeClasses.ambientOrb3}`} />
            </div>

            <ProgressBar
                currentQuestionIndex={currentQuestionIndex}
                totalQuestions={allDemos.allDemos.length}
                progressPercent={progressPercent}
                handleBack={handleBack}
                handleNext={handleNext}
            />

            <div className="flex-shrink-0 w-full px-4 sm:px-6 pt-4 pb-2 z-20">
                <div className="w-full max-w-xl mx-auto animate-question-next">
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full shadow-2xs border ${themeClasses.typography.labelSmall} ${themeClasses.bg.pill} ${themeClasses.text.pill}`}>
                            <Sparkles className="w-3 h-3 text-indigo-600" />
                            Question {currentQuestionIndex + 1} of {allDemos.allDemos.length}
                        </span>
                    </div>

                    <h2 className={`mt-1 ${themeClasses.typography.headlineLarge} ${themeClasses.text.primary}`}>
                        {q.question}
                    </h2>

                    <div className="mt-1.5 flex items-center justify-between gap-2">
                        <p className={`${themeClasses.typography.bodyMedium} ${themeClasses.text.secondary}`}>
                            {isMulti ? "Select all that apply" : isText ? "Type your answer below" : "Select one option to continue"}
                        </p>
                    </div>
                    {error && (
                        <div className={`mt-3 flex items-start gap-2.5 px-4 py-3 rounded-xl shadow-sm animate-in fade-in slide-in-from-top-1 border ${themeClasses.bg.error} ${themeClasses.text.error}`}>
                            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" strokeWidth={2.5} />
                            <p className="text-sm font-semibold tracking-tight">{error}</p>
                        </div>
                    )}
                </div>
            </div>

            <div key={q.QId} className="relative flex-1 min-h-0 w-full flex flex-col items-center overflow-hidden z-20">
                <style>{`
                  @keyframes slideInFromRight {
                    from { opacity: 0; transform: translate3d(24px, 0, 0); }
                    to { opacity: 1; transform: translate3d(0, 0, 0); }
                  }
                  @keyframes optionFadeInUp {
                    from { opacity: 0; transform: translate3d(0, 12px, 0); }
                    to { opacity: 1; transform: translate3d(0, 0, 0); }
                  }
                  @keyframes checkmarkPop {
                    0% { transform: scale(0.5); opacity: 0; }
                    60% { transform: scale(1.2); opacity: 1; }
                    100% { transform: scale(1); opacity: 1; }
                  }
                  .animate-question-next { animation: slideInFromRight 0.32s cubic-bezier(0.16, 1, 0.3, 1) both; }
                  .animate-option-item { animation: optionFadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) both; }
                  .animate-check-pop { animation: checkmarkPop 0.22s cubic-bezier(0.175, 0.885, 0.32, 1.275) both; }
                  .attapoll-scroll::-webkit-scrollbar { width: 6px; }
                  .attapoll-scroll::-webkit-scrollbar-track { background: transparent; }
                  .attapoll-scroll::-webkit-scrollbar-thumb { background-color: rgba(148, 163, 184, 0.45); border-radius: 9999px; }
                  .attapoll-scroll::-webkit-scrollbar-thumb:hover { background-color: rgba(100, 116, 139, 0.65); }
                `}</style>

                <div
                    ref={optionsContainerRef}
                    onScroll={handleContainerScroll}
                    className="attapoll-scroll w-full h-full overflow-y-auto overscroll-contain px-4 sm:px-6 py-2 flex flex-col items-center relative"
                >
                    <div className={`w-full max-w-xl flex flex-col pb-6 pt-1 transition-all duration-200 ${!isSearchEnabledForQuestion && !searchQuery.trim() ? 'my-auto' : ''}`}>

                        {optionsUI}
                    </div>



                    {canScrollMore && displayedOptions.length > 0 && (
                        <div className="sticky bottom-2 z-20 flex justify-center pointer-events-none mt-auto pb-1 animate-bounce">
                            <button
                                type="button"
                                onClick={handleScrollMoreClick}
                                className="pointer-events-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold shadow-md bg-white border border-slate-200 text-indigo-600"
                            >
                                <span>Scroll for more</span>
                                <ChevronDown className="w-3.5 h-3.5 stroke-[2.5]" />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className={`flex-shrink-0 sticky bottom-0 z-30 w-full pt-2.5 pb-4 px-4 sm:px-6 ${themeClasses.surfaceBlur}`}>
                <div className="w-full max-w-xl mx-auto space-y-2.5">
                    {isSearchEnabledForQuestion && (
                        <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                    )}
                    <Button
                        onClick={handleNext}
                        isLoading={isSubmitting}
                        icon={ArrowRight}
                    >
                        {currentQuestionIndex < allDemos.allDemos.length - 1 ? "Next" : "Complete Screening"}
                    </Button>
                    {/* Honeypot */}
                    <input {...honeypotProps} style={{ display: 'none' }} />
                </div>
            </div>

            <Snackbar
                open={submissionAlert}
                autoHideDuration={3000}
                onClose={() => setSubmissionAlert(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <MuiAlert severity="error" onClose={() => setSubmissionAlert(false)}>
                    {translations?.errors?.pleaseAnswerAll || "Please answer all questions correctly to proceed."}
                </MuiAlert>
            </Snackbar>
        </div>
    );
};
export default DemographicsIsSinglePageScreening;
