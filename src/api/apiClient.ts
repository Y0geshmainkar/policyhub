import axios from 'axios';
import { store } from '../store';
import { setLoading } from '../store/uiSlice';

// Use local JSON when in dev OR when deployed to GitHub Pages (no real API)
const isGitHubPages = typeof window !== 'undefined' &&
  window.location.hostname.includes('github.io');
const USE_LOCAL = import.meta.env.DEV || isGitHubPages;

// In dev, axios calls resolve against /localJson/ (Vite serves public/)
// In prod, calls go to a real baseURL
export const apiClient = axios.create({
  baseURL: USE_LOCAL ? (import.meta.env.BASE_URL || '/') : '/api/',
  headers: { 'Content-Type': 'application/json' },
});

let pendingRequests = 0;

apiClient.interceptors.request.use(config => {
  if (!config.headers?.skipLoader) {
    pendingRequests++;
    store.dispatch(setLoading(true));
  }
  return config;
}, error => {
  pendingRequests = Math.max(0, pendingRequests - 1);
  if (pendingRequests === 0) store.dispatch(setLoading(false));
  return Promise.reject(error);
});

apiClient.interceptors.response.use(response => {
  pendingRequests = Math.max(0, pendingRequests - 1);
  if (pendingRequests === 0) store.dispatch(setLoading(false));
  return response;
}, error => {
  pendingRequests = Math.max(0, pendingRequests - 1);
  if (pendingRequests === 0) store.dispatch(setLoading(false));
  return Promise.reject(error);
});

// ── Payment API calls ──────────────────────────────────────────────────────

/** Fetch payment options for a policy */
export const fetchPolicyPaymentSearch = () =>
  apiClient.get('localJson/Payment/PolicyPaymentSearch.json');

/** Submit CC payment — mocked via setTimeout in dev */
export const schedulePaymentCC = (payload: unknown) => {
  if (USE_LOCAL) {
    return new Promise<{ data: unknown }>(resolve =>
      setTimeout(() => apiClient.get('localJson/Payment/SchedulePaymentCC.json').then(resolve), 800)
    );
  }
  return apiClient.post('Payment/ScheduleOneTimePaymentCC', payload);
};

/** Submit Bank Draft payment — mocked via setTimeout in dev */
export const schedulePaymentBank = (payload: unknown) => {
  if (USE_LOCAL) {
    return new Promise<{ data: unknown }>(resolve =>
      setTimeout(() => apiClient.get('localJson/Payment/SchedulePaymentBank.json').then(resolve), 800)
    );
  }
  return apiClient.post('Payment/ScheduleOneTimePaymentBank', payload);
};
