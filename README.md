# PrimeWave Lab — Resource Reservation Management System

A modern, full-stack enterprise digital solution designed for **PrimeWave Lab (Pvt) Ltd** to centralize facility and equipment scheduling, eliminate double-bookings, maintain live resource availability, and provide data-driven operational insights.

Built for the **Software Engineering Internship Technical Assessment**.

---

## 📋 Table of Contents
- [1. Business Scenario & Problem Statement](#1-business-scenario--problem-statement)
- [2. System Solution & Key Capabilities](#2-system-solution--key-capabilities)
- [3. Architecture & Relational Database Design](#3-architecture--relational-database-design)
- [4. Technology Stack](#4-technology-stack)
- [5. Getting Started & Setup Guide](#5-getting-started--setup-guide)
- [6. Project Structure](#6-project-structure)
- [7. Concurrency & Conflict Prevention Algorithm](#7-concurrency--conflict-prevention-algorithm)
- [8. Assessment Deliverables](#8-assessment-deliverables)

---

## 1. Business Scenario & Problem Statement

As organizations grow, coordinating shared facilities (such as executive conference rooms, precision hardware test benches, and media production studios) becomes increasingly complex. Reservations handled through informal communication, verbal requests, and disparate spreadsheets cause:
- **Scheduling Confusion & Double-Bookings**: Multiple teams arriving to use the same equipment or room simultaneously.
- **Uncertain Resource Availability**: Lack of real-time visibility into whether a resource is currently vacant, reserved, or offline for maintenance.
- **Operational Blindspots**: Inability to quantify resource utilization, peak demand hours, or department needs.

### The Objective
Design and implement a centralized, reliable full-stack web application that organizes organizational resources, coordinates reservations with strict conflict prevention, and maintains clear live usage visibility.

---

## 2. System Solution & Key Capabilities

### 🔍 1. Resource Catalog & Real-Time Availability Explorer (`/`)
- **Categorized Inventory**: Grouped across Conference Rooms, Hardware & Testing Rigs, and Media/AV Studios.
- **Dynamic State Engine**: Real-time status tags (*Available Right Now*, *In Use Until [Time]*, *Under Maintenance*, *Inactive*).
- **Search & Multi-Filter**: Filter instantaneously by category, keyword search, capacity thresholds, and operational status.
- **Resource Specifications**: Displays room capacity, equipment location, duration limits, and specialized amenities tags (e.g., 4K Display, Soldering Station, Thermal Isolation).

### 📅 2. Live Scheduling Timeline Grid (`/schedule`)
- **24-Hour Visual Matrix**: Real-time hour-by-hour view of all resources side-by-side.
- **Occupancy Blocks**: Color-coded visualization distinguishing confirmed reservations from maintenance downtime windows.
- **Quick-Date Navigation**: Jump across dates to coordinate future planning.

### ⚡ 3. Atomic Booking & Conflict Prevention Engine
- **Strict Interval Validation**: Enforces server-side overlapping collision detection to prevent double-booking.
- **Maintenance Blackouts**: Automatically blocks bookings during scheduled hardware servicing or repairs.
- **Duration Enforcement**: Prevents reservations exceeding resource-specific maximum limits (e.g. 240 mins).
- **Persona Context Switcher**: Seamlessly switch between organizational personas (Engineers, Admins, Staff) to simulate multi-user collaboration.

### 📋 4. Reservation Lifecycle Management (`/reservations`)
- **Status Workflows**: Tracks lifecycle states: `PENDING`, `CONFIRMED`, `CANCELLED`, `COMPLETED`, `REJECTED`.
- **On-site Check-in Verification**: One-click check-in logging to track physical presence.
- **Audit-Tracked Cancellation**: Cancel reservations with mandatory reason capture, automatically returning the slot to the availability pool.

### 📊 5. Operational Analytics & Demand Insights (`/analytics`)
- **Key Metrics Summary**: Total resources, active reservations, utilization rates, and scheduled maintenance count.
- **Resource Leaderboard**: Top utilized facilities ranked by booking frequency and cumulative hours.
- **Department Demand Breakdown**: Reservation distributions across Software Engineering, Hardware, Operations, Facilities, and Design.
- **Peak Hours Distribution**: Hourly demand analysis (8:00 AM – 7:00 PM) to identify organizational bottleneck periods.
- **Live Audit Activity Feed**: Immutable activity trail capturing bookings, approvals, check-ins, and cancellations.

### 🏛️ 6. Interactive Architecture & ER Portal (`/architecture`)
- In-app interactive ER documentation with copyable Mermaid schema and architectural rationale.

---

## 3. Architecture & Relational Database Design

The database is built on **PostgreSQL** using a fully normalized relational schema managed with **Prisma ORM 7**.

### Visual Entity Relationship (ER) Diagram

```mermaid
erDiagram
    USER ||--o{ RESERVATION : "creates"
    USER ||--o{ ACTIVITY_LOG : "triggers"
    CATEGORY ||--o{ RESOURCE : "classifies"
    RESOURCE ||--o{ RESERVATION : "scheduled_for"
    RESOURCE ||--o{ MAINTENANCE_LOG : "undergoes"
    RESOURCE ||--o{ ACTIVITY_LOG : "referenced_in"
    RESERVATION ||--o{ ACTIVITY_LOG : "generates"

    USER {
        string id PK "UUID"
        string name "Full Name"
        string email UK "Unique Email Address"
        string department "Department"
        enum role "ADMIN | STAFF | MEMBER"
        string avatarUrl "Profile Avatar URL"
    }

    CATEGORY {
        string id PK "UUID"
        string name "Category Name"
        string slug UK "Unique Slug"
        string description "Description"
        string icon "Icon Identifier"
    }

    RESOURCE {
        string id PK "UUID"
        string name "Resource Title"
        string code UK "Unique Code (e.g. CONF-01)"
        string categoryId FK "References CATEGORY(id)"
        string location "Building / Room Location"
        int capacity "Occupancy / Device Capacity"
        enum status "AVAILABLE | MAINTENANCE | INACTIVE"
        boolean isApprovalRequired "Requires Sign-off"
        int maxDurationMinutes "Booking Cap"
        string[] amenities "Array of Facilities"
    }

    RESERVATION {
        string id PK "UUID"
        string title "Reservation Purpose"
        string resourceId FK "References RESOURCE(id)"
        string userId FK "References USER(id)"
        datetime startTime "Start DateTime (Indexed)"
        datetime endTime "End DateTime (Indexed)"
        enum status "PENDING | CONFIRMED | CANCELLED | COMPLETED | REJECTED"
        string notes "Special Requests"
        int attendeesCount "Headcount"
        datetime checkInTime "Check-in Timestamp"
        string cancellationReason "Cancellation Reason"
    }

    MAINTENANCE_LOG {
        string id PK "UUID"
        string resourceId FK "References RESOURCE(id)"
        string title "Maintenance Title"
        string description "Technical Scope"
        datetime startTime "Downtime Start"
        datetime endTime "Downtime End"
        string technician "Lead Technician"
        enum status "SCHEDULED | IN_PROGRESS | COMPLETED"
    }

    ACTIVITY_LOG {
        string id PK "UUID"
        string action "Event Type Code"
        string details "Explanatory Narrative"
        string userId FK "References USER(id)"
        string resourceId FK "References RESOURCE(id)"
        string reservationId FK "References RESERVATION(id)"
        datetime createdAt "Timestamp (Indexed)"
    }
```

Detailed architectural specifications are provided in [`docs/ER_DIAGRAM.md`](docs/ER_DIAGRAM.md).

---

## 4. Technology Stack

| Layer | Technology | Rationale |
| :--- | :--- | :--- |
| **Framework** | **Next.js 16 (App Router)** | High-performance React Server Components (RSC) and Server Actions for atomic mutations without client API boilerplate. |
| **Language** | **TypeScript 5** | Strict end-to-end type safety across the database, server actions, and UI layer. |
| **Database** | **PostgreSQL** | ACID-compliant relational storage ensuring serializable data integrity and indexing. |
| **ORM & Driver** | **Prisma ORM 7 + `@prisma/adapter-pg`** | Type-safe query building, migration management, and low-latency pooled driver adapter. |
| **Styling** | **Custom Vanilla CSS Design System** | Modern glassmorphism dark theme, zero runtime CSS overhead, accessible contrast ratios, responsive flex/grid layouts. |
| **Icons** | **Lucide React** | Consistent iconography across navigation, metrics, and state tags. |
| **Time Handling** | **Date-fns** | Deterministic timezone-safe date math for schedule grid positioning. |

---

## 5. Getting Started & Setup Guide

### Prerequisites
- **Node.js**: v18.18.0 or newer (v20+ recommended)
- **PostgreSQL**: v14 or newer (local service or hosted instance)
- **Git**

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/GimhaniDilmika/PrimeWave.git
cd PrimeWave
```

---

### Step 2: Install Dependencies
```bash
npm install
```

---

### Step 3: Configure Environment Variables
Create or verify the `.env` file in the root directory:
```env
# PostgreSQL connection string
DATABASE_URL="postgresql://postgres:123@127.0.0.1:5432/resource_reservation_db?schema=public"
```
*(Replace `postgres`, `123`, `5432`, and database name with your local credentials if different).*

---

### Step 4: Synchronize Database Schema
Push the Prisma relational schema directly to PostgreSQL:
```bash
npx prisma db push
```

---

### Step 5: Seed Demo Data
Populate the database with realistic organizational resources, team members, scheduled maintenance logs, and active bookings:
```bash
npm run seed
```

---

### Step 6: Start the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

### Step 7: Build for Production (Verification)
```bash
npm run build
npm run start
```

---

## 6. Project Structure

```
PrimeWave/
├── docs/
│   ├── ER_DIAGRAM.md             # Formal ER specification & attribute dictionary
│   └── DEMO_VIDEO_GUIDE.md       # 3-5 minute video script & recording guide
├── prisma/
│   ├── schema.prisma             # Relational data schema & composite indexes
│   └── seed.ts                   # Realistic seed dataset
├── src/
│   ├── actions/
│   │   └── reservation-actions.ts # Atomic server actions (create, cancel, check-in, update)
│   ├── app/
│   │   ├── layout.tsx            # Global layout with persona context provider & navbar
│   │   ├── globals.css           # Glassmorphic dark design system & tokens
│   │   ├── page.tsx              # Home / Resource Catalog page
│   │   ├── schedule/             # Live hour-by-hour timeline schedule view
│   │   ├── reservations/         # Reservation management, check-in & cancellation
│   │   ├── analytics/            # Utilization metrics, department demand, peak hours
│   │   └── architecture/         # In-app ER diagram & technical decision documentation
│   ├── components/
│   │   ├── BookingModal.tsx      # Reservation dialog with validation
│   │   ├── Navbar.tsx            # Navigation bar with user persona switcher
│   │   ├── ResourceCard.tsx      # Resource inventory card with live status badges
│   │   ├── ResourceExplorer.tsx  # Dynamic catalog with live search & filters
│   │   └── TimelineGrid.tsx      # Visual multi-resource 24h schedule grid
│   ├── context/
│   │   └── user-context.tsx      # Active persona context & simulation switch
│   └── lib/
│       ├── data.ts               # Server data queries & live state computation
│       └── prisma.ts             # Prisma client instance with PostgreSQL driver adapter
├── package.json
├── tsconfig.json
└── README.md
```

---

## 7. Concurrency & Conflict Prevention Algorithm

To guarantee that no two reservations or maintenance windows can collide, the application executes an interval overlap query inside an isolated transaction (`prisma.$transaction`):

### The Interval Overlap Rule
Given an existing booking $[S_1, E_1)$ and a requested booking $[S_2, E_2)$, a collision occurs if and only if:
$$S_1 < E_2 \quad \text{AND} \quad E_1 > S_2$$

```typescript
// Strict Double-Booking Prevention Query
const overlappingReservation = await prisma.reservation.findFirst({
  where: {
    resourceId,
    status: { in: ["CONFIRMED", "PENDING"] },
    startTime: { lt: requestedEnd },
    endTime: { gt: requestedStart },
  },
  include: {
    user: { select: { name: true, department: true } },
  },
});

if (overlappingReservation) {
  return {
    success: false,
    error: `Scheduling Conflict: "${resource.name}" is already booked by ${overlappingReservation.user.name} between ${conflictStart} and ${conflictEnd}.`,
  };
}
```

---

## 8. Assessment Deliverables

This project fulfills all requirements specified in the **PrimeWave Lab Software Engineering Internship Technical Assessment**:

1. **GitHub Repository**: Complete source code, clean commit history, and comprehensive documentation.
2. **Demonstration Video Guide**: Detailed script and walkthrough provided in [`docs/DEMO_VIDEO_GUIDE.md`](docs/DEMO_VIDEO_GUIDE.md).
3. **Entity Relationship (ER) Diagram**: Accessible in-app at [`/architecture`](http://localhost:3000/architecture) and in [`docs/ER_DIAGRAM.md`](docs/ER_DIAGRAM.md).
4. **Assessment Submission Form**: [Official Submission Form](https://forms.gle/HzQH6tB5c4edPjnn8).
   - **Submission Deadline**: Thursday, 15 October 2026, 11:59 PM (Sri Lanka Time).

---

## 👨‍💻 Author & Acknowledgements
- **Candidate**: Software Engineering Internship Candidate
- **Organization**: PrimeWave Lab (Pvt) Ltd (*"Turning Complexity into Possibility"*)
