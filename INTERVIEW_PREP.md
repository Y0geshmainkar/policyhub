# React Interview Prep — Living Reference

> Add to this file every time we cover a new topic.
> Each section: concept → how we use it in PolicyHub → likely interview questions.

---

## 1. Redux & Redux Toolkit

### What it is
Single global store outside React components. One-way data flow: Action → Reducer → New State → Re-render.

### Three pieces
| Piece | What it is | Our example |
|-------|-----------|-------------|
| Action | Plain object describing what happened | `{ type: 'ui/setLoading', payload: true }` |
| Reducer | Function: (state, action) → new state | `setLoading` in `uiSlice.ts` |
| Store | Holds state, runs reducers | `src/store/index.ts` |

### createSlice — collapses all three into one file
```ts
const uiSlice = createSlice({
  name: 'ui',
  initialState: { isLoading: false },
  reducers: {
    setLoading: (state, action) => { state.isLoading = action.payload }
  }
});
export const { setLoading } = uiSlice.actions;  // action creator
export default uiSlice.reducer;                  // reducer
```

### Our 3 slices
| Slice | Owns |
|-------|------|
| `policiesSlice` | All 40 policies, activeDivision, selectedPolicyId |
| `uiSlice` | isLoading, loadingMessage |
| `paymentSlice` | modalOpen, paymentType, status, token, last4, confirmationNo |

### Golden rule
- Multiple components need same data → **Redux**
- Only one component needs it → **useState**

### Interview questions
- What is Redux and why use it?
- What problem does Redux solve? (prop drilling)
- What is a reducer? Must it be pure?
- What is an action? What is an action creator?
- What is Redux Toolkit and how does it differ from plain Redux?
- What is `createSlice`?
- Can one component dispatch to multiple slices? (Yes — PaymentModal does this)
- Where do you put data in Redux vs local state?

---

## 2. React-Redux Hooks

### useAppSelector — reads from store
```ts
const { isLoading } = useAppSelector(s => s.ui);
```
- `s` = entire RootState
- Selector picks what you need
- Component re-renders ONLY when selected value changes (strict equality `===`)
- Uses `TypedUseSelectorHook<RootState>` for TypeScript safety

### useAppDispatch — writes to store
```ts
const dispatch = useAppDispatch();
dispatch(setLoading(true));
```
- Returns the store's dispatch function
- Uses `useDispatch<AppDispatch>()` for TypeScript safety

### Why typed wrappers?
Raw `useSelector` gives `state: unknown`. Typed version gives full autocomplete + compile-time error on wrong payloads.

### store.dispatch vs useAppDispatch
| | `useAppDispatch` | `store.dispatch` |
|--|--|--|
| Where | Inside React components | Outside React (apiClient.ts) |
| Why | Hooks only work in components | Plain TS modules can't use hooks |

### Interview questions
- What is `useSelector`? How does it decide when to re-render?
- What is `useDispatch`?
- Why create typed wrappers (`useAppSelector`, `useAppDispatch`)?
- What is `RootState`? How do you derive it?
- How do you use Redux outside a React component?

---

## 3. React Hooks — Core

### useState
```ts
const [value, setValue] = useState('');
```
- Local state — only this component cares
- We use in: `CreditCardForm`, `BankDraftForm` for form inputs + errors
- Re-renders only this component when called

### useEffect
```ts
useEffect(() => {
  // runs after render
  closeRef.current?.focus();
}, [modalOpen]);  // only when modalOpen changes
```
- Run code after render (side effects)
- Dependency array controls when it runs
- We use in: `PaymentModal` to focus close button when modal opens
- Empty `[]` = run once on mount, `[dep]` = run when dep changes, no array = every render

### useRef
```ts
const closeRef = useRef<HTMLButtonElement>(null);
<button ref={closeRef}>✕</button>
closeRef.current?.focus();
```
- Holds a mutable reference that does NOT cause re-render
- Two uses: 1) DOM references 2) persisting values between renders
- We use in: `Sidebar` (tab refs for roving tabindex), `PaymentModal` (focus trap)

### useParams (react-router)
```ts
const { id } = useParams<{ id: string }>();
```
- Reads URL params from route `/policy/:id`
- We use in: `PolicyDetail` to find which policy to show

### Interview questions — useState
- What is the difference between `useState` and a regular variable?
- Does `setState` update immediately? (No — batched, async)
- When should you NOT use `useState`? (When multiple components need it → Redux)

### Interview questions — useEffect
- What is a side effect in React?
- What is the cleanup function in useEffect?
- What happens with an empty dependency array `[]`?
- What is the difference between `useEffect` with and without a dependency array?
- Why shouldn't you fetch data directly in the component body?

### Interview questions — useRef
- What is the difference between `useRef` and `useState`?
- When would you use `useRef` over `useState`?
- Can you store non-DOM values in useRef? (Yes)

---

## 4. Axios & Interceptors

### What interceptors do
Run code on every request or response before it reaches your component.

### Our pattern (mirrors real ESC codebase)
```ts
let pendingRequests = 0;

// Request interceptor
apiClient.interceptors.request.use(config => {
  pendingRequests++;
  store.dispatch(setLoading(true));  // spinner on
  return config;
});

// Response interceptor
apiClient.interceptors.response.use(response => {
  pendingRequests--;
  if (pendingRequests === 0) store.dispatch(setLoading(false));  // spinner off
  return response;
});
```

### Why pendingRequests counter, not just true/false?
If 3 calls fire simultaneously, a boolean would turn off after the first finishes. Counter ensures loading stays true until ALL are done.

### skipLoader header pattern
```ts
axios.get('/silent-call', { headers: { skipLoader: true } })
// interceptor checks: if skipLoader → don't show spinner
```

### Local JSON dev switch
```ts
const USE_LOCAL = import.meta.env.DEV;
const url = USE_LOCAL ? 'localJson/Payment/PolicyPaymentSearch.json' : 'Payment/PolicyPaymentSearch';
```
Dev → serves from `public/localJson/`. Prod → hits real API. No rebuild needed.

### Interview questions
- What are axios interceptors and what are they used for?
- How would you show a global loading spinner for all API calls?
- How do you handle errors globally in axios?
- What is the difference between axios and fetch?
- How do you cancel an axios request?

---

## 5. React Router v6

### Our routes
```tsx
<Routes>
  <Route path="/" element={<Dashboard />} />
  <Route path="/policy/:id" element={<PolicyDetail />} />
</Routes>
```

### Hooks used
```ts
useParams()    // read :id from URL
useNavigate()  // programmatic navigation (Sidebar)
```

### HashRouter vs BrowserRouter
| | BrowserRouter | HashRouter |
|--|--|--|
| URL | `/policy/123` | `/#/policy/123` |
| Server needed? | Yes — 404 if server doesn't redirect | No — hash never hits server |
| We use | HashRouter | GitHub Pages doesn't support server redirects |

### Interview questions
- What is the difference between `BrowserRouter` and `HashRouter`?
- How do you pass data between routes?
- What is `useNavigate`?
- What is a protected route?
- How do you read URL parameters in React Router v6?

---

## 6. Component Patterns Used in PolicyHub

### Controlled components
Form inputs where React controls the value:
```tsx
<input value={cardNumber} onChange={e => setCardNumber(e.target.value)} />
```
We use in: `CreditCardForm`, `BankDraftForm`

### Compound component pattern
`PaymentModal` contains `CreditCardForm` and `BankDraftForm` as tabs — modal owns the logic, forms own the UI.

### Lifting state up
`AutoPayToggle` receives `checked` from `PolicyDetail` (which reads Redux). Toggle only dispatches — it doesn't read Redux itself.

### Conditional rendering
```tsx
if (!isLoading) return null;  // LoadingOverlay
if (!modalOpen) return null;  // PaymentModal
```
Components always mounted in tree, invisible when not needed.

### Interview questions
- What is a controlled vs uncontrolled component?
- What is lifting state up?
- What is prop drilling and how do you avoid it?
- What is component composition?
- When would you use `children` prop?

---

## 7. Accessibility (a11y)

### What we implemented
```tsx
role="tablist" / role="tab" / role="tabpanel"   // Sidebar division navigation
aria-selected={activeDivision === div}           // current tab
aria-controls={`panel-${div}`}                  // tab → panel link
tabIndex={active ? 0 : -1}                      // roving tabindex
role="dialog" aria-modal="true"                  // PaymentModal
role="status" aria-live="polite"                 // LoadingOverlay
```

### Roving tabindex
Only ONE element is in tab order at a time. Arrow keys move focus between tabs.
```ts
ArrowDown → focus next tab, tabIndex = 0
ArrowUp   → focus prev tab, tabIndex = 0
All others → tabIndex = -1 (skipped by Tab key)
```

### Interview questions
- What is ARIA?
- What is the difference between `role` and native HTML elements?
- What is `aria-label` vs `aria-labelledby`?
- What is a focus trap and when do you need one?
- What is roving tabindex?
- What Lighthouse score indicates good accessibility? (90+)

---

## 8. TypeScript in React

### Key concepts we use
```ts
interface Policy { ... }          // shape of data
type Division = 'GL' | 'AI' | ... // union type — only these values
PayloadAction<string>             // typed Redux action
TypedUseSelectorHook<RootState>   // typed selector hook
ReturnType<typeof store.getState> // derive type from value
```

### Interview questions
- What is the difference between `interface` and `type`?
- What is a union type?
- What is a generic? (`Array<T>`, `PayloadAction<T>`)
- What is `ReturnType`?
- What is `typeof`?

---

## Topics Still to Cover (as we build)

- [ ] React lifecycle (mounting, updating, unmounting)
- [ ] useMemo and useCallback (performance)
- [ ] React.memo — when to use
- [ ] Context API vs Redux — when to use which
- [ ] Storybook — Phase 4
- [ ] Jest + React Testing Library — Phase 4
- [ ] Virtual DOM — how React reconciliation works
- [ ] Keys in lists — why they matter
- [ ] Error boundaries
- [ ] Lazy loading / code splitting
- [ ] React 18 features (Concurrent Mode, Suspense)
- [ ] CSS Modules vs styled-components vs Tailwind
- [ ] Performance profiling with React DevTools

---

*Last updated: Phase 3 complete — Redux, Hooks, Axios, Router, Accessibility, TypeScript*
