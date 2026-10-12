"use client";

import { useState } from "react";
import { useCurrentUser } from "@/context/user-context";
import { createReservationAction } from "@/actions/reservation-actions";
import {
  X,
  Calendar,
  Clock,
  Users,
  FileText,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ShieldAlert,
} from "lucide-react";

export type ResourceLite = {
  id: string;
  name: string;
  code: string;
  location: string;
  capacity: number;
  maxDurationMinutes: number;
  isApprovalRequired: boolean;
  category: { name: string };
};

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  resources: ResourceLite[];
  preselectedResourceId?: string;
  initialStartTime?: string;
  initialEndTime?: string;
  onSuccess?: () => void;
}

export function BookingModal({
  isOpen,
  onClose,
  resources,
  preselectedResourceId,
  initialStartTime,
  initialEndTime,
  onSuccess,
}: BookingModalProps) {
  const { currentUser } = useCurrentUser();

  // Helper to format ISO datetime-local
  const formatForInput = (d: Date) => {
    const pad = (n: number) => String(n).padStart(2, "0");
    const y = d.getFullYear();
    const m = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    const h = pad(d.getHours());
    const min = pad(d.getMinutes());
    return `${y}-${m}-${day}T${h}:${min}`;
  };

  const getInitialDates = () => {
    if (initialStartTime && initialEndTime) {
      return { start: initialStartTime, end: initialEndTime };
    }
    const start = new Date();
    // Default to next top of hour
    start.setHours(start.getHours() + 1, 0, 0, 0);
    const end = new Date(start.getTime() + 60 * 60 * 1000); // +1 hour
    return {
      start: formatForInput(start),
      end: formatForInput(end),
    };
  };

  const initialDates = getInitialDates();

  const [resourceId, setResourceId] = useState<string>(
    preselectedResourceId || (resources[0]?.id ?? "")
  );
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState(initialDates.start);
  const [endTime, setEndTime] = useState(initialDates.end);
  const [attendeesCount, setAttendeesCount] = useState(1);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const selectedResource = resources.find((r) => r.id === resourceId) || resources[0];

  // Quick duration helper
  const addDuration = (minutes: number) => {
    const s = new Date(startTime);
    if (!isNaN(s.getTime())) {
      const e = new Date(s.getTime() + minutes * 60 * 1000);
      setEndTime(formatForInput(e));
      setError(null);
    }
  };

  // Calculate duration display
  const sDate = new Date(startTime);
  const eDate = new Date(endTime);
  const durationMinutes =
    !isNaN(sDate.getTime()) && !isNaN(eDate.getTime())
      ? Math.round((eDate.getTime() - sDate.getTime()) / (1000 * 60))
      : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!title.trim()) {
      setError("Please provide a title/purpose for your reservation.");
      return;
    }

    if (durationMinutes <= 0) {
      setError("End time must be after start time.");
      return;
    }

    if (selectedResource && durationMinutes > selectedResource.maxDurationMinutes) {
      setError(
        `Duration exceeds maximum limit of ${selectedResource.maxDurationMinutes} minutes (${selectedResource.maxDurationMinutes / 60} hours).`
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await createReservationAction({
        resourceId,
        userId: currentUser.id,
        title,
        startTime,
        endTime,
        attendeesCount,
        notes,
      });

      if (!res.success) {
        setError(res.error || "Reservation failed.");
      } else {
        setSuccessMessage(res.message || "Reservation confirmed!");
        setTimeout(() => {
          onClose();
          if (onSuccess) onSuccess();
        }, 1200);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1.25rem",
            paddingBottom: "0.85rem",
            borderBottom: "1px solid var(--border-subtle)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "rgba(0, 212, 178, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--accent-teal)",
              }}
            >
              <Sparkles size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--text-main)" }}>
                Reserve PrimeWave Facility
              </h2>
              <p style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>
                Atomic conflict detection & schedule coordinator
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "50%",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text-muted)",
              transition: "all 0.15s ease",
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Current Reserving User Indicator */}
        <div
          style={{
            background: "rgba(15, 23, 42, 0.8)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-md)",
            padding: "0.6rem 0.85rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1.2rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
            <div
              style={{
                width: "26px",
                height: "26px",
                borderRadius: "50%",
                background: "#00d4b2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#000",
                fontSize: "0.75rem",
                fontWeight: 700,
              }}
            >
              {currentUser.name[0]}
            </div>
            <div style={{ fontSize: "0.8rem" }}>
              <span style={{ color: "var(--text-dim)" }}>Reserving as: </span>
              <strong style={{ color: "var(--text-main)" }}>{currentUser.name}</strong>
              <span style={{ color: "var(--text-dim)", marginLeft: "0.4rem" }}>
                ({currentUser.department})
              </span>
            </div>
          </div>
          <span
            style={{
              fontSize: "0.68rem",
              fontWeight: 700,
              padding: "0.15rem 0.5rem",
              borderRadius: "4px",
              background: "rgba(0, 212, 178, 0.12)",
              color: "var(--accent-teal)",
            }}
          >
            {currentUser.role}
          </span>
        </div>

        {/* Success or Error Feedback */}
        {error && (
          <div
            style={{
              background: "rgba(244, 63, 94, 0.12)",
              border: "1px solid rgba(244, 63, 94, 0.35)",
              borderRadius: "var(--radius-md)",
              padding: "0.85rem",
              marginBottom: "1.2rem",
              display: "flex",
              alignItems: "flex-start",
              gap: "0.65rem",
              color: "#fda4af",
              fontSize: "0.84rem",
              lineHeight: 1.4,
            }}
          >
            <ShieldAlert size={18} style={{ flexShrink: 0, marginTop: "2px", color: "#f43f5e" }} />
            <div>{error}</div>
          </div>
        )}

        {successMessage && (
          <div
            style={{
              background: "rgba(16, 185, 129, 0.15)",
              border: "1px solid rgba(16, 185, 129, 0.4)",
              borderRadius: "var(--radius-md)",
              padding: "0.85rem",
              marginBottom: "1.2rem",
              display: "flex",
              alignItems: "center",
              gap: "0.65rem",
              color: "#6ee7b7",
              fontSize: "0.85rem",
              fontWeight: 600,
            }}
          >
            <CheckCircle2 size={18} style={{ color: "#10b981" }} />
            <div>{successMessage}</div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Target Resource */}
          <div className="form-group">
            <label className="form-label">Resource / Facility</label>
            <select
              className="form-select"
              value={resourceId}
              onChange={(e) => setResourceId(e.target.value)}
              required
            >
              {resources.map((r) => (
                <option key={r.id} value={r.id} style={{ background: "#0f172a" }}>
                  {r.code} - {r.name} ({r.category.name} • Max {r.capacity} pax)
                </option>
              ))}
            </select>
          </div>

          {/* Policy Info Notice */}
          {selectedResource && (
            <div
              style={{
                fontSize: "0.75rem",
                color: "var(--text-dim)",
                marginBottom: "1.1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "rgba(255, 255, 255, 0.03)",
                padding: "0.45rem 0.75rem",
                borderRadius: "var(--radius-sm)",
              }}
            >
              <AlertCircle size={14} color="#00d4b2" />
              <span>
                Location: <strong>{selectedResource.location}</strong> • Max Limit:{" "}
                <strong>{selectedResource.maxDurationMinutes / 60} hours</strong>
                {selectedResource.isApprovalRequired && (
                  <span style={{ color: "#38bdf8", marginLeft: "0.4rem" }}>
                    • (Requires Admin Approval)
                  </span>
                )}
              </span>
            </div>
          )}

          {/* Reservation Purpose / Title */}
          <div className="form-group">
            <label className="form-label">Reservation Purpose / Title *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Sprint Planning, Thermal Stress Test, Client VC"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Date & Time Inputs */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>
            <div className="form-group">
              <label className="form-label">
                <Clock size={12} style={{ display: "inline", marginRight: "4px" }} />
                Start Time *
              </label>
              <input
                type="datetime-local"
                className="form-input"
                value={startTime}
                onChange={(e) => {
                  setStartTime(e.target.value);
                  setError(null);
                }}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Clock size={12} style={{ display: "inline", marginRight: "4px" }} />
                End Time *
              </label>
              <input
                type="datetime-local"
                className="form-input"
                value={endTime}
                onChange={(e) => {
                  setEndTime(e.target.value);
                  setError(null);
                }}
                required
              />
            </div>
          </div>

          {/* Quick Duration Buttons & Duration Preview */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "1.1rem",
              background: "rgba(11, 18, 32, 0.6)",
              padding: "0.5rem 0.75rem",
              borderRadius: "var(--radius-sm)",
            }}
          >
            <div style={{ fontSize: "0.76rem", color: "var(--text-dim)" }}>
              Duration:{" "}
              <strong
                style={{
                  color:
                    durationMinutes > 0 &&
                    (!selectedResource || durationMinutes <= selectedResource.maxDurationMinutes)
                      ? "var(--accent-teal)"
                      : "#f43f5e",
                }}
              >
                {durationMinutes > 0
                  ? `${Math.floor(durationMinutes / 60)}h ${durationMinutes % 60}m`
                  : "Invalid range"}
              </strong>
            </div>

            <div style={{ display: "flex", gap: "0.35rem" }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => addDuration(30)}
                style={{ padding: "0.2rem 0.5rem", fontSize: "0.72rem" }}
              >
                +30m
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => addDuration(60)}
                style={{ padding: "0.2rem 0.5rem", fontSize: "0.72rem" }}
              >
                +1h
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => addDuration(120)}
                style={{ padding: "0.2rem 0.5rem", fontSize: "0.72rem" }}
              >
                +2h
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => addDuration(240)}
                style={{ padding: "0.2rem 0.5rem", fontSize: "0.72rem" }}
              >
                +4h
              </button>
            </div>
          </div>

          {/* Attendees Count & Notes */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "0.85rem" }}>
            <div className="form-group">
              <label className="form-label">
                <Users size={12} style={{ display: "inline", marginRight: "4px" }} />
                Attendees
              </label>
              <input
                type="number"
                min={1}
                max={selectedResource ? selectedResource.capacity : 50}
                className="form-input"
                value={attendeesCount}
                onChange={(e) => setAttendeesCount(parseInt(e.target.value) || 1)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <FileText size={12} style={{ display: "inline", marginRight: "4px" }} />
                Notes / Special Requests
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Video recording setup, calibration kit"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          {/* Actions */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "0.75rem",
              marginTop: "1.25rem",
              paddingTop: "1rem",
              borderTop: "1px solid var(--border-subtle)",
            }}
          >
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? (
                <span>Checking & Reserving...</span>
              ) : selectedResource?.isApprovalRequired ? (
                <span>Submit for Approval</span>
              ) : (
                <span>Confirm Reservation</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
