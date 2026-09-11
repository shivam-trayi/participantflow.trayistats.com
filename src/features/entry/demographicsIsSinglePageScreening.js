// import React, { useState, useRef, useEffect, useMemo } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { checkUserQuotaAction, logAttentionCheckResponse } from '../../store/slices/participantSlice';
// import CssBaseline from '@mui/material/CssBaseline';
// import Box from '@mui/material/Box';
// import Container from '@mui/material/Container';
// import Card from '@mui/material/Card';
// import CardContent from '@mui/material/CardContent';
// import Button from '@mui/material/Button';
// import Select from '@mui/material/Select';
// import Radio from '@mui/material/Radio';
// import RadioGroup from '@mui/material/RadioGroup';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import Checkbox from '@mui/material/Checkbox';
// import FormGroup from '@mui/material/FormGroup';
// import Snackbar from '@mui/material/Snackbar';
// import MuiAlert from '@mui/material/Alert';
// import Typography from '@mui/material/Typography';
// import FormControl from '@mui/material/FormControl';
// import CircularProgress from '@mui/material/CircularProgress';
// import TextField from '@mui/material/TextField';
// import LinearProgress from '@mui/material/LinearProgress';
// import IconButton from '@mui/material/IconButton';
// import { styled } from '@mui/material/styles';
// import { analyzeIPRanker } from '../../common/utils/ipRanker';
// import { startSpinner } from '../../store/slices/loaderSlice';
// import DragAndDropGame from './DragAndDropGame';
// import SurveyQuestions from './SurveyQuestions';
// import { COUNTRY_CODE, ZIP_REGEX, ZIP_EXAMPLES } from '../../common/countrylangMapping';
// import './multiselectDropdown.css'
// import useBotDetector from './useBotDetector';
// import { getTranslationsByCountryId } from '../../locales';
 
// // --- New Design Styled Components ---
// const StyledCard = styled(Card)(({ theme }) => ({
//     width: '100%',
//     borderRadius: '16px',
//     boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
//     border: '1px solid #f0f0f0',
//     overflow: 'visible !important',
//     [theme.breakpoints.down('md')]: {
//         margin: theme.spacing(2)
//     },
//     [theme.breakpoints.down('sm')]: {
//         borderRadius: '12px',
//         margin: theme.spacing(1)
//     }
// }));
 
// const QuestionContainer = styled(Box)(({ theme }) => ({
//     marginBottom: '20px',
//     paddingBottom: '2px',
//     borderBottom: `1px solid ${theme.palette.divider}66`,
//     [theme.breakpoints.down('sm')]: {
//         marginBottom: '20px',
//         paddingBottom: '2px',
//     },
//     '&:last-child': {
//         borderBottom: 'none',
//         marginBottom: 0
//     }
// }));

// const validateZipByCountry = (zip, langId) => {
//   const countryCode = COUNTRY_CODE[langId] || null;
//   const regex = ZIP_REGEX[countryCode];
//   if (!regex) return true;
//   return regex.test(zip);
// }
 
// const QuestionText = styled(Typography)(({ theme }) => ({
//     fontWeight: 600,
//     fontSize: '1.1rem',
//     wordBreak: 'break-word',
//     [theme.breakpoints.down('sm')]: {
//         fontSize: '1rem',
//     },
//     marginBottom: theme.spacing(2),
//     color: '#1a1a1a',
//     lineHeight: 1.4,
//     '& .required-star': {
//         color: '#d32f2f',
//         marginLeft: '4px',
//         fontWeight: 'bold',
//         fontSize: '1.2rem',
//         display: 'inline-block',
//         verticalAlign: 'text-top'
//     }
// }));
 
// const StyledButton = styled(Button)(({ theme }) => ({
//     padding: theme.spacing(1.2, 5),
//     fontSize: '1rem',
//     borderRadius: '8px',
//     textTransform: 'none',
//     fontWeight: 600,
//     boxShadow: '0 4px 12px 0 rgba(103, 58, 183, 0.25)',
//     background: 'linear-gradient(135deg, #673ab7 0%, #3f51b5 100%)',
//     color: 'white',
//     transition: 'all 0.2s ease',
//     '&:hover': {
//         transform: 'translateY(-1px)',
//         boxShadow: '0 6px 16px 0 rgba(103, 58, 183, 0.35)',
//     },
//     [theme.breakpoints.down('sm')]: {
//         width: '100%',
//         padding: theme.spacing(1.2, 2),
//         fontSize: '0.95rem',
//     }
// }));
// const FooterBar = styled(Box)(({ theme }) => ({
//     position: 'fixed',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     padding: theme.spacing(1.5, 2),
//     backgroundColor: 'rgba(255, 255, 255, 0.95)',
//     backdropFilter: 'blur(12px)',
//     borderTop: `1px solid ${theme.palette.divider}`,
//     boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
//     zIndex: 4000,
//     display: 'flex',
//     justifyContent: 'flex-end',
//     [theme.breakpoints.up('sm')]: {
//         padding: theme.spacing(1, 4),
//     }
// }));
 
// const BackArrowIcon = () => (
//   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M15 18l-6-6 6-6"/>
//   </svg>
// );

// const DemographicsIsSinglePageScreening = () => {
//     const dispatch = useDispatch();
//     const allDemos = useSelector(state => state.participant.demographicsData);
//     const [userAnswer, setUserAnswer] = useState({});
//     const [errors, setErrors] = useState({});
//     const [isCopied, setIsCopied] = useState({});
//     const [submissionAlert, setSubmissionAlert] = useState(false);
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [isGameActive, setIsGameActive] = useState(false);
//     const [smartFilterResult, setSmartFilterResult] = useState(-1);
//     const [isIPRankerEnabled, setIsIPRankerEnabled] = useState(false);
//     const [showDemoUID, setShowDemoUID] = useState(true);
//     const [surveyDone, setSurveyDone] = useState(false);
//     const [surveyResults, setSurveyResults] = useState(null);
//     const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//     const questionRefs = useRef({});
//     const { getBotSignals, onKeystroke, onInputChange, honeypotProps } = useBotDetector();
//     const rawCountryId = useSelector(
//         state => state.participant.demographicsData.countryCode
//     );
//     const translations = useMemo(
//         () => getTranslationsByCountryId(rawCountryId),
//         [rawCountryId]
//     );
 
//     const createTimeout = (ms) =>
//         new Promise((_, reject) =>
//             setTimeout(() => reject(new Error("Fingerprint request timed out")), ms)
//         );
 
//     useEffect(() => {
//         if (allDemos?.isDemoEnabled && allDemos?.isSmartRespFilterEnabled === 1) {
//             setIsGameActive(true);
//         }
//         if (allDemos?.isDemoEnabled && allDemos?.isIpRankerAnalysisEnabled === 1) {
//             setIsIPRankerEnabled(true);
//         }
//     }, [allDemos]);

    
//     useEffect(() => {
//         setUserAnswer({});
//         setErrors({});
//         setIsCopied({});
//         setSurveyDone(false);
//         setSurveyResults(null);
//         setCurrentQuestionIndex(0);
//     }, [allDemos]);
//     const handleGameComplete = (data) => {
//         setSmartFilterResult(data.finalScore);
//         setIsGameActive(false);
//     };

//     const handleSurveyComplete = (results) => {
//         console.log('Survey Results:', results);
//         setSurveyResults(results);
//         setSurveyDone(true);
//         dispatch(logAttentionCheckResponse({...results,PID:allDemos.PID,CookieId:allDemos.cookieId}))  
//     };
 
//     const setAnswerForQ = (qid, value) => {
//         setUserAnswer(prev => ({ ...prev, [qid]: value }));
//         if (errors[qid]) {
//             setErrors(prev => ({ ...prev, [qid]: false }));
//         }
//     };
 
//     const handleNext = () => {
//         let newErrors = {};
//         const q = allDemos.allDemos[currentQuestionIndex];
//         const val = userAnswer[q.QId];
//         let hasError = false;

//         if (!val || val === "" || (Array.isArray(val) && val.length === 0)) {
//             newErrors[q.QId] = translations?.errors?.required || "This question is required";
//             hasError = true;
//         } else if (q?.IsZipValidate === 1 || q?.DemoId == 3) {
//             const globalCountryCode = q?.lang_code || rawCountryId;
//             const isValid = validateZipByCountry(val, globalCountryCode);
//             if (!isValid) {
//                 const countryCode = COUNTRY_CODE[globalCountryCode] || null;
//                 const example = ZIP_EXAMPLES[countryCode];
//                 const invalidZipMsg = translations?.errors?.invalidZip || "Invalid ZIP format";
//                 newErrors[q.QId] = example ? `${invalidZipMsg} (e.g. ${example})` : invalidZipMsg;
//                 hasError = true;
//             }
//         } else if (q.queryType === "range" || q.queryType === 5) {
//             if (!/^\d+$/.test(val)) {
//                 newErrors[q.QId] = translations?.errors?.onlyNumbers || "Only numbers are allowed.";
//                 hasError = true;
//             } else {
//                 const numVal = parseInt(val, 10);
//                 if (numVal < 18 || numVal > 99) {
//                     newErrors[q.QId] = translations?.errors?.range || "Age must be between 18 and 99.";
//                     hasError = true;
//                 }
//             }
//         }

//         if (hasError) {
//             setErrors(prev => ({ ...prev, ...newErrors }));
//             setSubmissionAlert(true);
//             return;
//         }

//         setErrors(prev => ({ ...prev, [q.QId]: undefined }));

//         if (currentQuestionIndex < allDemos.allDemos.length - 1) {
//             setCurrentQuestionIndex(prev => prev + 1);
//         } else {
//             handleBulkSubmit();
//         }
//     };

//     const handleBack = () => {
//         if (currentQuestionIndex > 0) {
//             setCurrentQuestionIndex(prev => prev - 1);
//             setErrors({});
//         }
//     };

//     const handleBulkSubmit = async () => {
//         let newErrors = {};
//         let firstErrorQId = null;
//         const userResponse = [{
//             bodyData: [],
//             behiviouralData:{}
//         }]
//         allDemos.allDemos.forEach(q => {
//             const val = userAnswer[q.QId];
//             if (!val || val === "" || (Array.isArray(val) && val.length === 0)) {
//                 newErrors[q.QId] = translations?.errors?.required || "This question is required";
//                 if (!firstErrorQId) firstErrorQId = q.QId;
//             } else if (q?.IsZipValidate === 1 || q?.DemoId == 3) {
//                 const globalCountryCode = q?.lang_code || rawCountryId;
//                 const isValid = validateZipByCountry(val, globalCountryCode);
//                 if (!isValid) {
//                     const countryCode = COUNTRY_CODE[globalCountryCode] || null;
//                     const example = ZIP_EXAMPLES[countryCode];
//                     const invalidZipMsg = translations?.errors?.invalidZip || "Invalid ZIP format";
//                     newErrors[q.QId] = example ? `${invalidZipMsg} (e.g. ${example})` : invalidZipMsg;
//                     if (!firstErrorQId) firstErrorQId = q.QId;
//                 }
//             } else if (q.queryType === "range" || q.queryType === 5) {
//                 if (!/^\d+$/.test(val)) {
//                     newErrors[q.QId] = translations?.errors?.onlyNumbers || "Only numbers are allowed.";
//                     if (!firstErrorQId) firstErrorQId = q.QId;
//                 } else {
//                     const numVal = parseInt(val, 10);
//                     if (numVal < 18 || numVal > 99) {
//                         newErrors[q.QId] = translations?.errors?.range || "Age must be between 18 and 99.";
//                         if (!firstErrorQId) firstErrorQId = q.QId;
//                     }
//                 }
//             }
//         });
 
//         if (Object.keys(newErrors).length > 0) {
//             setErrors(newErrors);
//             setSubmissionAlert(true);
//             if (firstErrorQId) {
//                 const node = questionRefs.current[firstErrorQId];
//                 if (node) {
//                     node.scrollIntoView({ behavior: "smooth", block: "center" });
//                     const input = node.querySelector('input,select,textarea');
//                     if (input) input.focus();
//                 }
//             }
//             return;
//         }
 
//         setErrors({});
//         setIsSubmitting(true);
 
//         try {
//             const allQuestions = allDemos.allDemos;
//             let results = [];
 
//             for (let i = 0; i < allQuestions.length; i++) {
//                 const currentQuestionData = allQuestions[i];
//                 let userGivenAnswer = userAnswer[currentQuestionData.QId];
//                 let isCorrect = false;
//                 let userAnserText = [];
//                 if ((currentQuestionData.queryType == "dropdown") || currentQuestionData.queryType == 1) {
//                     isCorrect = currentQuestionData.correctAnswerCode.includes(+userGivenAnswer);
//                     let opt = currentQuestionData.QuestionAnswerCodes.find(x => String(x.OId) == String(userGivenAnswer));
//                     if (opt) userAnserText.push(opt.optionText);
//                     userGivenAnswer = [userGivenAnswer];
 
//                 } else if ((currentQuestionData.queryType == "radio") || (currentQuestionData.queryType == 2)) {
//                     isCorrect = currentQuestionData.correctAnswerCode.includes(+userGivenAnswer);
//                     let opt = currentQuestionData.QuestionAnswerCodes.find(x => String(x.OId) == String(userGivenAnswer));
//                     if (opt) userAnserText.push(opt.optionText);
//                     userGivenAnswer = [userGivenAnswer];
 
//                 } else if ((currentQuestionData.queryType == "multiselect") || (currentQuestionData.queryType == 4)) {
//                     if (typeof userGivenAnswer == 'string') {
//                         userGivenAnswer = userGivenAnswer.split(",").map(Number);
//                     } else if (!Array.isArray(userGivenAnswer)) {
//                         userGivenAnswer = [Number(userGivenAnswer)];
//                     }
//                     isCorrect = userGivenAnswer.some(v => currentQuestionData.correctAnswerCode.includes(v));
//                     for (let key of userGivenAnswer) {
//                         let opt = currentQuestionData.QuestionAnswerCodes.find(x => String(x.OId) == String(key));
//                         if (opt) userAnserText.push(opt.optionText);
//                     }
 
//                 } else if ((currentQuestionData.queryType == "range") || (currentQuestionData.queryType == 5)) {
//                     isCorrect = currentQuestionData.correctAnswerCode.includes(+userGivenAnswer);
//                     userAnserText.push(userGivenAnswer);
//                     userGivenAnswer = [userGivenAnswer];
 
//                 } else if ((currentQuestionData.queryType == "text") || (currentQuestionData.queryType == 3)) {
//                     if (currentQuestionData?.IsZipValidate == 1 && currentQuestionData.QId != 669) {
//                         if (currentQuestionData.correctAnswerCode.length) {
//                             isCorrect = currentQuestionData.correctAnswerCode.includes(userGivenAnswer);
//                         } else {
//                             isCorrect = true;
//                         }
//                     } else {
//                         isCorrect = true;
//                     }
//                     userAnserText.push(userGivenAnswer);
//                     userGivenAnswer = [userGivenAnswer];
//                 }
 
//                 results.push({ userGivenAnswer, userAnserText, isCorrect});
//             }
 
//             const botSignals = getBotSignals();
//             for (let i = 0; i < allQuestions.length; i++) {
//                 const currentQuestionData = allQuestions[i];
//                 const { userGivenAnswer, userAnserText, isCorrect } = results[i];
//                 userResponse[0].bodyData.push({
//                     PID: allDemos.PID,
//                     userAnswer: userGivenAnswer,
//                     QId: currentQuestionData.QId,
//                     isCorrect: isCorrect,
//                     smartFilterResult,
//                     userAnswerText: userAnserText,
//                     isCopied: isCopied[currentQuestionData.QId] ? 1 : 0,
//                     isPasted: isCopied[currentQuestionData.QId] ? 1 : 0,
//                     botSignals
//                 })
//             }
  
//             let behiviouralData = null;
//             localStorage.removeItem('ipranker_cache');
//             let timeTakenInAnalysis = new Date().getTime();
//             let ipRankerResult = { success: false };
//             if (isIPRankerEnabled) {
//                 dispatch(startSpinner());
//                 try {
//                     ipRankerResult = await Promise.race([
//                         analyzeIPRanker(),
//                         createTimeout(7000)
//                     ]);
//                 } catch (error) {
//                     ipRankerResult.success = false;
//                 }
//                 if (ipRankerResult.success) behiviouralData = ipRankerResult.payload;
//             }
//             timeTakenInAnalysis = new Date().getTime() - timeTakenInAnalysis;
//              userResponse[0].behiviouralData={
//                 behiviouralData,
//                 timeTakenInAnalysis,
//                 iprankerResponse: ipRankerResult.success,
//                 botSignals
//             }

//             userResponse[0].surveyData = surveyResults;

//             dispatch(checkUserQuotaAction(userResponse));
 
//             setShowDemoUID(false);
//             setIsSubmitting(false);
 
//         } catch (error) {
//             console.error("Submission Error", error);
//             setIsSubmitting(false);
//         }
//     };
 
//     const Alert = React.forwardRef(function Alert(props, ref) {
//         return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
//     });
 
//     if (isGameActive) {
//         return (
//             <Box>
//                 <DragAndDropGame onComplete={handleGameComplete} />
//             </Box>
//         );
//     }

//     if (allDemos?.isDemoEnabled && allDemos?.IsAttentionCheckEnabled == 1 && !surveyDone) {
//         return <SurveyQuestions onComplete={handleSurveyComplete} />;
//     }
  
//     const q = allDemos.allDemos[currentQuestionIndex];
//     if (!q) return null;

//     const val = userAnswer[q.QId] || "";
//     const error = errors[q.QId];

//     let optionsUI = "";
//     if (q.queryType == 1 || q.queryType == "dropdown") {
//         optionsUI = <ControlledDropdown q={q} value={val} setVal={(v) => setAnswerForQ(q.QId, v)} translations={translations} />;
//     } else if (q.queryType == 2 || q.queryType == "radio") {
//         optionsUI = getNewModeRadioOptions(q, val, (v) => setAnswerForQ(q.QId, v));
//     } else if (q.queryType == 4 || q.queryType == "multiselect") {
//         optionsUI = <GetMultiSelectDropDown q={q} value={val} setVal={(v) => setAnswerForQ(q.QId, v)} translations={translations} />;
//     } else {
//         const showTextFieldError = (q.queryType == "range" || q.queryType == 5) && error && error != (translations?.errors?.required || "This question is required");
//         optionsUI = getNewModeInputTextElement(q, val, (v) => { setUserAnswer(prev => ({ ...prev, [q.QId]: v })); onInputChange(q.QId, v); }, showTextFieldError ? error : null, setErrors, () => setIsCopied(prev => ({ ...prev, [q.QId]: 1 })), onKeystroke, translations?.errors, translations?.placeholder?.enterAnswer);
//     }

//     return (
//         <React.Fragment>
//             <CssBaseline />
//             <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', pt: { xs: 2, md: 4 }, pb: { xs: 8, md: 10 } }} >
//                 <Box sx={{ width: '100%', maxWidth: '700px' }} >
//                     <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
//                         <IconButton onClick={handleBack} disabled={currentQuestionIndex === 0} sx={{ mr: 1, visibility: currentQuestionIndex === 0 ? 'hidden' : 'visible' }}>
//                             <BackArrowIcon />
//                         </IconButton>
//                         <Box sx={{ flexGrow: 1, mx: 2 }}>
//                             <LinearProgress 
//                                 variant="determinate" 
//                                 value={(currentQuestionIndex / allDemos.allDemos.length) * 100} 
//                                 sx={{ height: 8, borderRadius: 4, backgroundColor: '#e0e0e0', '& .MuiLinearProgress-bar': { backgroundColor: '#4caf50' } }} 
//                             />
//                         </Box>
//                         {/* Dummy invisible box to balance the back icon for centering */}
//                         <Box sx={{ width: 40, height: 40 }} />
//                     </Box>

//                     <StyledCard>
//                         <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
//                             <QuestionContainer
//                                 key={q.QId}
//                                 ref={el => questionRefs.current[q.QId] = el}
//                                 id={`question-${q.QId}`}
//                             >
//                                 <QuestionText>
//                                     {q.question} <span className="required-star">*</span>
//                                 </QuestionText>
//                                 <Box sx={{ mt: 1 }}>
//                                     {optionsUI}
//                                     {error && (
//                                         <Typography color="error" fontSize={13} mt={0.5} sx={{ fontWeight: 500 }}>
//                                             {error}
//                                         </Typography>
//                                     )}
//                                 </Box>
//                             </QuestionContainer>
//                             {/* Honeypot – invisible to real users; bots fill it */}
//                             <input {...honeypotProps} />
//                         </CardContent>
//                     </StyledCard>
//                 </Box>
 
//                 <Snackbar open={submissionAlert} autoHideDuration={3000} onClose={() => setSubmissionAlert(false)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
//                     <Alert severity="error" onClose={() => setSubmissionAlert(false)}>
//                         {translations?.errors?.pleaseAnswerAll || "Please answer all questions correctly to proceed."}
//                     </Alert>
//                 </Snackbar>
 
//                 <FooterBar>
//                     <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'flex-end', p: 0 }}>
//                         <Box sx={{ width: '100%', maxWidth: '700px', display: 'flex', justifyContent: 'flex-end' }}>
//                             <StyledButton
//                                 onClick={handleNext}
//                                 disabled={isSubmitting}
//                                 sx={{ minWidth: '200px', background: '#4caf50', '&:hover': { background: '#45a049' }, boxShadow: 'none' }}
//                             >
//                                 {
//                                     isSubmitting ? (
//                                         <CircularProgress size={24} sx={{ color: 'white' }} />
//                                     ) : (
//                                         currentQuestionIndex === allDemos.allDemos.length - 1 ? (translations?.buttons?.submit ?? "Submit") : "Next"
//                                     )
//                                 }
//                             </StyledButton>
//                         </Box>
//                     </Container>
//                 </FooterBar>
 
//             </Container>
//         </React.Fragment>
//     );
// };
 
// // --- New Mode Helpers ---
// const ControlledDropdown = ({ q, value, setVal, translations }) => {
//     const [open, setOpen] = useState(false);
//     const [search, setSearch] = useState("");
//     const containerRef = useRef(null);
//     const dropdownRef = useRef(null);
//     const [openUpward, setOpenUpward] = useState(false);

//     const checkPosition = () => {
//         if (!containerRef.current || !dropdownRef.current) return;
//         const rect = containerRef.current.getBoundingClientRect();
//         const dropdownHeight = 350;
//         const footerHeight = 85; 
//         const spaceBelow = window.innerHeight - rect.bottom - footerHeight;
//         const spaceAbove = rect.top;
//         setOpenUpward(spaceBelow < dropdownHeight && spaceAbove > spaceBelow);
//     };

//     useEffect(() => {
//         if (open) setTimeout(checkPosition, 0);
//     }, [open]);

//     useEffect(() => {
//         const handle = () => { if (open) checkPosition(); };
//         window.addEventListener("resize", handle);
//         return () => {
//             window.removeEventListener("resize", handle);
//         };
//     }, [open]);

//     useEffect(() => {
//         const handleClickOutside = (e) => {
//             if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false);
//         };
//         document.addEventListener("mousedown", handleClickOutside);
//         return () => document.removeEventListener("mousedown", handleClickOutside);
//     }, []);

//     const filteredOptions = q.QuestionAnswerCodes.filter(opt =>
//         opt.optionText.toLowerCase().includes(search.toLowerCase())
//     );

//     const selectedOption = q.QuestionAnswerCodes.find(i => String(i.OId) === String(value));

//     return (
//         <div className="custom-multiselect relative w-full" ref={containerRef} style={{ marginBottom: '8px' }}>
//             <div className={`ms-input ${open ? 'focused' : ''}`} onClick={() => setOpen(prev => !prev)}>
//                 {!value ? (
//                     <span className="ms-placeholder">{translations.dropdown.selectOption}</span>
//                 ) : (
//                     <span style={{ fontSize: '0.95rem', color: '#1a1a1a', padding: '0 4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
//                         {selectedOption ? selectedOption.optionText : value}
//                     </span>
//                 )}
//                 <div className={`ms-arrow ${open ? 'open' : ''}`}>
//                     <svg width="12" height="8" viewBox="0 0 12 8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                         <path d="M1 1.5L6 6.5L11 1.5" />
//                     </svg>
//                 </div>
//             </div>

//             {open && (
//                 <React.Fragment>
//                     <div className="ms-overlay" onClick={() => setOpen(false)} />
//                     <div ref={dropdownRef} className={`ms-dropdown ${openUpward ? "dropdown-up" : "dropdown-down"}`}>
//                         <input
//                             type="text"
//                             className="ms-search"
//                             placeholder={translations.dropdown.searchPlaceholder}
//                             value={search}
//                             onChange={(e) => setSearch(e.target.value)}
//                             onClick={(e) => e.stopPropagation()}
//                         />
//                         <div className="ms-options">
//                             {filteredOptions.length > 0 ? (
//                                 filteredOptions.map(opt => (
//                                     <div
//                                         key={opt.OId}
//                                         className={`ms-option ${String(opt.OId) === String(value) ? 'selected' : ''}`}
//                                         onClick={() => {
//                                             setVal(opt.OId);
//                                             setOpen(false);
//                                             setSearch("");
//                                         }}
//                                     >
//                                         {opt.optionText}
//                                     </div>
//                                 ))
//                             ) : (
//                                 <div className="ms-no-data">No results found</div>
//                             )}
//                         </div>
//                     </div>
//                 </React.Fragment>
//             )}
//         </div>
//     );
// };
 
// function getNewModeMultiSelect(q, value, setVal) {
//     return (
//         <FormGroup sx={{ width: '100%' }}>
//             {q.QuestionAnswerCodes.map(i => {
//                 let arr = value ? String(value).split(",") : [];
//                 let isCheck = arr.includes(String(i.OId));
 
//                 return (
//                     <FormControlLabel
//                         key={i.OId}
//                         control={
//                             <Checkbox
//                                 checked={isCheck}
//                                 onClick={() => {
//                                     let arr = value ? String(value).split(",") : [];
//                                     if (arr.includes(String(i.OId))) {
//                                         arr = arr.filter(x => x !== String(i.OId));
//                                     } else {
//                                         arr.push(String(i.OId));
//                                     }
//                                     setVal(arr.join(","));
//                                 }}
//                                 color="primary"
//                             />
//                         }
//                         label={i.optionText}
//                         slotProps={{ typography: { fontSize: { xs: '0.9rem', sm: '1rem' } } }}
//                         sx={{
//                             width: '100%',
//                             ml: 0,
//                             mb: 1,
//                             border: '1px solid #e0e0e0',
//                             borderRadius: '8px',
//                             padding: '6px 12px',
//                             transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
//                             backgroundColor: isCheck ? '#f5f5ff' : '#fff',
//                             borderColor: isCheck ? '#3f51b5' : '#e0e0e0',
//                             borderWidth: isCheck ? '2px' : '1px',
//                             '&:hover': {
//                                 borderColor: '#3f51b5',
//                                 backgroundColor: isCheck ? '#f0f0ff' : '#f9f9f9'
//                             },
//                             '& .MuiFormControlLabel-label': {
//                                 width: '100%',
//                                 userSelect: 'none'
//                             }
//                         }}
//                     />
//                 );
//             })}
//         </FormGroup>
//     );
// }

// const GetMultiSelectDropDown = ({ q, value, setVal, translations }) => {
//     const [open, setOpen] = useState(false);
//     const [search, setSearch] = useState("");
//     const containerRef = useRef(null);
//     const dropdownRef = useRef(null);
//     const [openUpward, setOpenUpward] = useState(false);

//     const selectedValues = value ? String(value).split(",") : [];

//     const checkPosition = () => {
//         if (!containerRef.current || !dropdownRef.current) return;
//         const rect = containerRef.current.getBoundingClientRect();
//         const dropdownHeight = 350;
//         const footerHeight = 85; 
//         const spaceBelow = window.innerHeight - rect.bottom - footerHeight;
//         const spaceAbove = rect.top;
//         setOpenUpward(spaceBelow < dropdownHeight && spaceAbove > spaceBelow);
//     };

//     useEffect(() => {
//         if (open) setTimeout(checkPosition, 0);
//     }, [open]);

//     useEffect(() => {
//         const handle = () => { if (open) checkPosition(); };
//         window.addEventListener("resize", handle);
//         return () => {
//             window.removeEventListener("resize", handle);
//         };
//     }, [open]);

//     useEffect(() => {
//         const handleClickOutside = (e) => {
//             if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false);
//         };
//         document.addEventListener("mousedown", handleClickOutside);
//         return () => document.removeEventListener("mousedown", handleClickOutside);
//     }, []);

//     const toggleSelect = (id) => {
//         let updated = [...selectedValues];
//         if (updated.includes(String(id))) {
//             updated = updated.filter(v => v !== String(id));
//         } else {
//             updated.push(String(id));
//         }
//         setVal(updated.join(","));
//     };

//     const filteredOptions = q.QuestionAnswerCodes.filter(opt =>
//         opt.optionText.toLowerCase().includes(search.toLowerCase())
//     );

//     return (
//         <div className="custom-multiselect relative w-full" ref={containerRef}>
//             <div className={`ms-input ${open ? 'focused' : ''}`} onClick={() => setOpen(prev => !prev)}>
//                 {selectedValues.length === 0 && (
//                     <span className="ms-placeholder">{translations.dropdown.selectOption}</span>
//                 )}
//                 <div className="ms-chips">
//                     {selectedValues.map(val => {
//                         const option = q.QuestionAnswerCodes.find(i => String(i.OId) === String(val));
//                         if (!option) return null;
//                         return (
//                             <div key={val} className="ms-chip">
//                                 {option.optionText}
//                                 <span className="ms-remove" onClick={(e) => { e.stopPropagation(); toggleSelect(val); }}>×</span>
//                             </div>
//                         );
//                     })}
//                 </div>
//                 <div className={`ms-arrow ${open ? 'open' : ''}`}>
//                     <svg width="12" height="8" viewBox="0 0 12 8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                         <path d="M1 1.5L6 6.5L11 1.5" />
//                     </svg>
//                 </div>
//             </div>

//             {open && (
//                 <React.Fragment>
//                     <div className="ms-overlay" onClick={() => setOpen(false)} />
//                     <div ref={dropdownRef} className={`ms-dropdown ${openUpward ? "dropdown-up" : "dropdown-down"}`}>
//                         <input
//                             type="text"
//                             className="ms-search"
//                             placeholder={translations.dropdown.searchPlaceholder}
//                             value={search}
//                             onChange={(e) => setSearch(e.target.value)}
//                             onClick={(e) => e.stopPropagation()}
//                         />
//                         <div className="ms-options">
//                             {filteredOptions.length > 0 ? (
//                                 filteredOptions.map(opt => {
//                                     const isSelected = selectedValues.includes(String(opt.OId));
//                                     return (
//                                         <label key={opt.OId} className={`ms-option ${isSelected ? 'selected' : ''}`}>
//                                             <input
//                                                 type="checkbox"
//                                                 checked={isSelected}
//                                                 onChange={() => toggleSelect(opt.OId)}
//                                             />
//                                             {opt.optionText}
//                                         </label>
//                                     );
//                                 })
//                             ) : (
//                                 <div className="ms-no-data">No results found</div>
//                             )}
//                         </div>
//                     </div>
//                 </React.Fragment>
//             )}
//         </div>
//     );
// };
// function getNewModeRadioOptions(q, value, setVal) {
//     return (
//         <FormControl fullWidth component="fieldset">
//             <RadioGroup
//                 name={`question-${q.QId}`}
//                 value={value}
//                 onChange={e => setVal(e.target.value)}
//             >
//                 {q.QuestionAnswerCodes.map(i => {
//                     const isSelected = String(i.OId) === String(value);
//                     return (
//                         <FormControlLabel
//                             key={i.OId}
//                             value={String(i.OId)}
//                             control={<Radio color="primary" size="small" />}
//                             label={i.optionText}
//                             slotProps={{ typography: { fontSize: { xs: '0.9rem', sm: '1rem' } } }}
//                             sx={{
//                                 width: '100%',
//                                 ml: 0,
//                                 mb: 1.2,
//                                 border: '1px solid',
//                                 borderRadius: '8px',
//                                 padding: '6px 14px',
//                                 transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
//                                 backgroundColor: isSelected ? '#f8f9ff' : '#fff',
//                                 borderColor: isSelected ? '#3f51b5' : '#e0e0e0',
//                                 borderWidth: isSelected ? '1.5px' : '1px',
//                                 boxShadow: isSelected ? '0 2px 8px rgba(63, 81, 181, 0.08)' : 'none',
//                                 '&:hover': {
//                                     borderColor: '#3f51b5',
//                                     backgroundColor: isSelected ? '#f1f3ff' : '#f9f9f9',
//                                 },
//                                 '& .MuiFormControlLabel-label': {
//                                     width: '100%',
//                                     userSelect: 'none'
//                                 }
//                             }}
//                         />
//                     );
//                 })}
//             </RadioGroup>
//         </FormControl>
//     );
// }
 
// function getNewModeInputTextElement(q, value, setVal, error, setErrors, onPasteDetected, onKeystroke, translationsErrors = {}, placeholderTranslations = {}) {
//     return (
//         <FormControl fullWidth>
//             <TextField
//                 variant="outlined"
//                 value={value}
//                 error={!!error}
//                 placeholder={placeholderTranslations || "Type your answer here..."}
//                 onKeyDown={(e) => { if (onKeystroke) onKeystroke(e); }}
//                 onCopy={(e) => {
//                     if (q?.IsZipValidate === 1 || q?.DemoId == 3) {
//                         e.preventDefault();
//                     }
//                 }}
//                 onPaste={(e) => {
//                     if (onPasteDetected) onPasteDetected();
//                     if (q?.IsZipValidate === 1 || q?.DemoId == 3) {
//                         e.preventDefault();
//                     }
//                 }}
//                 onChange={e => {
//                     let val = e.target.value;
//                     if (q.queryType === "text" || q.queryType === 3) {
//                         val = val.toUpperCase();
//                     }
//                     if (q.queryType === "range" || q.queryType == 5) {
//                         val = val.replace(/[^0-9]/g, '');
//                         setErrors(prev => ({
//                             ...prev,
//                             [q.QId]: ""
//                         }));
//                     }
//                     // ✅ ZIP VALIDATION
//                     if (q?.IsZipValidate === 1 || q?.DemoId == 3) {
//                         setErrors(prev => ({
//                             ...prev,
//                             [q.QId]: ""
//                         }));
//                     }
//                     setVal(val);
//                 }}
//                 type="text"
//                 sx={{
//                     bgcolor: '#fff',
//                     '& .MuiOutlinedInput-root': {
//                         borderRadius: '8px',
//                         '&:hover .MuiOutlinedInput-notchedOutline': {
//                             borderColor: '#3f51b5',
//                         },
//                         '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
//                             borderColor: '#3f51b5',
//                             borderWidth: '2px',
//                         },
//                     },
//                     '& .MuiOutlinedInput-input': {
//                         padding: '12px 14px',
//                         fontSize: { xs: '0.9rem', sm: '0.95rem' }
//                     }
//                 }}
//             />
//         </FormControl>
//     );
// }
 
// export default DemographicsIsSinglePageScreening;
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkUserQuotaAction, logAttentionCheckResponse } from '../../store/slices/participantSlice';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import { analyzeIPRanker } from '../../common/utils/ipRanker';
import { startSpinner } from '../../store/slices/loaderSlice';
import DragAndDropGame from './DragAndDropGame';
import SurveyQuestions from './SurveyQuestions';
import { COUNTRY_CODE, ZIP_REGEX, ZIP_EXAMPLES } from '../../common/countrylangMapping';
import './multiselectDropdown.css'
import useBotDetector from './useBotDetector';
import { getTranslationsByCountryId } from '../../locales';
 
// --- New Design Styled Components ---
const StyledCard = styled(Card)(({ theme }) => ({
    width: '100%',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    border: '1px solid #f0f0f0',
    overflow: 'visible !important',
    [theme.breakpoints.down('md')]: {
        margin: theme.spacing(2)
    },
    [theme.breakpoints.down('sm')]: {
        borderRadius: '12px',
        margin: theme.spacing(1)
    }
}));
 
const QuestionContainer = styled(Box)(({ theme }) => ({
    marginBottom: '20px',
    paddingBottom: '2px',
    borderBottom: `1px solid ${theme.palette.divider}66`,
    [theme.breakpoints.down('sm')]: {
        marginBottom: '20px',
        paddingBottom: '2px',
    },
    '&:last-child': {
        borderBottom: 'none',
        marginBottom: 0
    }
}));

const validateZipByCountry = (zip, langId) => {
  const countryCode = COUNTRY_CODE[langId] || null;
  const regex = ZIP_REGEX[countryCode];
  if (!regex) return true;
  return regex.test(zip);
}
 
const QuestionText = styled(Typography)(({ theme }) => ({
    fontWeight: 600,
    fontSize: '1.1rem',
    wordBreak: 'break-word',
    [theme.breakpoints.down('sm')]: {
        fontSize: '1rem',
    },
    marginBottom: theme.spacing(2),
    color: '#1a1a1a',
    lineHeight: 1.4,
    '& .required-star': {
        color: '#d32f2f',
        marginLeft: '4px',
        fontWeight: 'bold',
        fontSize: '1.2rem',
        display: 'inline-block',
        verticalAlign: 'text-top'
    }
}));
 
const StyledButton = styled(Button)(({ theme }) => ({
    padding: theme.spacing(1.2, 5),
    fontSize: '1rem',
    borderRadius: '8px',
    textTransform: 'none',
    fontWeight: 600,
    boxShadow: '0 4px 12px 0 rgba(103, 58, 183, 0.25)',
    background: 'linear-gradient(135deg, #673ab7 0%, #3f51b5 100%)',
    color: 'white',
    transition: 'all 0.2s ease',
    '&:hover': {
        transform: 'translateY(-1px)',
        boxShadow: '0 6px 16px 0 rgba(103, 58, 183, 0.35)',
    },
    [theme.breakpoints.down('sm')]: {
        width: '100%',
        padding: theme.spacing(1.2, 2),
        fontSize: '0.95rem',
    }
}));
const FooterBar = styled(Box)(({ theme }) => ({
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    padding: theme.spacing(1.5, 2),
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(12px)',
    borderTop: `1px solid ${theme.palette.divider}`,
    boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
    zIndex: 4000,
    display: 'flex',
    justifyContent: 'flex-end',
    [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(1, 4),
    }
}));
 
const DemographicsIsSinglePageScreening = () => {
    const dispatch = useDispatch();
    const allDemos = useSelector(state => state.participant.demographicsData);
    const [userAnswer, setUserAnswer] = useState({});
    const [errors, setErrors] = useState({});
    const [isCopied, setIsCopied] = useState({});
    const [submissionAlert, setSubmissionAlert] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGameActive, setIsGameActive] = useState(false);
    const [smartFilterResult, setSmartFilterResult] = useState(-1);
    const [isIPRankerEnabled, setIsIPRankerEnabled] = useState(false);
    const [showDemoUID, setShowDemoUID] = useState(true);
    const [surveyDone, setSurveyDone] = useState(false);
    const [surveyResults, setSurveyResults] = useState(null);
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
    }, [allDemos]);
    const handleGameComplete = (data) => {
        setSmartFilterResult(data.finalScore);
        setIsGameActive(false);
    };

    const handleSurveyComplete = (results) => {
        console.log('Survey Results:', results);
        setSurveyResults(results);
        setSurveyDone(true);
        dispatch(logAttentionCheckResponse({...results,PID:allDemos.PID,CookieId:allDemos.cookieId}))  
    };
 
    const setAnswerForQ = (qid, value) => {
        setUserAnswer(prev => ({ ...prev, [qid]: value }));
        if (errors[qid]) {
            setErrors(prev => ({ ...prev, [qid]: false }));
        }
    };
 
    const handleBulkSubmit = async () => {
        let newErrors = {};
        let firstErrorQId = null;
        const userResponse = [{
            bodyData: [],
            behiviouralData:{}
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
 
                results.push({ userGivenAnswer, userAnserText, isCorrect});
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
             userResponse[0].behiviouralData={
                behiviouralData,
                timeTakenInAnalysis,
                iprankerResponse: ipRankerResult.success,
                botSignals
            }

            userResponse[0].surveyData = surveyResults;

            dispatch(checkUserQuotaAction(userResponse));
 
            setShowDemoUID(false);
            setIsSubmitting(false);
 
        } catch (error) {
            console.error("Submission Error", error);
            setIsSubmitting(false);
        }
    };
 
    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });
 
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
  
    return (
        <React.Fragment>
            <CssBaseline />
            <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', pt: { xs: 2, md: 4 }, pb: { xs: 8, md: 10 } }} >
                <Box sx={{ width: '100%', maxWidth: '700px' }} >
                    <StyledCard>
                        <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
                            {allDemos.allDemos.map((q, index) => {
                                const val = userAnswer[q.QId] || "";
                                const error = errors[q.QId];
 
                                let optionsUI = "";
                                if (q.queryType == 1 || q.queryType == "dropdown") {
                                    optionsUI = <ControlledDropdown q={q} value={val} setVal={(v) => setAnswerForQ(q.QId, v)} translations={translations} />;
                                } else if (q.queryType == 2 || q.queryType == "radio") {
                                    optionsUI = getNewModeRadioOptions(q, val, (v) => setAnswerForQ(q.QId, v));
                                } else if (q.queryType == 4 || q.queryType == "multiselect") {
                                    optionsUI = <GetMultiSelectDropDown q={q} value={val} setVal={(v) => setAnswerForQ(q.QId, v)} translations={translations} />;
                                } else {
                                    const showTextFieldError = (q.queryType == "range" || q.queryType == 5) && error && error != (translations?.errors?.required || "This question is required");
                                    optionsUI = getNewModeInputTextElement(q, val, (v) => { setUserAnswer(prev => ({ ...prev, [q.QId]: v })); onInputChange(q.QId, v); }, showTextFieldError ? error : null, setErrors, () => setIsCopied(prev => ({ ...prev, [q.QId]: 1 })), onKeystroke, translations?.errors, translations?.placeholder?.enterAnswer);
                                }
                                return (
                                    <QuestionContainer
                                        key={q.QId}
                                        ref={el => questionRefs.current[q.QId] = el}
                                        id={`question-${q.QId}`}
                                    >
                                        <QuestionText>
                                            {q.question} <span className="required-star">*</span>
                                        </QuestionText>
                                        <Box sx={{ mt: 1 }}>
                                            {optionsUI}
                                            {error && (
                                                <Typography color="error" fontSize={13} mt={0.5} sx={{ fontWeight: 500 }}>
                                                    {error}
                                                </Typography>
                                            )}
                                        </Box>
                                    </QuestionContainer>
                                );
                            })}
                        {/* Honeypot – invisible to real users; bots fill it */}
                        <input {...honeypotProps} />
                        </CardContent>
                    </StyledCard>
                </Box>
 
                <Snackbar open={submissionAlert} autoHideDuration={3000} onClose={() => setSubmissionAlert(false)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                    <Alert severity="error" onClose={() => setSubmissionAlert(false)}>
                        {translations?.errors?.pleaseAnswerAll || "Please answer all questions correctly to proceed."}
                    </Alert>
                </Snackbar>
 
                <FooterBar>
                    <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'flex-end', p: 0 }}>
                        <Box sx={{ width: '100%', maxWidth: '700px', display: 'flex', justifyContent: 'flex-end' }}>
                            <StyledButton
                                onClick={handleBulkSubmit}
                                disabled={isSubmitting}
                                sx={{ minWidth: '200px' }}
                            >
                                {
                                    isSubmitting ? (
                                        <CircularProgress size={24} sx={{ color: 'white' }} />
                                    ) : (
                                        translations?.buttons?.submit ?? "Submit"
                                    )
                                }
                            </StyledButton>
                        </Box>
                    </Container>
                </FooterBar>
 
            </Container>
        </React.Fragment>
    );
};
 
// --- New Mode Helpers ---
const ControlledDropdown = ({ q, value, setVal, translations }) => {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const containerRef = useRef(null);
    const dropdownRef = useRef(null);
    const [openUpward, setOpenUpward] = useState(false);

    const checkPosition = () => {
        if (!containerRef.current || !dropdownRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const dropdownHeight = 350;
        const footerHeight = 85; 
        const spaceBelow = window.innerHeight - rect.bottom - footerHeight;
        const spaceAbove = rect.top;
        setOpenUpward(spaceBelow < dropdownHeight && spaceAbove > spaceBelow);
    };

    useEffect(() => {
        if (open) setTimeout(checkPosition, 0);
    }, [open]);

    useEffect(() => {
        const handle = () => { if (open) checkPosition(); };
        window.addEventListener("resize", handle);
        return () => {
            window.removeEventListener("resize", handle);
        };
    }, [open]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredOptions = q.QuestionAnswerCodes.filter(opt =>
        opt.optionText.toLowerCase().includes(search.toLowerCase())
    );

    const selectedOption = q.QuestionAnswerCodes.find(i => String(i.OId) === String(value));

    return (
        <div className="custom-multiselect relative w-full" ref={containerRef} style={{ marginBottom: '8px' }}>
            <div className={`ms-input ${open ? 'focused' : ''}`} onClick={() => setOpen(prev => !prev)}>
                {!value ? (
                    <span className="ms-placeholder">{translations.dropdown.selectOption}</span>
                ) : (
                    <span style={{ fontSize: '0.95rem', color: '#1a1a1a', padding: '0 4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {selectedOption ? selectedOption.optionText : value}
                    </span>
                )}
                <div className={`ms-arrow ${open ? 'open' : ''}`}>
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 1.5L6 6.5L11 1.5" />
                    </svg>
                </div>
            </div>

            {open && (
                <React.Fragment>
                    <div className="ms-overlay" onClick={() => setOpen(false)} />
                    <div ref={dropdownRef} className={`ms-dropdown ${openUpward ? "dropdown-up" : "dropdown-down"}`}>
                        <input
                            type="text"
                            className="ms-search"
                            placeholder={translations.dropdown.searchPlaceholder}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                        />
                        <div className="ms-options">
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map(opt => (
                                    <div
                                        key={opt.OId}
                                        className={`ms-option ${String(opt.OId) === String(value) ? 'selected' : ''}`}
                                        onClick={() => {
                                            setVal(opt.OId);
                                            setOpen(false);
                                            setSearch("");
                                        }}
                                    >
                                        {opt.optionText}
                                    </div>
                                ))
                            ) : (
                                <div className="ms-no-data">No results found</div>
                            )}
                        </div>
                    </div>
                </React.Fragment>
            )}
        </div>
    );
};
 
function getNewModeMultiSelect(q, value, setVal) {
    return (
        <FormGroup sx={{ width: '100%' }}>
            {q.QuestionAnswerCodes.map(i => {
                let arr = value ? String(value).split(",") : [];
                let isCheck = arr.includes(String(i.OId));
 
                return (
                    <FormControlLabel
                        key={i.OId}
                        control={
                            <Checkbox
                                checked={isCheck}
                                onClick={() => {
                                    let arr = value ? String(value).split(",") : [];
                                    if (arr.includes(String(i.OId))) {
                                        arr = arr.filter(x => x !== String(i.OId));
                                    } else {
                                        arr.push(String(i.OId));
                                    }
                                    setVal(arr.join(","));
                                }}
                                color="primary"
                            />
                        }
                        label={i.optionText}
                        slotProps={{ typography: { fontSize: { xs: '0.9rem', sm: '1rem' } } }}
                        sx={{
                            width: '100%',
                            ml: 0,
                            mb: 1,
                            border: '1px solid #e0e0e0',
                            borderRadius: '8px',
                            padding: '6px 12px',
                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                            backgroundColor: isCheck ? '#f5f5ff' : '#fff',
                            borderColor: isCheck ? '#3f51b5' : '#e0e0e0',
                            borderWidth: isCheck ? '2px' : '1px',
                            '&:hover': {
                                borderColor: '#3f51b5',
                                backgroundColor: isCheck ? '#f0f0ff' : '#f9f9f9'
                            },
                            '& .MuiFormControlLabel-label': {
                                width: '100%',
                                userSelect: 'none'
                            }
                        }}
                    />
                );
            })}
        </FormGroup>
    );
}

const GetMultiSelectDropDown = ({ q, value, setVal, translations }) => {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const containerRef = useRef(null);
    const dropdownRef = useRef(null);
    const [openUpward, setOpenUpward] = useState(false);

    const selectedValues = value ? String(value).split(",") : [];

    const checkPosition = () => {
        if (!containerRef.current || !dropdownRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const dropdownHeight = 350;
        const footerHeight = 85; 
        const spaceBelow = window.innerHeight - rect.bottom - footerHeight;
        const spaceAbove = rect.top;
        setOpenUpward(spaceBelow < dropdownHeight && spaceAbove > spaceBelow);
    };

    useEffect(() => {
        if (open) setTimeout(checkPosition, 0);
    }, [open]);

    useEffect(() => {
        const handle = () => { if (open) checkPosition(); };
        window.addEventListener("resize", handle);
        return () => {
            window.removeEventListener("resize", handle);
        };
    }, [open]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleSelect = (id) => {
        let updated = [...selectedValues];
        if (updated.includes(String(id))) {
            updated = updated.filter(v => v !== String(id));
        } else {
            updated.push(String(id));
        }
        setVal(updated.join(","));
    };

    const filteredOptions = q.QuestionAnswerCodes.filter(opt =>
        opt.optionText.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="custom-multiselect relative w-full" ref={containerRef}>
            <div className={`ms-input ${open ? 'focused' : ''}`} onClick={() => setOpen(prev => !prev)}>
                {selectedValues.length === 0 && (
                    <span className="ms-placeholder">{translations.dropdown.selectOption}</span>
                )}
                <div className="ms-chips">
                    {selectedValues.map(val => {
                        const option = q.QuestionAnswerCodes.find(i => String(i.OId) === String(val));
                        if (!option) return null;
                        return (
                            <div key={val} className="ms-chip">
                                {option.optionText}
                                <span className="ms-remove" onClick={(e) => { e.stopPropagation(); toggleSelect(val); }}>×</span>
                            </div>
                        );
                    })}
                </div>
                <div className={`ms-arrow ${open ? 'open' : ''}`}>
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 1.5L6 6.5L11 1.5" />
                    </svg>
                </div>
            </div>

            {open && (
                <React.Fragment>
                    <div className="ms-overlay" onClick={() => setOpen(false)} />
                    <div ref={dropdownRef} className={`ms-dropdown ${openUpward ? "dropdown-up" : "dropdown-down"}`}>
                        <input
                            type="text"
                            className="ms-search"
                            placeholder={translations.dropdown.searchPlaceholder}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                        />
                        <div className="ms-options">
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map(opt => {
                                    const isSelected = selectedValues.includes(String(opt.OId));
                                    return (
                                        <label key={opt.OId} className={`ms-option ${isSelected ? 'selected' : ''}`}>
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => toggleSelect(opt.OId)}
                                            />
                                            {opt.optionText}
                                        </label>
                                    );
                                })
                            ) : (
                                <div className="ms-no-data">No results found</div>
                            )}
                        </div>
                    </div>
                </React.Fragment>
            )}
        </div>
    );
};
function getNewModeRadioOptions(q, value, setVal) {
    return (
        <FormControl fullWidth component="fieldset">
            <RadioGroup
                name={`question-${q.QId}`}
                value={value}
                onChange={e => setVal(e.target.value)}
            >
                {q.QuestionAnswerCodes.map(i => {
                    const isSelected = String(i.OId) === String(value);
                    return (
                        <FormControlLabel
                            key={i.OId}
                            value={String(i.OId)}
                            control={<Radio color="primary" size="small" />}
                            label={i.optionText}
                            slotProps={{ typography: { fontSize: { xs: '0.9rem', sm: '1rem' } } }}
                            sx={{
                                width: '100%',
                                ml: 0,
                                mb: 1.2,
                                border: '1px solid',
                                borderRadius: '8px',
                                padding: '6px 14px',
                                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                backgroundColor: isSelected ? '#f8f9ff' : '#fff',
                                borderColor: isSelected ? '#3f51b5' : '#e0e0e0',
                                borderWidth: isSelected ? '1.5px' : '1px',
                                boxShadow: isSelected ? '0 2px 8px rgba(63, 81, 181, 0.08)' : 'none',
                                '&:hover': {
                                    borderColor: '#3f51b5',
                                    backgroundColor: isSelected ? '#f1f3ff' : '#f9f9f9',
                                },
                                '& .MuiFormControlLabel-label': {
                                    width: '100%',
                                    userSelect: 'none'
                                }
                            }}
                        />
                    );
                })}
            </RadioGroup>
        </FormControl>
    );
}
 
function getNewModeInputTextElement(q, value, setVal, error, setErrors, onPasteDetected, onKeystroke, translationsErrors = {}, placeholderTranslations = {}) {
    return (
        <FormControl fullWidth>
            <TextField
                variant="outlined"
                value={value}
                error={!!error}
                placeholder={placeholderTranslations || "Type your answer here..."}
                onKeyDown={(e) => { if (onKeystroke) onKeystroke(e); }}
                onCopy={(e) => {
                    if (q?.IsZipValidate === 1 || q?.DemoId == 3) {
                        e.preventDefault();
                    }
                }}
                onPaste={(e) => {
                    if (onPasteDetected) onPasteDetected();
                    if (q?.IsZipValidate === 1 || q?.DemoId == 3) {
                        e.preventDefault();
                    }
                }}
                onChange={e => {
                    let val = e.target.value;
                    if (q.queryType === "text" || q.queryType === 3) {
                        val = val.toUpperCase();
                    }
                    if (q.queryType === "range" || q.queryType == 5) {
                        val = val.replace(/[^0-9]/g, '');
                        setErrors(prev => ({
                            ...prev,
                            [q.QId]: ""
                        }));
                    }
                    // ✅ ZIP VALIDATION
                    if (q?.IsZipValidate === 1 || q?.DemoId == 3) {
                        setErrors(prev => ({
                            ...prev,
                            [q.QId]: ""
                        }));
                    }
                    setVal(val);
                }}
                type="text"
                sx={{
                    bgcolor: '#fff',
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#3f51b5',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#3f51b5',
                            borderWidth: '2px',
                        },
                    },
                    '& .MuiOutlinedInput-input': {
                        padding: '12px 14px',
                        fontSize: { xs: '0.9rem', sm: '0.95rem' }
                    }
                }}
            />
        </FormControl>
    );
}
 
export default DemographicsIsSinglePageScreening;