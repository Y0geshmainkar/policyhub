import reducer, {
  setActiveDivision, setSelectedPolicyId, toggleAutoPay, updatePolicyStatus
} from '../store/policiesSlice';
import { mockPolicies } from '../data/mockData';

const initial = {
  policies: mockPolicies,
  activeDivision: 'GL' as const,
  selectedPolicyId: null,
};

describe('policiesSlice', () => {
  test('setActiveDivision', () => {
    expect(reducer(initial, setActiveDivision('AI')).activeDivision).toBe('AI');
  });

  test('setSelectedPolicyId', () => {
    expect(reducer(initial, setSelectedPolicyId('00A327584')).selectedPolicyId).toBe('00A327584');
  });

  test('setSelectedPolicyId null clears selection', () => {
    const s = reducer({ ...initial, selectedPolicyId: '00A327584' }, setSelectedPolicyId(null));
    expect(s.selectedPolicyId).toBeNull();
  });

  test('toggleAutoPay flips autoPay', () => {
    const before = mockPolicies.find(p => p.id === '00A327584')!.autoPay;
    const after = reducer(initial, toggleAutoPay('00A327584')).policies.find(p => p.id === '00A327584')!.autoPay;
    expect(after).toBe(!before);
  });

  test('toggleAutoPay twice returns to original', () => {
    const before = mockPolicies.find(p => p.id === '00A327584')!.autoPay;
    let s = reducer(initial, toggleAutoPay('00A327584'));
    s = reducer(s, toggleAutoPay('00A327584'));
    expect(s.policies.find(p => p.id === '00A327584')!.autoPay).toBe(before);
  });

  test('updatePolicyStatus sets new status', () => {
    const s = reducer(initial, updatePolicyStatus({ id: '00A327584', status: 'active' }));
    expect(s.policies.find(p => p.id === '00A327584')!.status).toBe('active');
  });

  test('unknown policy id does nothing', () => {
    const s = reducer(initial, toggleAutoPay('NONEXISTENT'));
    expect(s.policies).toHaveLength(initial.policies.length);
  });
});
