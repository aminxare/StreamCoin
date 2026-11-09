# Technology Stack

This document details the libraries, runtime tools, build configurations, and third-party services powering StreamCoin.

## Core Framework and Runtime

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 25-alpine (Docker) / 20+ | Runtime environment |
| **Next.js** | 16.1.6 | App Router, Server/Client components, asset optimization, standalone production server |
| **React** | 19.2.3 | UI library with latest concurrent rendering and hook capabilities |
| **TypeScript** | ^5.0.0 | Static type safety and developer tooling |
| **pnpm** | Workspace-ready | Fast, disk-efficient package management |

## State Management and Data Fetching

| Library | Version | Purpose |
|---------|---------|---------|
| **@tanstack/react-query** | ^5.0.0 | Server-state caching, automatic revalidation, infinite queries, and deduplication |
| **@reduxjs/toolkit** | ^1.9.5 | Client UI state management, immutable state updates via slices |
| **react-redux** | ^8.1.1 | React bindings for Redux with typed hooks (`useAppDispatch`, `useAppSelector`) |

## Styling and UI Components

| Library | Version | Purpose |
|---------|---------|---------|
| **Tailwind CSS** | ^4.0.0 | Utility-first styling via `@tailwindcss/postcss` and native CSS theme variables |
| **shadcn/ui** | ^3.8.5 | Component architectural pattern configured via `components.json` |
| **radix-ui** | ^1.4.3 | Accessible, unstyled headless primitives (DropdownMenu, Slot, etc.) |
| **lucide-react** | ^0.575.0 | Consistent iconography for navigation, settings, user profiles, and actions |
| **class-variance-authority** | ^0.7.1 | Declarative variant configuration for components (CVA) |
| **clsx & tailwind-merge** | Latest | Safe class name concatenation and Tailwind conflict resolution (`cn` utility) |
| **tw-animate-css** | ^1.4.0 | Animation utilities for smooth transitions and dropdowns |

## Data Visualization and Utilities

| Library / Tool | Purpose |
|----------------|---------|
| **react-sparklines** | Lightweight SVG rendering for 7-day price movement trends |
| **CoinGecko API (v3)** | REST provider for crypto prices, market caps, 24h volume, and 7-day sparkline arrays |
| **Geist & Geist Mono** | Variable typography optimized via `next/font/google` |

## Containerization and Deployment

- **Dockerfile:** Multi-stage build leveraging `node:25-alpine`.
  - Stage 1 (Builder): Installs dependencies with `pnpm`, builds Next.js with `output: 'standalone'`.
  - Stage 2 (Production): Runs minimal production image with a dedicated non-root `nextjs` user.
- **docker-compose.yml:** Standard container orchestration exposing port 3000, setting `NODE_ENV=production`, and defining health checks (`/api/health`).

