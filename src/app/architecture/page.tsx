"use client";

import { useState } from "react";
import {
  Database,
  Code,
  ShieldAlert,
  Server,
  Layers,
  CheckCircle2,
  Copy,
  Check,
  Cpu,
  ArrowRight,
  GitBranch,
} from "lucide-react";

export default function ArchitecturePage() {
  const [copied, setCopied] = useState(false);

  const mermaidER = `erDiagram
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
        string email UK "Unique Email"
        string department "Department"
        enum role "ADMIN | STAFF | MEMBER"
        string avatarUrl "Profile Avatar"
        datetime createdAt "Created Timestamp"
    }

    CATEGORY {
        string id PK "UUID"
        string name "Category Name"
        string slug UK "Unique Slug"
        string description "Category Purpose"
        string icon "Lucide Icon Reference"
    }

    RESOURCE {
        string id PK "UUID"
        string name "Resource Title"
        string code UK "Unique Code (e.g. RES-CR-01)"
        string categoryId FK "References CATEGORY(id)"
        string location "Building & Wing"
        int capacity "Max Pax Capacity"
        enum status "AVAILABLE | MAINTENANCE | INACTIVE"
        boolean isApprovalRequired "Requires Admin Sign-off"
        int maxDurationMinutes "Booking Cap (e.g. 240 mins)"
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
        datetime checkInTime "On-site Verification"
        string cancellationReason "Reason if Cancelled"
    }

    MAINTENANCE_LOG {
        string id PK "UUID"
        string resourceId FK "References RESOURCE(id)"
        string title "Maintenance Title"
        string description "Service Details"
        datetime startTime "Downtime Start"
        datetime endTime "Downtime End"
        string technician "Service Technician"
        enum status "SCHEDULED | IN_PROGRESS | COMPLETED"
    }

    ACTIVITY_LOG {
        string id PK "UUID"
        string action "Event Type"
        string details "Human-readable Details"
        string userId FK "References USER(id)"
        string resourceId FK "References RESOURCE(id)"
        string reservationId FK "References RESERVATION(id)"
        datetime createdAt "Timestamp"
    }`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(mermaidER);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
      {/* Page Header */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--text-main)" }}>
            Entity Relationship (ER) Diagram & System Architecture
          </h1>
          <span
            style={{
              fontSize: "0.74rem",
              fontWeight: 700,
              padding: "0.2rem 0.55rem",
              borderRadius: "9999px",
              background: "rgba(0, 212, 178, 0.15)",
              color: "var(--accent-teal)",
            }}
          >
            Technical Assessment Submission
          </span>
        </div>
        <p style={{ fontSize: "0.85rem", color: "var(--text-dim)", marginTop: "0.25rem" }}>
          Database relational models, constraints, atomic conflict detection algorithm, and full-stack design rationale.
        </p>
      </div>

      {/* Visual Interactive ER Diagram Representation */}
      <div className="glass-panel" style={{ padding: "1.75rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1.5rem",
            paddingBottom: "1rem",
            borderBottom: "1px solid var(--border-subtle)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <Database size={20} color="#00d4b2" />
            <div>
              <h2 style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--text-main)" }}>
                Entity Relationship Diagram (Relational Schema)
              </h2>
              <p style={{ fontSize: "0.78rem", color: "var(--text-dim)" }}>
                PostgreSQL normalized entities with foreign keys and composite conflict indexes
              </p>
            </div>
          </div>

          <button
            onClick={copyToClipboard}
            className="btn btn-secondary btn-sm"
            style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
          >
            {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
            <span>{copied ? "Mermaid Copied!" : "Copy Mermaid Schema"}</span>
          </button>
        </div>

        {/* Visual Entity Cards Map */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {/* USER Entity */}
          <div
            style={{
              background: "rgba(11, 18, 32, 0.85)",
              border: "1px solid var(--border-card)",
              borderRadius: "var(--radius-md)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                background: "linear-gradient(90deg, #1e293b 0%, #0f172a 100%)",
                padding: "0.65rem 0.85rem",
                borderBottom: "1px solid var(--border-subtle)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <strong style={{ fontSize: "0.85rem", color: "#38bdf8" }}>USER</strong>
              <span style={{ fontSize: "0.68rem", color: "var(--text-dim)" }}>Core Persona</span>
            </div>
            <div style={{ padding: "0.85rem", fontSize: "0.76rem", lineHeight: 1.8, fontFamily: "var(--font-mono)" }}>
              <div><span style={{ color: "#f43f5e" }}>PK</span> id : String (UUID)</div>
              <div><span style={{ color: "#38bdf8" }}>UK</span> email : String (Unique)</div>
              <div>name : String</div>
              <div>department : String</div>
              <div>role : Enum (ADMIN, STAFF, MEMBER)</div>
              <div>avatarUrl : String?</div>
              <div>createdAt : DateTime</div>
            </div>
          </div>

          {/* CATEGORY Entity */}
          <div
            style={{
              background: "rgba(11, 18, 32, 0.85)",
              border: "1px solid var(--border-card)",
              borderRadius: "var(--radius-md)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                background: "linear-gradient(90deg, #1e293b 0%, #0f172a 100%)",
                padding: "0.65rem 0.85rem",
                borderBottom: "1px solid var(--border-subtle)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <strong style={{ fontSize: "0.85rem", color: "#00d4b2" }}>CATEGORY</strong>
              <span style={{ fontSize: "0.68rem", color: "var(--text-dim)" }}>Classification</span>
            </div>
            <div style={{ padding: "0.85rem", fontSize: "0.76rem", lineHeight: 1.8, fontFamily: "var(--font-mono)" }}>
              <div><span style={{ color: "#f43f5e" }}>PK</span> id : String (UUID)</div>
              <div><span style={{ color: "#38bdf8" }}>UK</span> slug : String (Unique)</div>
              <div>name : String</div>
              <div>description : String?</div>
              <div>icon : String?</div>
              <div>createdAt : DateTime</div>
            </div>
          </div>

          {/* RESOURCE Entity */}
          <div
            style={{
              background: "rgba(11, 18, 32, 0.85)",
              border: "1px solid rgba(0, 212, 178, 0.3)",
              borderRadius: "var(--radius-md)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                background: "linear-gradient(90deg, #0d9488 0%, #0f766e 100%)",
                padding: "0.65rem 0.85rem",
                borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                color: "#031412",
              }}
            >
              <strong style={{ fontSize: "0.85rem" }}>RESOURCE</strong>
              <span style={{ fontSize: "0.68rem", fontWeight: 700 }}>Primary Asset</span>
            </div>
            <div style={{ padding: "0.85rem", fontSize: "0.76rem", lineHeight: 1.8, fontFamily: "var(--font-mono)" }}>
              <div><span style={{ color: "#f43f5e" }}>PK</span> id : String (UUID)</div>
              <div><span style={{ color: "#38bdf8" }}>UK</span> code : String (e.g. RES-CR-01)</div>
              <div><span style={{ color: "#a855f7" }}>FK</span> categoryId -&gt; CATEGORY(id)</div>
              <div>name : String</div>
              <div>location : String</div>
              <div>capacity : Int</div>
              <div>status : Enum (AVAILABLE, MAINTENANCE, INACTIVE)</div>
              <div>isApprovalRequired : Boolean</div>
              <div>maxDurationMinutes : Int (Cap)</div>
              <div>amenities : String[] (PostgreSQL Array)</div>
            </div>
          </div>

          {/* RESERVATION Entity */}
          <div
            style={{
              background: "rgba(11, 18, 32, 0.85)",
              border: "1px solid rgba(6, 182, 212, 0.3)",
              borderRadius: "var(--radius-md)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                background: "linear-gradient(90deg, #0284c7 0%, #0369a1 100%)",
                padding: "0.65rem 0.85rem",
                borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                color: "#fff",
              }}
            >
              <strong style={{ fontSize: "0.85rem" }}>RESERVATION</strong>
              <span style={{ fontSize: "0.68rem", fontWeight: 700 }}>Core Transaction</span>
            </div>
            <div style={{ padding: "0.85rem", fontSize: "0.76rem", lineHeight: 1.8, fontFamily: "var(--font-mono)" }}>
              <div><span style={{ color: "#f43f5e" }}>PK</span> id : String (UUID)</div>
              <div><span style={{ color: "#a855f7" }}>FK</span> resourceId -&gt; RESOURCE(id)</div>
              <div><span style={{ color: "#a855f7" }}>FK</span> userId -&gt; USER(id)</div>
              <div><span style={{ color: "#10b981" }}>IDX</span> startTime : DateTime</div>
              <div><span style={{ color: "#10b981" }}>IDX</span> endTime : DateTime</div>
              <div>status : Enum (PENDING, CONFIRMED, CANCELLED...)</div>
              <div>title : String</div>
              <div>notes : String?</div>
              <div>checkInTime : DateTime?</div>
              <div>cancellationReason : String?</div>
            </div>
          </div>

          {/* MAINTENANCE_LOG Entity */}
          <div
            style={{
              background: "rgba(11, 18, 32, 0.85)",
              border: "1px solid var(--border-card)",
              borderRadius: "var(--radius-md)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                background: "linear-gradient(90deg, #b45309 0%, #92400e 100%)",
                padding: "0.65rem 0.85rem",
                borderBottom: "1px solid var(--border-subtle)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                color: "#fff",
              }}
            >
              <strong style={{ fontSize: "0.85rem" }}>MAINTENANCE_LOG</strong>
              <span style={{ fontSize: "0.68rem" }}>Downtime Scheduler</span>
            </div>
            <div style={{ padding: "0.85rem", fontSize: "0.76rem", lineHeight: 1.8, fontFamily: "var(--font-mono)" }}>
              <div><span style={{ color: "#f43f5e" }}>PK</span> id : String (UUID)</div>
              <div><span style={{ color: "#a855f7" }}>FK</span> resourceId -&gt; RESOURCE(id)</div>
              <div>title : String</div>
              <div>description : String</div>
              <div>startTime : DateTime</div>
              <div>endTime : DateTime</div>
              <div>technician : String?</div>
              <div>status : Enum (SCHEDULED, IN_PROGRESS, COMPLETED)</div>
            </div>
          </div>

          {/* ACTIVITY_LOG Entity */}
          <div
            style={{
              background: "rgba(11, 18, 32, 0.85)",
              border: "1px solid var(--border-card)",
              borderRadius: "var(--radius-md)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                background: "linear-gradient(90deg, #1e293b 0%, #0f172a 100%)",
                padding: "0.65rem 0.85rem",
                borderBottom: "1px solid var(--border-subtle)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <strong style={{ fontSize: "0.85rem", color: "#a855f7" }}>ACTIVITY_LOG</strong>
              <span style={{ fontSize: "0.68rem", color: "var(--text-dim)" }}>Audit Trail</span>
            </div>
            <div style={{ padding: "0.85rem", fontSize: "0.76rem", lineHeight: 1.8, fontFamily: "var(--font-mono)" }}>
              <div><span style={{ color: "#f43f5e" }}>PK</span> id : String (UUID)</div>
              <div>action : String (Event code)</div>
              <div>details : String</div>
              <div><span style={{ color: "#a855f7" }}>FK</span> userId -&gt; USER(id)?</div>
              <div><span style={{ color: "#a855f7" }}>FK</span> resourceId -&gt; RESOURCE(id)?</div>
              <div><span style={{ color: "#a855f7" }}>FK</span> reservationId -&gt; RESERVATION(id)?</div>
              <div>createdAt : DateTime</div>
            </div>
          </div>
        </div>

        {/* Mermaid Code Preview */}
        <div style={{ marginTop: "1.75rem" }}>
          <div
            style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: "var(--text-dim)",
              marginBottom: "0.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            <Code size={14} color="#00d4b2" />
            <span>Mermaid.js Specification (Shareable ER Format)</span>
          </div>
          <pre
            style={{
              background: "rgba(8, 13, 22, 0.95)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-md)",
              padding: "1rem",
              fontSize: "0.74rem",
              color: "#94a3b8",
              overflowX: "auto",
              fontFamily: "var(--font-mono)",
              lineHeight: 1.5,
              maxHeight: "260px",
            }}
          >
            {mermaidER}
          </pre>
        </div>
      </div>

      {/* Engineering Design Rationale Section */}
      <div className="glass-panel" style={{ padding: "1.75rem" }}>
        <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--text-main)", marginBottom: "1.2rem" }}>
          Engineering Rationale & Real-World Problem Solution
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem" }}>
          <div
            style={{
              background: "rgba(11, 18, 32, 0.7)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-md)",
              padding: "1.25rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
              <ShieldAlert size={18} color="#00d4b2" />
              <strong style={{ fontSize: "0.95rem", color: "var(--text-main)" }}>
                Atomic Overlap & Race Condition Prevention
              </strong>
            </div>
            <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
              The core business pain point was overlapping double-bookings. We enforce atomic isolation via Prisma PostgreSQL transactions. Every booking query evaluates:
              <br />
              <code style={{ color: "#38bdf8", fontFamily: "var(--font-mono)", fontSize: "0.75rem" }}>
                existing.startTime &lt; newEnd AND existing.endTime &gt; newStart
              </code>
              <br />
              Composite B-Tree index on <code style={{ color: "var(--accent-teal)" }}>[resourceId, startTime, endTime]</code> enables O(log N) lookup speeds.
            </p>
          </div>

          <div
            style={{
              background: "rgba(11, 18, 32, 0.7)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-md)",
              padding: "1.25rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
              <Layers size={18} color="#38bdf8" />
              <strong style={{ fontSize: "0.95rem", color: "var(--text-main)" }}>
                Operational Policies & Governance
              </strong>
            </div>
            <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
              Resources have customizable business constraints:
              <br />
              • <strong style={{ color: "#fff" }}>maxDurationMinutes</strong> prevents hoarding (e.g. 2h for pods, 5h for boardrooms).
              <br />
              • <strong style={{ color: "#fff" }}>isApprovalRequired</strong> routes high-stakes facilities (e.g. Executive Boardroom, Field EV) to Admin (Sarah Jenkins) for sign-off.
              <br />
              • <strong style={{ color: "#fff" }}>Maintenance Logs</strong> automatically block bookings during scheduled calibration.
            </p>
          </div>

          <div
            style={{
              background: "rgba(11, 18, 32, 0.7)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-md)",
              padding: "1.25rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
              <Server size={18} color="#a855f7" />
              <strong style={{ fontSize: "0.95rem", color: "var(--text-main)" }}>
                Full-Stack Architecture & Performance
              </strong>
            </div>
            <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
              Built with Next.js App Router (Turbopack, Server Actions, React 19) + Prisma ORM 7 + PostgreSQL driver adapter (<code style={{ color: "#a855f7" }}>@prisma/adapter-pg</code>).
              Zero client API overhead: mutations run via safe Server Actions with automatic Next.js cache revalidation (<code style={{ color: "#00d4b2" }}>revalidatePath</code>).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
