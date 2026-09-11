import { configureStore } from '@reduxjs/toolkit';
import participantReducer from './slices/participantSlice';
import spinnerReducer from './slices/loaderSlice';
import alertReducer from './slices/alertSlice';
import languageReducer from './slices/languageSlice';

export const store = configureStore({
    reducer: {
        participant: participantReducer,
        spinner: spinnerReducer,
        alert: alertReducer,
        language: languageReducer,
    },
});
