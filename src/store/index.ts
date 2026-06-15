import { configureStore } from '@reduxjs/toolkit';
import policiesReducer from './policiesSlice';

export const store = configureStore({
  reducer: {
    policies: policiesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
