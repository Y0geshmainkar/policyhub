/**
 * Reusable UI component library
 * All form elements and buttons use these — never create ad-hoc inputs/buttons.
 */
import React from 'react';
import styles from './UI.module.scss';

// ── FormField wrapper ─────────────────────────────────────────────────────

interface FieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}

export function FormField({ label, required, error, children }: FieldProps) {
  return (
    <div className={styles.field}>
      <label className={styles.label}>
        {label}
        {required && <span className={styles.required} aria-hidden>*</span>}
      </label>
      {children}
      {error && <span className={styles.errorMsg} role="alert">{error}</span>}
    </div>
  );
}

// ── Input ─────────────────────────────────────────────────────────────────

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  mono?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ error, mono, className, ...props }, ref) => (
    <input
      ref={ref}
      className={[
        styles.input,
        error ? styles.error : '',
        mono  ? styles.mono  : '',
        className ?? '',
      ].join(' ')}
      {...props}
    />
  )
);
Input.displayName = 'Input';

// ── Select ────────────────────────────────────────────────────────────────

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export function Select({ error, options, placeholder, className, ...props }: SelectProps) {
  return (
    <select
      className={[styles.select, error ? styles.error : '', className ?? ''].join(' ')}
      {...props}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(o => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

// ── Button ────────────────────────────────────────────────────────────────

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md';
  full?: boolean;
}

export function Button({
  variant = 'primary',
  size,
  full,
  className,
  children,
  ...props
}: ButtonProps) {
  const cls = [
    variant === 'primary'   ? styles.btnPrimary   : '',
    variant === 'secondary' ? styles.btnSecondary : '',
    variant === 'ghost'     ? styles.btnGhost     : '',
    size === 'sm' ? styles.btnSm : '',
    full ? styles.btnFull : '',
    className ?? '',
  ].join(' ');

  return (
    <button className={cls} {...props}>
      {children}
    </button>
  );
}


// ── Alert / Banner ────────────────────────────────────────────────────────
import alertStyles from './Alert.module.scss';

type AlertVariant = 'warning' | 'info' | 'error' | 'success';

const ALERT_ICONS: Record<AlertVariant, string> = {
  warning: '⚠',
  info:    'ℹ',
  error:   '✕',
  success: '✓',
};

interface AlertProps {
  variant?: AlertVariant;
  children: React.ReactNode;
}

export function Alert({ variant = 'warning', children }: AlertProps) {
  return (
    <div className={`${alertStyles.alert} ${alertStyles[variant]}`} role="alert">
      <span className={alertStyles.icon} aria-hidden>{ALERT_ICONS[variant]}</span>
      {children}
    </div>
  );
}
