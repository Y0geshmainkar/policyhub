import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  isLoading: boolean;
  loadingMessage: string;
}

const initialState: UiState = {
  isLoading: false,
  loadingMessage: '',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setLoadingMessage(state, action: PayloadAction<string>) {
      state.loadingMessage = action.payload;
    },
  },
});

export const { setLoading, setLoadingMessage } = uiSlice.actions;
export default uiSlice.reducer;
