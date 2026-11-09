# StreamCoin Agent Context

Welcome to the StreamCoin knowledge base for AI agents and developers. This directory contains comprehensive documentation detailing the architecture, project structure, design philosophy, conventions, and technical stack of StreamCoin.

## Quick Project Summary

- **Project Name:** StreamCoin
- **Author:** AminXare
- **Repository:** https://github.com/AminXare/StreamCoin
- **Description:** Real-time cryptocurrency market screener and dashboard
- **Primary Framework:** Next.js 16 (App Router) with React 19 and TypeScript
- **Styling:** Tailwind CSS v4 with Radix UI and shadcn/ui components
- **State Management:** Hybrid architecture using TanStack React Query v5 (server data) and Redux Toolkit (client UI state)

## Context Navigation

Read the following documents to understand specific aspects of the codebase:

1. [Structure](file:///home/amin/projects/StreamCoin/context/structure.md)
   Complete directory tree, file responsibilities, and routing structure.
2. [Architecture](file:///home/amin/projects/StreamCoin/context/architecture.md)
   Data flow, separation of concerns, and the division between server and client state.
3. [Philosophy](file:///home/amin/projects/StreamCoin/context/philosophy.md)
   Core engineering principles, UX standards, and performance goals.
4. [Tech Stack](file:///home/amin/projects/StreamCoin/context/tech-stack.md)
   Libraries, dependencies, package manager, and build/deploy setup.
5. [Conventions](file:///home/amin/projects/StreamCoin/context/conventions.md)
   Coding standards, component guidelines, naming patterns, and best practices.
6. [Roadmap](file:///home/amin/projects/StreamCoin/context/roadmap.md)
   Current implementation status, placeholder pages, and upcoming features.

## Instructions for AI Agents

When working on this repository, follow these rules:

1. **Check Existing Patterns First:** Before adding components or services, review `context/architecture.md` and `context/conventions.md`.
2. **Preserve State Boundaries:** Never store raw server market data in Redux; use TanStack React Query for caching and server queries. Keep Redux focused on synchronous UI state (search filters, sorting keys, display options).
3. **Respect Separation of Concerns:** Route all API requests through `api/agents/` and expose them via `services/`. Do not invoke external `fetch` calls directly inside React components.
4. **Use Established UI Components:** Prefer components in `components/ui/` (shadcn/ui primitives) and utility functions in `lib/utils.ts` (`cn`).
5. **Keep Accessibility and Responsiveness First:** Ensure proper ARIA attributes, semantic HTML tags, keyboard navigation, and responsive mobile layouts without horizontal scroll.

