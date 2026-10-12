"use client";

import { useState } from "react";
import { useCurrentUser } from "@/context/user-context";
import { format } from "date-fns";
import {
  cancelReservationAction,
  checkInReservationAction,
  updateReservationStatusAction,
} from "@/actions/reservation-actions";
import { BookingModal, ResourceLite } from "@/components/BookingModal";
import {
  Clock,
  Calendar,
  MapPin,
  Users,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Filter,
  PlusCircle,
  ShieldCheck,
  Ban,
  LogIn,
  Search,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface ReservationsClientProps {
  initialReservations: any[];
  allResources: any[];
}

export function ReservationsClient({
  initialReservations,
  allResources,
}: ReservationsClientProps) {
  const router = useRouter();
  const { currentUser } = useCurrentUser();

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [userScope, setUserScope] = useState<"all" | "mine">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedResourceId, setSelectedResourceId] = useState<string>("all");

  // Cancellation modal state
  const [cancelModalId, setCancelModalId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);

  // New reservation modal state
  const [isNewBookingOpen, setIsNewBookingOpen] = useState(false);

  // Action status message
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

  const resourcesLite: ResourceLite[] = allResources.map((r) => ({
    id: r.id,
    name: r.name,
    code: r.code,
    location: r.location,
    capacity: r.capacity,
    maxDurationMinutes: r.maxDurationMinutes,
    isApprovalRequired: r.isApprovalRequired,
    category: { name: r.category.name },
  }));

  const filteredReservations = initialReservations.filter((res) => {
    if (statusFilter !== "all" && res.status !== statusFilter) return false;
    if (userScope === "mine" && res.userId !== currentUser.id) return false;
    if (selectedResourceId !== "all" && res.resourceId !== selectedResourceId) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = res.title.toLowerCase().includes(q);
      const matchResource = res.resource.name.toLowerCase().includes(q);
      const matchUser = res.user.name.toLowerCase().includes(q);
      const matchDept = res.user.department?.toLowerCase().includes(q);
      if (!matchTitle && !matchResource && !matchUser && !matchDept) return false;
    }

    return true;
  });

  const handleCheckIn = async (id: string) => {
    setFeedback(null);
    const res = await checkInReservationAction(id);
    if (res.success) {
      setFeedback({ type: "success", text: "Successfully checked in to your reservation!" });
      router.refresh();
    } else {
      setFeedback({ type: "error", text: res.error || "Check-in failed." });
    }
  };

  const handleConfirmCancel = async () => {
    if (!cancelModalId) return;
    setIsCancelling(true);
    setFeedback(null);

    const res = await cancelReservationAction(cancelModalId, cancelReason, currentUser.id);
    setIsCancelling(false);
    setCancelModalId(null);
    setCancelReason("");

    if (res.success) {
      setFeedback({ type: "success", text: "Reservation cancelled successfully." });
      router.refresh();
    } else {
      setFeedback({ type: "error", text: res.error || "Could not cancel reservation." });
    }
  };

  const handleAdminApproval = async (id: string, newStatus: "CONFIRMED" | "REJECTED") => {
    setFeedback(null);
    const res = await updateReservationStatusAction(id, newStatus, currentUser.id);
    if (res.success) {
      setFeedback({
        type: "success",
        text: `Reservation successfully marked as ${newStatus}!`,
      });
      router.refresh();
    } else {
      setFeedback({ type: "error", text: res.error || "Approval action failed." });
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--text-main)" }}>
              Reservation Management
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
              {initialReservations.length} Total Records
            </span>
          </div>
          <p style={{ fontSize: "0.85rem", color: "var(--text-dim)", marginTop: "0.25rem" }}>
            Review, check in, cancel, or approve reservations across all PrimeWave facilities.
          </p>
        </div>

        <button onClick={() => setIsNewBookingOpen(true)} className="btn btn-primary">
          <PlusCircle size={16} />
          <span>New Reservation</span>
        </button>
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <div
          style={{
            background:
              feedback.type === "success" ? "rgba(16, 185, 129, 0.15)" : "rgba(244, 63, 94, 0.15)",
            border: `1px solid ${feedback.type === "success" ? "rgba(16, 185, 129, 0.35)" : "rgba(244, 63, 94, 0.35)"}`,
            borderRadius: "var(--radius-md)",
            padding: "0.85rem 1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            color: feedback.type === "success" ? "#6ee7b7" : "#fda4af",
            fontSize: "0.85rem",
            fontWeight: 600,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {feedback.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{feedback.text}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            style={{
              background: "transparent",
              color: "inherit",
              fontSize: "0.8rem",
              fontWeight: 700,
            }}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Filters Bar */}
      <div
        className="glass-panel"
        style={{
          padding: "1rem 1.25rem",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        {/* Scope Pill Toggle (All vs My Bookings) */}
        <div
          style={{
            display: "flex",
            background: "rgba(11, 18, 32, 0.8)",
            padding: "0.25rem",
            borderRadius: "var(--radius-full)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <button
            onClick={() => setUserScope("all")}
            style={{
              padding: "0.4rem 0.85rem",
              borderRadius: "var(--radius-full)",
              fontSize: "0.78rem",
              fontWeight: 600,
              background: userScope === "all" ? "var(--accent-teal)" : "transparent",
              color: userScope === "all" ? "#031412" : "var(--text-muted)",
              transition: "all 0.15s ease",
            }}
          >
            All Bookings
          </button>
          <button
            onClick={() => setUserScope("mine")}
            style={{
              padding: "0.4rem 0.85rem",
              borderRadius: "var(--radius-full)",
              fontSize: "0.78rem",
              fontWeight: 600,
              background: userScope === "mine" ? "var(--accent-teal)" : "transparent",
              color: userScope === "mine" ? "#031412" : "var(--text-muted)",
              transition: "all 0.15s ease",
            }}
          >
            My Bookings ({currentUser.name.split(" ")[0]})
          </button>
        </div>

        {/* Search */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "rgba(11, 18, 32, 0.8)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-md)",
            padding: "0.45rem 0.75rem",
            flex: 1,
            minWidth: "220px",
          }}
        >
          <Search size={14} color="#00d4b2" />
          <input
            type="text"
            placeholder="Search bookings, members, or facilities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              background: "transparent",
              border: "none",
              color: "#fff",
              fontSize: "0.82rem",
              width: "100%",
              outline: "none",
            }}
          />
        </div>

        {/* Status Dropdown */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              width: "auto",
              padding: "0.45rem 0.75rem",
              fontSize: "0.8rem",
            }}
          >
            <option value="all">All Statuses</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PENDING">Pending Approval</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          {/* Facility Dropdown */}
          <select
            className="form-select"
            value={selectedResourceId}
            onChange={(e) => setSelectedResourceId(e.target.value)}
            style={{
              width: "auto",
              padding: "0.45rem 0.75rem",
              fontSize: "0.8rem",
            }}
          >
            <option value="all">All Facilities</option>
            {allResources.map((r) => (
              <option key={r.id} value={r.id}>
                {r.code} - {r.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Reservations List */}
      {filteredReservations.length === 0 ? (
        <div
          className="glass-panel"
          style={{
            padding: "4rem 2rem",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <div
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.05)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text-dim)",
            }}
          >
            <Clock size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-main)" }}>
              No reservations found
            </h3>
            <p style={{ fontSize: "0.82rem", color: "var(--text-dim)", marginTop: "0.25rem" }}>
              There are no matching reservations for the active filters.
            </p>
          </div>
          <button onClick={() => setIsNewBookingOpen(true)} className="btn btn-primary btn-sm">
            Book a Facility Now
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {filteredReservations.map((res) => {
            const isConfirmed = res.status === "CONFIRMED";
            const isPending = res.status === "PENDING";
            const isCancelled = res.status === "CANCELLED";
            const isCompleted = res.status === "COMPLETED";

            const sDate = new Date(res.startTime);
            const eDate = new Date(res.endTime);
            const isOwner = res.userId === currentUser.id;
            const isAdmin = currentUser.role === "ADMIN";

            return (
              <div
                key={res.id}
                className="glass-panel"
                style={{
                  padding: "1.25rem 1.5rem",
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "1.25rem",
                  borderLeft: `4px solid ${
                    isConfirmed
                      ? "var(--accent-teal)"
                      : isPending
                        ? "#06b6d4"
                        : isCancelled
                          ? "#f43f5e"
                          : "#64748b"
                  }`,
                }}
              >
                {/* Left: Info */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", flex: 1, minWidth: "280px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        padding: "0.15rem 0.45rem",
                        borderRadius: "3px",
                        background: "rgba(255, 255, 255, 0.08)",
                        color: "#38bdf8",
                      }}
                    >
                      {res.resource.code}
                    </span>

                    <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-main)" }}>
                      {res.title}
                    </h3>

                    {/* Status Badge */}
                    {isConfirmed && <span className="badge badge-available">Confirmed</span>}
                    {isPending && <span className="badge badge-pending">Pending Approval</span>}
                    {isCancelled && <span className="badge badge-inuse">Cancelled</span>}
                    {isCompleted && <span className="badge badge-completed">Completed</span>}
                  </div>

                  {/* Resource & Location */}
                  <div
                    style={{
                      fontSize: "0.82rem",
                      color: "var(--text-muted)",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <strong style={{ color: "var(--text-main)" }}>{res.resource.name}</strong>
                    <span>•</span>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                      <MapPin size={13} color="#00d4b2" />
                      <span>{res.resource.location}</span>
                    </div>
                  </div>

                  {/* Notes / Reason */}
                  {res.notes && (
                    <div style={{ fontSize: "0.76rem", color: "var(--text-dim)", fontStyle: "italic" }}>
                      "{res.notes}"
                    </div>
                  )}

                  {isCancelled && res.cancellationReason && (
                    <div style={{ fontSize: "0.76rem", color: "#fca5a5" }}>
                      Cancellation reason: {res.cancellationReason}
                    </div>
                  )}
                </div>

                {/* Center: Timing & Booked By */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.35rem",
                    fontSize: "0.8rem",
                    color: "var(--text-muted)",
                    minWidth: "220px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <Calendar size={14} color="#00d4b2" />
                    <span>{format(sDate, "EEE, MMM d, yyyy")}</span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <Clock size={14} color="#38bdf8" />
                    <span>
                      {format(sDate, "HH:mm")} - {format(eDate, "HH:mm")}
                    </span>
                  </div>

                  {/* Booked By */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.45rem",
                      marginTop: "0.2rem",
                    }}
                  >
                    <div
                      style={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        background: "#00d4b2",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.65rem",
                        fontWeight: 700,
                        color: "#000",
                      }}
                    >
                      {res.user.name[0]}
                    </div>
                    <span style={{ fontSize: "0.76rem" }}>
                      {res.user.name} ({res.user.department})
                    </span>
                  </div>

                  {res.checkInTime && (
                    <div style={{ fontSize: "0.72rem", color: "#34d399", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                      <CheckCircle2 size={12} />
                      <span>Checked in at {format(new Date(res.checkInTime), "HH:mm")}</span>
                    </div>
                  )}
                </div>

                {/* Right: Actions */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  {/* Admin Approval Actions for Pending */}
                  {isPending && isAdmin && (
                    <>
                      <button
                        onClick={() => handleAdminApproval(res.id, "CONFIRMED")}
                        className="btn btn-primary btn-sm"
                        title="Approve Reservation"
                      >
                        <CheckCircle2 size={14} />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => handleAdminApproval(res.id, "REJECTED")}
                        className="btn btn-danger btn-sm"
                        title="Reject Reservation"
                      >
                        <XCircle size={14} />
                        <span>Reject</span>
                      </button>
                    </>
                  )}

                  {/* Check-In Action (Only if confirmed and not checked in yet) */}
                  {isConfirmed && !res.checkInTime && (
                    <button
                      onClick={() => handleCheckIn(res.id)}
                      className="btn btn-secondary btn-sm"
                      title="Confirm on-site arrival"
                      style={{ borderColor: "rgba(0, 212, 178, 0.4)", color: "#00d4b2" }}
                    >
                      <LogIn size={14} />
                      <span>Check In</span>
                    </button>
                  )}

                  {/* Cancel Button (Owner or Admin can cancel uncancelled/non-completed) */}
                  {(isConfirmed || isPending) && (isOwner || isAdmin) && (
                    <button
                      onClick={() => setCancelModalId(res.id)}
                      className="btn btn-danger btn-sm"
                      title="Cancel this reservation"
                    >
                      <Ban size={14} />
                      <span>Cancel</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {cancelModalId && (
        <div className="modal-overlay" onClick={() => setCancelModalId(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "460px" }}>
            <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--text-main)", marginBottom: "0.5rem" }}>
              Cancel Reservation?
            </h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
              This will free the facility for other team members immediately.
            </p>

            <div className="form-group">
              <label className="form-label">Reason for cancellation (optional)</label>
              <textarea
                className="form-textarea"
                placeholder="e.g. Meeting rescheduled, client cancelled visit"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.6rem" }}>
              <button
                className="btn btn-secondary"
                onClick={() => setCancelModalId(null)}
                disabled={isCancelling}
              >
                Keep Reservation
              </button>
              <button
                className="btn btn-danger"
                onClick={handleConfirmCancel}
                disabled={isCancelling}
              >
                {isCancelling ? "Cancelling..." : "Confirm Cancellation"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Booking Modal */}
      <BookingModal
        isOpen={isNewBookingOpen}
        onClose={() => setIsNewBookingOpen(false)}
        resources={resourcesLite}
        onSuccess={() => {
          router.refresh();
        }}
      />
    </div>
  );
}
