import { createSlice } from '@reduxjs/toolkit';

export const loaderSlice = createSlice({
    name: 'spinner',
    initialState: {
        loading: true
    },
    reducers: {
        startSpinner: (state) => {
            state.loading = true;
        },
        endSpinner: (state) => {
            state.loading = false;
        }
    }
});

export const { startSpinner, endSpinner } = loaderSlice.actions;

export default loaderSlice.reducer;
