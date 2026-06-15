import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// isLoading removed — TanStack Query's useIsFetching/isPending handles server state loading
// uiSlice now owns only pure UI state
interface UiState {
  loadingMessage: string;
}

const initialState: UiState = {
  loadingMessage: '',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoadingMessage(state, action: PayloadAction<string>) {
      state.loadingMessage = action.payload;
    },
  },
});

export const { setLoadingMessage } = uiSlice.actions;
export default uiSlice.reducer;
