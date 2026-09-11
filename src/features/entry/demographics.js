import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createParticipantAction, saveUserAnswerAction, checkUserQuotaAction, userFailedInScreeningAction, logAttentionCheckResponse } from '../../store/slices/participantSlice';
import DragAndDropGame from './DragAndDropGame';
import SurveyQuestions from './SurveyQuestions';

import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import Divider from '@mui/material/Divider';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import useCopyPasteLogger from './useCopyPasteLogger';
import config from '../../common/api/config';
import { analyzeIPRanker } from '../../common/utils/ipRanker';
import { startSpinner } from '../../store/slices/loaderSlice';
import { COUNTRY_CODE, ZIP_REGEX, ZIP_EXAMPLES } from '../../common/countrylangMapping';
import useBotDetector from './useBotDetector';
import { getTranslationsByCountryId } from '../../locales';


function validateZipByCountry(zip, langId) {
  const countryCode = COUNTRY_CODE[langId] || null;
  const regex = ZIP_REGEX[countryCode];
  if (!regex) return true;
  return regex.test(zip);
}

const Demographics = () => {
     const createTimeout = (ms) =>
      new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Fingerprint request timed out")), ms)
  );
    const dispatch = useDispatch();
    const allDemos = useSelector(state => state.participant.demographicsData);
    const translations = React.useMemo(
        () => getTranslationsByCountryId(allDemos?.countryCode),
        [allDemos?.countryCode]
    );

    // all Demos Here
    let [currentQuestion, setCurrentQuestion] = useState(0);
    let [userAnswer, setUserAnswer] = useState("");
    let [isCopied, setIsCopied] = useState(0);
    const [zipError, setZipError] = useState("");
    let [smartFilterResult, setSmartFilterResult] = useState(-1); // default -1 not asked
    let [showDemoUID, setShowDemoUID] = useState(true);
    const [isIPRankerEnabled, setIsIPRankerEnabled] = useState(false);
    const [open, setOpen] = React.useState(false);
    const [alertMessage, setAlertMessage] = useState("You didn't give any answer !");
    const [pid, setPid] = useState(null);
    useCopyPasteLogger(pid, config.API_KEY);
    const { getBotSignals, onKeystroke, onInputChange, honeypotProps } = useBotDetector();


    const [isGameActive, setIsGameActive] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [apiCallStarted, setApiCallStarted] = useState(false);
    const [surveyDone, setSurveyDone] = useState(false);
    const [surveyResults, setSurveyResults] = useState(null);
    const isLoading = useSelector(state => state.spinner && state.spinner.loading);

    useEffect(() => {
    if (allDemos) {
        setCurrentQuestion(0);
        setUserAnswer("");
        setIsCopied(0);
        setShowDemoUID(true);
        setSmartFilterResult(-1);
        setApiCallStarted(false);
        setIsSubmitting(false);
        setSurveyDone(false);
        setSurveyResults(null);
    }
}, [allDemos]);

    useEffect(() => {
        if (allDemos?.PID) {
            setPid(allDemos.PID);
        }
        if (allDemos?.isDemoEnabled && allDemos?.isSmartRespFilterEnabled == 1) {
            setIsGameActive(true);
        }

        if(allDemos?.isDemoEnabled && allDemos?.isIpRankerAnalysisEnabled == 1) {
            setIsIPRankerEnabled(true);
        }
        
    }, [allDemos?.PID, allDemos?.isDemoEnabled, allDemos]);
 
    // useEffect(() => {
    //     if (apiCallStarted && !isLoading && currentQuestion != 0) {
    //         setShowDemoUID(false);
    //         setApiCallStarted(false);
    //         setIsSubmitting(false);
    //     }
    // }, [apiCallStarted, isLoading]);


    const handleGameComplete = (data) => {
        // Log data for tracking purpose as requested
        console.log("Mini Game Result:", data);
        setSmartFilterResult(data.finalScore);
        setIsGameActive(false);
    };

    const handleSurveyComplete = (results) => {
        console.log("Survey Results:", results);
        setSurveyResults(results);
        setSurveyDone(true);
        dispatch(logAttentionCheckResponse({...results,PID:allDemos.PID,CookieId:allDemos.cookieId}))
    };

    const handleClick = (msg) => {
        setAlertMessage(msg || translations?.errors?.noAnswerGiven || "You didn't give any answer !");
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const onClickSave = async () => {
        if (userAnswer !== undefined && userAnswer === "") {
            handleClick();
            return
        }



        let userGivenAnswer = userAnswer;
        let allDemoData = allDemos.allDemos;
        let currentQuestionData = allDemoData[currentQuestion];

        if (currentQuestionData?.IsZipValidate === 1 || currentQuestionData?.DemoId == 3) {
            const countryCode = currentQuestionData?.lang_code || allDemos?.countryCode;
            const isValidFormat = validateZipByCountry(userAnswer, countryCode);
            if (!isValidFormat && userAnswer.length > 0) {
                const actualCountryCode = COUNTRY_CODE[countryCode];
                const example = ZIP_EXAMPLES[actualCountryCode];
                const invalidZipTxt = translations?.errors?.invalidZip || "Invalid ZIP format";
                const mappedStr = example ? `${invalidZipTxt} (e.g. ${example})` : invalidZipTxt;
                setZipError(mappedStr);
                handleClick(mappedStr);
                return;
            }
        }
        let isCorrect = false;
        let userAnserText = [];
        if ((currentQuestionData.queryType === "dropdown") || currentQuestionData.queryType == 1) {
            isCorrect = currentQuestionData.correctAnswerCode.includes(+userGivenAnswer);
            userAnserText.push(currentQuestionData.QuestionAnswerCodes.filter(mData => mData.OId == userGivenAnswer)[0].optionText);
            userGivenAnswer = [userGivenAnswer];
        } else if ((currentQuestionData.queryType === "radio") || (currentQuestionData.queryType == 2)) {
            isCorrect = currentQuestionData.correctAnswerCode.includes(+userGivenAnswer);
            userAnserText.push(currentQuestionData.QuestionAnswerCodes.filter(mData => mData.OId == userGivenAnswer)[0].optionText);
            userGivenAnswer = [userGivenAnswer];
        } else if ((currentQuestionData.queryType === "multiselect") || (currentQuestionData.queryType == 4)) {

            userGivenAnswer = userGivenAnswer.split(",").map(Number);
            let defaultCorrect = false;
            for (let i = 0; i < userGivenAnswer.length; i++) {
                let checkCorrect = currentQuestionData.correctAnswerCode.filter(corr => corr == userGivenAnswer[i]);
                if (checkCorrect.length > 0) {
                    defaultCorrect = true;
                    break;
                }
            }

            if (defaultCorrect === true) {
                isCorrect = true;
            } else {
                isCorrect = false;
            }

            for (let key of userGivenAnswer) {
                userAnserText.push(currentQuestionData.QuestionAnswerCodes.filter(mData => mData.OId == key)[0].optionText)
            }

        } else if ((currentQuestionData.queryType === "range") || (currentQuestionData.queryType == 5)) {
            isCorrect = currentQuestionData.correctAnswerCode.includes(+userGivenAnswer);
            userAnserText.push(userGivenAnswer);
            userGivenAnswer = [userGivenAnswer];
        } else if ((currentQuestionData.queryType === "text") || (currentQuestionData.queryType == 3)) {
            if (currentQuestionData?.IsZipValidate === 1 && currentQuestionData.QId !== 669) {
                // 669 is FSA question
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

        const isLastQuestion = currentQuestion === allDemos.allDemos.length - 1;

        if (isCorrect) {
            // Question is correct given by user
            // check is it a last question or not
            if (isLastQuestion) {
                // call check screener Quota API
                // Start Spinner
                setIsSubmitting(true);

                let behiviouralData = null;
                localStorage.removeItem('ipranker_cache');
                let timeTakenInAnalysis = new Date().getTime();
                let ipRankerResult = {success : false};
                if (isIPRankerEnabled) {
                    dispatch(startSpinner());
                    try {
                    ipRankerResult = await Promise.race([
                                    analyzeIPRanker(),
                                    createTimeout(7000)
                                    ])
                    } catch (error) {
                       ipRankerResult.success = false
                    }
                    if (ipRankerResult.success) {
                        behiviouralData = ipRankerResult.payload;
                    }
                }
                

                timeTakenInAnalysis = new Date().getTime() - timeTakenInAnalysis;

                let postData = {
                    PID: allDemos.PID,
                    userAnswer: userGivenAnswer, // it will be a array
                    QId: currentQuestionData.QId,
                    isCorrect: isCorrect,
                    smartFilterResult : smartFilterResult,
                    userAnswerText: userAnserText, // it will be a array
                    behiviouralData: behiviouralData,
                    timeTakenInAnalysis,
                    iprankerResponse : ipRankerResult.success,
                    surveyData: surveyResults,
                    isCopied: isCopied,
                    isPasted: isCopied,
                    botSignals: getBotSignals()
                }

                setApiCallStarted(true);
                dispatch(checkUserQuotaAction(postData));
                // setShowDemoUID(false);
                // Hide Demo UI here

            } else {
                // save User Reply into table

                let postData = {
                    PID: allDemos.PID,
                    userAnswer: userGivenAnswer, // it will be a array
                    QId: currentQuestionData.QId,
                    isCorrect: isCorrect,
                    smartFilterResult : smartFilterResult,
                    userAnswerText: userAnserText, // it will be a array
                    surveyData: surveyResults,
                    isCopied: isCopied,
                    isPasted: isCopied,
                    botSignals: getBotSignals()
                }

                dispatch(saveUserAnswerAction(postData));
                setUserAnswer("");
                setIsCopied(0);
                setCurrentQuestion(currentQuestion + 1);
            }
        } else {
            // User failed in screening
            // Call User Failed in Screening API
            // Start Spinner


            let postData = {
                PID: allDemos.PID,
                userAnswer: userGivenAnswer, // it will be a array
                QId: currentQuestionData.QId,
                isCorrect: isCorrect,
                smartFilterResult : smartFilterResult,
                userAnswerText: userAnserText, // it will be a array
                surveyData: surveyResults,
                isCopied: isCopied,
                isPasted: isCopied,
                botSignals: getBotSignals()
            }

            if (isLastQuestion) {
                setIsSubmitting(true);
                setApiCallStarted(true);
                dispatch(userFailedInScreeningAction(postData));
                // setShowDemoUID(false);
            } else {
                dispatch(userFailedInScreeningAction(postData));
                // Hide Demo UI here
                // setShowDemoUID(false);
            }
        }

    }

    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

    let content = "";
    if (isGameActive) {
        content = <DragAndDropGame onComplete={handleGameComplete} />;
    } else if (allDemos?.isDemoEnabled  && allDemos?.IsAttentionCheckEnabled == 1 && !surveyDone) {
        content = <SurveyQuestions onComplete={handleSurveyComplete} />;
    } else if (allDemos && allDemos.allDemos && showDemoUID) {
        let allDemoData = allDemos.allDemos;

        let currentQuestionData = allDemoData[currentQuestion];
        let questionTextUI = <FormGroup style={{ "marginTop": "-20px" }}>
            <p style={{ "fontSize": "25px", "width": "100%", "textAlign": "left" }}>{currentQuestionData.question} </p>
        </FormGroup>


        let optionsUI = "";

        if ((currentQuestionData.queryType === "dropdown") || (currentQuestionData.queryType == 1)) {
            // Drop Down Feature
            optionsUI = getDropdownUI(currentQuestionData, userAnswer, setUserAnswer);
        } else if (currentQuestionData.queryType === "radio" || currentQuestionData.queryType == 2) {
            optionsUI = getRadioOptions(currentQuestionData, userAnswer, setUserAnswer);
        } else if ((currentQuestionData.queryType === "multiselect") || (currentQuestionData.queryType == 4)) {
            optionsUI = getMultiSelect(currentQuestionData, userAnswer, setUserAnswer);
        } else if ((currentQuestionData.queryType === "range") || currentQuestionData.queryType == 5) {
            optionsUI = getInputTextElement(currentQuestionData, userAnswer, setUserAnswer, setZipError, () => setIsCopied(1), onKeystroke, (v) => onInputChange('field', v), translations?.errors);
        } else if ((currentQuestionData.queryType === "text") || (currentQuestionData.queryType == 3)) {
            optionsUI = getInputTextElement(currentQuestionData, userAnswer, setUserAnswer, setZipError, () => setIsCopied(1), onKeystroke, (v) => onInputChange('field', v), translations?.errors);
        }

        content =
            <React.Fragment>
                <CssBaseline />
                <Container maxWidth="sm" >
                    <Box sx={{ height: '100vh' }} >
                        <Card variant="outlined" style={{ "margin": "20px" }}>
                            <CardContent>
                                {questionTextUI}
                                <Divider style={{ "marginTop": "-10px", "marginBottom": "40px" }} />
                                {optionsUI}
                                {zipError && (
                                    <p style={{ color: "red", fontSize: "14px", marginTop: "8px" }}>
                                        {zipError}
                                    </p>
                                )}
                                {/* Honeypot – bots fill this; humans don't */}
                                <input {...honeypotProps} />
                            </CardContent>
                            <CardActions style={{ "float": "right", "margin": "10px" }}>
                                <Button variant="contained" onClick={() => !isSubmitting && onClickSave()}>
                                    {isSubmitting ? <CircularProgress size={24} sx={{ color: 'white' }} /> : "Next"}
                                </Button>
                            </CardActions>
                        </Card>

                        <Snackbar open={open} autoHideDuration={2000}
                            anchorOrigin={{ "vertical": "top", "horizontal": "center" }}
                            onClose={handleClose}>
                            <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                                {alertMessage}
                            </Alert>
                        </Snackbar>
                    </Box>
                </Container>
            </React.Fragment>
    } else {

    }

    return (
        <div>{content}</div>
    );

}

function getDropdownUI(currentQuestionData, userAnswer, setUserAnswer) {
    let myDropdowns = currentQuestionData.QuestionAnswerCodes.map(function (item, index) {
        // eslint-disable-next-line react/jsx-key
        return <MenuItem value={item.OId}>{item.optionText}</MenuItem>
    });


    return <FormGroup >
        <Select
            value={userAnswer}
            onChange={e => setUserAnswer(e.target.value)}
            displayEmpty
            style={{ "width": "200px", "height": "40px" }}
            inputProps={{ 'aria-label': 'Without label' }}
        >
            <MenuItem value="">Please Select</MenuItem>
            {myDropdowns}
        </Select>


    </FormGroup>

}

function getMultiSelect(currentQuestionData, userAnswer, setUserAnswer) {
    let myDropdowns = currentQuestionData.QuestionAnswerCodes.map(function (item, index) {
        let isCheck = false;
        if (userAnswer === "") {
            isCheck = false;
        } else {
            isCheck = userAnswer.includes(new String(item.OId))
        }

        return <FormControlLabel control={<Checkbox checked={isCheck} id={item.OId} name="checkbox=[]" onClick={e => {

            if (userAnswer === "") {
                userAnswer = new String(e.target.value)
            } else {
                if (userAnswer.includes(item.OId)) {
                    let allUserSelectdItems = userAnswer.split(",");
                    let allRemainingItems = allUserSelectdItems.filter(mData => mData != item.OId)
                    userAnswer = allRemainingItems.join();
                } else {
                    userAnswer = userAnswer + "," + e.target.value;
                }
            }

            setUserAnswer(userAnswer)
            // eslint-disable-next-line react/jsx-key
        }} value={item.OId} />} label={item.optionText} />
    });

    return <FormGroup>
        {myDropdowns}
    </FormGroup>


}

function getRadioOptions(currentQuestionData, userAnswer, setUserAnswer) {
    let myDropdowns = currentQuestionData.QuestionAnswerCodes.map(function (item, index) {
        // eslint-disable-next-line react/jsx-key
        return <FormControlLabel value={item.OId} control={<Radio />} label={item.optionText} />


    });

    return <RadioGroup
        aria-labelledby="demo-controlled-radio-buttons-group"
        name="controlled-radio-buttons-group"
        value={userAnswer}
        onChange={e => setUserAnswer(e.target.value)}
    >
        <FormGroup>
            {myDropdowns}
        </FormGroup>
    </RadioGroup>
}

function getInputTextElement(currentQuestionData, userAnswer, setUserAnswer, setZipError, onPasteDetected, onKeystroke, onInputChange, translationsErrors = {}) {

    return <FormGroup >
        <OutlinedInput style={{ "width": "200px", "height": "40px" }} value={userAnswer}
            onCopy={(e) => {
                if (currentQuestionData?.IsZipValidate === 1 || currentQuestionData?.DemoId == 3) {
                    e.preventDefault();
                }
            }}
            onKeyDown={(e) => { if (onKeystroke) onKeystroke(e); }}
            onPaste={(e) => {
                if (onPasteDetected) onPasteDetected();
                if (currentQuestionData?.IsZipValidate === 1 || currentQuestionData?.DemoId == 3) {
                    e.preventDefault();
                }
            }}
            onChange={e => {
                let val = e.target.value;
                if (onInputChange) onInputChange(val);

                if (currentQuestionData.queryType === "range" || currentQuestionData.queryType == 5) {
                    val = val.replace(/[^0-9]/g, '');
                }

                if (currentQuestionData.queryType === "text" || currentQuestionData.queryType == 3) {
                    val = val.toUpperCase();
                }

                    // Clear ZIP error on change
                    if (currentQuestionData?.IsZipValidate === 1 || currentQuestionData?.DemoId == 3) {
                        setZipError("");
                    }

                setUserAnswer(val);
            }} type="text"></OutlinedInput>
    </FormGroup>
}

export default Demographics;
