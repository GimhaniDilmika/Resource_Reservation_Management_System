import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL must be specified");
}
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding PrimeWave Lab database...");

  // Clean existing records in correct relation order
  await prisma.activityLog.deleteMany();
  await prisma.maintenanceLog.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.resource.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // 1. Seed Users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: "Sarah Jenkins",
        email: "sarah.j@primewave.com",
        department: "Operations",
        role: "ADMIN",
        avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      },
    }),
    prisma.user.create({
      data: {
        name: "Alex Rivera",
        email: "alex.r@primewave.com",
        department: "Hardware Engineering",
        role: "MEMBER",
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      },
    }),
    prisma.user.create({
      data: {
        name: "Priya Sharma",
        email: "priya.s@primewave.com",
        department: "Software Engineering",
        role: "MEMBER",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      },
    }),
    prisma.user.create({
      data: {
        name: "Marcus Chen",
        email: "marcus.c@primewave.com",
        department: "Facilities & IT",
        role: "STAFF",
        avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      },
    }),
    prisma.user.create({
      data: {
        name: "Elena Rostova",
        email: "elena.r@primewave.com",
        department: "Product & Design",
        role: "MEMBER",
        avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
      },
    }),
  ]);

  const [sarah, alex, priya, marcus, elena] = users;

  // 2. Seed Categories
  const catRooms = await prisma.category.create({
    data: {
      name: "Conference & Meeting Rooms",
      slug: "conference-rooms",
      description: "Dedicated spaces equipped with video conferencing, smart boards, and acoustic isolation.",
      icon: "DoorOpen",
    },
  });

  const catLabs = await prisma.category.create({
    data: {
      name: "Hardware & Testing Rigs",
      slug: "hardware-labs",
      description: "Precision instrumentation benches, thermal chambers, and prototyping equipment.",
      icon: "Cpu",
    },
  });

  const catMedia = await prisma.category.create({
    data: {
      name: "Media & Audio/Visual Studio",
      slug: "media-studio",
      description: "Acoustically treated production rooms for podcasts, tech demos, and keynote broadcasts.",
      icon: "Video",
    },
  });

  const catFleet = await prisma.category.create({
    data: {
      name: "Logistics & Company Vehicles",
      slug: "company-fleet",
      description: "Electric utility vehicles and transit vans for on-site diagnostics and field client visits.",
      icon: "Car",
    },
  });

  // 3. Seed Resources
  const rBoardroom = await prisma.resource.create({
    data: {
      name: "Executive Boardroom Alpha",
      code: "RES-CR-01",
      description: "Primary presentation room with 85-inch 4K HDR display, dual PTZ conferencing cameras, and conference phone.",
      categoryId: catRooms.id,
      location: "Building A, Floor 3 (Wing E)",
      capacity: 16,
      status: "AVAILABLE",
      isApprovalRequired: true,
      maxDurationMinutes: 300,
      amenities: ["Dual 4K Screens", "Zoom Rooms Rig", "Conference Phone", "Whiteboard", "Ergonomic Chairs"],
      imageUrl: "https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=600&auto=format&fit=crop&q=80",
    },
  });

  await prisma.resource.create({
    data: {
      name: "Agile Innovation Hub #2",
      code: "RES-CR-02",
      description: "Collaborative breakout space for sprint planning, design critiques, and standups.",
      categoryId: catRooms.id,
      location: "Building A, Floor 2 (Center)",
      capacity: 8,
      status: "AVAILABLE",
      isApprovalRequired: false,
      maxDurationMinutes: 180,
      amenities: ["Interactive Whiteboard", "Wireless Screen Sharing", "Standing Desk Module"],
      imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop&q=80",
    },
  });

  const rFocusPod = await prisma.resource.create({
    data: {
      name: "Acoustic Focus Pod Gamma",
      code: "RES-CR-03",
      description: "Ultra-quiet private pod for sensitive interviews, high-focus coding, and 1-on-1 syncs.",
      categoryId: catRooms.id,
      location: "Building B, Floor 1 (Quiet Zone)",
      capacity: 2,
      status: "AVAILABLE",
      isApprovalRequired: false,
      maxDurationMinutes: 120,
      amenities: ["Soundproofing 40dB", "Dual USB-C Power", "Air Ventilation"],
      imageUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&auto=format&fit=crop&q=80",
    },
  });

  const rThermal = await prisma.resource.create({
    data: {
      name: "Thermal Environmental Chamber",
      code: "RES-LAB-01",
      description: "-40°C to +150°C programmable temperature & humidity stress testing chamber.",
      categoryId: catLabs.id,
      location: "Hardware Engineering Bay, Room 104",
      capacity: 2,
      status: "AVAILABLE",
      isApprovalRequired: true,
      maxDurationMinutes: 480,
      amenities: ["Automated Data Logging", "Programmable Profile Cycles", "Safety Gas Exhaust"],
      imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80",
    },
  });

  const rRfBench = await prisma.resource.create({
    data: {
      name: "RF & Spectrum Analysis Bench",
      code: "RES-LAB-02",
      description: "Keysight 6GHz Spectrum Analyzer, 4-Channel High-Speed Digital Oscilloscope, and EMI probe kit.",
      categoryId: catLabs.id,
      location: "Hardware Engineering Bay, Bench 7",
      capacity: 2,
      status: "MAINTENANCE",
      isApprovalRequired: false,
      maxDurationMinutes: 240,
      amenities: ["6GHz Spectrum Analyzer", "Isolated Ground Power", "Anti-Static Mat & Wrist Straps"],
      imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&auto=format&fit=crop&q=80",
    },
  });

  const rStudio = await prisma.resource.create({
    data: {
      name: "PrimeWave Media & Podcast Suite",
      code: "RES-AV-01",
      description: "Soundproof broadcast studio with Blackmagic ATEM Mini, Sony FX3 4K cameras, and Shure SM7B microphones.",
      categoryId: catMedia.id,
      location: "Building C, Ground Studio",
      capacity: 4,
      status: "AVAILABLE",
      isApprovalRequired: false,
      maxDurationMinutes: 240,
      amenities: ["Shure SM7B Mic Set", "Teleprompter", "Aputure Studio Lighting", "Green Screen Backdrop"],
      imageUrl: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&auto=format&fit=crop&q=80",
    },
  });

  const rVehicle = await prisma.resource.create({
    data: {
      name: "Field Operations EV #01 (Model Y)",
      code: "RES-VEH-01",
      description: "Dual-motor electric vehicle equipped with field engineering toolboxes, power inverters, and secure equipment trunk.",
      categoryId: catFleet.id,
      location: "West Parking Bay - EV Charger #3",
      capacity: 5,
      status: "AVAILABLE",
      isApprovalRequired: true,
      maxDurationMinutes: 600,
      amenities: ["110V Inverter Power", "Onboard GPS", "All-Weather Diagnostic Kit", "Fast Charge Access"],
      imageUrl: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=600&auto=format&fit=crop&q=80",
    },
  });

  // 4. Seed Reservations (Relative to current time)
  const now = new Date();
  const todayAt = (hours: number, minutes = 0) => {
    const d = new Date(now);
    d.setHours(hours, minutes, 0, 0);
    return d;
  };

  const tomorrowAt = (hours: number, minutes = 0) => {
    const d = new Date(now);
    d.setDate(d.getDate() + 1);
    d.setHours(hours, minutes, 0, 0);
    return d;
  };

  const yesterdayAt = (hours: number, minutes = 0) => {
    const d = new Date(now);
    d.setDate(d.getDate() - 1);
    d.setHours(hours, minutes, 0, 0);
    return d;
  };

  // Past reservation (Completed)
  await prisma.reservation.create({
    data: {
      title: "Sprint 42 Demo & Review",
      resourceId: rBoardroom.id,
      userId: priya.id,
      startTime: yesterdayAt(14, 0),
      endTime: yesterdayAt(15, 30),
      status: "COMPLETED",
      attendeesCount: 12,
      notes: "Sprint deliverables demonstration with product stakeholders.",
      checkInTime: yesterdayAt(14, 2),
    },
  });

  // Active / Upcoming reservations for today
  await prisma.reservation.create({
    data: {
      title: "Executive Leadership Quarterly Review",
      resourceId: rBoardroom.id,
      userId: sarah.id,
      startTime: todayAt(10, 0),
      endTime: todayAt(12, 0),
      status: "CONFIRMED",
      attendeesCount: 10,
      notes: "Strategic priorities review for Q4 and department milestones.",
    },
  });

  await prisma.reservation.create({
    data: {
      title: "Hardware Stress Test Phase 3",
      resourceId: rThermal.id,
      userId: alex.id,
      startTime: todayAt(13, 0),
      endTime: todayAt(17, 0),
      status: "CONFIRMED",
      attendeesCount: 2,
      notes: "Subjecting telemetry gateway units to +85°C heat cycle testing.",
    },
  });

  await prisma.reservation.create({
    data: {
      title: "UX Research Usability Testing",
      resourceId: rFocusPod.id,
      userId: elena.id,
      startTime: todayAt(15, 0),
      endTime: todayAt(16, 30),
      status: "CONFIRMED",
      attendeesCount: 2,
      notes: "Remote moderated user feedback session with external beta participant.",
    },
  });

  await prisma.reservation.create({
    data: {
      title: "Engineering Tech Talk: System Architecture",
      resourceId: rStudio.id,
      userId: priya.id,
      startTime: tomorrowAt(10, 0),
      endTime: tomorrowAt(12, 0),
      status: "CONFIRMED",
      attendeesCount: 3,
      notes: "Recording educational tech talk for PrimeWave engineering onboarding.",
    },
  });

  await prisma.reservation.create({
    data: {
      title: "Client Factory Sensor Inspection",
      resourceId: rVehicle.id,
      userId: alex.id,
      startTime: tomorrowAt(8, 30),
      endTime: tomorrowAt(14, 0),
      status: "CONFIRMED",
      attendeesCount: 3,
      notes: "Field trip to Colombo industrial plant for sensor placement diagnosis.",
    },
  });

  // 5. Seed Maintenance Log
  await prisma.maintenanceLog.create({
    data: {
      resourceId: rRfBench.id,
      title: "Semi-Annual Calibration & Frequency Sweep Verification",
      description: "ISO 17025 external calibration standards check and firmware patch on Keysight unit.",
      startTime: todayAt(8, 0),
      endTime: todayAt(18, 0),
      technician: "Keysight Field Metrology Services",
      status: "IN_PROGRESS",
    },
  });

  // 6. Seed Activity Logs
  await prisma.activityLog.create({
    data: {
      action: "RESERVATION_CREATED",
      details: "Sarah Jenkins booked Executive Boardroom Alpha for Executive Leadership Review",
      userId: sarah.id,
      resourceId: rBoardroom.id,
    },
  });

  await prisma.activityLog.create({
    data: {
      action: "MAINTENANCE_SCHEDULED",
      details: "Routine calibration scheduled for RF & Spectrum Analysis Bench by Facilities",
      userId: marcus.id,
      resourceId: rRfBench.id,
    },
  });

  console.log("Database seeded successfully with users, categories, resources, reservations, and maintenance logs!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
