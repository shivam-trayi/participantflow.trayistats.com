import { createSlice } from '@reduxjs/toolkit';
import { getTranslations } from '../../locales/index';

const languageSlice = createSlice({
  name: 'language',
  initialState: {
    currentLanguage: 'en-US',
    translations: getTranslations('en-US')
  },
  reducers: {
    setLanguage: (state, action) => {
      const code = action.payload;
      state.currentLanguage = code;
      state.translations = getTranslations(code);
    }
  }
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
