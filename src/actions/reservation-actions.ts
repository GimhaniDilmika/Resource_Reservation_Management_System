"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type ActionResult<T = any> = {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;
};

export async function createReservationAction(formData: {
  resourceId: string;
  userId: string;
  title: string;
  startTime: string;
  endTime: string;
  attendeesCount?: number;
  notes?: string;
}): Promise<ActionResult> {
  try {
    const { resourceId, userId, title, startTime, endTime, attendeesCount, notes } = formData;

    if (!resourceId || !userId || !title || !startTime || !endTime) {
      return { success: false, error: "Please fill in all required fields." };
    }

    const start = new Date(startTime);
    const end = new Date(endTime);
    const now = new Date();

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return { success: false, error: "Invalid date or time provided." };
    }

    if (end <= start) {
      return { success: false, error: "End time must be after start time." };
    }

    // 5-minute grace period for near-instant booking
    const gracePeriodMs = 5 * 60 * 1000;
    if (start.getTime() < now.getTime() - gracePeriodMs) {
      return { success: false, error: "Reservations cannot be created for past times." };
    }

    // 1. Fetch resource and verify operational state
    const resource = await prisma.resource.findUnique({
      where: { id: resourceId },
    });

    if (!resource) {
      return { success: false, error: "Selected resource does not exist." };
    }

    if (resource.status === "INACTIVE") {
      return { success: false, error: "This resource is decommissioned and cannot be reserved." };
    }

    if (resource.status === "MAINTENANCE") {
      return { success: false, error: "This resource is currently under maintenance." };
    }

    // 2. Validate maximum allowed duration
    const durationMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
    if (durationMinutes > resource.maxDurationMinutes) {
      return {
        success: false,
        error: `Reservation exceeds the maximum allowed duration of ${resource.maxDurationMinutes} minutes (requested ${Math.round(durationMinutes)} mins).`,
      };
    }

    // 3. Check for overlapping scheduled maintenance
    const maintenanceConflict = await prisma.maintenanceLog.findFirst({
      where: {
        resourceId,
        status: { in: ["SCHEDULED", "IN_PROGRESS"] },
        startTime: { lt: end },
        endTime: { gt: start },
      },
    });

    if (maintenanceConflict) {
      return {
        success: false,
        error: `Cannot reserve: Scheduled maintenance "${maintenanceConflict.title}" overlaps with this time window.`,
      };
    }

    // 4. Strict Overlap / Double-Booking Prevention Query
    const overlappingReservation = await prisma.reservation.findFirst({
      where: {
        resourceId,
        status: { in: ["CONFIRMED", "PENDING"] },
        startTime: { lt: end },
        endTime: { gt: start },
      },
      include: {
        user: { select: { name: true, department: true } },
      },
    });

    if (overlappingReservation) {
      const conflictStart = new Date(overlappingReservation.startTime).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      const conflictEnd = new Date(overlappingReservation.endTime).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      return {
        success: false,
        error: `Scheduling Conflict: "${resource.name}" is already booked by ${overlappingReservation.user.name} (${overlappingReservation.user.department}) between ${conflictStart} and ${conflictEnd}. Please select an alternate slot.`,
      };
    }

    // 5. Determine initial status based on resource approval requirements
    const initialStatus = resource.isApprovalRequired ? "PENDING" : "CONFIRMED";

    // 6. Atomic creation and audit logging
    const newReservation = await prisma.$transaction(async (tx) => {
      const reservation = await tx.reservation.create({
        data: {
          title: title.trim(),
          resourceId,
          userId,
          startTime: start,
          endTime: end,
          attendeesCount: attendeesCount ? Math.max(1, attendeesCount) : 1,
          notes: notes?.trim() || null,
          status: initialStatus,
        },
        include: {
          resource: true,
          user: true,
        },
      });

      await tx.activityLog.create({
        data: {
          action: initialStatus === "PENDING" ? "RESERVATION_PENDING_APPROVAL" : "RESERVATION_CONFIRMED",
          details: `${reservation.user.name} booked ${reservation.resource.name} (${reservation.title}) for ${start.toLocaleDateString()} ${start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
          userId,
          resourceId,
          reservationId: reservation.id,
        },
      });

      return reservation;
    });

    revalidatePath("/");
    revalidatePath("/schedule");
    revalidatePath("/reservations");
    revalidatePath("/analytics");

    return {
      success: true,
      message:
        initialStatus === "PENDING"
          ? "Reservation submitted for administrator approval!"
          : "Reservation successfully confirmed!",
      data: newReservation,
    };
  } catch (err: any) {
    console.error("Error creating reservation:", err);
    return {
      success: false,
      error: err.message || "Failed to create reservation due to a database error.",
    };
  }
}

export async function cancelReservationAction(
  reservationId: string,
  reason?: string,
  cancelledByUserId?: string
): Promise<ActionResult> {
  try {
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: { user: true, resource: true },
    });

    if (!reservation) {
      return { success: false, error: "Reservation not found." };
    }

    if (reservation.status === "CANCELLED") {
      return { success: false, error: "This reservation is already cancelled." };
    }

    await prisma.$transaction(async (tx) => {
      await tx.reservation.update({
        where: { id: reservationId },
        data: {
          status: "CANCELLED",
          cancellationReason: reason?.trim() || "Cancelled by user",
        },
      });

      await tx.activityLog.create({
        data: {
          action: "RESERVATION_CANCELLED",
          details: `Reservation "${reservation.title}" for ${reservation.resource.name} was cancelled. Reason: ${reason || "No reason specified."}`,
          userId: cancelledByUserId || reservation.userId,
          resourceId: reservation.resourceId,
          reservationId: reservation.id,
        },
      });
    });

    revalidatePath("/");
    revalidatePath("/schedule");
    revalidatePath("/reservations");
    revalidatePath("/analytics");

    return { success: true, message: "Reservation cancelled successfully." };
  } catch (err: any) {
    console.error("Error cancelling reservation:", err);
    return { success: false, error: err.message || "Could not cancel reservation." };
  }
}

export async function checkInReservationAction(reservationId: string): Promise<ActionResult> {
  try {
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: { resource: true, user: true },
    });

    if (!reservation) {
      return { success: false, error: "Reservation not found." };
    }

    await prisma.$transaction(async (tx) => {
      await tx.reservation.update({
        where: { id: reservationId },
        data: {
          checkInTime: new Date(),
        },
      });

      await tx.activityLog.create({
        data: {
          action: "RESERVATION_CHECKED_IN",
          details: `${reservation.user.name} checked in to ${reservation.resource.name} for "${reservation.title}"`,
          userId: reservation.userId,
          resourceId: reservation.resourceId,
          reservationId: reservation.id,
        },
      });
    });

    revalidatePath("/");
    revalidatePath("/schedule");
    revalidatePath("/reservations");

    return { success: true, message: "Successfully checked in!" };
  } catch (err: any) {
    return { success: false, error: err.message || "Could not check in." };
  }
}

export async function updateReservationStatusAction(
  reservationId: string,
  newStatus: "CONFIRMED" | "REJECTED",
  adminUserId?: string
): Promise<ActionResult> {
  try {
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: { resource: true, user: true },
    });

    if (!reservation) {
      return { success: false, error: "Reservation not found." };
    }

    await prisma.$transaction(async (tx) => {
      await tx.reservation.update({
        where: { id: reservationId },
        data: { status: newStatus },
      });

      await tx.activityLog.create({
        data: {
          action: newStatus === "CONFIRMED" ? "RESERVATION_APPROVED" : "RESERVATION_REJECTED",
          details: `Admin changed status of "${reservation.title}" for ${reservation.resource.name} to ${newStatus}`,
          userId: adminUserId,
          resourceId: reservation.resourceId,
          reservationId: reservation.id,
        },
      });
    });

    revalidatePath("/");
    revalidatePath("/schedule");
    revalidatePath("/reservations");
    revalidatePath("/analytics");

    return { success: true, message: `Reservation marked as ${newStatus}.` };
  } catch (err: any) {
    return { success: false, error: err.message || "Action failed." };
  }
}
