# Context

This document captures the ubiquitous language and domain model for the application.

## Core Entities & Vocabulary

### Roles
- **Admin**: Has full access. Can toggle their default UI to act as either an Admin (god-mode) or a Staff member upon signing in.
- **Staff**: Belongs to a department. Creates logbooks, creates appointments, broadcasts announcements, and can lock their device into Kiosk Mode.
- **Student**: Automatically subscribed to all published, public departments. Uses a read-only or interaction-limited UI on their own device to view announcements and manage appointments.

### Digital Logbook
- **Logbook**: A dynamic form configured by Staff or Admins (using presets or a custom form builder, with future AI-generation support) to capture data.
- **Kiosk Mode**: A locked-down state on a Staff/Guard device that strictly displays a specific Logbook form. Used when the Staff hands the tablet/keyboard to a Student or Guest to enter data.
- **Temporary Pass**: A digital record created when a Guest or Student (who forgot their ID) fills out the guardhouse Logbook. It is synced across the system so guards at other gates can verify the pass via tablet search, eliminating the need for physical receipt printers.

### Task & Requirement Tracking
- **Appointment / Requirement**: A scheduled interaction or deadline created by a Staff member for a Student.
- **Slot Management**: Staff can open slots and mark them as unavailable, done, or cancelled. 
- **Student Interaction**: Students do not arbitrarily create appointments from scratch. They receive appointments and can **RSVP, Request a Reschedule, or Cancel**, feeding status updates back to the Staff to free up time slots.

### Departments & Announcements
- **Department**: An organizational unit that Staff belong to.
- **Announcement**: Broadcast messages sent by Staff to their Department's subscribers.
- **Subscription**: Students are automatically subscribed to all published, public Departments.
