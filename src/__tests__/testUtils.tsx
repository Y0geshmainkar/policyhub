import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import policiesReducer from '../store/policiesSlice';
import uiReducer from '../store/uiSlice';
import paymentReducer from '../store/paymentSlice';
import authReducer from '../store/authSlice';

export function renderWithProviders(ui: React.ReactElement, route = '/') {
  const store = configureStore({
    reducer: { policies: policiesReducer, ui: uiReducer, payment: paymentReducer, auth: authReducer },
  });
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
  return {
    ...render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter initialEntries={[route]}>
            {ui}
          </MemoryRouter>
        </QueryClientProvider>
      </Provider>
    ),
    store,
  };
}
