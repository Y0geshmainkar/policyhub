// All SVGs inline — no external image dependency

export const LogoIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
    <circle cx="14" cy="14" r="13" fill="#F58220" />
    <path d="M7 14c0-3.866 3.134-7 7-7s7 3.134 7 7-3.134 7-7 7" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"/>
    <circle cx="14" cy="14" r="3" fill="#fff" />
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
export const ShieldIcon = ({ color = '#F58220' }: { color?: string }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M10 2L3 5v5c0 4.418 3.134 7.635 7 8.5C16.866 17.635 20 14.418 20 10V5L10 2z"
      fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M7 10l2 2 4-4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const HeartIcon = ({ color = '#F58220' }: { color?: string }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M10 16s-7-4.5-7-9a4 4 0 018 0 4 4 0 018 0c0 4.5-7 9-7 9z"
      fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>
);

export const ChartIcon = ({ color = '#3B82F6' }: { color?: string }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <rect x="3" y="11" width="3" height="6" rx="1" fill={color} fillOpacity="0.8"/>
    <rect x="8.5" y="7" width="3" height="10" rx="1" fill={color} fillOpacity="0.8"/>
    <rect x="14" y="3" width="3" height="14" rx="1" fill={color} fillOpacity="0.8"/>
  </svg>
);

export const MedicalIcon = ({ color = '#22A86E' }: { color?: string }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <rect x="2" y="2" width="16" height="16" rx="4" fill={color} fillOpacity="0.12" stroke={color} strokeWidth="1.5"/>
    <path d="M10 6v8M6 10h8" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

export const HomeIcon = ({ color = '#EF4444' }: { color?: string }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M3 10L10 3l7 7" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 8.5V17h4v-4h2v4h4V8.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const BuildingIcon = ({ color = '#8B5CF6' }: { color?: string }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <rect x="3" y="4" width="14" height="13" rx="1" stroke={color} strokeWidth="1.5" fill={color} fillOpacity="0.1"/>
    <path d="M7 17V9h6v8" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <rect x="8.5" y="5.5" width="3" height="2" rx="0.5" fill={color}/>
  </svg>
);

export const DocIcon = ({ color = '#6B7280' }: { color?: string }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <rect x="4" y="2" width="12" height="16" rx="2" stroke={color} strokeWidth="1.5" fill={color} fillOpacity="0.1"/>
    <path d="M7 7h6M7 10h6M7 13h4" stroke={color} strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);

import type { Division } from '../../types/policy';

export const DIVISION_ICONS: Record<Division, JSX.Element> = {
  GL: <ShieldIcon color="#F58220" />,
  AI: <MedicalIcon color="#22A86E" />,
  UA: <ChartIcon color="#3B82F6" />,
  GN: <HeartIcon color="#F58220" />,
  NI: <BuildingIcon color="#8B5CF6" />,
  FH: <HomeIcon color="#EF4444" />,
  LN: <DocIcon color="#6B7280" />,
};
