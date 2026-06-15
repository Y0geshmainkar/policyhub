// All SVGs inline — no external image dependency

export const CreditCardIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <rect x="2" y="5" width="16" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <path d="M2 8.5h16" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="4" y="11" width="4" height="1.5" rx="0.75" fill="currentColor"/>
  </svg>
);

export const BankIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M10 2.5L17 6H3L10 2.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" fill="none"/>
    <rect x="4" y="9" width="2" height="6" rx="0.5" fill="currentColor" opacity="0.8"/>
    <rect x="9" y="9" width="2" height="6" rx="0.5" fill="currentColor" opacity="0.8"/>
    <rect x="14" y="9" width="2" height="6" rx="0.5" fill="currentColor" opacity="0.8"/>
    <path d="M3 15.5h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const LogoIcon = () => (
  <svg width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden="true">
    <rect width="34" height="34" rx="9" fill="#F58220" />
    {/* P */}
    <path d="M9 10h5c2 0 3.5 1.5 3.5 3.5S16 17 14 17H9V10z" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round"/>
    <line x1="9" y1="17" x2="9" y2="24" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/>
    {/* H */}
    <line x1="20" y1="10" x2="20" y2="24" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/>
    <line x1="26" y1="10" x2="26" y2="24" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/>
    <line x1="20" y1="17" x2="26" y2="17" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

export const GreenCheck = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <circle cx="9" cy="9" r="9" fill="#22A86E" />
    <path d="M5 9l3 3 5-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const RedDot = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <circle cx="9" cy="9" r="9" fill="#EF4444" />
    <path d="M9 5v4M9 12v1" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

export const GreyDot = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <circle cx="9" cy="9" r="9" fill="#8391A1" />
    <path d="M6 9h6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

// Division icons
// Single neutral icon for all division tabs — monochrome, no per-division color
export const DivisionIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <rect x="2" y="2" width="14" height="14" rx="3" stroke="currentColor" strokeWidth="1.4" fill="none"/>
    <path d="M5 9h8M5 6h5M5 12h6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);

import type { Division } from '../../types/policy';

export const DIVISION_ICONS: Record<Division, JSX.Element> = {
  GL: <DivisionIcon />,
  AI: <DivisionIcon />,
  UA: <DivisionIcon />,
  GN: <DivisionIcon />,
  NI: <DivisionIcon />,
  FH: <DivisionIcon />,
  LN: <DivisionIcon />,
};
