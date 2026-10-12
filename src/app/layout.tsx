import type { Metadata } from "next";
import "./globals.css";
import { UserProvider } from "@/context/user-context";
import { getUsers } from "@/lib/data";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "PrimeWave Lab | Resource Reservation Management System",
  description:
    "Enterprise-grade centralized resource scheduling, conflict-free allocation, and real-time timeline for PrimeWave Lab.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let users: any[] = [];
  try {
    users = await getUsers();
  } catch (err) {
    console.error("Could not fetch users for layout:", err);
  }

  return (
    <html lang="en">
      <body>
        <UserProvider initialUsers={users}>
          <Navbar />
          <main style={{ flex: 1, padding: "2rem 0 4rem" }}>
            <div className="container">{children}</div>
          </main>
          <footer
            style={{
              borderTop: "1px solid var(--border-subtle)",
              background: "rgba(8, 13, 22, 0.9)",
              padding: "2rem 0",
              marginTop: "auto",
            }}
          >
            <div
              className="container"
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "1rem",
                fontSize: "0.8rem",
                color: "var(--text-dim)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <strong style={{ color: "var(--text-main)" }}>PrimeWave Lab (Pvt) Ltd</strong>
                <span>— Turning Complexity into Possibility</span>
              </div>
              <div>Software Engineering Technical Assessment Solution • Next.js & PostgreSQL</div>
            </div>
          </footer>
        </UserProvider>
      </body>
    </html>
  );
}
