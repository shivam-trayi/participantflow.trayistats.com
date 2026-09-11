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

// Full Expanded Mock Data Generator as requested by the user
const generateMockData = () => {
    const baseData = [
        { q: "5", t: "Number", o: ["Two", "Five", "Ten", "Seven"], v: ["2", "5", "10", "7"], c: "5" },
        { q: "Apple", t: "Word", o: ["Vehicle", "Fruit", "Animal", "Color"], v: ["vehicle", "fruit", "animal", "color"], c: "fruit" },
        { q: "Blue", t: "Word", o: ["Color", "Fruit", "Shape", "Number"], v: ["color", "fruit", "shape", "number"], c: "color" },
        { q: "10", t: "Number", o: ["Ten", "One", "Zero", "Hundred"], v: ["10", "1", "0", "100"], c: "10" },
        { q: "Dog", t: "Word", o: ["Animal", "Plant", "City", "Car"], v: ["animal", "plant", "city", "car"], c: "animal" },
        { q: "Square", t: "Word", o: ["Shape", "Taste", "Sound", "Smell"], v: ["shape", "taste", "sound", "smell"], c: "shape" },
        { q: "Car", t: "Word", o: ["Vehicle", "Building", "Food", "Planet"], v: ["vehicle", "building", "food", "planet"], c: "vehicle" },
        { q: "2 + 2", t: "Math", o: ["3", "4", "5", "6"], v: ["3", "4", "5", "6"], c: "4" },
        { q: "Sun", t: "Word", o: ["Star", "Moon", "Earth", "Comet"], v: ["star", "moon", "earth", "comet"], c: "star" },
        { q: "Water", t: "Word", o: ["Liquid", "Solid", "Gas", "Plasma"], v: ["liquid", "solid", "gas", "plasma"], c: "liquid" },
        { q: "Red", t: "Word", o: ["Color", "Sound", "Taste", "Touch"], v: ["color", "sound", "taste", "touch"], c: "color" },
        { q: "Cat", t: "Word", o: ["Animal", "Insect", "Fish", "Bird"], v: ["animal", "insect", "fish", "bird"], c: "animal" },
        { q: "3 + 5", t: "Math", o: ["6", "7", "8", "9"], v: ["6", "7", "8", "9"], c: "8" },
        { q: "Chair", t: "Word", o: ["Furniture", "Vehicle", "Food", "Clothing"], v: ["furniture", "vehicle", "food", "clothing"], c: "furniture" },
        { q: "Circle", t: "Word", o: ["Shape", "Color", "Number", "Letter"], v: ["shape", "color", "number", "letter"], c: "shape" },
        { q: "Banana", t: "Word", o: ["Fruit", "Vegetable", "Meat", "Dairy"], v: ["fruit", "vegetable", "meat", "dairy"], c: "fruit" },
        { q: "Run", t: "Word", o: ["Verb", "Noun", "Adjective", "Pronoun"], v: ["verb", "noun", "adjective", "pronoun"], c: "verb" },
        { q: "Happy", t: "Word", o: ["Emotion", "Color", "Size", "Shape"], v: ["emotion", "color", "size", "shape"], c: "emotion" },
        { q: "Ocean", t: "Word", o: ["Water", "Land", "Air", "Fire"], v: ["water", "land", "air", "fire"], c: "water" },
        { q: "Moon", t: "Word", o: ["Satellite", "Star", "Planet", "Asteroid"], v: ["satellite", "star", "planet", "asteroid"], c: "satellite" },
        { q: "10 - 2", t: "Math", o: ["8", "7", "9", "6"], v: ["8", "7", "9", "6"], c: "8" },
        { q: "Winter", t: "Word", o: ["Season", "Day", "Month", "Year"], v: ["season", "day", "month", "year"], c: "season" },
        { q: "Ice", t: "Word", o: ["Cold", "Hot", "Warm", "Dry"], v: ["cold", "hot", "warm", "dry"], c: "cold" },
        { q: "Fire", t: "Word", o: ["Hot", "Cold", "Wet", "Soft"], v: ["hot", "cold", "wet", "soft"], c: "hot" },
        { q: "Book", t: "Word", o: ["Read", "Eat", "Wear", "Drive"], v: ["read", "eat", "wear", "drive"], c: "read" },
        { q: "Pencil", t: "Word", o: ["Write", "Sleep", "Run", "Fly"], v: ["write", "sleep", "run", "fly"], c: "write" },
        { q: "Shoes", t: "Word", o: ["Feet", "Hands", "Head", "Legs"], v: ["feet", "hands", "head", "legs"], c: "feet" },
        { q: "Hat", t: "Word", o: ["Head", "Feet", "Arms", "Legs"], v: ["head", "feet", "arms", "legs"], c: "head" },
        { q: "Bird", t: "Word", o: ["Animal", "Plant", "Mineral", "Gas"], v: ["animal", "plant", "mineral", "gas"], c: "animal" },
        { q: "Plane", t: "Word", o: ["Fly", "Swim", "Crawl", "Hop"], v: ["fly", "swim", "crawl", "hop"], c: "fly" },
        { q: "Fish", t: "Word", o: ["Swim", "Fly", "Walk", "Run"], v: ["swim", "fly", "walk", "run"], c: "swim" },
        { q: "6 * 2", t: "Math", o: ["12", "10", "14", "16"], v: ["12", "10", "14", "16"], c: "12" },
        { q: "A", t: "Letter", o: ["Vowel", "Consonant", "Number", "Symbol"], v: ["vowel", "consonant", "number", "symbol"], c: "vowel" },
        { q: "B", t: "Letter", o: ["Consonant", "Vowel", "Number", "Symbol"], v: ["consonant", "vowel", "number", "symbol"], c: "consonant" },
        { q: "Triangle", t: "Word", o: ["Shape", "Color", "Taste", "Smell"], v: ["shape", "color", "taste", "smell"], c: "shape" },
        { q: "Green", t: "Word", o: ["Color", "Shape", "Size", "Texture"], v: ["color", "shape", "size", "texture"], c: "color" },
        { q: "Lion", t: "Word", o: ["Animal", "Plant", "Vehicle", "City"], v: ["animal", "plant", "vehicle", "city"], c: "animal" },
        { q: "Rose", t: "Word", o: ["Flower", "Tree", "Animal", "Rock"], v: ["flower", "tree", "animal", "rock"], c: "flower" },
        { q: "Oak", t: "Word", o: ["Tree", "Flower", "Animal", "Insect"], v: ["tree", "flower", "animal", "insect"], c: "tree" },
        { q: "Ant", t: "Word", o: ["Insect", "Bird", "Fish", "Mammal"], v: ["insect", "bird", "fish", "mammal"], c: "insect" },
        { q: "Python", t: "Word", o: ["Snake", "Bird", "Fish", "Dog"], v: ["snake", "bird", "fish", "dog"], c: "snake" },
        { q: "50 + 50", t: "Math", o: ["100", "90", "110", "120"], v: ["100", "90", "110", "120"], c: "100" },
        { q: "Computer", t: "Word", o: ["Machine", "Animal", "Plant", "Food"], v: ["machine", "animal", "plant", "food"], c: "machine" },
        { q: "Keyboard", t: "Word", o: ["Input", "Output", "Storage", "Processing"], v: ["input", "output", "storage", "processing"], c: "input" },
        { q: "Monitor", t: "Word", o: ["Screen", "Mouse", "Keyboard", "Printer"], v: ["screen", "mouse", "keyboard", "printer"], c: "screen" },
        { q: "Mouse", t: "Word", o: ["Input", "Output", "Screen", "Speaker"], v: ["input", "output", "screen", "speaker"], c: "input" },
        { q: "Coffee", t: "Word", o: ["Drink", "Food", "Vehicle", "Clothing"], v: ["drink", "food", "vehicle", "clothing"], c: "drink" },
        { q: "Pizza", t: "Word", o: ["Food", "Drink", "Toy", "Tool"], v: ["food", "drink", "toy", "tool"], c: "food" },
        { q: "Shirt", t: "Word", o: ["Clothing", "Furniture", "Tool", "Toy"], v: ["clothing", "furniture", "tool", "toy"], c: "clothing" },
        { q: "Pants", t: "Word", o: ["Clothing", "Food", "Drink", "Plant"], v: ["clothing", "food", "drink", "plant"], c: "clothing" },
        { q: "Soccer", t: "Word", o: ["Sport", "Food", "Color", "Shape"], v: ["sport", "food", "color", "shape"], c: "sport" },
        { q: "Tennis", t: "Word", o: ["Sport", "Subject", "City", "Country"], v: ["sport", "subject", "city", "country"], c: "sport" },
        { q: "Math", t: "Word", o: ["Subject", "Sport", "Food", "Color"], v: ["subject", "sport", "food", "color"], c: "subject" },
        { q: "Science", t: "Word", o: ["Subject", "Sport", "Clothing", "Furniture"], v: ["subject", "sport", "clothing", "furniture"], c: "subject" },
        { q: "London", t: "Word", o: ["City", "Country", "Continent", "Planet"], v: ["city", "country", "continent", "planet"], c: "city" },
        { q: "Paris", t: "Word", o: ["City", "Country", "River", "Mountain"], v: ["city", "country", "river", "mountain"], c: "city" },
        { q: "France", t: "Word", o: ["Country", "City", "Ocean", "Star"], v: ["country", "city", "ocean", "star"], c: "country" },
        { q: "Spain", t: "Word", o: ["Country", "City", "Animal", "Food"], v: ["country", "city", "animal", "food"], c: "country" },
        { q: "Earth", t: "Word", o: ["Planet", "Star", "Moon", "Comet"], v: ["planet", "star", "moon", "comet"], c: "planet" },
        { q: "Mars", t: "Word", o: ["Planet", "Country", "City", "Ocean"], v: ["planet", "country", "city", "ocean"], c: "planet" },
        { q: "Jupiter", t: "Word", o: ["Planet", "Star", "Moon", "Asteroid"], v: ["planet", "star", "moon", "asteroid"], c: "planet" },
        { q: "Gold", t: "Word", o: ["Metal", "Gas", "Liquid", "Plastic"], v: ["metal", "gas", "liquid", "plastic"], c: "metal" },
        { q: "Silver", t: "Word", o: ["Metal", "Wood", "Glass", "Rubber"], v: ["metal", "wood", "glass", "rubber"], c: "metal" },
        { q: "Iron", t: "Word", o: ["Metal", "Gas", "Liquid", "Paper"], v: ["metal", "gas", "liquid", "paper"], c: "metal" },
        { q: "Oxygen", t: "Word", o: ["Gas", "Metal", "Liquid", "Solid"], v: ["gas", "metal", "liquid", "solid"], c: "gas" },
        { q: "H2O", t: "Word", o: ["Water", "Salt", "Sugar", "Iron"], v: ["Water", "Salt", "Sugar", "Iron"], c: "Water" },
        { q: "Guitar", t: "Word", o: ["Instrument", "Tool", "Weapon", "Toy"], v: ["instrument", "tool", "weapon", "toy"], c: "instrument" },
        { q: "Piano", t: "Word", o: ["Instrument", "Vehicle", "Furniture", "Clothing"], v: ["instrument", "vehicle", "furniture", "clothing"], c: "instrument" },
        { q: "Violin", t: "Word", o: ["Instrument", "Sport", "Food", "Drink"], v: ["instrument", "sport", "food", "drink"], c: "instrument" },
        { q: "Drum", t: "Word", o: ["Instrument", "Animal", "Plant", "Color"], v: ["instrument", "animal", "plant", "color"], c: "instrument" },
        { q: "Chef", t: "Word", o: ["Job", "Sport", "Hobby", "Place"], v: ["job", "sport", "hobby", "place"], c: "job" },
        { q: "Doctor", t: "Word", o: ["Job", "Animal", "Plant", "Thing"], v: ["job", "animal", "plant", "thing"], c: "job" },
        { q: "Teacher", t: "Word", o: ["Job", "Vehicle", "Food", "Color"], v: ["job", "vehicle", "food", "color"], c: "job" },
        { q: "Driver", t: "Word", o: ["Job", "Plant", "Animal", "Mineral"], v: ["job", "plant", "animal", "mineral"], c: "job" },
        { q: "Rain", t: "Word", o: ["Weather", "Food", "Clothing", "Furniture"], v: ["weather", "food", "clothing", "furniture"], c: "weather" },
        { q: "Snow", t: "Word", o: ["Weather", "Sport", "Music", "Art"], v: ["weather", "sport", "music", "art"], c: "weather" },
        { q: "Wind", t: "Word", o: ["Weather", "Color", "Shape", "Size"], v: ["weather", "color", "shape", "size"], c: "weather" },
        { q: "Cloud", t: "Word", o: ["Weather", "Ground", "Ocean", "Space"], v: ["weather", "ground", "ocean", "space"], c: "weather" },
        { q: "North", t: "Word", o: ["Direction", "Color", "Shape", "Time"], v: ["direction", "color", "shape", "time"], c: "direction" },
        { q: "South", t: "Word", o: ["Direction", "Food", "Drink", "Toy"], v: ["direction", "food", "drink", "toy"], c: "direction" },
        { q: "East", t: "Word", o: ["Direction", "Animal", "Plant", "Person"], v: ["direction", "animal", "plant", "person"], c: "direction" },
        { q: "West", t: "Word", o: ["Direction", "Building", "Street", "City"], v: ["direction", "building", "street", "city"], c: "direction" },
        { q: "Monday", t: "Word", o: ["Day", "Month", "Year", "Season"], v: ["day", "month", "year", "season"], c: "day" },
        { q: "January", t: "Word", o: ["Month", "Day", "Year", "Week"], v: ["month", "day", "year", "week"], c: "month" },
        { q: "2024", t: "Number", o: ["Year", "Month", "Day", "Time"], v: ["year", "month", "day", "time"], c: "year" },
        { q: "Hour", t: "Word", o: ["Time", "Distance", "Speed", "Weight"], v: ["time", "distance", "speed", "weight"], c: "time" },
        { q: "Minute", t: "Word", o: ["Time", "Color", "Shape", "Sound"], v: ["time", "color", "shape", "sound"], c: "time" },
        { q: "Second", t: "Word", o: ["Time", "Place", "Person", "Thing"], v: ["time", "place", "person", "thing"], c: "time" },
        { q: "Meter", t: "Word", o: ["Distance", "Time", "Weight", "Volume"], v: ["distance", "time", "weight", "volume"], c: "distance" },
        { q: "Kilogram", t: "Word", o: ["Weight", "Distance", "Time", "Speed"], v: ["weight", "distance", "time", "speed"], c: "weight" },
        { q: "Liter", t: "Word", o: ["Volume", "Distance", "Time", "Weight"], v: ["volume", "distance", "time", "weight"], c: "volume" },
        // --- Smilies & Emotions ---
        { q: "😀", t: "Emotion", o: ["Happy", "Sad", "Angry", "Surprised"], v: ["happy", "sad", "angry", "surprised"], c: "happy" },
        { q: "😢", t: "Emotion", o: ["Sad", "Happy", "Angry", "Excited"], v: ["sad", "happy", "angry", "excited"], c: "sad" },
        { q: "😠", t: "Emotion", o: ["Angry", "Happy", "Sad", "Relaxed"], v: ["angry", "happy", "sad", "relaxed"], c: "angry" },
        { q: "😮", t: "Emotion", o: ["Surprised", "Sleepy", "Happy", "Bored"], v: ["surprised", "sleepy", "happy", "bored"], c: "surprised" },
        { q: "😴", t: "Emotion", o: ["Sleepy", "Energetic", "Angry", "Happy"], v: ["sleepy", "energetic", "angry", "happy"], c: "sleepy" },
        { q: "😎", t: "Emotion", o: ["Cool", "Sad", "Angry", "Scared"], v: ["cool", "sad", "angry", "scared"], c: "cool" },
        { q: "😭", t: "Emotion", o: ["Crying", "Laughing", "Smiling", "Sleeping"], v: ["crying", "laughing", "smiling", "sleeping"], c: "crying" },
        { q: "😂", t: "Emotion", o: ["Laughing", "Crying", "Angry", "Serious"], v: ["laughing", "crying", "angry", "serious"], c: "laughing" },
        { q: "🤢", t: "Emotion", o: ["Sick", "Healthy", "Happy", "Excited"], v: ["sick", "healthy", "happy", "excited"], c: "sick" },
        { q: "🤔", t: "Emotion", o: ["Thinking", "Sleeping", "Running", "Eating"], v: ["thinking", "sleeping", "running", "eating"], c: "thinking" },
        { q: "Happy", t: "Emotion", o: ["😀", "😢", "😠", "😐"], v: ["😀", "😢", "😠", "😐"], c: "😀" },
        { q: "Sad", t: "Emotion", o: ["😢", "😀", "😎", "🤩"], v: ["😢", "😀", "😎", "🤩"], c: "😢" },
        { q: "Angry", t: "Emotion", o: ["😠", "😴", "🤔", "😇"], v: ["😠", "😴", "🤔", "😇"], c: "😠" },
        { q: "Cool", t: "Emotion", o: ["😎", "🤢", "🤯", "🥶"], v: ["😎", "🤢", "🤯", "🥶"], c: "😎" },
        // --- Shapes ---
        { q: "🟥", t: "Shape", o: ["Square", "Circle", "Triangle", "Star"], v: ["square", "circle", "triangle", "star"], c: "square" },
        { q: "🔵", t: "Shape", o: ["Circle", "Square", "Triangle", "Diamond"], v: ["circle", "square", "triangle", "diamond"], c: "circle" },
        { q: "🔺", t: "Shape", o: ["Triangle", "Square", "Circle", "Star"], v: ["triangle", "square", "circle", "star"], c: "triangle" },
        { q: "⭐", t: "Shape", o: ["Star", "Heart", "Square", "Circle"], v: ["star", "heart", "square", "circle"], c: "star" },
        { q: "🔷", t: "Shape", o: ["Diamond", "Circle", "Star", "Heart"], v: ["diamond", "circle", "star", "heart"], c: "diamond" },
        { q: "❤️", t: "Shape", o: ["Heart", "Star", "Triangle", "Square"], v: ["heart", "star", "triangle", "square"], c: "heart" },
        { q: "🟩", t: "Color/Shape", o: ["Green Square", "Red Circle", "Blue Triangle", "Yellow Star"], v: ["green square", "red circle", "blue triangle", "yellow star"], c: "green square" },
        { q: "🟡", t: "Color/Shape", o: ["Yellow Circle", "Blue Square", "Red Triangle", "Green Star"], v: ["yellow circle", "blue square", "red triangle", "green star"], c: "yellow circle" },
        { q: "Square", t: "Shape", o: ["🟥", "🔵", "🔺", "⭐"], v: ["🟥", "🔵", "🔺", "⭐"], c: "🟥" },
        { q: "Circle", t: "Shape", o: ["🔵", "🟥", "🔺", "🔷"], v: ["🔵", "🟥", "🔺", "🔷"], c: "🔵" },
        { q: "Triangle", t: "Shape", o: ["🔺", "🟥", "🔵", "⭐"], v: ["🔺", "🟥", "🔵", "⭐"], c: "🔺" },
        { q: "Star", t: "Shape", o: ["⭐", "❤️", "🟥", "🔵"], v: ["⭐", "❤️", "🟥", "🔵"], c: "⭐" },
        { q: "Heart", t: "Shape", o: ["❤️", "⭐", "🔷", "🟥"], v: ["❤️", "⭐", "🔷", "🟥"], c: "❤️" }
    ];

    // Transform to component format
    return baseData.map((item, index) => ({
        id: index + 1,
        question: item.q,
        type: item.t,
        options: item.o.map((opt, i) => ({
            id: `o${index}_${i}`,
            text: opt,
            value: item.v[i]
        })),
        correctValue: item.c
    }));
};

const MOCK_DATA = generateMockData();

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
