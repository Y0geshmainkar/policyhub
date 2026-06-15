import { normalizeCfo, normalizeOipa, normalizeOpaLnl, normalizeLnl } from '../data/normalizers';

describe('normalizeCfo', () => {
  it('maps CFO raw to Policy', () => {
    const raw = {
      policyId: 'GL-001', divisionCode: 'GL' as const,
      policyType: 'Term Life', policyStatus: 'ACTIVE',
      monthlyPremium: 100, nextDueDate: '2026-07-01', autoPayEnabled: true,
    };
    const p = normalizeCfo(raw);
    expect(p.id).toBe('GL-001');
    expect(p.status).toBe('active');
    expect(p.premium).toBe(100);
    expect(p.autoPay).toBe(true);
    expect(p.sourceSystem).toBe('CFO');
  });
});

describe('normalizeOipa', () => {
  it('maps OIPA raw to Policy', () => {
    const raw = {
      polNum: 'AI-001', div: 'AI' as const,
      prodDesc: 'Accident', statCd: '02',
      premAmt: 55, dueDt: '2026-06-20', autopayFlg: 'N' as const,
    };
    const p = normalizeOipa(raw);
    expect(p.id).toBe('AI-001');
    expect(p.status).toBe('due');
    expect(p.autoPay).toBe(false);
    expect(p.sourceSystem).toBe('OIPA');
  });
});

describe('normalizeOpaLnl', () => {
  it('maps OPA-LNL raw to Policy', () => {
    const raw = {
      policy_number: 'GN-001', division_id: 'GN' as const,
      product_name: 'Universal Life', status_code: 'ACT',
      premium_amount: 200, next_payment_date: '2026-08-01', auto_pay: false,
    };
    const p = normalizeOpaLnl(raw);
    expect(p.id).toBe('GN-001');
    expect(p.status).toBe('active');
    expect(p.sourceSystem).toBe('OPA-LNL');
  });
});

describe('normalizeLnl', () => {
  it('maps LNL raw to Policy', () => {
    const raw = {
      id: 'LN-001', div: 'LN' as const,
      desc: 'Legacy Whole', stat: 'L',
      amount: 80, due: '2026-05-01', ap: 0 as const,
    };
    const p = normalizeLnl(raw);
    expect(p.id).toBe('LN-001');
    expect(p.status).toBe('lapsed');
    expect(p.autoPay).toBe(false);
    expect(p.sourceSystem).toBe('LNL');
  });
});
