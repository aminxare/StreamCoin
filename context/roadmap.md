# Project Roadmap and Feature Status

This document tracks the current state of StreamCoin, notes active placeholders, and outlines planned features and improvements.

## Current Implementation Status

### Completed Features
- **Live Market Screener:** Paginated table displaying top market cap coins from CoinGecko v3 with prices, 24-hour changes, market caps, and volume metrics.
- **Client Search & Sorting:** Real-time client-side search by coin name or ticker symbol, with multi-column sorting (ascending and descending) powered by Redux Toolkit.
- **Infinite Scrolling:** Dynamic data pagination using TanStack React Query's `useInfiniteQuery` coupled with an `IntersectionObserver` sentinel.
- **Sparkline Previews:** SVG-based 7-day price trajectory graphs rendered via `react-sparklines`.
- **Skeleton Loading:** Custom table skeleton UI mirroring the live table to prevent layout shifts during fetches.
- **Navigation Shell:** Responsive sticky navigation bar with route links and account dropdown menu.
- **Containerization:** Multi-stage Dockerfile and docker-compose deployment configuration.

---

## Active Placeholders and In-Progress Routes

The following routes currently present structural UI drafts awaiting backend or deep-dive feature integration:

### 1. `/coin` Route (`app/coin/page.tsx`)
- **Current State:** Displays a static Bitcoin snapshot and a placeholder container for future charting.
- **Planned Target:** Convert into a dynamic route (`app/coin/[id]/page.tsx`):
  - Accept dynamic coin parameters (e.g., `/coin/bitcoin`, `/coin/ethereum`).
  - Fetch detailed coin profile and market data via CoinGecko.
  - Interactive price charts with timeframes (24h, 7d, 30d, 1y, All).
  - Extended metrics: All-time high (ATH), circulating vs total supply, volume-to-market-cap ratio.

### 2. `/profile` Route (`app/profile/page.tsx`)
- **Current State:** Displays placeholder account card with a guest user profile and an empty watchlist activity section.
- **Planned Target:**
  - Personalized coin watchlist: ability to "star" coins on the main table and view them on the profile page.
  - Portfolio tracker: track holding amounts, buy prices, and calculated profit/loss.
  - Local storage or database persistence for user holdings.

### 3. `/settings` Route (`app/settings/page.tsx`)
- **Current State:** Outlines preference sections for display themes and data intervals.
- **Planned Target:**
  - Functional Theme Toggle: Switch between Light, Dark, and System themes.
  - Currency Selector: Switch base currency from USD to EUR, GBP, JPY, or BTC.
  - Refresh Rate Controls: Customize market poll interval (e.g., 30s, 60s, 5m, or manual only).
  - Table Column Customizer: Show or hide specific columns (e.g., sparklines, volume).

---

## Technical Debt and Maintenance

1. **CoinGecko Rate Limiting:** The public CoinGecko API enforces strict rate limits. Adding support for optional API keys (`NEXT_PUBLIC_COINGECKO_API_KEY` or server-side proxying) will prevent HTTP 429 errors.
2. **Health Check Endpoint:** Add `app/api/health/route.ts` to satisfy the Docker Compose healthcheck spider probe (`http://localhost:3000/api/health`).
3. **Lint Notice Cleanup:**
   - In `hooks/useCryptoMarketOverview.ts`, refactor the `lastUpdated` timestamp logic away from synchronous `setState` in `useEffect` to satisfy the React 19 compiler rules.
   - In `lib/coingecko.ts`, remove the unused `Coin` import.

