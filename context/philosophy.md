# Engineering Philosophy and Principles

This document outlines the core values, architectural philosophy, and user experience standards that guide the development of StreamCoin.

## Core Philosophy

### 1. Clear Separation of Concerns
Every module in StreamCoin has a single, well-defined responsibility:
- **Agents** speak HTTP to third parties.
- **Services** provide business interfaces.
- **Store** holds user-driven client UI state.
- **Hooks** coordinate data and domain logic.
- **Components** render the UI and capture user actions.

No layer should bypass its neighbor. Components never make raw network requests. Business services never touch the DOM or Redux state.

### 2. Predictable State Boundaries
Do not mix server cache with client UI state.
- External server data belongs in TanStack React Query. It is asynchronous, subject to network latency, requires revalidation, and can fail.
- User interface state belongs in Redux Toolkit. It is synchronous, immediate, local to the user session, and represents user intent (such as typing a search query or clicking a sort header).
Keeping these distinct prevents cache-invalidation bugs and reduces boilerplate.

### 3. Resilient User Experience
Real-time financial interfaces must handle unpredictable network conditions gracefully:
- **Skeleton Loaders over Generic Spinners:** Instead of a single jarring loading spinner, StreamCoin renders layout-matching skeleton rows (`TableSkeleton`) so the page structure remains stable while loading.
- **Three Core States for Data Displays:** Every data view must implement an empty state, a loading state, and a clear error state with recovery options (e.g., a manual refresh button).
- **Graceful Degradation:** If optional data is missing (such as missing 7-day sparklines), the UI handles `undefined` values without crashing or displaying broken layout elements.

### 4. Performance and Data Efficiency
Cryptocurrency screeners can easily overwhelm the client with high-frequency updates and heavy DOM nodes:
- **Paginated Infinite Scroll:** StreamCoin uses batch fetching with IntersectionObserver to avoid rendering hundreds of table rows at once.
- **Memoized Filtering:** In-memory searching and sorting is wrapped in `useMemo` so that table re-renders only recalculate when dependencies change.
- **Lightweight SVG Sparklines:** Price trend graphs use minimal SVG paths rather than heavyweight canvas chart libraries, keeping bundle size low and scrolling smooth.
- **Image Optimization:** Remote CoinGecko images are loaded through Next.js `<Image />` with configured domain patterns for automatic resizing and caching.

### 5. Accessible and Purposeful Design
StreamCoin prioritizes clarity and legibility over decorative excess:
- **High Contrast:** Key figures like current price, market cap, and percentage changes use distinct contrast ratios for clear readability.
- **Intuitive Visual Hierarchy:** Primary coin identity (icon, symbol, name) is prioritized on the left, key financial metrics align to the right, and 24-hour gains/losses use explicit color coding (+ green / - destructive red).
- **Keyboard and Focus Support:** Interactive elements, including table headers, search inputs, and dropdown triggers, maintain accessible focus states and keyboard navigation.

### 6. Strict Type Safety
TypeScript is not an afterthought in StreamCoin. All domain objects, API payloads, store actions, and custom hooks have explicit typings. Avoid using `any` or loose type assertions. When new API properties are consumed, add them to `type.d.ts` to ensure consistency across the entire codebase.

