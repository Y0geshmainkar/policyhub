import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { nextStep, prevStep, updateForm, submitRegister, resetRegister } from '../../store/authSlice';
import { FormField, Input, Button, Alert } from '../../components/UI';
import { registerUser } from '../../api/apiClient';
import styles from './Register.module.scss';

const STEPS = ['Account', 'Personal', 'Confirm'];

// ── Validators ────────────────────────────────────────────────────────────
function validateStep1(form: { email: string; password: string; confirmPassword: string }) {
  const errs: Record<string, string> = {};
  if (!form.email) errs.email = 'Required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email address';

  if (!form.password) errs.password = 'Required';
  else if (form.password.length < 8) errs.password = 'Must be at least 8 characters';
  else if (!/[A-Z]/.test(form.password)) errs.password = 'Must contain an uppercase letter';
  else if (!/[0-9]/.test(form.password)) errs.password = 'Must contain a number';

  if (!form.confirmPassword) errs.confirmPassword = 'Required';
  else if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';

  return errs;
}

function validateStep2(form: { firstName: string; lastName: string; phone: string; dob: string }) {
  const errs: Record<string, string> = {};
  if (!form.firstName.trim()) errs.firstName = 'Required';
  if (!form.lastName.trim()) errs.lastName = 'Required';

  if (!form.phone) errs.phone = 'Required';
  else if (!/^\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{4}$/.test(form.phone.replace(/\s/g, '')))
    errs.phone = 'Enter a valid 10-digit phone number';

  if (!form.dob) errs.dob = 'Required';
  else {
    const age = (Date.now() - new Date(form.dob).getTime()) / (1000 * 60 * 60 * 24 * 365.25);
    if (age < 18) errs.dob = 'Must be at least 18 years old';
  }

  return errs;
}

// ── Password strength indicator ───────────────────────────────────────────
function passwordStrength(pw: string): { level: 0 | 1 | 2 | 3; label: string } {
  if (!pw) return { level: 0, label: '' };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw) && /[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const labels = ['', 'Weak', 'Fair', 'Strong'];
  return { level: score as 0 | 1 | 2 | 3, label: labels[score] };
}

export function Register() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { step, form, submitted } = useAppSelector(s => s.auth);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const mutation = useMutation({
    mutationFn: () => registerUser(form),
    onSuccess: () => dispatch(submitRegister()),
  });

  function handleStep1(e: FormEvent) {
    e.preventDefault();
    const errs = validateStep1(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    dispatch(nextStep());
  }

  function handleStep2(e: FormEvent) {
    e.preventDefault();
    const errs = validateStep2(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    dispatch(nextStep());
  }

  function handleBack() {
    setErrors({});
    dispatch(prevStep());
  }

  const strength = passwordStrength(form.password);

  if (submitted) {
    return (
      <div className={styles.page}>
        <div className={styles.card}>
          <div className={styles.successIcon}>✓</div>
          <h1 className={styles.stepTitle}>Account Created</h1>
          <p className={styles.hint}>Welcome, {form.firstName}! Your PolicyHub account is ready.</p>
          <Button full onClick={() => { dispatch(resetRegister()); navigate('/'); }}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>

        {/* Stepper */}
        <nav className={styles.stepper} aria-label="Registration steps">
          {STEPS.map((label, i) => {
            const n = i + 1;
            const s = n < step ? 'done' : n === step ? 'active' : 'pending';
            return (
              <div key={label} className={`${styles.stepItem} ${styles[s]}`}>
                <div className={styles.stepCircle} aria-hidden>{n < step ? '✓' : n}</div>
                <span className={styles.stepLabel}>{label}</span>
                {i < STEPS.length - 1 && <div className={styles.stepLine} aria-hidden />}
              </div>
            );
          })}
        </nav>

        {/* Step 1 — Account */}
        {step === 1 && (
          <form onSubmit={handleStep1} noValidate>
            <h2 className={styles.stepTitle}>Create your account</h2>
            <div className={styles.fields}>
              <FormField label="Email" required error={errors.email}>
                <Input type="email" autoComplete="email" placeholder="you@example.com"
                  error={!!errors.email}
                  value={form.email}
                  onChange={e => dispatch(updateForm({ email: e.target.value }))} />
              </FormField>

              <FormField label="Password" required error={errors.password}>
                <Input type="password" autoComplete="new-password" placeholder="Min. 8 characters"
                  error={!!errors.password}
                  value={form.password}
                  onChange={e => dispatch(updateForm({ password: e.target.value }))} />
                {form.password && (
                  <div className={styles.strengthBar}>
                    <div className={`${styles.strengthFill} ${styles[`strength${strength.level}`]}`} />
                    <span className={styles.strengthLabel}>{strength.label}</span>
                  </div>
                )}
              </FormField>

              <FormField label="Confirm Password" required error={errors.confirmPassword}>
                <Input type="password" autoComplete="new-password" placeholder="Repeat password"
                  error={!!errors.confirmPassword}
                  value={form.confirmPassword}
                  onChange={e => dispatch(updateForm({ confirmPassword: e.target.value }))} />
              </FormField>
            </div>
            <div className={styles.actions}>
              <Button type="submit" full>Next →</Button>
            </div>
            <p className={styles.hint}>Already have an account? <a href="/">Sign in</a></p>
          </form>
        )}

        {/* Step 2 — Personal */}
        {step === 2 && (
          <form onSubmit={handleStep2} noValidate>
            <h2 className={styles.stepTitle}>Personal information</h2>
            <div className={styles.fields}>
              <div className={styles.row}>
                <FormField label="First Name" required error={errors.firstName}>
                  <Input type="text" placeholder="Jane" error={!!errors.firstName}
                    value={form.firstName}
                    onChange={e => dispatch(updateForm({ firstName: e.target.value }))} />
                </FormField>
                <FormField label="Last Name" required error={errors.lastName}>
                  <Input type="text" placeholder="Smith" error={!!errors.lastName}
                    value={form.lastName}
                    onChange={e => dispatch(updateForm({ lastName: e.target.value }))} />
                </FormField>
              </div>
              <FormField label="Phone" required error={errors.phone}>
                <Input type="tel" placeholder="(555) 000-0000" error={!!errors.phone}
                  value={form.phone}
                  onChange={e => dispatch(updateForm({ phone: e.target.value }))} />
              </FormField>
              <FormField label="Date of Birth" required error={errors.dob}>
                <Input type="date" error={!!errors.dob}
                  value={form.dob}
                  onChange={e => dispatch(updateForm({ dob: e.target.value }))} />
              </FormField>
            </div>
            <div className={styles.actions}>
              <Button variant="secondary" type="button" onClick={handleBack}>← Back</Button>
              <Button type="submit">Next →</Button>
            </div>
          </form>
        )}

        {/* Step 3 — Confirm */}
        {step === 3 && (
          <form onSubmit={e => { e.preventDefault(); mutation.mutate(); }} noValidate>
            <h2 className={styles.stepTitle}>Review & confirm</h2>
            <dl className={styles.summary}>
              <dt>Email</dt><dd>{form.email}</dd>
              <dt>Name</dt><dd>{form.firstName} {form.lastName}</dd>
              <dt>Phone</dt><dd>{form.phone}</dd>
              <dt>Date of Birth</dt><dd>{form.dob}</dd>
            </dl>
            {mutation.isError && (
              <Alert variant="error">Registration failed. Please try again.</Alert>
            )}
            <div className={styles.actions}>
              <Button variant="secondary" type="button" onClick={handleBack}>← Back</Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? 'Creating…' : 'Create Account'}
              </Button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
