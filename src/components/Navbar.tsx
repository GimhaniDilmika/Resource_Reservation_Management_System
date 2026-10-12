"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCurrentUser } from "@/context/user-context";
import {
  CalendarDays,
  LayoutGrid,
  Clock,
  BarChart3,
  Database,
  PlusCircle,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";

export function Navbar({ onOpenNewBooking }: { onOpenNewBooking?: () => void }) {
  const pathname = usePathname();
  const { currentUser, setCurrentUser, availableUsers } = useCurrentUser();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Explore Resources", icon: LayoutGrid },
    { href: "/schedule", label: "Live Schedule", icon: CalendarDays },
    { href: "/reservations", label: "Reservations", icon: Clock },
    { href: "/analytics", label: "Utilization Insights", icon: BarChart3 },
    { href: "/architecture", label: "ER Diagram & Arch", icon: Database },
  ];

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        borderBottom: "1px solid var(--border-subtle)",
        background: "rgba(8, 13, 22, 0.85)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "4.75rem",
        }}
      >
        {/* Brand / Logo */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.85rem",
          }}
        >
          {/* Stylized PrimeWave Teal Wave Icon */}
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #00d4b2 0%, #0284c7 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 20px rgba(0, 212, 178, 0.4)",
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#031412"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 12c3-4 6-4 9 0s6 4 9 0" />
              <path d="M2 17c3-4 6-4 9 0s6 4 9 0" opacity="0.6" />
              <path d="M2 7c3-4 6-4 9 0s6 4 9 0" opacity="0.4" />
            </svg>
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span
                style={{
                  fontSize: "1.2rem",
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                  background: "linear-gradient(90deg, #ffffff 0%, #a7f3d0 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                PrimeWave
              </span>
              <span
                style={{
                  fontSize: "0.75rem",
                  padding: "0.15rem 0.5rem",
                  borderRadius: "9999px",
                  background: "rgba(0, 212, 178, 0.15)",
                  color: "#00d4b2",
                  fontWeight: 700,
                  border: "1px solid rgba(0, 212, 178, 0.3)",
                }}
              >
                Lab
              </span>
            </div>
            <div
              style={{
                fontSize: "0.7rem",
                color: "var(--text-dim)",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              Resource Reservation System
            </div>
          </div>
        </Link>

        {/* Center Navigation Links */}
        <nav
          style={{
            display: "none",
            gap: "0.35rem",
            background: "rgba(15, 23, 42, 0.6)",
            padding: "0.35rem",
            borderRadius: "var(--radius-full)",
            border: "1px solid var(--border-subtle)",
          }}
          className="desktop-nav"
        >
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-tab ${isActive ? "active" : ""}`}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Action: User Switcher & Quick Reserve */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
          {onOpenNewBooking && (
            <button
              onClick={onOpenNewBooking}
              className="btn btn-primary btn-sm"
              style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
            >
              <PlusCircle size={16} />
              <span>Reserve Now</span>
            </button>
          )}

          {/* User Switcher Dropdown */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                background: "rgba(21, 34, 56, 0.8)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-full)",
                padding: "0.35rem 0.75rem 0.35rem 0.35rem",
                transition: "all 0.2s ease",
              }}
              title="Click to switch simulated member/admin account"
            >
              {/* Avatar */}
              <div
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  background: "var(--accent-teal)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  color: "#000",
                }}
              >
                {currentUser.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  currentUser.name[0]
                )}
              </div>

              <div style={{ textAlign: "left", lineHeight: 1.2 }}>
                <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-main)" }}>
                  {currentUser.name}
                </div>
                <div style={{ fontSize: "0.68rem", color: "var(--text-dim)" }}>
                  {currentUser.role === "ADMIN" ? (
                    <span style={{ color: "#38bdf8", fontWeight: 600 }}>Admin (Sarah)</span>
                  ) : (
                    currentUser.department
                  )}
                </div>
              </div>

              <ChevronDown size={14} style={{ color: "var(--text-dim)", marginLeft: "0.2rem" }} />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "120%",
                  width: "270px",
                  background: "var(--bg-surface-elevated)",
                  border: "1px solid var(--border-card)",
                  borderRadius: "var(--radius-lg)",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
                  padding: "0.6rem",
                  zIndex: 100,
                  animation: "fadeIn 0.15s ease-out",
                }}
              >
                <div
                  style={{
                    padding: "0.4rem 0.6rem",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    color: "var(--text-dim)",
                    borderBottom: "1px solid var(--border-subtle)",
                    marginBottom: "0.4rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                  }}
                >
                  <ShieldCheck size={14} color="#00d4b2" />
                  Switch Active Persona
                </div>

                {availableUsers.map((user) => {
                  const isSelected = user.id === currentUser.id;
                  return (
                    <button
                      key={user.id}
                      onClick={() => {
                        setCurrentUser(user);
                        setDropdownOpen(false);
                      }}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.65rem",
                        padding: "0.5rem 0.6rem",
                        borderRadius: "var(--radius-sm)",
                        background: isSelected ? "rgba(0, 212, 178, 0.12)" : "transparent",
                        border: isSelected ? "1px solid rgba(0, 212, 178, 0.25)" : "1px solid transparent",
                        textAlign: "left",
                        transition: "background 0.15s ease",
                        marginBottom: "0.2rem",
                      }}
                    >
                      <div
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "50%",
                          overflow: "hidden",
                          flexShrink: 0,
                        }}
                      >
                        {user.avatarUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={user.avatarUrl}
                            alt={user.name}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                        ) : (
                          <div
                            style={{
                              width: "100%",
                              height: "100%",
                              background: "#334155",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#fff",
                              fontSize: "0.75rem",
                            }}
                          >
                            {user.name[0]}
                          </div>
                        )}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: "0.82rem",
                            fontWeight: 600,
                            color: isSelected ? "#00d4b2" : "var(--text-main)",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {user.name}
                        </div>
                        <div
                          style={{
                            fontSize: "0.7rem",
                            color: "var(--text-dim)",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.4rem",
                          }}
                        >
                          <span>{user.department}</span>
                          <span
                            style={{
                              fontSize: "0.62rem",
                              fontWeight: 700,
                              padding: "0.1rem 0.35rem",
                              borderRadius: "4px",
                              background:
                                user.role === "ADMIN"
                                  ? "rgba(14, 165, 233, 0.2)"
                                  : "rgba(255, 255, 255, 0.08)",
                              color: user.role === "ADMIN" ? "#38bdf8" : "var(--text-muted)",
                            }}
                          >
                            {user.role}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile nav fallback bar */}
      <div
        className="mobile-nav"
        style={{
          display: "flex",
          overflowX: "auto",
          padding: "0.4rem 1rem",
          gap: "0.4rem",
          borderTop: "1px solid var(--border-subtle)",
          background: "rgba(11, 18, 32, 0.95)",
        }}
      >
        {navLinks.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-tab ${isActive ? "active" : ""}`}
              style={{ fontSize: "0.78rem", padding: "0.4rem 0.75rem" }}
            >
              <Icon size={14} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      <style jsx>{`
        @media (min-width: 860px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-nav {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
