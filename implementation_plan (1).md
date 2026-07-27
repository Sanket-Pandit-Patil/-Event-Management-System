# Implementation Plan - Event Management System with Multi-Timezone Support

Build a full-stack MERN application for managing events across multiple user profiles and timezones, adhering strictly to the assignment specifications, design snapshots, and bonus requirements.

## User Review Required

> [!IMPORTANT]
> - **Tech Stack & Libraries**: Frontend will use **Vite + React (JavaScript/JSX)** with **Vanilla CSS**, **Zustand** for state management (required by the assignment spec — profile store, event store, view-timezone store), and **DayJS** (with UTC + timezone plugins) for timezone management. Backend will use **Node.js + Express + MongoDB (Mongoose)**.
> - **Database Strategy**: `mongodb-memory-server` is used **only** as a local dev convenience when no `MONGODB_URI` is set (`NODE_ENV=development` or missing URI). The deployed instance connects to a real **MongoDB Atlas** cluster via `MONGODB_URI`, since an in-memory DB would wipe all data on every server restart — unacceptable for the "fully functional deployment" requirement.
> - **No External CSS Frameworks**: Custom CSS design system matching the Figma snapshots (modern purple primary accents `#6C5CE7`, sleek dark/light card elements, responsive dropdowns, modals, and date-time pickers).
> - **DSA Concepts Incorporated**:
>   1. **Field Diffing Algorithm ($O(N)$ Hash-based Set Diff)**: Computes minimal state deltas for event updates to generate precise update logs.
>   2. **Interval Conflict Detection ($O(N \log N)$ Sweep-line / Interval Overlap)**: Bonus, non-blocking — flags overlapping schedules per profile with a badge; does not prevent event creation, since the spec doesn't require blocking.
>   3. **Prefix Filtering (linear scan)**: Fast profile filtering in multi-select dropdowns. A trie was considered but adds complexity with no real benefit at this list size (tens of profiles) — will mention this trade-off explicitly in the video rather than over-engineer the implementation.

## Open Questions

> [!NOTE]
> None at this stage. All requirements, Figma snapshots, OCR text, and functional rules have been fully analyzed from `SkaiLama_ Assignment for MERN stack Developer .pdf`.

## Proposed Changes

### Backend (`/backend`)

#### [NEW] [package.json](file:///s:/programing/Intern%20Assignment/Skailama/backend/package.json)
- Express, Mongoose, dotenv, cors, dayjs, `mongodb-memory-server` (devDependency only — never used in production).

#### [NEW] [config/db.js](file:///s:/programing/Intern%20Assignment/Skailama/backend/config/db.js)
- Database connection helper: connects to `MONGODB_URI` (Atlas) when set — always the case in the deployed environment. Falls back to an in-memory MongoDB instance only when `MONGODB_URI` is absent and `NODE_ENV !== 'production'`, purely for frictionless local dev.

#### [NEW] [models/Profile.js](file:///s:/programing/Intern%20Assignment/Skailama/backend/models/Profile.js)
- Profile schema (`name`, `createdAt`). No persisted per-profile timezone — "View in Timezone" is a session-level selector per the design snapshots, not a saved profile setting. (Intentional simplification, not an oversight — flagged for confirmation.)

#### [NEW] [models/Event.js](file:///s:/programing/Intern%20Assignment/Skailama/backend/models/Event.js)
- Event schema (`title`, `profiles` [ref Profile], `timezone`, `startTime` (UTC Date), `endTime` (UTC Date), `createdAt`, `updatedAt`).

#### [NEW] [models/EventLog.js](file:///s:/programing/Intern%20Assignment/Skailama/backend/models/EventLog.js)
- Audit log schema (`eventId`, `changes` array of `{ field, description, previousValue, newValue }`, `timestamp`).

#### [NEW] [utils/diffCalculator.js](file:///s:/programing/Intern%20Assignment/Skailama/backend/utils/diffCalculator.js)
- DSA diffing engine calculating precise changes between previous and updated event states.

#### [NEW] [controllers/profileController.js](file:///s:/programing/Intern%20Assignment/Skailama/backend/controllers/profileController.js)
- `getProfiles`, `createProfile` endpoints.

#### [NEW] [controllers/eventController.js](file:///s:/programing/Intern%20Assignment/Skailama/backend/controllers/eventController.js)
- `getEvents`, `createEvent`, `updateEvent`, `getEventLogs` endpoints.

#### [NEW] [server.js](file:///s:/programing/Intern%20Assignment/Skailama/backend/server.js)
- Express server setup, middleware, API routes, error handler.

---

### Frontend (`/frontend`)

#### [NEW] [package.json](file:///s:/programing/Intern%20Assignment/Skailama/frontend/package.json)
- React, Vite, Dayjs (with UTC + Timezone plugins), Lucide-react (icons), **Zustand** (state management — required by spec).

#### [NEW] [src/store/profileStore.js](file:///s:/programing/Intern%20Assignment/Skailama/frontend/src/store/profileStore.js)
- Zustand store: profile list, currently selected profile, create-profile action.

#### [NEW] [src/store/eventStore.js](file:///s:/programing/Intern%20Assignment/Skailama/frontend/src/store/eventStore.js)
- Zustand store: events for current profile, loading/error state, CRUD actions calling the API layer.

#### [NEW] [src/store/viewTimezoneStore.js](file:///s:/programing/Intern%20Assignment/Skailama/frontend/src/store/viewTimezoneStore.js)
- Zustand store: currently selected "View in Timezone" value, shared across `EventList`, `EventCard`, and `EventLogsModal`.

#### [NEW] [src/styles/index.css](file:///s:/programing/Intern%20Assignment/Skailama/frontend/src/styles/index.css)
- Comprehensive CSS design system matching Figma screenshots:
  - Clean light background (`#F7F8FA`) with dark text
  - Primary purple color palette (`#6C5CE7`, `#7C5CFC`)
  - Modern card containers with subtle borders and box-shadows
  - Custom styled dropdowns, search inputs, modal overlays, date/time pickers.

#### [NEW] [src/utils/timezone.js](file:///s:/programing/Intern%20Assignment/Skailama/frontend/src/utils/timezone.js)
- Timezone formatters and list of major timezones (Eastern Time ET, Pacific Time PT, India IST, UTC, Central European CET, etc.).

#### [NEW] [src/components/Header.jsx](file:///s:/programing/Intern%20Assignment/Skailama/frontend/src/components/Header.jsx)
- Main title, subtitle, and top-right Profile Dropdown with search and inline profile creation.

#### [NEW] [src/components/CreateEventForm.jsx](file:///s:/programing/Intern%20Assignment/Skailama/frontend/src/components/CreateEventForm.jsx)
- Left card for event creation: Multi-profile selector, timezone picker, start/end date-time selectors, and validation logic.

#### [NEW] [src/components/EventList.jsx](file:///s:/programing/Intern%20Assignment/Skailama/frontend/src/components/EventList.jsx)
- Right card displaying list of events, top "View in Timezone" selector, empty state handling, conflict badges.

#### [NEW] [src/components/EventCard.jsx](file:///s:/programing/Intern%20Assignment/Skailama/frontend/src/components/EventCard.jsx)
- Individual event item showing assigned profiles, start/end dates converted to active viewing timezone, created/updated timestamps, and action buttons (`Edit`, `View Logs`).

#### [NEW] [src/components/EditEventModal.jsx](file:///s:/programing/Intern%20Assignment/Skailama/frontend/src/components/EditEventModal.jsx)
- Modal dialog for editing existing event details with validation.

#### [NEW] [src/components/EventLogsModal.jsx](file:///s:/programing/Intern%20Assignment/Skailama/frontend/src/components/EventLogsModal.jsx)
- Audit log modal displaying timeline of changes with dynamic timezone conversion.

#### [NEW] [src/App.jsx](file:///s:/programing/Intern%20Assignment/Skailama/frontend/src/App.jsx)
- Main layout composing the three Zustand stores, API calls, and layout components.

---

## Verification Plan

### Automated & Manual Verification
1. **Backend Verification**:
   - Start backend server, verify MongoDB connection / memory-server launch.
   - Test REST endpoints using API client / fetch scripts (`/api/profiles`, `/api/events`, `/api/events/:id/logs`).
2. **Frontend UI & Functionality Verification**:
   - Test profile creation and search in multi-select dropdown.
   - Create events for single and multiple profiles with different timezones.
   - Validate rule: End date/time in the past relative to start time triggers validation error.
   - Switch viewing timezone in "View in Timezone" dropdown and verify all timestamps re-render in real-time matching the new timezone.
   - Edit an event and inspect the generated diff logs in "View Logs" modal.
   - Verify mobile responsiveness and pixel-perfect design alignment with PDF Figma snapshots.
