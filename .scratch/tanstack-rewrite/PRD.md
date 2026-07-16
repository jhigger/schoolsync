# PRD: TanStack Start Rewrite (SchoolSync)

## Objective
Rewrite the `index.html` SchoolSync prototype into a modern, component-driven architecture using TanStack Start, React, Tailwind CSS, and shadcn/ui. This migration will establish clean boundaries (seams), drastically reduce the AI context window per task, and utilize industry-standard tools for styling and routing.

## Tech Stack
- **Framework**: TanStack Start (React)
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui (Radix primitives)
- **Icons**: Lucide React
- **Package Manager**: pnpm

## Architecture & Layouts
The app consists of two primary layouts:
1. **Public Layout**: Bare layout for the Sign-In screen.
2. **App Shell Layout**: The main authenticated shell featuring:
   - Left Sidebar (responsive: moves to bottom tab bar on `< 768px`)
   - Top Header (Title, freshness indicator, help toggle)
   - Main Content Area

## Routes (TanStack Start File-Based Routing)
- `/` (Redirects to `/signin` if unauthenticated, otherwise `/dashboard`)
- `/signin` - The login screen
- `/_app` (Layout route for the authenticated shell)
  - `/_app/dashboard` - Hero tasks, summary strips, quick activity feed
  - `/_app/activity` - Searchable, filterable event log
  - `/_app/devices` - Room list and device status grids
  - `/_app/alerts` - System alerts and threshold configuration
  - `/_app/settings` - User preferences, Dark Mode, Simple/Detailed mode

## Global State / Context
- **Theme**: Dark/Light mode toggle
- **App Mode**: Simple / Detailed view toggle (hides/shows advanced technical data)
- **Auth**: Simple mock authentication state to gate the `/_app` routes.

## Components (shadcn/ui to install)
- `Button`, `Card`, `Badge`, `Input`, `Select`, `Tabs`, `Switch`, `Avatar`

## Phased Approach (Tracer Bullet Implementation)
We will build this vertically, starting with the outer shell and moving inwards route by route to ensure a tight feedback loop without long integration phases.
