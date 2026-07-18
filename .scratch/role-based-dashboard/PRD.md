Status: ready-for-agent

## Problem Statement

The application currently lacks distinct interfaces and capabilities based on user roles (Admin, Staff, Student). Staff need tools to record interactions and schedule tasks, Admins need system-wide oversight, and Students need an easy way to view requirements and appointments without being overwhelmed by administrative tools. Additionally, guardhouses and offices need a reliable, paperless way to log visitors and issue temporary passes.

## Solution

Implement a role-based dashboard system where UI/UX is strictly tailored to the user's role:
- **Admin**: Has access to all features, with a toggle to switch between a standard Staff view and "God-Mode".
- **Staff / Guards**: Can create dynamic digital logbooks, lock their device into Kiosk Mode for safe student/guest data entry, broadcast announcements to their department, and assign appointments/requirements to students.
- **Student**: Has a focused, interaction-limited view (auto-subscribed to public departments) for viewing announcements and appointments, with the ability to RSVP, reschedule, or cancel.
- **Guest / Temporary Pass**: Guards use the Staff logbook in Kiosk Mode to generate digital temporary passes that are searchable across gates.

## User Stories

1. As an Admin, I want to toggle my view between Staff and Admin modes, so that I can experience the app exactly as my staff does or switch to global management.
2. As a Staff member, I want to create a dynamic logbook with custom fields, so that I can collect specific information (like reasons for temporary passes or ID numbers) based on my office's needs.
3. As a Staff member, I want to lock my tablet into Kiosk Mode, so that a student or guest can fill out the logbook without accessing my dashboard or seeing other students' private data.
4. As a Staff member, I want to schedule an appointment or requirement for a student, so that they have a clear deadline and reminder to return.
5. As a Staff member, I want to broadcast announcements to my department, so that all subscribed students receive the information.
6. As a Staff member, I want to see if a student has RSVP'd or cancelled their appointment, so that I can efficiently manage my time and open slots for others.
7. As a Guard (Staff), I want to issue a digital temporary pass to a guest or student who forgot their ID, so that they can enter the campus.
8. As a Guard (Staff), I want to search for a name on my tablet to verify a temporary pass, so that I don't have to rely on physical receipt printers.
9. As a Student, I want my UI to hide all logbook creation and admin settings, so that I am not distracted or confused by features I cannot use.
10. As a Student, I want to be automatically subscribed to public departments, so that I receive all relevant campus announcements.
11. As a Student, I want to view a list of my scheduled requirements/appointments, so that I don't forget to submit documents or attend meetings.
12. As a Student, I want to RSVP, cancel, or request a reschedule for an appointment, so that I can communicate my availability to the Staff.

## Implementation Decisions

- The UI navigation and layout components will use conditional rendering based on the authenticated user's role.
- Dynamic Logbooks will be powered by a form builder schema (e.g., JSON representation of fields) to support both preset templates and custom text fields.
- Kiosk Mode will require a client-side route lock that hides navigation bars. Exiting Kiosk Mode will require a Staff PIN/password to prevent students from escaping the form.
- The Temporary Pass system will be completely digital and cloud-synced, removing the need for thermal printers. Verification happens via a global search query on the Staff/Guard dashboard.
- Students will have a dedicated read-only/interaction-limited dashboard route for viewing appointments and announcements. They cannot create appointments from scratch.

## Testing Decisions

- We will test the feature at the React component level using `@testing-library/react` and `vitest` (similar to existing tests like `_app.activity.test.tsx`).
- Good tests will focus on external behavior: simulating role switching by mocking the authentication store/context and asserting that navigation elements are either hidden or present.
- Kiosk Mode tests will ensure the UI removes all escape paths (back buttons, nav bars) when active.
- Data fetching (like fetching appointments or logbook configurations) will be mocked to verify the UI state transitions without needing a backend.

## Out of Scope

- AI generation of Logbook forms (this is planned for a future release).
- Physical printing integration (explicitly replaced by digital search).
- Complex student-initiated booking flows (Staff always initiates the appointment/requirement).

## Further Notes

- The domain vocabulary for this feature is strictly defined in `CONTEXT.md` at the root of the repository.
