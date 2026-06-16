import { screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import reducer, {
  nextStep, prevStep, updateForm, submitRegister, resetRegister,
} from '../store/authSlice';
import { Register } from '../pages/Register/Register';
import { renderWithProviders } from './testUtils';

// ── authSlice unit tests ──────────────────────────────────────────────────

const blank = { email: '', password: '', confirmPassword: '', firstName: '', lastName: '', phone: '', dob: '' };
const initial = { step: 1 as const, form: blank, submitted: false };

describe('authSlice', () => {
  test('nextStep increments step', () => {
    expect(reducer(initial, nextStep()).step).toBe(2);
  });

  test('nextStep does not exceed 3', () => {
    const s3 = { ...initial, step: 3 as const };
    expect(reducer(s3, nextStep()).step).toBe(3);
  });

  test('prevStep decrements step', () => {
    const s2 = { ...initial, step: 2 as const };
    expect(reducer(s2, prevStep()).step).toBe(1);
  });

  test('prevStep does not go below 1', () => {
    expect(reducer(initial, prevStep()).step).toBe(1);
  });

  test('updateForm merges partial fields', () => {
    const s = reducer(initial, updateForm({ email: 'a@b.com' }));
    expect(s.form.email).toBe('a@b.com');
    expect(s.form.password).toBe('');
  });

  test('submitRegister sets submitted true', () => {
    expect(reducer(initial, submitRegister()).submitted).toBe(true);
  });

  test('resetRegister returns to initial state', () => {
    const dirty = { step: 3 as const, form: { ...blank, email: 'x@y.com' }, submitted: true };
    const s = reducer(dirty, resetRegister());
    expect(s.step).toBe(1);
    expect(s.form.email).toBe('');
    expect(s.submitted).toBe(false);
  });
});

// ── Register component tests ──────────────────────────────────────────────

// Mock apiClient so no real HTTP calls
jest.mock('../api/apiClient', () => ({
  registerUser: () => Promise.resolve({ data: { success: true } }),
}));

describe('Register component', () => {
  it('renders step 1 by default', () => {
    renderWithProviders(<Register />);
    expect(screen.getByText('Create your account')).toBeInTheDocument();
  });

  it('shows email validation error on empty submit', async () => {
    renderWithProviders(<Register />);
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    await waitFor(() => expect(screen.getAllByText('Required').length).toBeGreaterThanOrEqual(1));
  });

  it('shows invalid email error', async () => {
    renderWithProviders(<Register />);
    await userEvent.type(screen.getByPlaceholderText('you@example.com'), 'notanemail');
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    await waitFor(() => expect(screen.getByText('Invalid email address')).toBeInTheDocument());
  });

  it('shows password too short error', async () => {
    renderWithProviders(<Register />);
    await userEvent.type(screen.getByPlaceholderText('you@example.com'), 'a@b.com');
    await userEvent.type(screen.getByPlaceholderText('Min. 8 characters'), 'abc');
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    await waitFor(() => expect(screen.getByText(/at least 8 characters/)).toBeInTheDocument());
  });

  it('shows password mismatch error', async () => {
    renderWithProviders(<Register />);
    await userEvent.type(screen.getByPlaceholderText('you@example.com'), 'a@b.com');
    await userEvent.type(screen.getByPlaceholderText('Min. 8 characters'), 'Password1');
    await userEvent.type(screen.getByPlaceholderText('Repeat password'), 'Different1');
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    await waitFor(() => expect(screen.getByText('Passwords do not match')).toBeInTheDocument());
  });

  it('advances to step 2 with valid step 1 data', async () => {
    renderWithProviders(<Register />);
    await userEvent.type(screen.getByPlaceholderText('you@example.com'), 'a@b.com');
    await userEvent.type(screen.getByPlaceholderText('Min. 8 characters'), 'Password1');
    await userEvent.type(screen.getByPlaceholderText('Repeat password'), 'Password1');
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    await waitFor(() => expect(screen.getByText('Personal information')).toBeInTheDocument());
  });

  it('shows phone validation error on step 2', async () => {
    renderWithProviders(<Register />);
    // fill step 1 and advance
    await userEvent.type(screen.getByPlaceholderText('you@example.com'), 'a@b.com');
    await userEvent.type(screen.getByPlaceholderText('Min. 8 characters'), 'Password1');
    await userEvent.type(screen.getByPlaceholderText('Repeat password'), 'Password1');
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    await waitFor(() => screen.getByText('Personal information'));
    // fill step 2 with bad phone
    await userEvent.type(screen.getByPlaceholderText('Jane'), 'Jane');
    await userEvent.type(screen.getByPlaceholderText('Smith'), 'Smith');
    await userEvent.type(screen.getByPlaceholderText('(555) 000-0000'), '123');
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    await waitFor(() => expect(screen.getByText(/valid 10-digit/)).toBeInTheDocument());
  });

  it('renders Back button on step 2', async () => {
    renderWithProviders(<Register />);
    await userEvent.type(screen.getByPlaceholderText('you@example.com'), 'a@b.com');
    await userEvent.type(screen.getByPlaceholderText('Min. 8 characters'), 'Password1');
    await userEvent.type(screen.getByPlaceholderText('Repeat password'), 'Password1');
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    await waitFor(() => expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument());
  });
});
