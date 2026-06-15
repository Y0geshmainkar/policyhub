import { normalizeApiPolicy, ApiPolicyRaw } from './normalizers';

const apiRecords: ApiPolicyRaw[] = [
  // UA — Medicare Supplement
  { policyNo: '008178083', registeredCompanyCode: 'UA', companyCode: 'UA', planName: 'Medicare Supplement', policyStatusDescription: 'Cancellation', totalMonthlyPremium: 35.0, totalAnnualPremium: 411.0, paidToDate: '2018-12-01T00:00:00', autoPay: false, systemCode: 'NON-CFU', insuredName: 'GARCIA, JAMES E' },
  { policyNo: '008157827', registeredCompanyCode: 'UA', companyCode: 'UA', planName: 'Medicare Supplement', policyStatusDescription: 'Cancellation', totalMonthlyPremium: 50.0, totalAnnualPremium: 594.0, paidToDate: '2019-01-01T00:00:00', autoPay: false, systemCode: 'NON-CFU', insuredName: 'GIESER, WILLIAM J' },
  { policyNo: '008094375', registeredCompanyCode: 'UA', companyCode: 'UA', planName: 'Medicare Supplement', policyStatusDescription: 'Lapsed', totalMonthlyPremium: 417.0, totalAnnualPremium: 5001.0, paidToDate: '2022-11-15T00:00:00', autoPay: false, systemCode: 'NON-CFU', insuredName: 'WAITE, JANET C' },

  // GL — Group Life (CFO)
  { policyNo: '00A327584', registeredCompanyCode: 'GL', companyCode: 'GL', planName: 'Group Term To 100', policyStatusDescription: 'Active - Premium Paying', totalMonthlyPremium: 24.0, totalAnnualPremium: 270.0, paidToDate: '2026-07-16T00:00:00', autoPay: true, systemCode: 'CFO', insuredName: 'NOVOKUS, ISABELLE' },
  { policyNo: '0014P1435', registeredCompanyCode: 'GL', companyCode: 'GL', planName: '20 Yr Term Ride', policyStatusDescription: 'Inactive-Payment Due', totalMonthlyPremium: 12.49, totalAnnualPremium: 138.79, paidToDate: '2026-05-07T00:00:00', autoPay: true, systemCode: 'CFO', insuredName: 'COLEMAN, AMYA L' },
  { policyNo: '0017H1972', registeredCompanyCode: 'GL', companyCode: 'GL', planName: '20 Yr Term Rider - No Cash Values', policyStatusDescription: 'Inactive-Payment Due', totalMonthlyPremium: 16.22, totalAnnualPremium: 180.22, paidToDate: '2026-03-18T00:00:00', autoPay: false, systemCode: 'CFO', insuredName: 'HANSEN, ANTHONY' },
  { policyNo: '00E547437', registeredCompanyCode: 'GL', companyCode: 'GL', planName: 'Modified Premium Whole Life', policyStatusDescription: 'Inactive-Payment Due', totalMonthlyPremium: 6.75, totalAnnualPremium: 75.0, paidToDate: '2026-03-18T00:00:00', autoPay: false, systemCode: 'CFO', insuredName: 'HAWKINS, SEANTRESE V' },
  { policyNo: '00D457174', registeredCompanyCode: 'GL', companyCode: 'GL', planName: 'Modified Premium 20 Year Renewable Term With CV', policyStatusDescription: 'Inactive-Payment Due', totalMonthlyPremium: 14.0, totalAnnualPremium: 156.0, paidToDate: '2026-04-12T00:00:00', autoPay: false, systemCode: 'CFO', insuredName: 'AKIN, JOY' },
  { policyNo: '006708560', registeredCompanyCode: 'GL', companyCode: 'GL', planName: 'Term Rider', policyStatusDescription: 'Inactive-Payment Due', totalMonthlyPremium: 13.95, totalAnnualPremium: 155.0, paidToDate: '2026-04-12T00:00:00', autoPay: false, systemCode: 'CFO', insuredName: 'GANHS, JULIE E' },
  { policyNo: '0029B3877', registeredCompanyCode: 'GL', companyCode: 'GL', planName: 'Individual Juvenile Whole Life', policyStatusDescription: 'Inactive-Payment Due', totalMonthlyPremium: 11.82, totalAnnualPremium: 131.31, paidToDate: '2026-04-30T00:00:00', autoPay: false, systemCode: 'CFO', insuredName: 'MANKA, NATALIE S' },
  { policyNo: '0017C2128', registeredCompanyCode: 'GL', companyCode: 'GL', planName: '20 Yr Term Rider - No Cash Values', policyStatusDescription: 'Active - Premium Paying', totalMonthlyPremium: 5.59, totalAnnualPremium: 62.11, paidToDate: '2026-11-01T00:00:00', autoPay: false, systemCode: 'CFO', insuredName: 'HOLDEN, MICHAEL V' },
  { policyNo: '0052G5673', registeredCompanyCode: 'GL', companyCode: 'GL', planName: 'Individual Step Rate Term to 80', policyStatusDescription: 'Inactive-Payment Due', totalMonthlyPremium: 13.42, totalAnnualPremium: 151.51, paidToDate: '2026-03-10T00:00:00', autoPay: false, systemCode: 'CFO', insuredName: 'GORDON, TALISHIA' },
  { policyNo: '0052J1461', registeredCompanyCode: 'GL', companyCode: 'GL', planName: 'Indiv Juvenile Whole Life (ETI is NFO)', policyStatusDescription: 'Inactive-Payment Due', totalMonthlyPremium: 7.68, totalAnnualPremium: 85.32, paidToDate: '2026-03-12T00:00:00', autoPay: false, systemCode: 'CFO', insuredName: 'LUNNEY, MILES F' },
  { policyNo: '000309996', registeredCompanyCode: 'GL', companyCode: 'GL', planName: 'Modified Premium Whole Life', policyStatusDescription: 'Active - Premium Paying', totalMonthlyPremium: 6.3, totalAnnualPremium: 70.0, paidToDate: '2026-05-21T00:00:00', autoPay: false, systemCode: 'CFO', insuredName: 'DUCKWORTH, RALPH G' },
  { policyNo: '000310597', registeredCompanyCode: 'GL', companyCode: 'GL', planName: 'Modified Premium Whole Life', policyStatusDescription: 'Active - Premium Paying', totalMonthlyPremium: 6.3, totalAnnualPremium: 70.0, paidToDate: '2026-08-28T00:00:00', autoPay: false, systemCode: 'CFO', insuredName: 'CHERRY, THOMAS A' },
  { policyNo: '000310816', registeredCompanyCode: 'GL', companyCode: 'GL', planName: 'Modified Premium Whole Life', policyStatusDescription: 'Active - Premium Paying', totalMonthlyPremium: 3.15, totalAnnualPremium: 35.0, paidToDate: '2026-05-28T00:00:00', autoPay: false, systemCode: 'CFO', insuredName: 'DURHAM, JOYCE A' },
  { policyNo: '000312276', registeredCompanyCode: 'GL', companyCode: 'GL', planName: 'Modified Premium Whole Life', policyStatusDescription: 'Active - Premium Paying', totalMonthlyPremium: 3.15, totalAnnualPremium: 35.0, paidToDate: '2026-06-07T00:00:00', autoPay: false, systemCode: 'CFO', insuredName: 'HUTTO, DEBORAH M' },
  { policyNo: '000312817', registeredCompanyCode: 'GL', companyCode: 'GL', planName: 'Modified Premium Whole Life', policyStatusDescription: 'Active - Premium Paying', totalMonthlyPremium: 6.3, totalAnnualPremium: 70.0, paidToDate: '2026-07-28T00:00:00', autoPay: false, systemCode: 'CFO', insuredName: 'KUNTZ, RONALD L' },
  { policyNo: '000314782', registeredCompanyCode: 'GL', companyCode: 'GL', planName: 'Modified Premium Whole Life', policyStatusDescription: 'Active - Premium Paying', totalMonthlyPremium: 6.3, totalAnnualPremium: 70.0, paidToDate: '2026-05-28T00:00:00', autoPay: false, systemCode: 'CFO', insuredName: 'WILLIAMS, CARL E' },

  // GN — General Life (CFO, registeredCompanyCode=GN)
  { policyNo: '371714316', registeredCompanyCode: 'GN', companyCode: 'GL', planName: 'Modified Premium Whole Life', policyStatusDescription: 'Active - Premium Paying', totalMonthlyPremium: 13.5, totalAnnualPremium: 150.0, paidToDate: '2026-06-27T00:00:00', autoPay: false, systemCode: 'CFO', insuredName: 'REUTHER, CHARLENE L' },
  { policyNo: '371714420', registeredCompanyCode: 'GN', companyCode: 'GL', planName: 'Modified Premium Whole Life', policyStatusDescription: 'Active - Premium Paying', totalMonthlyPremium: 20.25, totalAnnualPremium: 225.0, paidToDate: '2026-06-27T00:00:00', autoPay: false, systemCode: 'CFO', insuredName: 'IRIZARRY, AMELIA' },
  { policyNo: '371714707', registeredCompanyCode: 'GN', companyCode: 'GL', planName: 'Modified Premium Whole Life', policyStatusDescription: 'Active - Premium Paying', totalMonthlyPremium: 13.5, totalAnnualPremium: 150.0, paidToDate: '2026-06-02T00:00:00', autoPay: false, systemCode: 'CFO', insuredName: 'PHILLIPS, AMIE M' },
  { policyNo: '371714847', registeredCompanyCode: 'GN', companyCode: 'GL', planName: 'Modified Premium Whole Life', policyStatusDescription: 'Active - Premium Paying', totalMonthlyPremium: 13.5, totalAnnualPremium: 150.0, paidToDate: '2026-07-03T00:00:00', autoPay: false, systemCode: 'CFO', insuredName: 'SHAFF, ANGELA J' },
  { policyNo: '371715117', registeredCompanyCode: 'GN', companyCode: 'GL', planName: 'Modified Premium Whole Life', policyStatusDescription: 'Active - Premium Paying', totalMonthlyPremium: 18.5, totalAnnualPremium: 205.6, paidToDate: '2026-08-05T00:00:00', autoPay: false, systemCode: 'CFO', insuredName: 'BROWN, VON GERALD H' },
  { policyNo: '371716986', registeredCompanyCode: 'GN', companyCode: 'GL', planName: 'Modified Premium Whole Life', policyStatusDescription: 'Inactive-Payment Due', totalMonthlyPremium: 6.75, totalAnnualPremium: 75.0, paidToDate: '2026-04-23T00:00:00', autoPay: false, systemCode: 'CFO', insuredName: 'LEGGETT, STEPHEN M' },

  // AI — Accident & Income (AIL)
  { policyNo: '4098658', registeredCompanyCode: 'AI', companyCode: 'AI', planName: 'Whole Life', policyStatusDescription: 'A', totalMonthlyPremium: 9.37, totalAnnualPremium: 104.04, paidToDate: '2026-06-22T00:00:00', autoPay: false, systemCode: 'AIL', insuredName: 'PAULAUSKI, PATRICIA' },
  { policyNo: '4102424', registeredCompanyCode: 'AI', companyCode: 'AI', planName: 'Whole Life', policyStatusDescription: 'A', totalMonthlyPremium: 14.04, totalAnnualPremium: 155.98, paidToDate: '2026-06-27T00:00:00', autoPay: false, systemCode: 'AIL', insuredName: 'MANSILLA, IVETTE' },
  { policyNo: '4111841', registeredCompanyCode: 'AI', companyCode: 'AI', planName: 'Cancer Only', policyStatusDescription: 'A', totalMonthlyPremium: 4.91, totalAnnualPremium: 54.6, paidToDate: '2026-07-08T00:00:00', autoPay: false, systemCode: 'AIL', insuredName: 'WILLETT, EUGENE' },
  { policyNo: '4592479', registeredCompanyCode: 'AI', companyCode: 'AI', planName: 'Whole Life', policyStatusDescription: 'A', totalMonthlyPremium: 14.26, totalAnnualPremium: 158.43, paidToDate: '2026-11-05T00:00:00', autoPay: false, systemCode: 'AIL', insuredName: 'BOURQUE, WACEY L' },
  { policyNo: '4097247', registeredCompanyCode: 'AI', companyCode: 'AI', planName: 'Whole Life', policyStatusDescription: 'A', totalMonthlyPremium: 14.04, totalAnnualPremium: 155.99, paidToDate: '2026-04-25T00:00:00', autoPay: false, systemCode: 'AIL', insuredName: 'SOLES, KAREN S' },
  { policyNo: '4629275', registeredCompanyCode: 'AI', companyCode: 'AI', planName: 'Whole Life', policyStatusDescription: 'A', totalMonthlyPremium: 19.06, totalAnnualPremium: 211.68, paidToDate: '2026-11-11T00:00:00', autoPay: false, systemCode: 'AIL', insuredName: 'STARKWEATHER, TED L' },

  // LN — Legacy Notes (LNL + OPA-LNL)
  { policyNo: 'A000709057', registeredCompanyCode: 'LN', companyCode: 'LN', planName: 'Executive Whole Life', policyStatusDescription: 'A', totalMonthlyPremium: 12.0, totalAnnualPremium: 133.0, paidToDate: '2026-05-01T00:00:00', autoPay: false, systemCode: 'LNL', insuredName: 'WRIGHT, MARION L' },
  { policyNo: 'A000709077', registeredCompanyCode: 'LN', companyCode: 'LN', planName: 'Executive Whole Life', policyStatusDescription: 'A', totalMonthlyPremium: 0, totalAnnualPremium: 112.7, paidToDate: '2026-05-06T00:00:00', autoPay: false, systemCode: 'LNL', insuredName: 'HERRING, DOUGLAS C' },
  { policyNo: 'A000718032', registeredCompanyCode: 'LN', companyCode: 'LN', planName: 'Executive Whole Life', policyStatusDescription: 'A', totalMonthlyPremium: 0, totalAnnualPremium: 133.0, paidToDate: '2026-09-14T00:00:00', autoPay: false, systemCode: 'LNL', insuredName: 'CONNER, FRANKLIN G' },
  { policyNo: 'L100026904', registeredCompanyCode: 'LN', companyCode: 'LN', planName: 'Accidental Death', policyStatusDescription: 'Terminated-Lapsed', totalMonthlyPremium: 0.38, totalAnnualPremium: 4.0, paidToDate: '2027-05-01T00:00:00', autoPay: false, systemCode: 'OPA-LNL', insuredName: 'WILL, FATYRELL' },
  { policyNo: 'A000710896', registeredCompanyCode: 'LN', companyCode: 'LN', planName: 'Preferred Risk Whole Life', policyStatusDescription: 'A', totalMonthlyPremium: 0, totalAnnualPremium: 58.1, paidToDate: '2026-08-01T00:00:00', autoPay: false, systemCode: 'LNL', insuredName: 'MORRIS, JOSEPH M' },
  { policyNo: 'A000713126', registeredCompanyCode: 'LN', companyCode: 'LN', planName: 'Executive Whole Life', policyStatusDescription: 'A', totalMonthlyPremium: 0, totalAnnualPremium: 109.8, paidToDate: '2026-06-01T00:00:00', autoPay: false, systemCode: 'LNL', insuredName: 'WAMP, JOE M' },

  // UA — CFU system
  { policyNo: '571775269', registeredCompanyCode: 'UA', companyCode: 'UA', planName: 'Modified Premium Whole Life', policyStatusDescription: 'Inactive-Payment Due', totalMonthlyPremium: 1.8, totalAnnualPremium: 20.0, paidToDate: '2026-05-07T00:00:00', autoPay: false, systemCode: 'CFU', insuredName: 'TURNER, TASHA' },
  { policyNo: '571778529', registeredCompanyCode: 'UA', companyCode: 'UA', planName: '10 Year Level Benefit Renewable Term', policyStatusDescription: 'Inactive-Payment Due', totalMonthlyPremium: 8.0, totalAnnualPremium: 90.0, paidToDate: '2025-12-25T00:00:00', autoPay: false, systemCode: 'CFU', insuredName: 'OWEN, DOROTHY' },
  { policyNo: '571703370', registeredCompanyCode: 'UA', companyCode: 'UA', planName: 'Modified Premium Whole Life', policyStatusDescription: 'Active - Premium Paying', totalMonthlyPremium: 15.3, totalAnnualPremium: 170.0, paidToDate: '2026-06-28T00:00:00', autoPay: false, systemCode: 'CFU', insuredName: 'BRYAN, ROY' },
  { policyNo: '571703891', registeredCompanyCode: 'UA', companyCode: 'UA', planName: 'Modified Premium Whole Life', policyStatusDescription: 'Inactive-Payment Due', totalMonthlyPremium: 11.25, totalAnnualPremium: 125.0, paidToDate: '2025-12-09T00:00:00', autoPay: false, systemCode: 'CFU', insuredName: 'CARPENTER, FRIZELL' },
  { policyNo: '571703443', registeredCompanyCode: 'UA', companyCode: 'UA', planName: 'Modified Premium Whole Life', policyStatusDescription: 'Inactive-Payment Due', totalMonthlyPremium: 6.3, totalAnnualPremium: 70.0, paidToDate: '2026-01-07T00:00:00', autoPay: false, systemCode: 'CFU', insuredName: 'MOODY, CARSON' },
  { policyNo: '571703482', registeredCompanyCode: 'UA', companyCode: 'UA', planName: 'Whole Life + ADB', policyStatusDescription: 'Inactive-Payment Due', totalMonthlyPremium: 14.0, totalAnnualPremium: 163.0, paidToDate: '2026-01-08T00:00:00', autoPay: false, systemCode: 'CFU', insuredName: 'ANDRAE, DIANA' },
];

const PAYMENT_HISTORY: Record<string, import('../types/policy').PaymentRecord[]> = {
  '00A327584': [
    { date: '2026-06-16', amount: 24.00, method: 'Bank Draft', status: 'paid' },
    { date: '2026-05-16', amount: 24.00, method: 'Bank Draft', status: 'paid' },
    { date: '2026-04-16', amount: 24.00, method: 'Bank Draft', status: 'paid' },
  ],
  '4098658': [
    { date: '2026-06-22', amount: 9.37,  method: 'Direct Bill', status: 'paid' },
    { date: '2026-05-22', amount: 9.37,  method: 'Direct Bill', status: 'paid' },
    { date: '2026-04-22', amount: 9.37,  method: 'Direct Bill', status: 'failed' },
  ],
  '371716986': [
    { date: '2026-04-23', amount: 19.88, method: 'Direct Bill', status: 'pending' },
    { date: '2026-01-23', amount: 19.88, method: 'Direct Bill', status: 'paid' },
    { date: '2025-10-23', amount: 19.88, method: 'Direct Bill', status: 'paid' },
  ],
  'A000709057': [
    { date: '2026-05-01', amount: 12.00, method: 'Premium Notice', status: 'paid' },
    { date: '2026-04-01', amount: 12.00, method: 'Premium Notice', status: 'paid' },
  ],
};

export const mockPolicies = apiRecords.map(normalizeApiPolicy).map(p => ({
  ...p,
  paymentHistory: PAYMENT_HISTORY[p.id] ?? [],
}));
