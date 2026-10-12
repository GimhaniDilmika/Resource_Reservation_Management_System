"use client";

import { useState } from "react";
import { format, addDays, subDays } from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  Sparkles,
  Info,
  Wrench,
  User,
  ShieldCheck,
} from "lucide-react";

type ReservationItem = {
  id: string;
  title: string;
  startTime: Date | string;
  endTime: Date | string;
  status: string;
  notes?: string | null;
  user: {
    id: string;
    name: string;
    department: string;
    avatarUrl?: string | null;
  };
};

type MaintenanceItem = {
  id: string;
  title: string;
  startTime: Date | string;
  endTime: Date | string;
  status: string;
};

type ResourceWithSchedule = {
  id: string;
  name: string;
  code: string;
  location: string;
  capacity: number;
  maxDurationMinutes: number;
  isApprovalRequired: boolean;
  category: { name: string };
  reservations: ReservationItem[];
  maintenanceLogs: MaintenanceItem[];
};

interface TimelineGridProps {
  resources: ResourceWithSchedule[];
  targetDate: string;
  onSelectSlot: (resourceId: string, startIso: string, endIso: string) => void;
  onDateChange: (newDateStr: string) => void;
}

export function TimelineGrid({
  resources,
  targetDate,
  onSelectSlot,
  onDateChange,
}: TimelineGridProps) {
  const currentDate = new Date(targetDate);
  const startHour = 8; // 08:00 AM
  const endHour = 20; // 08:00 PM
  const totalHours = endHour - startHour;

  const hoursArray = Array.from({ length: totalHours + 1 }, (_, i) => startHour + i);

  const [activeReservationHover, setActiveReservationHover] = useState<{
    reservation: ReservationItem;
    resourceName: string;
    x: number;
    y: number;
  } | null>(null);

  const handlePrevDay = () => {
    const prev = subDays(currentDate, 1);
    onDateChange(format(prev, "yyyy-MM-dd"));
  };

  const handleNextDay = () => {
    const next = addDays(currentDate, 1);
    onDateChange(format(next, "yyyy-MM-dd"));
  };

  const handleToday = () => {
    onDateChange(format(new Date(), "yyyy-MM-dd"));
  };

  // Convert reservation time to percentage offset and width
  const getBlockStyle = (startTimeStr: Date | string, endTimeStr: Date | string) => {
    const s = new Date(startTimeStr);
    const e = new Date(endTimeStr);

    const sHour = s.getHours() + s.getMinutes() / 60;
    const eHour = e.getHours() + e.getMinutes() / 60;

    const clampedStart = Math.max(startHour, sHour);
    const clampedEnd = Math.min(endHour, eHour);

    if (clampedEnd <= startHour || clampedStart >= endHour) {
      return null; // outside timeline window
    }

    const leftPercent = ((clampedStart - startHour) / totalHours) * 100;
    const widthPercent = ((clampedEnd - clampedStart) / totalHours) * 100;

    return {
      left: `${leftPercent}%`,
      width: `${Math.max(1.5, widthPercent)}%`,
    };
  };

  const handleCellClick = (resourceId: string, hour: number) => {
    const start = new Date(currentDate);
    start.setHours(hour, 0, 0, 0);
    const end = new Date(currentDate);
    end.setHours(hour + 1, 0, 0, 0);

    const pad = (n: number) => String(n).padStart(2, "0");
    const formatIso = (d: Date) =>
      `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;

    onSelectSlot(resourceId, formatIso(start), formatIso(end));
  };

  return (
    <div className="glass-panel" style={{ padding: "1.5rem" }}>
      {/* Timeline Controls Header */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          marginBottom: "1.5rem",
          paddingBottom: "1.2rem",
          borderBottom: "1px solid var(--border-subtle)",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-main)" }}>
              Interactive Daily Schedule Timeline
            </h2>
            <span
              style={{
                fontSize: "0.72rem",
                padding: "0.2rem 0.5rem",
                borderRadius: "9999px",
                background: "rgba(0, 212, 178, 0.15)",
                color: "var(--accent-teal)",
                fontWeight: 700,
              }}
            >
              Live Visual Matrix
            </span>
          </div>
          <p style={{ fontSize: "0.8rem", color: "var(--text-dim)", marginTop: "0.2rem" }}>
            Click on any vacant slot in the timeline to instantaneously book that facility.
          </p>
        </div>

        {/* Date Navigator */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <button
            onClick={handlePrevDay}
            className="btn btn-secondary btn-sm"
            style={{ padding: "0.45rem" }}
            title="Previous Day"
          >
            <ChevronLeft size={16} />
          </button>

          <button
            onClick={handleToday}
            className="btn btn-secondary btn-sm"
            style={{ fontWeight: 700 }}
          >
            Today
          </button>

          <button
            onClick={handleNextDay}
            className="btn btn-secondary btn-sm"
            style={{ padding: "0.45rem" }}
            title="Next Day"
          >
            <ChevronRight size={16} />
          </button>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "rgba(11, 18, 32, 0.8)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-md)",
              padding: "0.35rem 0.75rem",
            }}
          >
            <Calendar size={14} color="#00d4b2" />
            <input
              type="date"
              value={targetDate}
              onChange={(e) => onDateChange(e.target.value)}
              style={{
                background: "transparent",
                border: "none",
                color: "#fff",
                fontSize: "0.82rem",
                fontWeight: 600,
                outline: "none",
                cursor: "pointer",
              }}
            />
          </div>
        </div>
      </div>

      {/* Legend */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1.2rem",
          marginBottom: "1.2rem",
          fontSize: "0.76rem",
          color: "var(--text-muted)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <div style={{ width: "12px", height: "12px", borderRadius: "3px", background: "rgba(0, 212, 178, 0.85)" }} />
          <span>Confirmed Reservation</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <div style={{ width: "12px", height: "12px", borderRadius: "3px", background: "rgba(6, 182, 212, 0.85)" }} />
          <span>Pending Approval</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <div style={{ width: "12px", height: "12px", borderRadius: "3px", background: "rgba(245, 158, 11, 0.85)" }} />
          <span>Scheduled Maintenance</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <div style={{ width: "12px", height: "12px", borderRadius: "3px", background: "rgba(255, 255, 255, 0.05)", border: "1px dashed var(--border-subtle)" }} />
          <span>Available Slot (Click to Reserve)</span>
        </div>
      </div>

      {/* Timeline Grid Container */}
      <div
        style={{
          overflowX: "auto",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--border-subtle)",
          background: "rgba(11, 18, 32, 0.7)",
        }}
      >
        <div style={{ minWidth: "900px" }}>
          {/* Timeline Header (Hours) */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "260px 1fr",
              borderBottom: "1px solid var(--border-subtle)",
              background: "rgba(15, 23, 42, 0.9)",
            }}
          >
            <div
              style={{
                padding: "0.75rem 1rem",
                fontSize: "0.75rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                color: "var(--text-dim)",
              }}
            >
              Facility / Resource
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${totalHours}, 1fr)`,
                textAlign: "center",
              }}
            >
              {hoursArray.slice(0, totalHours).map((hour) => (
                <div
                  key={hour}
                  style={{
                    padding: "0.75rem 0.25rem",
                    fontSize: "0.74rem",
                    fontWeight: 600,
                    color: "var(--text-muted)",
                    borderLeft: "1px solid rgba(255, 255, 255, 0.04)",
                  }}
                >
                  {hour < 10 ? `0${hour}:00` : `${hour}:00`}
                </div>
              ))}
            </div>
          </div>

          {/* Resource Rows */}
          {resources.map((resource) => (
            <div
              key={resource.id}
              style={{
                display: "grid",
                gridTemplateColumns: "260px 1fr",
                borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                minHeight: "68px",
                transition: "background 0.15s ease",
              }}
              className="timeline-row"
            >
              {/* Resource Info Cell */}
              <div
                style={{
                  padding: "0.75rem 1rem",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  borderRight: "1px solid var(--border-subtle)",
                  background: "rgba(15, 23, 42, 0.5)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.68rem",
                      padding: "0.1rem 0.35rem",
                      borderRadius: "3px",
                      background: "rgba(255, 255, 255, 0.06)",
                      color: "#38bdf8",
                    }}
                  >
                    {resource.code}
                  </span>
                  <div
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      color: "var(--text-main)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {resource.name}
                  </div>
                </div>

                <div
                  style={{
                    fontSize: "0.7rem",
                    color: "var(--text-dim)",
                    marginTop: "0.2rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <span>{resource.category.name}</span>
                  <span>•</span>
                  <span>Cap: {resource.capacity} pax</span>
                </div>
              </div>

              {/* Hourly Slots Matrix Area */}
              <div
                style={{
                  position: "relative",
                  display: "grid",
                  gridTemplateColumns: `repeat(${totalHours}, 1fr)`,
                  height: "100%",
                }}
              >
                {/* Empty clickable slot cells */}
                {hoursArray.slice(0, totalHours).map((hour) => (
                  <div
                    key={hour}
                    onClick={() => handleCellClick(resource.id, hour)}
                    title={`Click to reserve ${resource.name} at ${hour}:00`}
                    style={{
                      height: "100%",
                      borderLeft: "1px solid rgba(255, 255, 255, 0.04)",
                      cursor: "pointer",
                      transition: "background 0.15s ease",
                    }}
                    className="timeline-slot"
                  />
                ))}

                {/* Maintenance Blocks */}
                {resource.maintenanceLogs.map((m) => {
                  const style = getBlockStyle(m.startTime, m.endTime);
                  if (!style) return null;

                  return (
                    <div
                      key={m.id}
                      style={{
                        position: "absolute",
                        top: "8px",
                        bottom: "8px",
                        ...style,
                        background:
                          "repeating-linear-gradient(45deg, rgba(245, 158, 11, 0.75), rgba(245, 158, 11, 0.75) 10px, rgba(217, 119, 6, 0.85) 10px, rgba(217, 119, 6, 0.85) 20px)",
                        borderRadius: "var(--radius-sm)",
                        padding: "0.2rem 0.5rem",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.35rem",
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        zIndex: 10,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
                      }}
                      title={`Maintenance: ${m.title}`}
                    >
                      <Wrench size={12} />
                      <span
                        style={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {m.title}
                      </span>
                    </div>
                  );
                })}

                {/* Reservation Blocks */}
                {resource.reservations.map((res) => {
                  const style = getBlockStyle(res.startTime, res.endTime);
                  if (!style) return null;

                  const isPending = res.status === "PENDING";
                  const sTime = format(new Date(res.startTime), "HH:mm");
                  const eTime = format(new Date(res.endTime), "HH:mm");

                  return (
                    <div
                      key={res.id}
                      style={{
                        position: "absolute",
                        top: "6px",
                        bottom: "6px",
                        ...style,
                        background: isPending
                          ? "linear-gradient(135deg, rgba(6, 182, 212, 0.85) 0%, rgba(14, 116, 144, 0.95) 100%)"
                          : "linear-gradient(135deg, rgba(0, 212, 178, 0.88) 0%, rgba(15, 118, 110, 0.95) 100%)",
                        borderRadius: "var(--radius-sm)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        padding: "0.25rem 0.6rem",
                        color: "#031412",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        zIndex: 15,
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.35)",
                        cursor: "pointer",
                        overflow: "hidden",
                      }}
                      title={`${res.title} (${sTime} - ${eTime}) by ${res.user.name}`}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "0.4rem",
                        }}
                      >
                        <span
                          style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            color: "#021210",
                            fontWeight: 800,
                          }}
                        >
                          {res.title}
                        </span>
                        <span style={{ fontSize: "0.65rem", opacity: 0.8, whiteSpace: "nowrap" }}>
                          {sTime}-{eTime}
                        </span>
                      </div>

                      <div
                        style={{
                          fontSize: "0.66rem",
                          fontWeight: 600,
                          color: "rgba(2, 18, 16, 0.85)",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.3rem",
                        }}
                      >
                        <span>{res.user.name}</span>
                        {isPending && (
                          <span
                            style={{
                              background: "#0891b2",
                              color: "#fff",
                              padding: "0 0.3rem",
                              borderRadius: "3px",
                              fontSize: "0.58rem",
                            }}
                          >
                            PENDING
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .timeline-slot:hover {
          background: rgba(0, 212, 178, 0.12) !important;
        }
        .timeline-row:hover {
          background: rgba(255, 255, 255, 0.02);
        }
      `}</style>
    </div>
  );
}
