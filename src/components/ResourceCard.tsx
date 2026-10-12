"use client";

import { ResourceWithDetails } from "@/lib/data";
import {
  MapPin,
  Users,
  Clock,
  ShieldCheck,
  Wrench,
  Calendar,
  Sparkles,
  ChevronRight,
} from "lucide-react";

interface ResourceCardProps {
  resource: ResourceWithDetails;
  onBook: (resourceId: string) => void;
  onViewSchedule?: (resourceId: string) => void;
}

export function ResourceCard({ resource, onBook }: ResourceCardProps) {
  const isAvailable = resource.computedState === "AVAILABLE";
  const isInUse = resource.computedState === "IN_USE";
  const isMaintenance = resource.computedState === "MAINTENANCE";

  return (
    <div
      className="glass-panel"
      style={{
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Card Image Banner */}
      <div
        style={{
          position: "relative",
          height: "185px",
          width: "100%",
          overflow: "hidden",
          background: "linear-gradient(180deg, #1e293b 0%, #0f172a 100%)",
        }}
      >
        {resource.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={resource.imageUrl}
            alt={resource.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: isMaintenance ? "grayscale(70%) brightness(0.7)" : "brightness(0.85)",
              transition: "transform 0.5s ease",
            }}
          />
        )}

        {/* Gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(8, 13, 22, 0.2) 0%, rgba(8, 13, 22, 0.95) 100%)",
          }}
        />

        {/* Top Badges */}
        <div
          style={{
            position: "absolute",
            top: "0.75rem",
            left: "0.75rem",
            right: "0.75rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Resource Code Chip */}
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.72rem",
              fontWeight: 700,
              padding: "0.2rem 0.55rem",
              borderRadius: "var(--radius-sm)",
              background: "rgba(8, 13, 22, 0.85)",
              backdropFilter: "blur(8px)",
              border: "1px solid var(--border-subtle)",
              color: "#38bdf8",
              letterSpacing: "0.03em",
            }}
          >
            {resource.code}
          </span>

          {/* Category Chip */}
          <span
            style={{
              fontSize: "0.7rem",
              fontWeight: 600,
              padding: "0.2rem 0.6rem",
              borderRadius: "9999px",
              background: "rgba(0, 212, 178, 0.15)",
              border: "1px solid rgba(0, 212, 178, 0.3)",
              color: "var(--accent-teal)",
              backdropFilter: "blur(8px)",
            }}
          >
            {resource.category.name}
          </span>
        </div>

        {/* Dynamic Status Pill */}
        <div
          style={{
            position: "absolute",
            bottom: "0.75rem",
            left: "0.75rem",
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
          }}
        >
          {isAvailable && (
            <div className="badge badge-available">
              <span className="pulse-indicator pulse-green" />
              <span>Available Now</span>
            </div>
          )}

          {isInUse && (
            <div className="badge badge-inuse">
              <span className="pulse-indicator pulse-red" />
              <span>In Use</span>
            </div>
          )}

          {isMaintenance && (
            <div className="badge badge-maintenance">
              <span className="pulse-indicator pulse-amber" />
              <span>Under Maintenance</span>
            </div>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div
        style={{
          padding: "1.15rem",
          display: "flex",
          flexDirection: "column",
          flex: 1,
          gap: "0.75rem",
        }}
      >
        <div>
          <h3
            style={{
              fontSize: "1.05rem",
              fontWeight: 700,
              color: "var(--text-main)",
              marginBottom: "0.3rem",
            }}
          >
            {resource.name}
          </h3>
          <p
            style={{
              fontSize: "0.8rem",
              color: "var(--text-dim)",
              lineHeight: 1.4,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {resource.description}
          </p>
        </div>

        {/* Metadata Chips: Location & Capacity */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.75rem",
            fontSize: "0.76rem",
            color: "var(--text-muted)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
            <MapPin size={14} color="#00d4b2" />
            <span>{resource.location}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
            <Users size={14} color="#38bdf8" />
            <span>Capacity: {resource.capacity} pax</span>
          </div>
        </div>

        {/* Live Slot / Status Details */}
        <div
          style={{
            background: "rgba(11, 18, 32, 0.7)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-sm)",
            padding: "0.55rem 0.75rem",
            fontSize: "0.74rem",
            display: "flex",
            alignItems: "center",
            gap: "0.45rem",
            color: isAvailable ? "#a7f3d0" : isInUse ? "#fda4af" : "#fde68a",
          }}
        >
          {isMaintenance ? (
            <Wrench size={13} />
          ) : isAvailable ? (
            <Clock size={13} />
          ) : (
            <ShieldCheck size={13} />
          )}
          <span style={{ fontWeight: 500 }}>{resource.stateMessage}</span>
        </div>

        {/* Amenities List */}
        {resource.amenities && resource.amenities.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginTop: "auto" }}>
            {resource.amenities.slice(0, 3).map((amenity, idx) => (
              <span
                key={idx}
                style={{
                  fontSize: "0.68rem",
                  padding: "0.2rem 0.5rem",
                  borderRadius: "4px",
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid var(--border-subtle)",
                  color: "var(--text-muted)",
                }}
              >
                {amenity}
              </span>
            ))}
            {resource.amenities.length > 3 && (
              <span
                style={{
                  fontSize: "0.68rem",
                  padding: "0.2rem 0.4rem",
                  color: "var(--text-dim)",
                }}
              >
                +{resource.amenities.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Footer Action */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: "0.75rem",
            borderTop: "1px solid var(--border-subtle)",
            marginTop: "0.5rem",
          }}
        >
          <div style={{ fontSize: "0.72rem", color: "var(--text-dim)" }}>
            {resource.todayReservationsCount} bookings today
          </div>

          <button
            onClick={() => onBook(resource.id)}
            disabled={isMaintenance}
            className="btn btn-primary btn-sm"
            style={{
              padding: "0.4rem 0.85rem",
              fontSize: "0.78rem",
            }}
          >
            <span>{isMaintenance ? "In Maintenance" : "Book Resource"}</span>
            <ChevronRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
