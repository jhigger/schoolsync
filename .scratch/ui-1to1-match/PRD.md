Status: ready-for-agent

## Problem Statement

The user has a monolithic, 94kb `index.html` prototype of "SchoolSync" which contains a fully fleshed out UI/UX using custom CSS classes modeled after Shadcn zinc tokens. A rewrite into a modern TanStack (Router, Query, Table) + React + Shadcn stack has begun, but the current React implementation lacks the polish, precise styling, and 1:1 structural fidelity of the original HTML. The goal is to perfectly replicate the look, feel, and content structure of the original prototype, but built upon an industry-standard, typesafe foundation.

## Solution

We will execute a 1:1 UI/UX match by translating the original custom CSS and HTML structure into idiomatic Tailwind CSS utility classes and Shadcn components. To support the interactive elements of the UI without a real backend, we will extract hardcoded data into strictly typed TypeScript mock data files and use TanStack Query with simulated async delays to fetch it. Global states—such as the active Mock Auth Role, Dark/Light Theme, and Simple/Detailed Mode—will be managed via a typesafe Zustand store. Tabular data will be rendered using TanStack Table, and the app shell will leverage a custom `<aside>` sidebar to perfectly replicate the original navigation.

## User Stories

1. As a user, I want the Sign-In page to display three buttons (Admin, Staff, Student) so that I can mock-authenticate into different roles.
2. As a user, I want the App Shell to use a custom Tailwind <aside> Sidebar for navigation that perfectly replicates the 1:1 look and feel of the original HTML, so that I can easily move between the Dashboard, Activity Log, Rooms & Devices, Alerts, and Settings.
3. As a user, I want the App Shell sidebar to gracefully handle mobile layouts so that the app remains usable on smaller screens.
4. As a user, I want to toggle a "Simple/Detailed" mode from the settings or header so that advanced technical data is hidden when I don't need it, exactly matching the original HTML behavior.
5. As a user, I want to toggle between light and dark themes so that the app matches my system preference or environment.
6. As a user, I want to see loading states (skeletons) when navigating to a new route so that I know data is being fetched.
7. As a user viewing the Dashboard, I want to see the summary cards, alert strips, and a quick feed so that I get a high-level overview of the system's status.
8. As a user viewing the Activity Log, I want to see a fully structured, typesafe table (via TanStack Table) containing the event logs so that the presentation matches the original HTML's detailed view.
9. As a user viewing the Rooms & Devices page, I want to see grid layouts of devices with correct status badges (success, warning, destructive) so that the visual hierarchy matches the original design.
10. As a user viewing the Alerts page, I want to see system alerts and thresholds styled exactly like the original prototype.
11. As a developer, I want all mock data to be strictly typed and fetched via TanStack Query so that the codebase is completely typesafe and ready for a real backend in the future.

## Implementation Decisions

- **Styling translation**: We will not port the raw CSS classes (e.g., `.btn-primary`) from `index.html`. Instead, we will map them to the equivalent Shadcn component variants and Tailwind utility classes to maintain idiomatic code.
- **Global State**: We will use Zustand to manage the `authRole`, `theme`, and `viewMode` (Simple vs. Detailed).
- **Mock Data Layer**: Hardcoded HTML data will be extracted into a `lib/mockData.ts` (or similar) file. We will write mock API functions that return this data wrapped in a `setTimeout` to simulate network latency.
- **Data Fetching**: We will use TanStack Query to call the mock API functions. This enforces proper loading/error state handling via Shadcn skeletons.
- **Tables**: We will use TanStack Table for complex lists/tables (like the Activity Log).
- **Layout**: We will use a custom Tailwind `<aside>` layout for the primary app shell navigation to ensure a perfect 1:1 match with the original prototype (pivoting away from Shadcn's `Sidebar` component).

## Testing Decisions

- **What makes a good test**: Tests will focus purely on external behavior and visual structural rendering, not the internal Tailwind classes used. For example, we test that clicking the "Detailed Mode" button causes the detailed stats to appear in the document.
- **Seams**: The primary testing seam will be at the **Route/Page Level**. 
- **Modules tested**: `<DashboardRoute />`, `<ActivityLogRoute />`, `<DevicesRoute />`, `<AlertsRoute />`, `<SettingsRoute />`, and the `<AppShell />` layout.
- **Prior Art**: We will wrap the rendered route in a Test Provider that supplies a fresh Zustand store and a mock TanStack Query client to ensure tests are isolated and don't share state.

## Out of Scope

- Implementing a real authentication backend or real database connections.
- Pixel-perfect CSS replication if it strictly violates Shadcn's design system—we will prioritize "soul and content" over exact pixel values.
- Writing E2E tests via Playwright/Cypress (we will stick to Integration tests at the Route seam).

## Further Notes

- The original `index.html` is 94kb of pure markup. The effort to extract the data will be significant, so breaking this down by route (Dashboard, Activity Log, etc.) in the next phase (`/to-tickets`) is critical.
