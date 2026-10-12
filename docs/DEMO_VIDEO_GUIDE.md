# PrimeWave Demonstration Video Guide (3–5 Minutes)
## Practical Screen Recording Script & Walkthrough Instructions

This document provides a step-by-step walkthrough and recording script for the 3–5 minute demonstration video required for the **PrimeWave Lab Software Engineering Internship Technical Assessment**.

---

## 1. Video Objectives & Rubric Alignment

Your video must communicate three main dimensions clearly:
1. **Purpose & Business Scenario**: How this centralized digital platform eliminates manual coordination, prevents double-booking confusion, and gives full visibility into organizational resources.
2. **Feature Tour**: Showing the key user flows live in action (discovering resources, live schedule timeline, booking a resource, preventing a conflicting overlap, managing reservations, check-in, and operational analytics).
3. **Engineering Decisions**: Explaining the architecture, PostgreSQL schema design, atomic concurrency handling, and performance indexing.

---

## 2. Timed 4-Minute Presentation Script

### Part 1: Introduction & Business Problem (0:00 – 0:45)
- **What to show on screen**: Open the application at `http://localhost:3000` on the **Explore Resources** page.
- **What to say**:
  > *"Hello, my name is [Your Name], and this is my submission for the PrimeWave Lab Software Engineering Internship Technical Assessment.
  >
  > PrimeWave Lab faced a classic operational challenge: as the organization grew, coordinating shared facilities—like meeting rooms, hardware test benches, and media studios—relied on informal messages and spreadsheets. This led to double-bookings, scheduling uncertainty, and zero usage visibility.
  >
  > To solve this, I designed and developed this centralized Resource Reservation Management System using Next.js 16 with the App Router, TypeScript, and a normalized PostgreSQL database powered by Prisma ORM."*

---

### Part 2: Resource Discovery & Live Status (0:45 – 1:30)
- **What to show on screen**:
  - Show the top filters: click on different categories (*Conference Rooms*, *Hardware Labs*, *Media Studio*).
  - Type a query into the live search bar (e.g., `"Bench"` or `"Main"`).
  - Point out the real-time status badges (*Available*, *In Use*, *Maintenance*).
- **What to say**:
  > *"On the home page, team members can immediately see which resources exist, where they are located, their capacity, and their real-time operational status.
  >
  > Notice the dynamic state tags: if a room currently has an ongoing reservation or scheduled maintenance, the system automatically flags it as 'In Use' or 'Under Maintenance', displaying when it will next become free. This gives everyone instantaneous clarity without having to ask around."*

---

### Part 3: Live Scheduling Timeline & Booking (1:30 – 2:30)
- **What to show on screen**:
  - Click on **Live Schedule** (`/schedule`) in the navigation bar.
  - Scroll horizontally or vertically across the visual 24-hour timeline grid.
  - Switch back to **Explore Resources** and click **Reserve Resource** on an available item.
  - Select a user persona from the dropdown (or use the top persona switcher).
  - Enter a title (e.g., *"Sprint Planning & Architecture Sync"*), choose a valid time slot, and submit.
  - Show the confirmation notification.
- **What to say**:
  > *"The Live Schedule view provides a visual timeline of all facilities across the day, making it easy to spot open time windows at a glance.
  >
  > Now let's book a slot. When creating a reservation, the modal lets you pick the user persona, meeting title, time duration, and headcount.
  >
  > But more importantly, the system enforces strict conflict validation on the server side:
  > If someone tries to book an overlapping slot or a period flagged for technical maintenance, the application rejects it atomically within a PostgreSQL transaction and alerts the user with details on who has currently reserved the room."*

---

### Part 4: Reservation Management & Check-in (2:30 – 3:15)
- **What to show on screen**:
  - Navigate to **Reservations** (`/reservations`).
  - Show the active bookings table.
  - Click **Check-In** on an upcoming booking to demonstrate attendance verification.
  - Click **Cancel** on a booking and demonstrate entering a cancellation reason.
- **What to say**:
  > *"In the Reservations management tab, users and administrators can view all reservations, filter by user or status, and verify attendance using the Check-In button.
  >
  > If plans change, reservations can be cleanly cancelled with a recorded cancellation reason, immediately releasing the slot back into the available pool and logging the action in our immutable audit history."*

---

### Part 5: Analytics, ER Architecture & Wrap-Up (3:15 – 4:00)
- **What to show on screen**:
  - Navigate to **Utilization Insights** (`/analytics`).
  - Highlight total bookings, active maintenance count, resource leaderboard, and peak hours distribution.
  - Navigate to **ER Diagram & Arch** (`/architecture`) to show the relational model and Mermaid schema.
- **What to say**:
  > *"For organizational leadership, the Utilization Insights page surfaces key operational metrics: which resources are most heavily utilized, department demand breakdowns, and peak hours of the day.
  >
  > Finally, on the Architecture page, we have our complete Entity Relationship Diagram. The database is strictly normalized across six core entities: Users, Categories, Resources, Reservations, Maintenance Logs, and Activity Logs. Composite indexes ensure that overlap queries remain sub-millisecond even as booking volume scales.
  >
  > Thank you for reviewing my technical assessment for PrimeWave Lab!"*

---

## 3. Preparation & Recording Checklist

- [ ] **Database Running**: PostgreSQL running on port 5432 with seeded data (`npm run seed`).
- [ ] **App Running**: `npm run dev` running at `http://localhost:3000`.
- [ ] **Browser Window**: Full screen or clean 1080p browser window (Chrome, Edge, or Firefox).
- [ ] **Recording Tool**: OBS Studio, Windows Game Bar (`Win + G`), or Loom.
- [ ] **Audio Check**: Test microphone quality and ensure background noise is minimized.
- [ ] **Duration**: Keep the video between 3 and 5 minutes as required by the assessment guidelines.
- [ ] **Sharing**: Upload to Google Drive, YouTube (Unlisted), or Loom, and ensure link access permissions are set to *"Anyone with the link can view"*.
