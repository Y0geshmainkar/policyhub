import { configureStore } from '@reduxjs/toolkit';
import policiesReducer from './policiesSlice';
import uiReducer from './uiSlice';
import paymentReducer from './paymentSlice';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    policies: policiesReducer,
    ui: uiReducer,
    payment: paymentReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
