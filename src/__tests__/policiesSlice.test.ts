import reducer, { setActiveDivision, setSelectedPolicyId, toggleAutoPay } from '../store/policiesSlice';
import { mockPolicies } from '../data/mockData';

const initial = { policies: mockPolicies, activeDivision: 'GL' as const, selectedPolicyId: null };

test('setActiveDivision', () => {
  const state = reducer(initial, setActiveDivision('AI'));
  expect(state.activeDivision).toBe('AI');
});

test('setSelectedPolicyId', () => {
  const state = reducer(initial, setSelectedPolicyId('GL-10001'));
  expect(state.selectedPolicyId).toBe('GL-10001');
});

test('toggleAutoPay', () => {
  const before = mockPolicies.find(p => p.id === '00A327584')!.autoPay;
  const state = reducer(initial, toggleAutoPay('00A327584'));
  const after = state.policies.find(p => p.id === '00A327584')!.autoPay;
  expect(after).toBe(!before);
});
