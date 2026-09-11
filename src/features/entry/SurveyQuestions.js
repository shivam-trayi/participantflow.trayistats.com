import React, { useState, useMemo } from 'react';
import useBotDetector from './useBotDetector';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Radio from '@mui/material/Radio';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import { useSelector } from 'react-redux';
import { getTranslationsByCountryId } from '../../locales';

// ─────────────────────────────────────────────────
// Styled UI Components (Modern Design)
// ─────────────────────────────────────────────────

const StyledCard = styled(Card)(({ theme }) => ({
    borderRadius: '16px',
    boxShadow: '0 12px 40px rgba(0,0,0,0.08)',
    overflow: 'hidden',
    border: 'none',
    backgroundColor: '#ffffff',
    [theme.breakpoints.down('md')]: {
        margin: theme.spacing(2)
    },
    [theme.breakpoints.down('sm')]: {
        borderRadius: '12px',
        margin: theme.spacing(1)
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
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 16px 0 rgba(103, 58, 183, 0.35)',
    },
    [theme.breakpoints.down('sm')]: {
        width: '100%',
        padding: theme.spacing(1.2, 2),
        fontSize: '0.95rem',
    }
}));

const OptionCard = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'selected'
})(({ theme, selected }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1.5, 2.5),
    marginBottom: theme.spacing(1.5),
    border: `2px solid ${selected ? '#3f51b5' : '#e0e0e0'}`,
    borderRadius: '12px',
    backgroundColor: selected ? '#f5f6ff' : '#ffffff',
    cursor: 'pointer',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
        borderColor: '#3f51b5',
        backgroundColor: selected ? '#f5f6ff' : '#fafaff',
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 12px rgba(63, 81, 181, 0.1)',
    }
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        borderRadius: '12px',
        backgroundColor: '#fafafa',
        transition: 'all 0.2s ease',
        '& fieldset': {
            borderColor: '#e0e0e0',
            borderWidth: '1px',
        },
        '&:hover fieldset': {
            borderColor: '#3f51b5',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#3f51b5',
            borderWidth: '2px',
        },
        '&.Mui-focused': {
            backgroundColor: '#ffffff',
            boxShadow: '0 4px 20px rgba(63, 81, 181, 0.08)',
        }
    }
}));

const HeaderBadge = styled(Typography)(({ theme }) => ({
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '20px',
    backgroundColor: '#ebedff',
    color: '#3f51b5',
    fontSize: '12px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '1.2px',
    marginBottom: theme.spacing(1.5),
}));

// ─────────────────────────────────────────────────
// Utility
// ─────────────────────────────────────────────────

function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// ─────────────────────────────────────────────────
// Attention Check Pool  (10 questions)
// ─────────────────────────────────────────────────

const ATTENTION_CHECKS = [
    {
        id: 'ac1', question: 'What is 2 + 3?',
        options: ['3', '4', '5', '6'], correctValue: '5',
    },
    {
        id: 'ac2', question: 'What is 10 − 4?',
        options: ['5', '6', '7', '8'], correctValue: '6',
    },
    {
        id: 'ac3', question: 'How many days are there in a week?',
        options: ['5', '6', '7', '8'], correctValue: '7',
    },
    {
        id: 'ac4', question: 'What is 3 × 3?',
        options: ['6', '7', '8', '9'], correctValue: '9',
    },
    {
        id: 'ac5', question: 'How many months are in a year?',
        options: ['10', '11', '12', '13'], correctValue: '12',
    },
    {
        id: 'ac6', question: 'Please select the number that comes after 4.',
        options: ['3', '4', '5', '6'], correctValue: '5',
    },
    {
        id: 'ac7', question: 'What is the opposite of "hot"?',
        options: ['Warm', 'Cool', 'Cold', 'Dry'], correctValue: 'Cold',
    },
    {
        id: 'ac8', question: 'Is the word "Definitelly" spelled correctly? Please select "No".',
        options: ['Yes', 'No', 'Maybe', 'I don\'t know'], correctValue: 'No',
    },
    {
        id: 'ac9', question: 'To show that you are paying attention, please select "Apple" from the options.',
        options: ['Banana', 'Orange', 'Apple', 'Grape'], correctValue: 'Apple',
    },
    {
        id: 'ac10', question: 'What is the opposite of "Day"?',
        options: ['Morning', 'Afternoon', 'Night', 'Evening'], correctValue: 'Night',
    },
    {
        id: 'ac12', question: 'Please ignore the following question and just select "Blue". What is your favorite color?',
        options: ['Red', 'Green', 'Blue', 'Yellow'], correctValue: 'Blue',
    },
    {
        id: 'ac15', question: 'For this question, simply choose the word "Guitar".',
        options: ['Piano', 'Violin', 'Guitar', 'Drums'], correctValue: 'Guitar',
    },
    {
        id: 'ac17', question: 'Do you know meaning of "rwkrf" ?.',
        options: ['Yes', 'No'], correctValue: 'No',
    }
];

// ─────────────────────────────────────────────────
// Open-Ended Pool
// ─────────────────────────────────────────────────

const OPEN_ENDED_POOL = [
    {
        id: 'oe1',
        question: 'In a few words, what is most important to you when deciding where to shop?',
        placeholder: 'Type here...',
    },
    {
        id: 'oe2',
        question: 'What feature would you most like to see improved in the technology products you use?',
        placeholder: 'Type here...',
    },
    {
        id: 'oe3',
        question: 'What type of content do you enjoy most and why?',
        placeholder: 'Type here...',
    },
    {
        id: 'oe4',
        question: 'What is your favorite way to spend your free time?',
        placeholder: 'Type here...',
    },
    {
        id: 'oe5',
        question: 'If you could travel anywhere in the world, where would it be and why?',
        placeholder: 'Type here...',
    },
    {
        id: 'oe6',
        question: 'What is a recent achievement you are proud of?',
        placeholder: 'Type here...',
    },
    {
        id: 'oe7',
        question: 'How do you prefer to learn new information?',
        placeholder: 'Type here...',
    },
    {
        id: 'oe8',
        question: 'What do you consider the most important quality in a good team player?',
        placeholder: 'Type here...',
    },
    {
        id: 'oe9',
        question: 'Describe an app or service that you use daily and why it is essential for you.',
        placeholder: 'Type here...',
    },
    {
        id: 'oe10',
        question: 'What are the main factors you consider when purchasing a new smartphone?',
        placeholder: 'Type here...',
    }
];

// ─────────────────────────────────────────────────
// Alert helper
// ─────────────────────────────────────────────────

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

// ─────────────────────────────────────────────────
// Shared Card wrapper
// ─────────────────────────────────────────────────

function SurveyCard({ badge, question, children, onNext, nextLabel = 'Next' }) {
    return (
        <Box sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(120deg, #f0f4ff 0%, #ffffff 100%)',
            py: { xs: 4, md: 8 }
        }}>
            <CssBaseline />
            <Container maxWidth="md">
                <StyledCard>
                    <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
                        {badge && <HeaderBadge>{badge}</HeaderBadge>}
                        <Typography sx={{
                            fontSize: { xs: '1.25rem', sm: '1.5rem' },
                            fontWeight: 700,
                            color: '#1a1a2e',
                            mb: 3,
                            lineHeight: 1.4
                        }}>
                            {question}
                        </Typography>
                        <Divider sx={{ mb: 4, borderColor: '#e0e0e0' }} />

                        <Box sx={{ mb: 5 }}>
                            {children}
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                            <StyledButton onClick={onNext}>{nextLabel}</StyledButton>
                        </Box>
                    </CardContent>
                </StyledCard>
            </Container>
        </Box>
    );
}

// ─────────────────────────────────────────────────
// Step 0 – Attention Check
// ─────────────────────────────────────────────────

const AttentionCheckStep = ({ config, onNext }) => {
    const [selected, setSelected] = useState('');
    const [snack, setSnack] = useState({ open: false, msg: '', severity: 'error' });
    const rawCountryId = useSelector(
        state => state.participant.demographicsData.countryCode
    );
    const translations = useMemo(
        () => getTranslationsByCountryId(rawCountryId),
        [rawCountryId]
    );

    const showSnack = (msg, severity = 'error') =>
        setSnack({ open: true, msg, severity });

    const handleNext = () => {
        if (!selected) {
            showSnack(translations?.errors?.attentionCheckError || "Please select an answer to continue.");
            return;
        }
        const isCorrect = selected === config.correctValue;
        if (!isCorrect) {
            //showSnack("Incorrect — but let's keep going!", 'warning');
            //setTimeout(() => onNext({ questionId: config.id, answer: selected, isCorrect: false }), 1300);
            onNext({ questionId: config.id, answer: selected, isCorrect: false });
        } else {
            onNext({ questionId: config.id, answer: selected, isCorrect: true });
        }
    };

    return (
        <>
            <SurveyCard badge="" question={config.question} onNext={handleNext} nextLabel={
                translations?.surveyQuestions?.buttons?.next ||
                "Next"
            }>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    {config.options.map(opt => {
                        const isSelected = selected === opt;
                        return (
                            <OptionCard
                                key={opt}
                                selected={isSelected}
                                onClick={() => setSelected(opt)}
                            >
                                <Radio
                                    checked={isSelected}
                                    value={opt}
                                    name="attention-check-radio"
                                    color="primary"
                                    sx={{ p: 0, mr: 2 }}
                                />
                                <Typography sx={{
                                    fontSize: '1rem',
                                    fontWeight: isSelected ? 600 : 400,
                                    color: isSelected ? '#1a1a2e' : '#4a4a5a'
                                }}>
                                    {opt}
                                </Typography>
                            </OptionCard>
                        );
                    })}
                </Box>
            </SurveyCard>

            <Snackbar open={snack.open} autoHideDuration={2200}
                onClose={() => setSnack(s => ({ ...s, open: false }))}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert severity={snack.severity} sx={{ width: '100%', borderRadius: '8px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>{snack.msg}</Alert>
            </Snackbar>
        </>
    );
};

// ─────────────────────────────────────────────────
// Step 1 – Open-Ended
// ─────────────────────────────────────────────────

const OpenEndedStep = ({ config, onNext }) => {
    const [answer, setAnswer] = useState('');
    const [snackOpen, setSnackOpen] = useState(false);
    const [isCopied, setIsCopied] = useState(0);
    const [isPasted, setIsPasted] = useState(0);
    const [isAutoFillDetected, setIsAutoFillDetected] = useState(0);
    const lastLengthRef = React.useRef(0);
    const { getBotSignals, onKeystroke, onInputChange, honeypotProps } = useBotDetector();
    const rawCountryId = useSelector(
        state => state.participant.demographicsData.countryCode
    );
    const translations = useMemo(
        () => getTranslationsByCountryId(rawCountryId),
        [rawCountryId]
    );

    const handleNext = () => {
        if (!answer.trim()) { setSnackOpen(true); return; }
        const botSignals = getBotSignals();
        onNext({ openEndedId: config.id, question: config.question, answer: answer.trim(), isCopied: isCopied, isPasted: isPasted, isAutoFillDetected: isAutoFillDetected, botSignals });
    };

    return (
        <>
            <SurveyCard
                badge=""
                question={config.question}
                onNext={handleNext}
                nextLabel={
                    translations?.surveyQuestions?.buttons?.submitContinue ||
                    "Submit & Continue"
                }
            >
                <StyledTextField
                    multiline minRows={5} maxRows={10}
                    fullWidth
                    placeholder={config.placeholder}
                    value={answer}
                    onCopy={() => setIsCopied(1)}
                    onPaste={() => setIsPasted(1)}
                    onKeyDown={(e) => onKeystroke(e)}
                    onChange={e => { 
                        const newLength = e.target.value.length;
                        if (newLength - lastLengthRef.current > 20) {
                            setIsAutoFillDetected(1);
                        }
                        lastLengthRef.current = newLength;
                        
                        setAnswer(e.target.value); 
                        onInputChange('openEnded', e.target.value); 
                    }}
                    variant="outlined"
                    inputProps={{ maxLength: 1000, autoComplete: 'new-password' }}
                />
                {/* Honeypot – bots fill this; humans don't */}
                <input {...honeypotProps} />
                <Typography variant="caption"
                    sx={{ color: '#999', display: 'block', textAlign: 'right', mt: 1, fontWeight: 500 }}>
                    {answer.length} / 1000 {translations?.characters || "characters"}
                </Typography>
            </SurveyCard>

            <Snackbar open={snackOpen} autoHideDuration={2000}
                onClose={() => setSnackOpen(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert severity="error" sx={{ width: '100%', borderRadius: '8px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>
                    {translations?.errors?.openEndedCheckError || "Please enter your thoughts before continuing."}
                </Alert>
            </Snackbar>
        </>
    );
};

// ─────────────────────────────────────────────────
// Main orchestrator
// ─────────────────────────────────────────────────

const STEPS = ['attention', 'openEnded'];

const SurveyQuestions = ({ onComplete }) => {
    const rawCountryId = useSelector(
        state => state.participant.demographicsData.countryCode
    );
    const translations = useMemo(
        () => getTranslationsByCountryId(rawCountryId),
        [rawCountryId]
    );
    const t = translations?.surveyQuestions || {};
    // const attentionConfig = useMemo(() => pickRandom(ATTENTION_CHECKS), []);
    // const openEndedConfig = useMemo(() => pickRandom(OPEN_ENDED_POOL), []);
    const attentionConfig = useMemo(() => {
        const question = pickRandom(ATTENTION_CHECKS);

        return {
            ...question,
            question:
                translations?.surveyQuestions?.attentionChecks?.[question.id] ||
                question.question,

            options: question.options.map(option =>
                translations?.surveyQuestions?.attentionChecks?.options?.[option] ||
                option
            ),

            correctValue:
                translations?.surveyQuestions?.attentionChecks?.options?.[
                question.correctValue
                ] || question.correctValue
        };
    }, [translations]);

    const openEndedConfig = useMemo(() => {
        const question = pickRandom(OPEN_ENDED_POOL);

        return {
            ...question,
            question:
                translations?.surveyQuestions?.openEnded?.[question.id] ||
                question.question,
            placeholder:
                translations?.surveyQuestions?.openEnded?.placeholder ||
                question.placeholder
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
