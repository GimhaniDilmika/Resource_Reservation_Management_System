"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type MockUser = {
  id: string;
  name: string;
  email: string;
  department: string;
  role: "ADMIN" | "STAFF" | "MEMBER";
  avatarUrl?: string | null;
};

type UserContextType = {
  currentUser: MockUser;
  setCurrentUser: (user: MockUser) => void;
  availableUsers: MockUser[];
};

const defaultUsers: MockUser[] = [
  {
    id: "user-sarah",
    name: "Sarah Jenkins",
    email: "sarah.j@primewave.com",
    department: "Operations",
    role: "ADMIN",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "user-alex",
    name: "Alex Rivera",
    email: "alex.r@primewave.com",
    department: "Hardware Engineering",
    role: "MEMBER",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "user-priya",
    name: "Priya Sharma",
    email: "priya.s@primewave.com",
    department: "Software Engineering",
    role: "MEMBER",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "user-marcus",
    name: "Marcus Chen",
    email: "marcus.c@primewave.com",
    department: "Facilities & IT",
    role: "STAFF",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "user-elena",
    name: "Elena Rostova",
    email: "elena.r@primewave.com",
    department: "Product & Design",
    role: "MEMBER",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
  },
];

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({
  children,
  initialUsers,
}: {
  children: React.ReactNode;
  initialUsers?: MockUser[];
}) {
  const users = initialUsers && initialUsers.length > 0 ? initialUsers : defaultUsers;
  const [currentUser, setCurrentUser] = useState<MockUser>(users[0]);

  // Read saved preference from localStorage if available
  useEffect(() => {
    try {
      const savedId = localStorage.getItem("primewave_active_user");
      if (savedId) {
        const found = users.find((u) => u.id === savedId);
        if (found) setCurrentUser(found);
      }
    } catch {
      // Ignore localStorage read errors in SSR
    }
  }, [users]);

  const handleSetCurrentUser = (user: MockUser) => {
    setCurrentUser(user);
    try {
      localStorage.setItem("primewave_active_user", user.id);
    } catch {
      // Ignore
    }
  };

  return (
    <UserContext.Provider
      value={{
        currentUser,
        setCurrentUser: handleSetCurrentUser,
        availableUsers: users,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useCurrentUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useCurrentUser must be used within a UserProvider");
  }
  return context;
}
