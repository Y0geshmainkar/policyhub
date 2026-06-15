import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import policiesReducer from '../store/policiesSlice';
import uiReducer from '../store/uiSlice';
import paymentReducer from '../store/paymentSlice';

export function renderWithProviders(ui: React.ReactElement, route = '/') {
  const store = configureStore({
    reducer: { policies: policiesReducer, ui: uiReducer, payment: paymentReducer },
  });
  return {
    ...render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>
          {ui}
        </MemoryRouter>
      </Provider>
    ),
    store,
  };
}
