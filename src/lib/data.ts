import prisma from "@/lib/prisma";

export type ResourceWithDetails = Awaited<ReturnType<typeof getResources>>[number];

export async function getUsers() {
  return prisma.user.findMany({
    orderBy: { name: "asc" },
  });
}

export async function getCategories() {
  return prisma.category.findMany({
    include: {
      _count: {
        select: { resources: true },
      },
    },
    orderBy: { name: "asc" },
  });
}

export async function getResources(filters?: {
  categoryId?: string;
  search?: string;
  status?: string;
  minCapacity?: number;
}) {
  const now = new Date();
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 59, 999);

  const whereClause: any = {};

  if (filters?.categoryId && filters.categoryId !== "all") {
    whereClause.categoryId = filters.categoryId;
  }

  if (filters?.status && filters.status !== "all") {
    whereClause.status = filters.status;
  }

  if (filters?.minCapacity) {
    whereClause.capacity = { gte: filters.minCapacity };
  }

  if (filters?.search && filters.search.trim()) {
    const q = filters.search.trim();
    whereClause.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { code: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
      { location: { contains: q, mode: "insensitive" } },
    ];
  }

  const resources = await prisma.resource.findMany({
    where: whereClause,
    include: {
      category: true,
      reservations: {
        where: {
          status: { in: ["CONFIRMED", "PENDING"] },
          startTime: { lte: endOfDay },
          endTime: { gte: startOfDay },
        },
        include: {
          user: {
            select: { id: true, name: true, department: true, avatarUrl: true },
          },
        },
        orderBy: { startTime: "asc" },
      },
      maintenanceLogs: {
        where: {
          status: { in: ["SCHEDULED", "IN_PROGRESS"] },
          startTime: { lte: endOfDay },
          endTime: { gte: startOfDay },
        },
        orderBy: { startTime: "asc" },
      },
    },
    orderBy: [{ status: "asc" }, { name: "asc" }],
  });

  return resources.map((resource) => {
    // Determine current live availability
    const activeReservation = resource.reservations.find(
      (r) => now >= r.startTime && now < r.endTime
    );
    const activeMaintenance = resource.maintenanceLogs.find(
      (m) => now >= m.startTime && now < m.endTime
    );
    const upcomingToday = resource.reservations.filter((r) => r.startTime > now);
    const nextReservation = upcomingToday[0] || null;

    let computedState: "AVAILABLE" | "IN_USE" | "MAINTENANCE" | "INACTIVE" = "AVAILABLE";
    let stateMessage = "Available right now";

    if (resource.status === "MAINTENANCE" || activeMaintenance) {
      computedState = "MAINTENANCE";
      stateMessage = activeMaintenance
        ? `Under maintenance: ${activeMaintenance.title}`
        : "Resource currently in maintenance";
    } else if (resource.status === "INACTIVE") {
      computedState = "INACTIVE";
      stateMessage = "Decommissioned / Inactive";
    } else if (activeReservation) {
      computedState = "IN_USE";
      stateMessage = `In use until ${new Date(activeReservation.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} by ${activeReservation.user.name}`;
    } else if (nextReservation) {
      stateMessage = `Available until ${new Date(nextReservation.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    }

    return {
      ...resource,
      computedState,
      stateMessage,
      activeReservation,
      nextReservation,
      todayReservationsCount: resource.reservations.length,
    };
  });
}

export async function getReservations(filters?: {
  status?: string;
  userId?: string;
  resourceId?: string;
  date?: string;
}) {
  const whereClause: any = {};

  if (filters?.status && filters.status !== "all") {
    whereClause.status = filters.status;
  }

  if (filters?.userId && filters.userId !== "all") {
    whereClause.userId = filters.userId;
  }

  if (filters?.resourceId && filters.resourceId !== "all") {
    whereClause.resourceId = filters.resourceId;
  }

  if (filters?.date) {
    const targetDate = new Date(filters.date);
    const start = new Date(targetDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(targetDate);
    end.setHours(23, 59, 59, 999);

    whereClause.startTime = { lte: end };
    whereClause.endTime = { gte: start };
  }

  return prisma.reservation.findMany({
    where: whereClause,
    include: {
      resource: {
        include: {
          category: true,
        },
      },
      user: true,
    },
    orderBy: { startTime: "desc" },
  });
}

export async function getScheduleTimeline(targetDateString?: string) {
  const targetDate = targetDateString ? new Date(targetDateString) : new Date();
  const startOfDay = new Date(targetDate);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(targetDate);
  endOfDay.setHours(23, 59, 59, 999);

  const resources = await prisma.resource.findMany({
    include: {
      category: true,
      reservations: {
        where: {
          status: { in: ["CONFIRMED", "PENDING", "COMPLETED"] },
          startTime: { lte: endOfDay },
          endTime: { gte: startOfDay },
        },
        include: {
          user: true,
        },
        orderBy: { startTime: "asc" },
      },
      maintenanceLogs: {
        where: {
          startTime: { lte: endOfDay },
          endTime: { gte: startOfDay },
        },
        orderBy: { startTime: "asc" },
      },
    },
    orderBy: [{ category: { name: "asc" } }, { name: "asc" }],
  });

  return {
    targetDate,
    resources,
  };
}

export async function getAnalyticsSummary() {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [
    totalResources,
    totalReservations,
    confirmedReservations,
    categories,
    users,
    recentReservations,
    activityLogs,
    maintenanceCount,
  ] = await Promise.all([
    prisma.resource.count(),
    prisma.reservation.count(),
    prisma.reservation.count({ where: { status: "CONFIRMED" } }),
    prisma.category.findMany({
      include: {
        resources: {
          include: {
            _count: {
              select: { reservations: true },
            },
          },
        },
      },
    }),
    prisma.user.findMany({
      include: {
        _count: {
          select: { reservations: true },
        },
      },
    }),
    prisma.reservation.findMany({
      take: 100,
      include: {
        resource: { include: { category: true } },
        user: true,
      },
      orderBy: { startTime: "desc" },
    }),
    prisma.activityLog.findMany({
      take: 10,
      include: {
        user: true,
        resource: true,
        reservation: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.resource.count({ where: { status: "MAINTENANCE" } }),
  ]);

  // Compute resource leaderboard
  const resourceBookings: Record<string, { name: string; code: string; count: number; category: string; hours: number }> = {};
  recentReservations.forEach((res) => {
    const key = res.resourceId;
    const durationHours = Math.max(0.5, (res.endTime.getTime() - res.startTime.getTime()) / (1000 * 60 * 60));
    if (!resourceBookings[key]) {
      resourceBookings[key] = {
        name: res.resource.name,
        code: res.resource.code,
        category: res.resource.category.name,
        count: 0,
        hours: 0,
      };
    }
    resourceBookings[key].count += 1;
    resourceBookings[key].hours += durationHours;
  });

  const topResources = Object.values(resourceBookings)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Compute department breakdown
  const departmentCounts: Record<string, number> = {};
  recentReservations.forEach((res) => {
    const dept = res.user.department || "General";
    departmentCounts[dept] = (departmentCounts[dept] || 0) + 1;
  });

  // Compute peak hours distribution (8 AM to 7 PM)
  const hourlyDistribution: Record<number, number> = {};
  for (let h = 8; h <= 19; h++) {
    hourlyDistribution[h] = 0;
  }
  recentReservations.forEach((res) => {
    const startHour = res.startTime.getHours();
    if (startHour >= 8 && startHour <= 19) {
      hourlyDistribution[startHour] = (hourlyDistribution[startHour] || 0) + 1;
    }
  });

  // Compute average reservation duration
  let totalDurationHours = 0;
  recentReservations.forEach((res) => {
    totalDurationHours += (res.endTime.getTime() - res.startTime.getTime()) / (1000 * 60 * 60);
  });
  const averageDurationHours =
    recentReservations.length > 0
      ? parseFloat((totalDurationHours / recentReservations.length).toFixed(1))
      : 0;

  return {
    totalResources,
    totalReservations,
    confirmedReservations,
    maintenanceCount,
    categoriesCount: categories.length,
    usersCount: users.length,
    topResources,
    departmentCounts,
    hourlyDistribution,
    activityLogs,
    averageDurationHours,
  };
}
