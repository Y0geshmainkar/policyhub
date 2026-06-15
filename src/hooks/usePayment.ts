import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, schedulePaymentCC, schedulePaymentBank } from '../api/apiClient';
import { normalizeApiPolicy, type ApiPolicyRaw } from '../data/normalizers';
import type { Policy } from '../types/policy';

// ── Query keys — centralised so invalidation is consistent ────────────────
export const queryKeys = {
  policies: ['policies'] as const,
  policy: (id: string) => ['policy', id] as const,
};

// ── Fetch all policies (from localJson in dev/GH Pages) ───────────────────
const fetchPolicies = async (): Promise<Policy[]> => {
  const res = await apiClient.get('localJson/Policy/PolicyRegistered.json');
  const raw: ApiPolicyRaw[] = res.data?.data ?? [];
  return raw.map(normalizeApiPolicy);
};

/** Fetch all policies — replaces policies[] in Redux */
export const usePolicies = () =>
  useQuery({
    queryKey: queryKeys.policies,
    queryFn: fetchPolicies,
  });

/** Fetch a single policy by id — derived from the policies cache */
export const usePolicyById = (id: string) =>
  useQuery({
    queryKey: queryKeys.policy(id),
    queryFn: async (): Promise<Policy | undefined> => {
      const res = await apiClient.get('localJson/Policy/PolicyRegistered.json');
      const raw: ApiPolicyRaw[] = res.data?.data ?? [];
      return raw.map(normalizeApiPolicy).find(p => p.id === id);
    },
    enabled: !!id,
  });

// ── Mutations ─────────────────────────────────────────────────────────────

interface PaymentPayload {
  policyId: string;
  token: string;
  last4: string;
  [key: string]: unknown;
}

interface PaymentResult {
  paymentConfirmationNo: string;
  last4: string;
}

/** Submit CC payment */
export const usePaymentCC = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: PaymentPayload): Promise<PaymentResult> => {
      const res: any = await schedulePaymentCC(payload);
      return res.data?.data;
    },
    onSuccess: () => {
      // Invalidate policies cache so the status badge refreshes
      queryClient.invalidateQueries({ queryKey: queryKeys.policies });
    },
  });
};

/** Submit Bank Draft payment */
export const usePaymentBank = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: PaymentPayload): Promise<PaymentResult> => {
      const res: any = await schedulePaymentBank(payload);
      return res.data?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.policies });
    },
  });
};
