# Coding Conventions and Best Practices

This document outlines the coding standards, file organization patterns, and best practices expected when contributing to StreamCoin.

## File and Component Naming

- **React Components:** PascalCase matching the file name (e.g., `CryptoMarketOverview.tsx`, `Navbar.tsx`).
- **Hook Files:** camelCase prefixed with `use` (e.g., `useCryptoMarketOverview.ts`).
- **Utility / Service / Agent Files:** camelCase (e.g., `coinService.ts`, `coingeckoAgent.ts`, `utils.ts`).
- **Type Definitions:** Keep shared interfaces in `type.d.ts` or co-located `.types.ts` files for feature-specific interfaces.
- **Route Segments:** lowercase directory names under `app/` (e.g., `app/coin/page.tsx`, `app/settings/page.tsx`).

## Architectural Conventions

### 1. Adding a New External API Integration
Never fetch data directly within a UI component. Follow this sequence:
1. **Define Types:** Add request/response interfaces to `type.d.ts`.
2. **Implement Agent:** Add a method in `api/agents/` (e.g., `coingeckoAgent.ts`) using the standard `fetch` API, query parameter formatting, and error handling.
3. **Expose Service:** Add the corresponding method in `services/` (e.g., `coinService.ts`).
4. **Create or Update Hook:** Wrap the service call with `useQuery` or `useInfiniteQuery` in a custom hook inside `hooks/`.
5. **Consume in Component:** Use the hook in your presentation component.

### 2. State Management Rules
- **Server Data:** Always use TanStack React Query. Define query keys as constant tuples (e.g., `['coins']`, `['coin', coinId]`). Set realistic `staleTime` and `refetchInterval` values to prevent API rate-limiting.
- **Client UI State:** Use Redux Toolkit when state is shared or persisted across multiple components. For purely local component state (like toggling an accordion or open modal), standard `useState` is preferred.
- **Avoid setState in Effects:** In React 19, avoid calling `setState` synchronously within a `useEffect` body to prevent cascading renders. Prefer calculating derived state during render or updating state inside event handlers.

### 3. Styling and UI Standards
- **Use the `cn` Helper:** Combine Tailwind utility classes using `cn()` from `@/lib/utils` to avoid class collisions.
- **Responsive by Default:** Ensure all tables have horizontal overflow protection (`overflow-x-auto`) and mobile layouts do not cause page-level horizontal scroll.
- **Accessibility:**
  - All interactive icons must have accessible labels (`aria-label` or surrounding visually hidden text).
  - Use native `<button>` or `<Link>` elements for clickable controls. Never assign click handlers to arbitrary `<div>` elements without role and keyboard listeners.
  - Preserve visible focus indicators for keyboard navigation.

### 4. Financial Metric Formatting
Always use the centralized formatting utilities in `lib/coingecko.ts`:
- **Currency:** Use `formatCurrency(val, compact)` for dollar values. When `compact = true`, it formats large numbers as `$1.24T`, `$850.20B`, or `$12.50M`.
- **Numbers:** Use `formatNumber(val, compact)` for supplies, counts, or non-currency quantities.
- **Percentages:** Format with fixed precision (e.g., `val.toFixed(2)%`) and color-code using badge variants or conditional text classes (green for positive, destructive red for negative).

### 5. Quality Assurance Checklist
Before committing changes, run:
```bash
# Type check and lint
pnpm lint

# Build production bundle
pnpm build
```
Verify that:
- No unused variables or imports remain.
- No TypeScript warnings or `any` bypasses are introduced.
- Interactive elements function with keyboard navigation.

