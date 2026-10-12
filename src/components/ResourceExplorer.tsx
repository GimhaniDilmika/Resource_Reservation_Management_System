"use client";

import { useState, useMemo } from "react";
import { ResourceWithDetails } from "@/lib/data";
import { ResourceCard } from "@/components/ResourceCard";
import { BookingModal, ResourceLite } from "@/components/BookingModal";
import {
  Search,
  Filter,
  SlidersHorizontal,
  Building,
  CheckCircle2,
  Clock,
  Wrench,
  Sparkles,
  CalendarDays,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

interface ResourceExplorerProps {
  initialResources: ResourceWithDetails[];
  categories: { id: string; name: string; _count: { resources: number } }[];
}

export function ResourceExplorer({ initialResources, categories }: ResourceExplorerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [minCapacity, setMinCapacity] = useState<number>(1);

  // Booking modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedResourceId, setSelectedResourceId] = useState<string | undefined>(undefined);

  // Resources lite for modal
  const resourcesLite: ResourceLite[] = useMemo(
    () =>
      initialResources.map((r) => ({
        id: r.id,
        name: r.name,
        code: r.code,
        location: r.location,
        capacity: r.capacity,
        maxDurationMinutes: r.maxDurationMinutes,
        isApprovalRequired: r.isApprovalRequired,
        category: { name: r.category.name },
      })),
    [initialResources]
  );

  // Filtered resources
  const filteredResources = useMemo(() => {
    return initialResources.filter((r) => {
      // Category match
      if (selectedCategory !== "all" && r.categoryId !== selectedCategory) {
        return false;
      }

      // Status match
      if (statusFilter === "AVAILABLE" && r.computedState !== "AVAILABLE") {
        return false;
      }
      if (statusFilter === "IN_USE" && r.computedState !== "IN_USE") {
        return false;
      }
      if (statusFilter === "MAINTENANCE" && r.computedState !== "MAINTENANCE") {
        return false;
      }

      // Min capacity
      if (r.capacity < minCapacity) {
        return false;
      }

      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = r.name.toLowerCase().includes(q);
        const matchesCode = r.code.toLowerCase().includes(q);
        const matchesLoc = r.location.toLowerCase().includes(q);
        const matchesDesc = r.description?.toLowerCase().includes(q);
        const matchesAmenities = r.amenities.some((a) => a.toLowerCase().includes(q));
        if (!matchesName && !matchesCode && !matchesLoc && !matchesDesc && !matchesAmenities) {
          return false;
        }
      }

      return true;
    });
  }, [initialResources, selectedCategory, statusFilter, minCapacity, searchQuery]);

  // KPI counts
  const availableNowCount = initialResources.filter((r) => r.computedState === "AVAILABLE").length;
  const inUseCount = initialResources.filter((r) => r.computedState === "IN_USE").length;
  const maintenanceCount = initialResources.filter((r) => r.computedState === "MAINTENANCE").length;
  const totalBookingsToday = initialResources.reduce(
    (sum, r) => sum + r.todayReservationsCount,
    0
  );

  const handleOpenBook = (resourceId?: string) => {
    setSelectedResourceId(resourceId);
    setIsModalOpen(true);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Hero Banner */}
      <div
        className="glass-panel-elevated"
        style={{
          padding: "2.25rem 2rem",
          position: "relative",
          overflow: "hidden",
          borderRadius: "var(--radius-xl)",
          border: "1px solid rgba(0, 212, 178, 0.2)",
          background:
            "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(8, 20, 36, 0.9) 100%)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-80px",
            right: "-80px",
            width: "320px",
            height: "320px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0, 212, 178, 0.15) 0%, transparent 70%)",
            filter: "blur(40px)",
            pointerEvents: "none",
          }}
        />

        <div style={{ maxWidth: "760px", position: "relative", zIndex: 1 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.45rem",
              padding: "0.25rem 0.75rem",
              borderRadius: "9999px",
              background: "rgba(0, 212, 178, 0.12)",
              border: "1px solid rgba(0, 212, 178, 0.3)",
              color: "var(--accent-teal)",
              fontSize: "0.76rem",
              fontWeight: 700,
              marginBottom: "1rem",
            }}
          >
            <Sparkles size={14} />
            <span>PrimeWave Centralized Resource Reservation Management</span>
          </div>

          <h1
            style={{
              fontSize: "2.2rem",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.2,
              marginBottom: "0.75rem",
              background: "linear-gradient(90deg, #ffffff 0%, #cbd5e1 50%, #99f6e4 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Seamless Scheduling & Guaranteed Conflict-Free Allocation
          </h1>

          <p
            style={{
              fontSize: "0.95rem",
              color: "var(--text-muted)",
              lineHeight: 1.6,
              marginBottom: "1.5rem",
            }}
          >
            Streamline shared facilities across PrimeWave Lab. Reserve boardroom suites,
            high-precision hardware test rigs, podcast studios, and EV fleet vehicles with atomic
            double-booking prevention.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.85rem" }}>
            <button onClick={() => handleOpenBook()} className="btn btn-primary">
              <Sparkles size={16} />
              <span>Quick Reserve Slot</span>
            </button>
            <Link href="/schedule" className="btn btn-secondary">
              <CalendarDays size={16} />
              <span>View Interactive Schedule</span>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Stats Bar */}
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
              Total Resources
            </span>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                background: "rgba(59, 130, 246, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#60a5fa",
              }}
            >
              <Building size={16} />
            </div>
          </div>
          <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#fff", marginTop: "0.4rem" }}>
            {initialResources.length}
          </div>
          <div style={{ fontSize: "0.74rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
            Across {categories.length} operational categories
          </div>
        </div>

        <div className="glass-panel" style={{ padding: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--text-dim)", fontWeight: 600 }}>
              Available Right Now
            </span>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                background: "rgba(16, 185, 129, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#34d399",
              }}
            >
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div
            style={{
              fontSize: "1.8rem",
              fontWeight: 800,
              color: "#34d399",
              marginTop: "0.4rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <span>{availableNowCount}</span>
            <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-dim)" }}>
              / {initialResources.length}
            </span>
          </div>
          <div style={{ fontSize: "0.74rem", color: "#34d399", marginTop: "0.2rem" }}>
            Ready for instant allocation
          </div>
        </div>

        <div className="glass-panel" style={{ padding: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--text-dim)", fontWeight: 600 }}>
              Active / In Use
            </span>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                background: "rgba(244, 63, 94, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#f43f5e",
              }}
            >
              <Clock size={16} />
            </div>
          </div>
          <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#fff", marginTop: "0.4rem" }}>
            {inUseCount}
          </div>
          <div style={{ fontSize: "0.74rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
            {totalBookingsToday} scheduled bookings today
          </div>
        </div>

        <div className="glass-panel" style={{ padding: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--text-dim)", fontWeight: 600 }}>
              Under Maintenance
            </span>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                background: "rgba(245, 158, 11, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fbbf24",
              }}
            >
              <Wrench size={16} />
            </div>
          </div>
          <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#fbbf24", marginTop: "0.4rem" }}>
            {maintenanceCount}
          </div>
          <div style={{ fontSize: "0.74rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
            Routine calibration / service
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          overflowX: "auto",
          paddingBottom: "0.4rem",
        }}
      >
        <button
          onClick={() => setSelectedCategory("all")}
          className={`nav-tab ${selectedCategory === "all" ? "active" : ""}`}
          style={{ borderRadius: "var(--radius-md)" }}
        >
          <span>All Facilities</span>
          <span
            style={{
              fontSize: "0.7rem",
              padding: "0.1rem 0.4rem",
              borderRadius: "9999px",
              background: selectedCategory === "all" ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.08)",
            }}
          >
            {initialResources.length}
          </span>
        </button>

        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`nav-tab ${isSelected ? "active" : ""}`}
              style={{ borderRadius: "var(--radius-md)" }}
            >
              <span>{cat.name}</span>
              <span
                style={{
                  fontSize: "0.7rem",
                  padding: "0.1rem 0.4rem",
                  borderRadius: "9999px",
                  background: isSelected ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.08)",
                }}
              >
                {cat._count.resources}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filter and Search Bar */}
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
        {/* Search Input */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            background: "rgba(11, 18, 32, 0.8)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-md)",
            padding: "0.5rem 0.85rem",
            flex: 1,
            minWidth: "260px",
          }}
        >
          <Search size={16} color="#00d4b2" />
          <input
            type="text"
            placeholder="Search by name, code (RES-CR-01), equipment, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              background: "transparent",
              border: "none",
              color: "#fff",
              fontSize: "0.86rem",
              width: "100%",
              outline: "none",
            }}
          />
        </div>

        {/* Filter Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", flexWrap: "wrap" }}>
          {/* Status Select */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <span style={{ fontSize: "0.76rem", color: "var(--text-dim)", fontWeight: 600 }}>
              Status:
            </span>
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
              <option value="all">All States</option>
              <option value="AVAILABLE">Available Now Only</option>
              <option value="IN_USE">In Use Now</option>
              <option value="MAINTENANCE">Maintenance Only</option>
            </select>
          </div>

          {/* Min Capacity */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <span style={{ fontSize: "0.76rem", color: "var(--text-dim)", fontWeight: 600 }}>
              Min Pax:
            </span>
            <select
              className="form-select"
              value={minCapacity}
              onChange={(e) => setMinCapacity(parseInt(e.target.value))}
              style={{
                width: "auto",
                padding: "0.45rem 0.75rem",
                fontSize: "0.8rem",
              }}
            >
              <option value={1}>Any capacity</option>
              <option value={2}>2+ pax</option>
              <option value={5}>5+ pax</option>
              <option value={10}>10+ pax</option>
            </select>
          </div>
        </div>
      </div>

      {/* Resource Cards Grid */}
      {filteredResources.length === 0 ? (
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
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.05)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text-dim)",
            }}
          >
            <Search size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-main)" }}>
              No facilities found matching your criteria
            </h3>
            <p style={{ fontSize: "0.84rem", color: "var(--text-dim)", marginTop: "0.3rem" }}>
              Try adjusting your search query, capacity requirement, or category filter.
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedCategory("all");
              setSearchQuery("");
              setStatusFilter("all");
              setMinCapacity(1);
            }}
            className="btn btn-secondary btn-sm"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {filteredResources.map((resource) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              onBook={(id) => handleOpenBook(id)}
            />
          ))}
        </div>
      )}

      {/* Booking Modal */}
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        resources={resourcesLite}
        preselectedResourceId={selectedResourceId}
        onSuccess={() => {
          // Re-render or notify
        }}
      />
    </div>
  );
}
