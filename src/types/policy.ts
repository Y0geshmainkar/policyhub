export type Division = 'GL' | 'AI' | 'UA' | 'GN' | 'NI' | 'FH' | 'LN';
export type PolicyStatus = 'active' | 'due' | 'lapsed';
export type SourceSystem = 'CFO' | 'OIPA' | 'OPA-LNL' | 'LNL';

export interface Policy {
  id: string;
  division: Division;
  divisionName: string;
  type: string;
  status: PolicyStatus;
  premium: number;
  dueDate: string;
  autoPay: boolean;
  sourceSystem: SourceSystem;
  insuredName: string;
}

export const DIVISION_NAMES: Record<Division, string> = {
  GL: 'Group Life',
  AI: 'Accident & Income',
  UA: 'Universal Annuity',
  GN: 'General Life',
  NI: 'National Indemnity',
  FH: 'Family Heritage',
  LN: 'Legacy Notes',
};

export const DIVISIONS: Division[] = ['GL', 'AI', 'UA', 'GN', 'NI', 'FH', 'LN'];
