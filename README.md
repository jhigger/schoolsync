# SchoolSync

School Activity Logbook & Device Management UI.

This project is a React-based application that simulates a robust UI/UX for school staff, teachers, and admins to manage devices and activity logs.

## Architecture

We recently migrated from a monolithic 94kb `index.html` prototype to a modern, typesafe stack:
- **Framework**: React with [TanStack Start](https://tanstack.com/router/latest) for robust routing.
- **Styling**: Tailwind CSS combined with [shadcn/ui](https://ui.shadcn.com/) components to ensure a pixel-perfect 1:1 match with the original custom CSS design system.
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) for global preferences like Dark/Light Mode, Simple/Detailed Views, and mock Auth Roles.
- **Data Layer**: Mock API fetching via [TanStack Query](https://tanstack.com/query/latest) against strongly typed dummy data in `src/lib/mockData.ts`.
- **Tables**: [TanStack Table](https://tanstack.com/table/latest) for complex, sortable lists like the Activity Log.

## Features
- **Dashboard**: Quick overview of tasks, issues, and system health.
- **Activity Log**: Detailed feed of all school events and alerts, filterable by room or event type.
- **Rooms & Devices**: Manage and monitor devices across different rooms with success/warning/destructive status badges.
- **Alerts**: Real-time mock notifications with acknowledgment tracking.
- **Settings**: Customizable user preferences including text scaling and UI density.

## Development

This project uses [Vite](https://vitejs.dev/) for lightning-fast hot module replacement.

### Prerequisites
- Node.js
- pnpm

### Getting Started

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Start the development server:
   ```bash
   pnpm dev
   ```

3. Open your browser to `http://localhost:5173/`.
