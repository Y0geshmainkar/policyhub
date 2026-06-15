import { configureStore } from '@reduxjs/toolkit';
import policiesReducer from './policiesSlice';
import uiReducer from './uiSlice';
import paymentReducer from './paymentSlice';

export const store = configureStore({
  reducer: {
    policies: policiesReducer,
    ui: uiReducer,
    payment: paymentReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
