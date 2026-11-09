# Project Structure

This document outlines the directory structure of StreamCoin and defines the purpose of each file and module.

## Directory Overview

```text
StreamCoin/
├── .agents/                    # Agent skills and configurations (e.g., antislop filter)
├── .cline/                     # Cline agent settings and local skills
├── .opencode/                  # OpenCode agent settings and local skills
├── api/                        # Low-level external API integration
│   └── agents/                 # Direct HTTP client wrappers for third-party services
│       └── coingeckoAgent.ts   # CoinGecko REST client with caching headers
├── app/                        # Next.js 16 App Router pages, layouts, and styles
│   ├── coin/                   # Coin detail page route (/coin)
│   │   └── page.tsx            # Market snapshot and chart placeholder
│   ├── profile/                # User profile route (/profile)
│   │   └── page.tsx            # Account overview and portfolio placeholder
│   ├── settings/               # Preferences route (/settings)
│   │   └── page.tsx            # Display and data refresh configuration
│   ├── favicon.ico             # App icon
│   ├── globals.css             # Tailwind v4 directives and CSS theme variables
│   ├── layout.tsx              # Root HTML shell, fonts (Geist), Navbar, Providers
│   ├── page.tsx                # Home page mounting the CryptoMarketOverview
│   └── providers.tsx           # Client providers (Redux Provider + QueryClientProvider)
├── components/                 # React UI components
│   ├── ui/                     # Reusable design primitives (shadcn/ui & Radix UI)
│   │   ├── avatar.tsx          # User avatar element
│   │   ├── badge.tsx           # Metric pill badges for positive/negative changes
│   │   ├── button-group.tsx    # Button grouping layout
│   │   ├── button.tsx          # Configurable button with CVA variants
│   │   ├── card.tsx            # Card containers with header, content, and description
│   │   ├── dropdown-menu.tsx   # Radix dropdown menu used in account navigation
│   │   ├── field.tsx           # Form field wrappers
│   │   ├── input.tsx           # Styled text input for search queries
│   │   ├── label.tsx           # Accessible form label
│   │   ├── separator.tsx       # Visual dividing lines
│   │   ├── skeleton.tsx        # Skeleton loaders for table rows and cards
│   │   └── table.tsx           # Data table primitives (Table, TableHeader, TableRow, TableCell)
│   ├── CryptoMarketOverview.tsx# Primary market screener card, table, and search bar
│   ├── Navbar.tsx              # Sticky header navigation with links and account menu
│   └── sparkline-cell.tsx      # SVG mini sparkline renderer for 7-day price trends
├── context/                    # AI Agent knowledge base and project context
│   ├── README.md               # Context directory index and AI guidelines
│   ├── architecture.md         # System design and data flow patterns
│   ├── conventions.md          # Coding standards and development practices
│   ├── philosophy.md           # Engineering principles and product vision
│   ├── roadmap.md              # Feature status and future milestones
│   ├── structure.md            # This document: directory breakdown
│   └── tech-stack.md           # Technology stack and tooling details
├── hooks/                      # Custom React hooks
│   └── useCryptoMarketOverview.ts # State hook for market data, infinite query, sorting, and search
├── lib/                        # Utility functions and shared helpers
│   ├── coingecko.ts            # Currency and compact number formatting functions
│   └── utils.ts                # Class name merger (`cn` utility combining clsx and twMerge)
├── public/                     # Static public assets (SVGs and icons)
├── services/                   # Business logic layer isolating APIs from UI hooks
│   └── coinService.ts          # Market coin retrieval abstraction
├── store/                      # Client-side UI state management via Redux Toolkit
│   ├── hooks.ts                # Typed Redux hooks (`useAppDispatch`, `useAppSelector`)
│   ├── marketSlice.ts          # Market UI slice (search query, sortBy, sortDirection)
│   └── store.ts                # Root Redux store configuration
├── AGENTS.md                   # Universal instructions and rules for AI coding assistants
├── components.json             # shadcn/ui configuration file
├── docker-compose.yml          # Container configuration for local or production runs
├── Dockerfile                  # Multi-stage production Docker build (Node 25 Alpine)
├── eslint.config.mjs           # Next.js and React ESLint rules
├── next.config.ts              # Next.js runtime config (image remote patterns for CoinGecko)
├── package.json                # Project dependencies, scripts, and metadata
├── pnpm-lock.yaml              # Exact dependency lockfile for pnpm
├── pnpm-workspace.yaml         # pnpm workspace configuration
├── postcss.config.mjs          # PostCSS configuration for Tailwind CSS v4
├── README.md                   # Repository overview and standard Next.js getting started
├── tsconfig.json               # TypeScript compiler options and path aliases (@/*)
└── type.d.ts                   # Core domain TypeScript interfaces (Coin, sparkline types)
```

## Detailed File Roles

### Root Configuration
- `package.json`: Configures scripts (`dev`, `build`, `start`, `lint`) and packages. Uses React 19, Next.js 16, Redux Toolkit, and TanStack Query.
- `next.config.ts`: Whitelists CoinGecko image domains (`assets.coingecko.com` and `coin-images.coingecko.com`) for Next.js `<Image />` optimization.
- `Dockerfile`: Multi-stage Alpine build using standalone Next.js server output for minimal image size.
- `type.d.ts`: Defines the central `Coin` interface, including prices, percentages, market cap, supply, volume, and sparkline array.

### Presentation & Routing (`app/`)
- `app/layout.tsx`: Root layout loaded for all pages. Loads Geist and Geist Mono variable fonts, applies base background styling, injects `Navbar`, and wraps children in `Providers`.
- `app/providers.tsx`: Combines `Provider` from `react-redux` and `QueryClientProvider` from `@tanstack/react-query`. Ensures client-side state is available across all client components.
- `app/page.tsx`: Landing page rendering the main `CryptoMarketOverview` table.
- `app/coin/page.tsx`: Dedicated coin overview page (currently a structured draft view to be expanded with dynamic coin routes).
- `app/profile/page.tsx`: Account and user watchlist placeholder.
- `app/settings/page.tsx`: Preference settings for display options and data refresh intervals.

### Data Layer (`api/` and `services/`)
- `api/agents/coingeckoAgent.ts`: Low-level HTTP client executing queries against `https://api.coingecko.com/api/v3`. Sets search parameters, revalidation headers (`next: { revalidate: 60 }`), and response checks.
- `services/coinService.ts`: Intermediate service layer. Provides clean asynchronous methods like `getMarketCoins(page, perPage)` consumed by React Query hooks.

### State Management (`store/`)
- `store/marketSlice.ts`: Defines `MarketState` (`search`, `sortBy`, `sortDirection`) and actions (`setSearch`, `setSortBy`, `toggleSortDirection`, `setSortDirection`).
- `store/store.ts`: Instantiates the Redux store with `marketReducer` and exports `RootState` and `AppDispatch` types.
- `store/hooks.ts`: Exports typed selectors and dispatchers for React components.

### Domain Hooks (`hooks/`)
- `hooks/useCryptoMarketOverview.ts`: Connects React Query infinite scroll with Redux state. Manages query keys, page parameters, intersection observers for lazy loading, search filtering, and multi-column sorting.

