import { Division, DIVISION_NAMES, Policy, PolicyStatus, SourceSystem } from '../types/policy';

// ── Raw shapes (one per source system, intentionally different field names) ──

export interface CfoRaw {
  policyId: string;
  divisionCode: Division;
  policyType: string;
  policyStatus: string;
  monthlyPremium: number;
  nextDueDate: string;
  autoPayEnabled: boolean;
  insuredFullName?: string;
}

export interface OipaRaw {
  polNum: string;
  div: Division;
  prodDesc: string;
  statCd: string;
  premAmt: number;
  dueDt: string;
  autopayFlg: 'Y' | 'N';
  insuredName?: string;
}

export interface OpaLnlRaw {
  policy_number: string;
  division_id: Division;
  product_name: string;
  status_code: string;
  premium_amount: number;
  next_payment_date: string;
  auto_pay: boolean;
  insured_name?: string;
}

export interface LnlRaw {
  id: string;
  div: Division;
  desc: string;
  stat: string;
  amount: number;
  due: string;
  ap: 0 | 1;
  insuredName?: string;
}

// ── Status normalization helpers ──

const cfoStatus = (s: string): PolicyStatus =>
  s === 'ACTIVE' ? 'active' : s === 'DUE' ? 'due' : 'lapsed';

const oipaStatus = (s: string): PolicyStatus =>
  s === '01' ? 'active' : s === '02' ? 'due' : 'lapsed';

const opaStatus = (s: string): PolicyStatus =>
  s === 'ACT' ? 'active' : s === 'DUE' ? 'due' : 'lapsed';

const lnlStatus = (s: string): PolicyStatus =>
  s === 'A' ? 'active' : s === 'D' ? 'due' : 'lapsed';

// ── Adapter functions ──

export const normalizeCfo = (raw: CfoRaw): Policy => ({
  id: raw.policyId,
  division: raw.divisionCode,
  divisionName: DIVISION_NAMES[raw.divisionCode],
  type: raw.policyType,
  status: cfoStatus(raw.policyStatus),
  premium: raw.monthlyPremium,
  dueDate: raw.nextDueDate,
  autoPay: raw.autoPayEnabled,
  sourceSystem: 'CFO',
  insuredName: raw.insuredFullName ?? '',
});

export const normalizeOipa = (raw: OipaRaw): Policy => ({
  id: raw.polNum,
  division: raw.div,
  divisionName: DIVISION_NAMES[raw.div],
  type: raw.prodDesc,
  status: oipaStatus(raw.statCd),
  premium: raw.premAmt,
  dueDate: raw.dueDt,
  autoPay: raw.autopayFlg === 'Y',
  sourceSystem: 'OIPA',
  insuredName: raw.insuredName ?? '',
});

export const normalizeOpaLnl = (raw: OpaLnlRaw): Policy => ({
  id: raw.policy_number,
  division: raw.division_id,
  divisionName: DIVISION_NAMES[raw.division_id],
  type: raw.product_name,
  status: opaStatus(raw.status_code),
  premium: raw.premium_amount,
  dueDate: raw.next_payment_date,
  autoPay: raw.auto_pay,
  sourceSystem: 'OPA-LNL',
  insuredName: raw.insured_name ?? '',
});

export const normalizeLnl = (raw: LnlRaw): Policy => ({
  id: raw.id,
  division: raw.div,
  divisionName: DIVISION_NAMES[raw.div],
  type: raw.desc,
  status: lnlStatus(raw.stat),
  premium: raw.amount,
  dueDate: raw.due,
  autoPay: raw.ap === 1,
  sourceSystem: 'LNL',
  insuredName: raw.insuredName ?? '',
});

// ── Generic dispatcher ──
export type RawPolicy = CfoRaw | OipaRaw | OpaLnlRaw | LnlRaw;

export function normalizePolicy(raw: RawPolicy, source: SourceSystem): Policy {
  switch (source) {
    case 'CFO':     return normalizeCfo(raw as CfoRaw);
    case 'OIPA':    return normalizeOipa(raw as OipaRaw);
    case 'OPA-LNL': return normalizeOpaLnl(raw as OpaLnlRaw);
    case 'LNL':     return normalizeLnl(raw as LnlRaw);
  }
}

// ── Real API response shape (policy reference register) ──

export interface ApiPolicyRaw {
  policyNo: string;
  registeredCompanyCode: string;
  companyCode: string;
  planName: string;
  policyStatusDescription: string;
  totalMonthlyPremium: number | null;
  totalAnnualPremium: number | null;
  paidToDate: string;
  autoPay: boolean;
  systemCode: string;
  // insured extracted from clients array — caller passes the resolved name
  insuredName?: string;
}

const apiStatus = (s: string): PolicyStatus => {
  const lower = (s ?? '').toLowerCase().trim();
  if (lower.startsWith('active') || lower === 'a') return 'active';
  if (lower.includes('due') || lower.includes('inactive')) return 'due';
  return 'lapsed';
};

const apiSourceSystem = (systemCode: string): SourceSystem => {
  if (systemCode === 'CFO' || systemCode === 'CFU') return 'CFO';
  if (systemCode === 'OPA-LNL') return 'OPA-LNL';
  if (systemCode === 'LNL') return 'LNL';
  return 'OIPA';
};

const apiDivision = (code: string): Division => {
  const valid: Division[] = ['GL', 'AI', 'UA', 'GN', 'NI', 'FH', 'LN'];
  return valid.includes(code as Division) ? (code as Division) : 'GL';
};

export const normalizeApiPolicy = (raw: ApiPolicyRaw): Policy => {
  const division = apiDivision(raw.registeredCompanyCode);
  return {
    id: raw.policyNo,
    division,
    divisionName: DIVISION_NAMES[division],
    type: raw.planName,
    status: apiStatus(raw.policyStatusDescription),
    premium: raw.totalMonthlyPremium ?? (raw.totalAnnualPremium ? raw.totalAnnualPremium / 12 : 0),
    dueDate: raw.paidToDate,
    autoPay: raw.autoPay,
    sourceSystem: apiSourceSystem(raw.systemCode),
    insuredName: raw.insuredName ?? '',
  };
};
