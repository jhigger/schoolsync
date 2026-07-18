Status: ready-for-agent

## Parent
[PRD](../PRD.md)

## What to build
Implement the core `UserSession` store with roles (Admin, Staff, Student). Update the main `AppShell` layout to conditionally hide/show navigation links based on the active role. Add a development toggle button in the UI for Admins to switch their view instantly between Admin, Staff, and Student for testing.

## Acceptance criteria
- [ ] Zustand/store contains user role state.
- [ ] `AppShell` navigation updates dynamically when the role changes.
- [ ] A mock toggle button exists for easy role switching during development.

## Blocked by
None - can start immediately
