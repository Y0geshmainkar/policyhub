import { normalizeCfo, normalizeOipa, normalizeOpaLnl, normalizeLnl, normalizeApiPolicy } from '../data/normalizers';

describe('normalizeCfo', () => {
  const raw = {
    policyId: 'GL-001', divisionCode: 'GL' as const,
    policyType: 'Term Life', policyStatus: 'ACTIVE',
    monthlyPremium: 100, nextDueDate: '2026-07-01', autoPayEnabled: true,
  };

  it('maps id, type, premium, dueDate', () => {
    const p = normalizeCfo(raw);
    expect(p.id).toBe('GL-001');
    expect(p.type).toBe('Term Life');
    expect(p.premium).toBe(100);
    expect(p.dueDate).toBe('2026-07-01');
  });

  it('maps ACTIVE → active', () => expect(normalizeCfo(raw).status).toBe('active'));
  it('maps DUE → due', () => expect(normalizeCfo({ ...raw, policyStatus: 'DUE' }).status).toBe('due'));
  it('maps unknown → lapsed', () => expect(normalizeCfo({ ...raw, policyStatus: 'LAPSED' }).status).toBe('lapsed'));

  it('sets sourceSystem to CFO', () => expect(normalizeCfo(raw).sourceSystem).toBe('CFO'));
  it('maps autoPay', () => expect(normalizeCfo(raw).autoPay).toBe(true));
  it('sets divisionName', () => expect(normalizeCfo(raw).divisionName).toBe('Group Life'));
});

describe('normalizeOipa', () => {
  const raw = {
    polNum: 'AI-001', div: 'AI' as const,
    prodDesc: 'Accident', statCd: '01',
    premAmt: 55, dueDt: '2026-06-20', autopayFlg: 'Y' as const,
  };

  it('maps id from polNum', () => expect(normalizeOipa(raw).id).toBe('AI-001'));
  it('maps 01 → active', () => expect(normalizeOipa(raw).status).toBe('active'));
  it('maps 02 → due', () => expect(normalizeOipa({ ...raw, statCd: '02' }).status).toBe('due'));
  it('maps other → lapsed', () => expect(normalizeOipa({ ...raw, statCd: '99' }).status).toBe('lapsed'));
  it('maps autopayFlg Y → true', () => expect(normalizeOipa(raw).autoPay).toBe(true));
  it('maps autopayFlg N → false', () => expect(normalizeOipa({ ...raw, autopayFlg: 'N' }).autoPay).toBe(false));
  it('sets sourceSystem to OIPA', () => expect(normalizeOipa(raw).sourceSystem).toBe('OIPA'));
});

describe('normalizeOpaLnl', () => {
  const raw = {
    policy_number: 'GN-001', division_id: 'GN' as const,
    product_name: 'Universal Life', status_code: 'ACT',
    premium_amount: 200, next_payment_date: '2026-08-01', auto_pay: false,
  };

  it('maps id from policy_number', () => expect(normalizeOpaLnl(raw).id).toBe('GN-001'));
  it('maps ACT → active', () => expect(normalizeOpaLnl(raw).status).toBe('active'));
  it('maps DUE → due', () => expect(normalizeOpaLnl({ ...raw, status_code: 'DUE' }).status).toBe('due'));
  it('maps other → lapsed', () => expect(normalizeOpaLnl({ ...raw, status_code: 'X' }).status).toBe('lapsed'));
  it('sets sourceSystem to OPA-LNL', () => expect(normalizeOpaLnl(raw).sourceSystem).toBe('OPA-LNL'));
});

describe('normalizeLnl', () => {
  const raw = {
    id: 'LN-001', div: 'LN' as const,
    desc: 'Legacy Whole', stat: 'A',
    amount: 80, due: '2026-05-01', ap: 1 as const,
  };

  it('maps stat A → active', () => expect(normalizeLnl(raw).status).toBe('active'));
  it('maps stat D → due', () => expect(normalizeLnl({ ...raw, stat: 'D' }).status).toBe('due'));
  it('maps stat L → lapsed', () => expect(normalizeLnl({ ...raw, stat: 'L' }).status).toBe('lapsed'));
  it('maps ap 1 → true', () => expect(normalizeLnl(raw).autoPay).toBe(true));
  it('maps ap 0 → false', () => expect(normalizeLnl({ ...raw, ap: 0 as const }).autoPay).toBe(false));
  it('sets sourceSystem to LNL', () => expect(normalizeLnl(raw).sourceSystem).toBe('LNL'));
});

describe('normalizeApiPolicy', () => {
  const raw = {
    policyNo: '00A327584', registeredCompanyCode: 'GL', companyCode: 'GL',
    planName: 'Group Term', policyStatusDescription: 'Active - Premium Paying',
    totalMonthlyPremium: 24, totalAnnualPremium: 270,
    paidToDate: '2026-07-16T00:00:00', autoPay: true, systemCode: 'CFO',
    insuredName: 'NOVOKUS, ISABELLE',
  };

  it('maps policyNo to id', () => expect(normalizeApiPolicy(raw).id).toBe('00A327584'));
  it('maps Active - Premium Paying → active', () => expect(normalizeApiPolicy(raw).status).toBe('active'));
  it('maps Inactive-Payment Due → due', () => expect(normalizeApiPolicy({ ...raw, policyStatusDescription: 'Inactive-Payment Due' }).status).toBe('due'));
  it('maps Lapsed → lapsed', () => expect(normalizeApiPolicy({ ...raw, policyStatusDescription: 'Lapsed' }).status).toBe('lapsed'));
  it('maps CFO systemCode → CFO sourceSystem', () => expect(normalizeApiPolicy(raw).sourceSystem).toBe('CFO'));
  it('maps OPA-LNL systemCode → OPA-LNL sourceSystem', () => expect(normalizeApiPolicy({ ...raw, systemCode: 'OPA-LNL' }).sourceSystem).toBe('OPA-LNL'));
  it('falls back to annual/12 when monthly is null', () => {
    const p = normalizeApiPolicy({ ...raw, totalMonthlyPremium: null });
    expect(p.premium).toBeCloseTo(22.5);
  });
  it('maps insuredName', () => expect(normalizeApiPolicy(raw).insuredName).toBe('NOVOKUS, ISABELLE'));
});
