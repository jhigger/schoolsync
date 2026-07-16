# 03 — Dashboard UI & Mock Data Foundation

**What to build:** Sets up the TanStack Query provider and the `mockData.ts` typed data layer. It fully builds the 1:1 styled Dashboard route (summary cards, feed, alert strips) consuming this simulated async data with proper Shadcn loading skeletons.

**Blocked by:** 02 — App Shell Layout (Sidebar & Header)

**Status:** ready-for-agent

- [ ] `lib/mockData.ts` is created with strictly typed TypeScript interfaces for dashboard data.
- [ ] TanStack Query is configured with simulated async delays (e.g., `setTimeout`).
- [ ] Dashboard route styling perfectly matches the original HTML (summary strips, alerts, cards).
- [ ] Loading states display Shadcn skeleton loaders while fetching data.
