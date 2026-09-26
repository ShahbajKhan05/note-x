"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  plan: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const COOKIE_NAME = "note-x-session";
const USER_STORAGE_KEY = "note-x-user";

export const DEFAULT_USER: UserProfile = {
  id: "usr-shahbaj",
  name: "Mo. Shahbaj",
  email: "mohammadshahbaj068@gmail.com",
  avatar: "S",
  plan: "Pro",
};

// Helper: check if session cookie exists in browser
function getSessionCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${COOKIE_NAME}=`));
  return match ? match.split("=")[1] : null;
}

// Helper: set session cookie
function setSessionCookie(value: string, days = 7) {
  if (typeof document === "undefined") return;
  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

// Helper: delete session cookie
function deleteSessionCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize auth state on mount
  useEffect(() => {
    try {
      const cookieSession = getSessionCookie();
      if (cookieSession) {
        // Read persisted profile or fallback to DEFAULT_USER
        const storedUser = localStorage.getItem(USER_STORAGE_KEY);
        if (storedUser) {
          try {
            const parsed = JSON.parse(storedUser);
            setUser(parsed);
          } catch {
            setUser(DEFAULT_USER);
          }
        } else {
          setUser(DEFAULT_USER);
        }
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (e) {
      console.error("Auth state initialization error:", e);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Login handler
  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    try {
      // Simulate network latency for realistic feel
      await new Promise((resolve) => setTimeout(resolve, 600));

      const cleanEmail = email.trim();
      if (!cleanEmail) {
        setIsLoading(false);
        return { success: false, error: "Please enter your email or phone" };
      }

      if (!password || password.length < 4) {
        setIsLoading(false);
        return { success: false, error: "Password must be at least 4 characters" };
      }

      // Determine user profile
      let profile: UserProfile;
      if (
        cleanEmail.toLowerCase() === DEFAULT_USER.email.toLowerCase() ||
        cleanEmail.toLowerCase() === "shahbaj"
      ) {
        profile = DEFAULT_USER;
      } else {
        const username = cleanEmail.split("@")[0] || "User";
        const displayName =
          username.charAt(0).toUpperCase() + username.slice(1);
        profile = {
          id: `usr-${Date.now()}`,
          name: displayName,
          email: cleanEmail.includes("@") ? cleanEmail : `${cleanEmail}@example.com`,
          avatar: displayName.charAt(0).toUpperCase(),
          plan: "Free",
        };
      }

      // Set cookie for server / middleware verification
      setSessionCookie(profile.id);

      // Persist user profile
      try {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(profile));
      } catch (err) {
        console.error("Failed to store user profile:", err);
      }

      setUser(profile);
      setIsAuthenticated(true);
      setIsLoading(false);

      return { success: true };
    } catch (error) {
      setIsLoading(false);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Authentication failed",
      };
    }
  };

  // Logout handler - clears session cookie & user state WITHOUT deleting notes
  const logout = async () => {
    try {
      deleteSessionCookie();
      try {
        localStorage.removeItem(USER_STORAGE_KEY);
      } catch {}

      setUser(null);
      setIsAuthenticated(false);
      router.replace("/login");
    } catch (e) {
      console.error("Error during logout:", e);
      window.location.href = "/login";
    }
  };

  // Update profile handler (e.g., editing display name)
  const updateProfile = (updates: Partial<UserProfile>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      try {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
