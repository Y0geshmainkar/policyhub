# TanStack Query — Interview Reference

> Separate file because this is a distinct architectural decision, not always used.
> Know BOTH patterns — TanStack Query AND manual Redux+Axios — and explain when you'd choose each.

---

## Is TanStack Query used in large-scale apps?

**Honest answer: Yes, but it depends on the company type.**

| Context | What they typically use |
|---------|------------------------|
| Startups, product companies (Vercel, Linear, etc.) | TanStack Query + Zustand |
| Large enterprise (insurance, banking, healthcare) | Redux + Axios + manual loading (like ESC codebase) |
| Redux-heavy teams wanting data fetching | RTK Query (Redux Toolkit's built-in) |
| Next.js apps | SWR (from Vercel) |
| GraphQL apps | Apollo Client |

**The right answer in an interview:**
> "I've worked with both patterns. For server state I prefer TanStack Query because it handles caching, refetching, and loading state automatically. For teams already on Redux, RTK Query achieves the same thing without adding a dependency. The key principle is the same: don't put API response data in Redux — keep Redux for UI state."

---

## Core Concept — Server State vs Client State

```
Client state (Redux):          Server state (TanStack Query):
  activeDivision                 policies[] from API
  payment.modalOpen              policyDetail
  payment.status                 paymentHistory
  user preferences               any data that lives on a server
```

**Why the separation matters:**
Server data can be stale, needs refetching, can fail, needs caching.
Client state is always up to date (you set it yourself).
Mixing them in Redux means you have to manually handle staleness, loading, and errors — TanStack does it for free.

---

## What We Built in PolicyHub

```ts
// src/hooks/usePayment.ts

// Query — reads data, caches it
const { data: policies, isLoading, isError } = usePolicies();

// Mutation — writes data, invalidates cache on success
const ccMutation = usePaymentCC();
ccMutation.mutate(payload, {
  onSuccess: (data) => { /* update UI */ },
  onError: () => { /* show error */ }
});
```

### QueryClientProvider setup
```tsx
// main.tsx — wraps entire app
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,  // 5 min fresh
      retry: 1,
    }
  }
});

<QueryClientProvider client={queryClient}>
  <App />
</QueryClientProvider>
```

### Query keys — the cache identifier
```ts
export const queryKeys = {
  policies: ['policies'] as const,
  policy: (id: string) => ['policy', id] as const,
};
// ['policy', '00A327584'] and ['policy', '4098658'] are separate cache entries
```

### Cache invalidation after mutation
```ts
const queryClient = useQueryClient();
// After payment success — refetch policies so status badge updates
queryClient.invalidateQueries({ queryKey: queryKeys.policies });
```

### LoadingOverlay — automatic, no manual dispatch
```ts
// Before (manual Redux):
store.dispatch(setLoading(true));  // in every interceptor

// After (TanStack):
const isFetching = useIsFetching();   // 1 if any query is loading
const isMutating = useIsMutating();   // 1 if any mutation is pending
if (!isFetching && !isMutating) return null;
```

---

## Interview Questions

**Q: What is TanStack Query (React Query)?**
A: A library for managing server state — fetching, caching, synchronizing data from APIs. It handles loading/error states, background refetching, and cache invalidation automatically.
> In PolicyHub: `usePolicies()` fetches all policies and caches them for 5 minutes.

**Q: What is the difference between `useQuery` and `useMutation`?**
A: `useQuery` is for reading data (GET). `useMutation` is for writing data (POST/PUT/DELETE). Query runs automatically on mount; mutation runs when you call `mutate()`.
> `usePolicies` uses `useQuery`. `usePaymentCC` uses `useMutation` — only fires when user submits.

**Q: What is `staleTime`?**
A: How long cached data is considered fresh. During this window, the same query won't refetch — it uses the cache. After it expires, the next mount triggers a background refetch.
> We set 5 minutes. If you visit Dashboard, leave, come back within 5 min — no new API call.

**Q: What is `queryKey`?**
A: The unique cache identifier. Same key = same cache entry. Change the key = new fetch.
> `['policy', '00A327584']` is a separate cache from `['policy', '4098658']`. Changing the ID in the URL automatically fetches the right policy.

**Q: What is `invalidateQueries`?**
A: Marks cached data as stale, triggering a refetch on next render. Used after mutations to keep UI in sync.
> After payment success: `queryClient.invalidateQueries({ queryKey: ['policies'] })` — policies list refetches so the status badge updates.

**Q: What is `useIsFetching`?**
A: Returns the number of queries currently fetching. Use it to show a global loading indicator without manual state.
> Our `LoadingOverlay` uses `useIsFetching() + useIsMutating()` — no Redux `isLoading` needed.

**Q: When would you NOT use TanStack Query?**
A: When data is purely client-side (no API), when the team is standardized on RTK Query, or when the existing codebase has a mature Redux+thunk pattern that works well.
> The ESC codebase uses manual Axios + Redux loading — that's fine too, it's a valid approach.

**Q: What is RTK Query vs TanStack Query?**
A: RTK Query is Redux Toolkit's built-in data fetching solution. Same concepts (queries, mutations, caching) but integrated directly into Redux — no separate library needed. Use RTK Query if you're already on Redux and don't want another dependency. Use TanStack Query for framework-agnostic, non-Redux setups.

**Q: What is optimistic updates?**
A: Update the UI immediately before the server confirms, then roll back if it fails. TanStack Query has built-in support via `onMutate` callback.
> Example: flip AutoPay toggle instantly in UI, revert if the API call fails.

---

## Redux + Axios Pattern (enterprise alternative) — Know This Too

```ts
// ESC codebase pattern — still valid in enterprise
let pendingRequests = 0;

axios.interceptors.request.use(config => {
  pendingRequests++;
  store.dispatch(setLoading(true));  // manual
  return config;
});

axios.interceptors.response.use(response => {
  if (--pendingRequests === 0) store.dispatch(setLoading(false));
  return response;
});
```

**When asked which you prefer:**
> "Both are valid. TanStack Query is less code and handles edge cases like background refetch and stale-while-revalidate automatically. The manual Redux pattern gives more control and is easier to debug in large teams where everyone already knows Redux. I've implemented both — I'd default to TanStack Query in a new project and respect the existing pattern in a mature codebase."

---

*Added: TanStack Query feature branch — feature/tanstack-query*
