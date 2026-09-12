import React, { useState, useRef, useMemo } from 'react';
import { useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { keyframes } from '@mui/system';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { getTranslationsByCountryId } from '../../../locales/index';
import { generateMockData, MOCK_DATA } from '../../../mockData/dragAndDropMockData';

// Full Expanded Mock Data Generator as requested by the user


const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
`;

const pulse = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(25, 118, 210, 0.4); }
  70% { transform: scale(1.03); box-shadow: 0 0 0 10px rgba(25, 118, 210, 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(25, 118, 210, 0); }
`;

const DragAndDropGame = ({ onComplete }) => {
    const rawCountryId = useSelector(state => state.participant.demographicsData.countryCode
);    
    const translations = useMemo(() => getTranslationsByCountryId(rawCountryId), [rawCountryId]);
    const t = translations?.dragDrop || {};

    // Game Logic
    const [round, setRound] = useState(1);
    const [score, setScore] = useState(0);
    const [gameHistory, setGameHistory] = useState([]);

    // Helper to get a random question
    const getRandomQuestion = () => MOCK_DATA[Math.floor(Math.random() * MOCK_DATA.length)];

    // Initialize with first question
    const [currentQuestion, setCurrentQuestion] = useState(() => getRandomQuestion());

    const [feedback, setFeedback] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [completed, setCompleted] = useState(false);

    // Touch State
    const [dragging, setDragging] = useState(false);
    const [touchPos, setTouchPos] = useState({ x: 0, y: 0 });
    const dragItemRef = useRef(null);
    const dropZoneRefs = useRef({});

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Interaction Handlers
    const handleInteractionEnd = (option) => {
        if (completed) return;

        let isCorrect = false;
        if (String(option.value).toLowerCase() === String(currentQuestion.correctValue).toLowerCase()) {
            isCorrect = true;
        }

        setCompleted(true);
        if (isCorrect) setScore(s => s + 1);

        const currentResult = {
            round: round,
            questionId: currentQuestion.id,
            question: currentQuestion.question,
            userAnswer: option.value,
            correct: isCorrect
        };

        const newHistory = [...gameHistory, currentResult];
        setGameHistory(newHistory);

        if (isCorrect) {
            setFeedback({ type: 'success', message: t.correct || 'Correct!' });
        } else {
            setFeedback({ type: 'error', message: t.incorrect || 'False' });
        }

        setOpenSnackbar(true);

        setTimeout(() => {
            if (round < 1) {
                setRound(r => r + 1);
                setCurrentQuestion(getRandomQuestion());
                setCompleted(false);
                setOpenSnackbar(false);
            } else {
                onComplete({
                    result: 'completed',
                    totalRounds: 1,
                    finalScore: isCorrect ? score + 1 : score,
                    history: newHistory
                });
            }
        }, 100);
    }

        // --- HTML5 DnD Handlers ---
    const handleDragStart = (e) => {
        e.dataTransfer.setData("text/plain", JSON.stringify(currentQuestion));
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDrop = (e, option) => {
        e.preventDefault();
        handleInteractionEnd(option);
    };

    // --- Touch Event Handlers ---
    const handleTouchStart = (e) => {
        if (completed) return;
        setDragging(true);
        const touch = e.touches[0];
        setTouchPos({ x: touch.clientX, y: touch.clientY });

        // Prevent scrolling while dragging
        // document.body.style.overflow = 'hidden'; 
    };

    const handleTouchMove = (e) => {
        if (!dragging || completed) return;
        const touch = e.touches[0];
        setTouchPos({ x: touch.clientX, y: touch.clientY });

        if (dragItemRef.current) {
            // Move the element visibly
            // Calculated offset could be applied here if we want the element to follow perfectly
        }
    };

    const handleTouchEnd = (e) => {
        if (!dragging || completed) return;
        setDragging(false);
        const touch = e.changedTouches[0];
        const clientX = touch.clientX;
        const clientY = touch.clientY;

        let droppedOption = null;
        Object.keys(dropZoneRefs.current).forEach(key => {
            const rect = dropZoneRefs.current[key]?.getBoundingClientRect();
            if (rect && clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom) {
                droppedOption = currentQuestion.options.find(o => o.id === key);
            }
        });
        if (droppedOption) {
            handleInteractionEnd(droppedOption);
        }
    };

   const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };
    return (
        <Box sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 2,
            background: 'linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)',
            overflow: 'hidden'
        }}>
            <Box sx={{
                width: '100%',
                maxWidth: 800,
                textAlign: 'center',
                mb: isMobile ? 3 : 6,
                animation: `${fadeIn} 1s ease-out`
            }}>
                <Typography variant={isMobile ? "h4" : "h3"} gutterBottom sx={{ fontWeight: 800, color: '#1565c0', textShadow: '0px 2px 4px rgba(0,0,0,0.1)' }}>
                    {t.title || 'Quick Match'} {t.round || 'Round'} {round}
                </Typography>
                <Typography variant="body1" sx={{ color: '#455a64', fontWeight: 500 }}>
                    {t.instruction || 'Drag the card to the correct category below'}
                </Typography>
            </Box>

            <Box
                ref={dragItemRef}
                draggable={!completed}
                onDragStart={handleDragStart}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{
                    position: dragging ? 'fixed' : 'relative',
                    left: dragging ? touchPos.x - 100 : 'auto',
                    top: dragging ? touchPos.y - 50 : 'auto',
                    zIndex: dragging ? 9999 : 1,
                    touchAction: 'none'
                }}
            >
                <Card sx={{
                    width: isMobile ? 260 : 300,
                    height: isMobile ? 120 : 160,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: isMobile ? 4 : 8,
                    cursor: completed ? 'default' : 'grab',
                    background: 'rgba(255, 255, 255, 0.85)',
                    backdropFilter: 'blur(12px)',
                    boxShadow: dragging ? '0 15px 35px rgba(0,0,0,0.2)' : '0 10px 30px rgba(0,0,0,0.1)',
                    borderRadius: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.4)',
                    animation: `${dragging ? 'none' : pulse} 4s infinite ease-in-out`,
                    transform: dragging ? 'scale(1.1)' : 'scale(1)',
                    transition: 'transform 0.1s'
                }}>
                    <CardContent>
                        <Typography variant={isMobile ? "h5" : "h4"} component="div" sx={{ fontWeight: 700, color: '#0d47a1' }}>
                            {t.categories?.[currentQuestion.question] || currentQuestion.question}
                        </Typography>
                    </CardContent>
                </Card>
            </Box>

            <Box sx={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
                gap: 2,
                width: '100%',
                maxWidth: 900,
                px: 2
            }}>
                {currentQuestion.options.map((option) => (
                    <div key={option.id} ref={el => dropZoneRefs.current[option.id] = el}>
                        <Card
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, option)}
                            sx={{
                                height: isMobile ? 100 : 140,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: 'rgba(255, 255, 255, 0.5)',
                                backdropFilter: 'blur(8px)',
                                border: '2px dashed rgba(25, 118, 210, 0.3)',
                                borderRadius: '16px',
                                transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                                "&:hover": { background: 'rgba(255, 255, 255, 0.9)', transform: 'translateY(-5px)', borderColor: '#1976d2', boxShadow: '0 12px 20px rgba(0,0,0,0.15)' }
                            }}
                        >
                            <CardContent sx={{ p: isMobile ? 1 : 2 }}>
                                <Typography variant={isMobile ? "body1" : "h6"} sx={{ color: '#01579b', fontWeight: 600 }}>
                                    {t.categories?.[option.text] || option.text}
                                </Typography>
                            </CardContent>
                        </Card>
                    </div>
                ))}
            </Box>

  <Snackbar
                open={openSnackbar}
                autoHideDuration={1500}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={feedback?.type || 'info'}
                    sx={{
                        width: '100%',
                        fontSize: '1.2rem',
                        padding: '16px 32px',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                        borderRadius: '50px'
                    }}
                >
                    {feedback?.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default DragAndDropGame;
