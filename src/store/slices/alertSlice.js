import { createSlice } from '@reduxjs/toolkit';

export const alertSlice = createSlice({
    name: 'alert',
    initialState: {
        message: null,
        success: null
    },
    reducers: {
        setMessage: (state, action) => {
            state.message = action.payload.message;
            state.success = action.payload.success;
        },
        clearMessage: (state) => {
            state.message = null;
            state.success = null;
        }
    }
});

export const { setMessage, clearMessage } = alertSlice.actions;

export default alertSlice.reducer;
