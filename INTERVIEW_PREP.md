# React Interview Prep — Q&A with Examples

> Format: Question → 1-2 line answer → PolicyHub example

---

## Redux & Redux Toolkit

**Q: What is Redux and why use it?**
A: A single global state container outside React. Use it when multiple unrelated components need the same data.
> In PolicyHub: `LoadingOverlay` and `apiClient` both need `isLoading` — neither is parent/child of the other.

**Q: What problem does Redux solve?**
A: Prop drilling — passing data through many component levels just to reach a deeply nested child.
> Without Redux: `App → Dashboard → PolicyCard → PaymentButton` all need payment state. With Redux: `PaymentModal` just reads `s.payment` directly.

**Q: What is a reducer? Must it be pure?**
A: A function `(currentState, action) => newState`. Yes, must be pure — same inputs always return same output, no API calls or side effects inside.
> `setActiveDivision(state, action) => { state.activeDivision = action.payload }` — just sets a value, nothing else.

**Q: What is an action? What is an action creator?**
A: Action = plain object `{ type: 'ui/setLoading', payload: true }`. Action creator = function that creates that object.
> `setLoading(true)` is the action creator. Calling it returns the action object. `dispatch(setLoading(true))` sends it.

**Q: What is Redux Toolkit vs plain Redux?**
A: Redux Toolkit removes boilerplate — `createSlice` replaces separate action types, action creators, and reducers. Also enables "mutating" syntax via Immer under the hood.
> Old Redux needed ~50 lines for what our `uiSlice.ts` does in 15 lines.

**Q: Can one component dispatch to multiple slices?**
A: Yes. Dispatch is just a function — you can call it as many times as you want.
> `PaymentModal` dispatches `setSuccess` (paymentSlice) AND `updatePolicyStatus` (policiesSlice) after a successful payment.

---

## React-Redux Hooks

**Q: What is `useSelector`? When does it re-render?**
A: Reads from Redux store. Re-renders only when the selected value changes (strict `===` comparison).
> `LoadingOverlay` uses `s => s.ui.isLoading`. Clicking a sidebar tab does NOT re-render it because `isLoading` didn't change.

**Q: What is `useDispatch`?**
A: Returns the store's dispatch function so you can send actions from a component.
> `const dispatch = useAppDispatch()` then `dispatch(openModal(policy.id))` in `PolicyDetail`.

**Q: Why create typed wrappers `useAppSelector` / `useAppDispatch`?**
A: Raw hooks give `state: unknown`. Typed wrappers bake in your store's types so TypeScript catches wrong payloads at compile time.
> `dispatch(setLoading("yes"))` → TS error. `dispatch(setLoading(true))` → ✅.

**Q: How do you use Redux outside a React component?**
A: Import `store` directly and call `store.dispatch()`. Hooks only work inside components.
> `apiClient.ts` does `store.dispatch(setLoading(true))` in the axios interceptor — no hooks needed.

---

## useState

**Q: Difference between `useState` and a regular variable?**
A: Regular variable resets on every render. `useState` persists between renders and triggers a re-render when updated.
> In `CreditCardForm`, `const [cardNumber, setCardNumber] = useState('')` — typed value survives re-renders, regular `let cardNumber = ''` would reset.

**Q: Does `setState` update immediately?**
A: No — it's asynchronous and batched. The new value is available on the next render.
> `setCardNumber('1234')` then `console.log(cardNumber)` still logs the old value.

**Q: When should you NOT use useState?**
A: When multiple unrelated components need the same state — use Redux instead.
> `isLoading` is in Redux not `useState` because both `LoadingOverlay` and `apiClient` need it.

---

## useEffect

**Q: What is a side effect in React?**
A: Anything that interacts outside the component — API calls, DOM manipulation, timers, subscriptions.
> Focusing the close button when PaymentModal opens is a side effect — it touches the DOM.

**Q: What does the dependency array do?**
A: Controls when the effect runs. `[]` = once on mount. `[x]` = when x changes. No array = every render.
> `useEffect(() => { closeRef.current?.focus() }, [modalOpen])` — only runs when `modalOpen` changes.

**Q: What is the cleanup function?**
A: A function returned from `useEffect` that runs before the next effect or on unmount. Used to cancel timers, subscriptions, etc.
```ts
useEffect(() => {
  const timer = setTimeout(fn, 1000);
  return () => clearTimeout(timer); // cleanup
}, []);
```

**Q: Why not fetch data directly in the component body?**
A: Component body runs on every render. Fetching there means a new request on every re-render — infinite loop.
> Always put API calls inside `useEffect` with proper dependencies.

---

## useRef

**Q: Difference between `useRef` and `useState`?**
A: Both persist between renders. `useState` triggers re-render on update, `useRef` does NOT.
> `tabRefs.current[i] = el` in `Sidebar` stores DOM nodes — updating it doesn't re-render the component.

**Q: When would you use `useRef` over `useState`?**
A: When you need to store a value or DOM node but don't want a re-render when it changes — focus management, timers, previous values.
> `closeRef` in `PaymentModal` holds the close button DOM node for focus trap — no need to re-render when it's set.

---

## useEffect vs useLayoutEffect

**Q: Difference?**
A: `useEffect` runs asynchronously after paint. `useLayoutEffect` runs synchronously before paint — use for DOM measurements.
> We use `useEffect` for focus — doesn't need to block the paint.

---

## Axios & Interceptors

**Q: What are axios interceptors?**
A: Functions that run on every request/response before your code handles them. Used for auth headers, loading state, error handling.
> Our request interceptor adds `store.dispatch(setLoading(true))` to every API call automatically.

**Q: Why a `pendingRequests` counter instead of a boolean?**
A: If 3 calls fire at once, a boolean turns off after the first finishes. Counter waits for all.
> `pendingRequests++` on each request, `if (pendingRequests === 0) setLoading(false)` on each response.

**Q: Axios vs fetch?**
A: Axios auto-parses JSON, has interceptors, better error handling (non-2xx throws), works in Node. Fetch is native but needs manual JSON parsing and no interceptors.

---

## React Router v6

**Q: BrowserRouter vs HashRouter?**
A: BrowserRouter uses real URLs (`/policy/123`) — needs server to redirect 404s. HashRouter uses `/#/policy/123` — hash never hits server, works on static hosting.
> We use `HashRouter` because GitHub Pages can't redirect 404s to `index.html`.

**Q: How do you read URL params?**
A: `useParams()` hook reads `:id` from the route definition.
> `const { id } = useParams()` in `PolicyDetail` reads the policy ID from `/policy/00A327584`.

**Q: How do you navigate programmatically?**
A: `const navigate = useNavigate()` then `navigate('/')`.
> `Sidebar` calls `navigate('/')` after dispatching `setActiveDivision` so the dashboard shows.

---

## Component Patterns

**Q: Controlled vs uncontrolled component?**
A: Controlled = React owns the value via `useState`. Uncontrolled = DOM owns it, accessed via `ref`.
> `<input value={cardNumber} onChange={e => setCardNumber(e.target.value)} />` = controlled. We use controlled everywhere in payment forms.

**Q: What is lifting state up?**
A: Moving state to the nearest common parent so multiple children can share it.
> `PolicyDetail` reads `policy.autoPay` from Redux and passes it as `checked` prop to `AutoPayToggle`. Toggle dispatches back up.

**Q: What is prop drilling?**
A: Passing props through many layers of components that don't use them, just to reach a deep child. Redux solves this.

---

## Accessibility (a11y)

**Q: What is ARIA?**
A: Attributes that add semantic meaning to HTML for screen readers when native elements aren't enough.
> `role="tablist"`, `aria-selected`, `aria-controls` on our sidebar tabs — a `<button>` styled as a tab needs these.

**Q: What is roving tabindex?**
A: Only one element in a group is in tab order (`tabIndex=0`) at a time. Arrow keys move focus between them. Used for menus, tabs, toolbars.
> Our `Sidebar` — active tab is `tabIndex=0`, all others are `tabIndex=-1`. Arrow Up/Down moves between them.

**Q: What is a focus trap?**
A: Keeping keyboard focus inside a modal while it's open so Tab doesn't escape to background content.
> `PaymentModal` focuses the close button on open. A full trap would also intercept Tab/Shift+Tab.

---

## TypeScript

**Q: interface vs type?**
A: Both define shapes. `interface` is extendable (can `extend` or `implements`). `type` can be a union/intersection.
> `interface Policy { id: string; ... }` for object shapes. `type Division = 'GL' | 'AI' | ...` for unions.

**Q: What is a union type?**
A: A value that can be one of several specific types.
> `type PaymentStatus = 'idle' | 'processing' | 'success' | 'error'` — only these 4 strings are valid.

**Q: What is a generic?**
A: A placeholder type that gets filled in when used.
> `PayloadAction<string>` — the action payload is typed as string. `PayloadAction<boolean>` — payload is boolean.

---

## Topics Still to Add

- [ ] useMemo — memoize expensive calculations
- [ ] useCallback — memoize functions passed as props
- [ ] React.memo — prevent re-render if props unchanged
- [ ] Context API vs Redux
- [ ] Virtual DOM & reconciliation
- [ ] Keys in lists — why they matter
- [ ] Error boundaries
- [ ] Lazy loading / React.lazy / Suspense
- [ ] React 18 — Concurrent Mode, automatic batching
- [ ] Jest + RTL — Phase 4
- [ ] Storybook — Phase 4

---

*Updated: Phase 3 — Redux, Hooks, Axios, Router, a11y, TypeScript*
