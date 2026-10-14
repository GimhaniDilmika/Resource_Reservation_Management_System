"use client";

import {
  BarChart3,
  TrendingUp,
  Building,
  Users,
  Clock,
  Calendar,
  Sparkles,
  ShieldCheck,
  Activity,
} from "lucide-react";
import { format } from "date-fns";

interface AnalyticsClientProps {
  data: {
    totalResources: number;
    totalReservations: number;
    confirmedReservations: number;
    maintenanceCount: number;
    categoriesCount: number;
    usersCount: number;
    topResources: { name: string; code: string; count: number; category: string; hours: number }[];
    departmentCounts: Record<string, number>;
    hourlyDistribution: Record<number, number>;
    activityLogs: any[];
    averageDurationHours: number;
  };
}

export function AnalyticsClient({ data }: AnalyticsClientProps) {
  const maxTopBookings = Math.max(...data.topResources.map((r) => r.count), 1);
  const maxHourlyCount = Math.max(...Object.values(data.hourlyDistribution), 1);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Header */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--text-main)" }}>
            Utilization Insights & Analytics
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
            Live Telemetry
          </span>
        </div>
        <p style={{ fontSize: "0.85rem", color: "var(--text-dim)", marginTop: "0.25rem" }}>
          Understand resource demand patterns, peak contention hours, and department usage across PrimeWave Lab.
        </p>
      </div>

      {/* KPI Highlights */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1.2rem",
        }}
      >
        <div className="glass-panel" style={{ padding: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--text-dim)", fontWeight: 600 }}>
              Total Reservations
            </span>
            <Calendar size={16} color="#00d4b2" />
          </div>
          <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#fff", marginTop: "0.4rem" }}>
            {data.totalReservations}
          </div>
          <div style={{ fontSize: "0.74rem", color: "#34d399", marginTop: "0.2rem" }}>
            {data.confirmedReservations} successfully confirmed
          </div>
        </div>

        <div className="glass-panel" style={{ padding: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--text-dim)", fontWeight: 600 }}>
              Tracked Facilities
            </span>
            <Building size={16} color="#38bdf8" />
          </div>
          <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#fff", marginTop: "0.4rem" }}>
            {data.totalResources}
          </div>
          <div style={{ fontSize: "0.74rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
            Across {data.categoriesCount} specialized categories
          </div>
        </div>

        <div className="glass-panel" style={{ padding: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--text-dim)", fontWeight: 600 }}>
              Active Lab Members
            </span>
            <Users size={16} color="#a855f7" />
          </div>
          <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#fff", marginTop: "0.4rem" }}>
            {data.usersCount}
          </div>
          <div style={{ fontSize: "0.74rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
            Across 5 functional departments
          </div>
        </div>

        <div className="glass-panel" style={{ padding: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--text-dim)", fontWeight: 600 }}>
              Average Duration
            </span>
            <Clock size={16} color="#f59e0b" />
          </div>
          <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#f59e0b", marginTop: "0.4rem" }}>
            {data.averageDurationHours} hrs
          </div>
          <div style={{ fontSize: "0.74rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
            Per scheduled session
          </div>
        </div>
      </div>

      {/* Leaderboard & Department Breakdown Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "1.5rem" }}>
        {/* Most Reserved Facilities */}
        <div className="glass-panel" style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
            <div>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-main)" }}>
                Most Utilized Facilities
              </h2>
              <p style={{ fontSize: "0.76rem", color: "var(--text-dim)" }}>
                Ranked by reservation volume & cumulative hours
              </p>
            </div>
            <TrendingUp size={18} color="#00d4b2" />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {data.topResources.map((r, idx) => {
              const percent = (r.count / maxTopBookings) * 100;
              return (
                <div key={r.code}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.35rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span
                        style={{
                          width: "20px",
                          height: "20px",
                          borderRadius: "50%",
                          background: idx === 0 ? "rgba(0, 212, 178, 0.2)" : "rgba(255, 255, 255, 0.05)",
                          color: idx === 0 ? "var(--accent-teal)" : "var(--text-dim)",
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {idx + 1}
                      </span>
                      <strong style={{ fontSize: "0.85rem", color: "var(--text-main)" }}>{r.name}</strong>
                      <span style={{ fontSize: "0.72rem", color: "var(--text-dim)", fontFamily: "var(--font-mono)" }}>
                        {r.code}
                      </span>
                    </div>

                    <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 600 }}>
                      <span style={{ color: "var(--accent-teal)" }}>{r.count} bookings</span> • {r.hours.toFixed(1)} hrs
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div
                    style={{
                      height: "8px",
                      borderRadius: "9999px",
                      background: "rgba(255, 255, 255, 0.06)",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${percent}%`,
                        borderRadius: "9999px",
                        background:
                          idx === 0
                            ? "linear-gradient(90deg, #00d4b2 0%, #06b6d4 100%)"
                            : "linear-gradient(90deg, #38bdf8 0%, #3b82f6 100%)",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Department Usage Breakdown */}
        <div className="glass-panel" style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
            <div>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-main)" }}>
                Department Distribution
              </h2>
              <p style={{ fontSize: "0.76rem", color: "var(--text-dim)" }}>
                Allocation share by organizational function
              </p>
            </div>
            <Users size={18} color="#38bdf8" />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
            {Object.entries(data.departmentCounts).map(([dept, count]) => {
              const total = Math.max(1, data.totalReservations);
              const pct = Math.round((count / total) * 100);
              return (
                <div key={dept}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem", fontSize: "0.82rem" }}>
                    <span style={{ fontWeight: 600, color: "var(--text-main)" }}>{dept}</span>
                    <span style={{ color: "var(--text-muted)" }}>
                      {count} bookings ({pct}%)
                    </span>
                  </div>
                  <div
                    style={{
                      height: "7px",
                      borderRadius: "9999px",
                      background: "rgba(255, 255, 255, 0.06)",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${pct}%`,
                        borderRadius: "9999px",
                        background: "linear-gradient(90deg, #06b6d4 0%, #8b5cf6 100%)",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Hourly Contention Distribution Heat Chart */}
      <div className="glass-panel" style={{ padding: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
          <div>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-main)" }}>
              Peak Booking Hours Distribution
            </h2>
            <p style={{ fontSize: "0.76rem", color: "var(--text-dim)" }}>
              Hourly demand heatmap from 08:00 to 19:00
            </p>
          </div>
          <Clock size={18} color="#f59e0b" />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(12, 1fr)",
            gap: "0.5rem",
            alignItems: "flex-end",
            height: "160px",
            paddingTop: "1.5rem",
            borderBottom: "1px solid var(--border-subtle)",
            paddingBottom: "0.5rem",
          }}
        >
          {Object.entries(data.hourlyDistribution).map(([hourStr, count]) => {
            const hour = parseInt(hourStr);
            const heightPct = Math.max(12, (count / maxHourlyCount) * 100);
            return (
              <div
                key={hour}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  height: "100%",
                  justifyContent: "flex-end",
                  gap: "0.4rem",
                }}
              >
                <span style={{ fontSize: "0.7rem", fontWeight: 700, color: count > 0 ? "var(--accent-teal)" : "var(--text-dim)" }}>
                  {count}
                </span>
                <div
                  style={{
                    width: "100%",
                    height: `${heightPct}%`,
                    borderRadius: "4px 4px 0 0",
                    background:
                      count > 0
                        ? "linear-gradient(180deg, #00d4b2 0%, rgba(0, 212, 178, 0.3) 100%)"
                        : "rgba(255, 255, 255, 0.05)",
                    transition: "all 0.2s ease",
                  }}
                  title={`${count} bookings at ${hour}:00`}
                />
              </div>
            );
          })}
        </div>

        {/* Hour Labels */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(12, 1fr)",
            gap: "0.5rem",
            textAlign: "center",
            marginTop: "0.5rem",
          }}
        >
          {Object.keys(data.hourlyDistribution).map((hourStr) => (
            <span key={hourStr} style={{ fontSize: "0.7rem", color: "var(--text-dim)" }}>
              {hourStr}:00
            </span>
          ))}
        </div>
      </div>

      {/* Audit Activity Stream */}
      <div className="glass-panel" style={{ padding: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
          <div>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-main)" }}>
              Real-Time Audit Trail
            </h2>
            <p style={{ fontSize: "0.76rem", color: "var(--text-dim)" }}>
              Chronological log of reservation changes, check-ins, and approvals
            </p>
          </div>
          <Activity size={18} color="#00d4b2" />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {data.activityLogs.map((log) => (
            <div
              key={log.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.65rem 0.85rem",
                borderRadius: "var(--radius-sm)",
                background: "rgba(11, 18, 32, 0.6)",
                border: "1px solid var(--border-subtle)",
                fontSize: "0.8rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <span
                  style={{
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    padding: "0.15rem 0.45rem",
                    borderRadius: "3px",
                    background:
                      log.action.includes("CONFIRMED") || log.action.includes("APPROVED")
                        ? "rgba(16, 185, 129, 0.2)"
                        : log.action.includes("CANCELLED")
                          ? "rgba(244, 63, 94, 0.2)"
                          : "rgba(6, 182, 212, 0.2)",
                    color:
                      log.action.includes("CONFIRMED") || log.action.includes("APPROVED")
                        ? "#34d399"
                        : log.action.includes("CANCELLED")
                          ? "#fda4af"
                          : "#38bdf8",
                  }}
                >
                  {log.action}
                </span>
                <span style={{ color: "var(--text-main)" }}>{log.details}</span>
              </div>

              <span style={{ fontSize: "0.72rem", color: "var(--text-dim)", whiteSpace: "nowrap" }}>
                {format(new Date(log.createdAt), "MMM d, HH:mm")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
