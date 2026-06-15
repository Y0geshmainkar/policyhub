import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Division, Policy } from '../types/policy';
import { mockPolicies } from '../data/mockData';

interface PoliciesState {
  policies: Policy[];
  activeDivision: Division;
  selectedPolicyId: string | null;
}

const initialState: PoliciesState = {
  policies: mockPolicies,
  activeDivision: 'GL',
  selectedPolicyId: null,
};

const policiesSlice = createSlice({
  name: 'policies',
  initialState,
  reducers: {
    setActiveDivision(state, action: PayloadAction<Division>) {
      state.activeDivision = action.payload;
    },
    setSelectedPolicyId(state, action: PayloadAction<string | null>) {
      state.selectedPolicyId = action.payload;
    },
    toggleAutoPay(state, action: PayloadAction<string>) {
      const policy = state.policies.find(p => p.id === action.payload);
      if (policy) policy.autoPay = !policy.autoPay;
    },
  },
});

export const { setActiveDivision, setSelectedPolicyId, toggleAutoPay } = policiesSlice.actions;
export default policiesSlice.reducer;
