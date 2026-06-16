import axios from 'axios';

// Use local JSON when in dev OR when deployed to GitHub Pages (no real API)
const isGitHubPages = typeof window !== 'undefined' &&
  window.location.hostname.includes('github.io');
export const USE_LOCAL = import.meta.env.DEV || isGitHubPages;

export const apiClient = axios.create({
  baseURL: USE_LOCAL ? (import.meta.env.BASE_URL || '/') : '/api/',
  headers: { 'Content-Type': 'application/json' },
});

// ── Payment API calls ──────────────────────────────────────────────────────

export const schedulePaymentCC = (payload: unknown) => {
  if (USE_LOCAL) {
    return new Promise<{ data: unknown }>(resolve =>
      setTimeout(() => apiClient.get('localJson/Payment/SchedulePaymentCC.json').then(resolve), 800)
    );
  }
  return apiClient.post('Payment/ScheduleOneTimePaymentCC', payload);
};

export const schedulePaymentBank = (payload: unknown) => {
  if (USE_LOCAL) {
    return new Promise<{ data: unknown }>(resolve =>
      setTimeout(() => apiClient.get('localJson/Payment/SchedulePaymentBank.json').then(resolve), 800)
    );
  }
  return apiClient.post('Payment/ScheduleOneTimePaymentBank', payload);
};

// ── Auth API calls ─────────────────────────────────────────────────────────

export const registerUser = (payload: unknown) => {
  if (USE_LOCAL) {
    return new Promise<{ data: unknown }>(resolve =>
      setTimeout(() => apiClient.get('localJson/Auth/Register.json').then(resolve), 800)
    );
  }
  return apiClient.post('Auth/Register', payload);
};
