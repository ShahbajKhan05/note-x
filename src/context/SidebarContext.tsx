"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type ViewMode = "grid" | "list";

interface SidebarContextType {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  toggleCollapsed: () => void;
  mobileOpen: boolean;
  setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toggleMobileOpen: () => void;
  closeMobile: () => void;
  viewMode: ViewMode;
  setViewMode: React.Dispatch<React.SetStateAction<ViewMode>>;
  toggleViewMode: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [darkMode, setDarkMode] = useState(false);

  // Restore saved viewMode and darkMode preference from localStorage
  useEffect(() => {
    try {
      const savedMode = localStorage.getItem("note-view-mode");
      if (savedMode === "grid" || savedMode === "list") {
        setViewMode(savedMode);
      }
      const savedTheme = localStorage.getItem("note-x-theme");
      if (savedTheme === "dark") {
        setDarkMode(true);
        document.documentElement.classList.add("dark");
      }
    } catch {
      // Ignore localStorage access errors
    }
  }, []);

  const toggleCollapsed = () => setCollapsed((prev) => !prev);
  const toggleMobileOpen = () => setMobileOpen((prev) => !prev);
  const closeMobile = () => setMobileOpen(false);

  const toggleViewMode = () => {
    setViewMode((prev) => {
      const next: ViewMode = prev === "grid" ? "list" : "grid";
      try {
        localStorage.setItem("note-view-mode", next);
      } catch {
        // Ignore localStorage write errors
      }
      return next;
    });
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("note-x-theme", next ? "dark" : "light");
      } catch {}
      if (next) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      return next;
    });
  };

  // Close mobile drawer on desktop resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close mobile drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <SidebarContext.Provider
      value={{
        collapsed,
        setCollapsed,
        toggleCollapsed,
        mobileOpen,
        setMobileOpen,
        toggleMobileOpen,
        closeMobile,
        viewMode,
        setViewMode,
        toggleViewMode,
        darkMode,
        toggleDarkMode,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  return useContext(SidebarContext);
}

export function useTheme() {
  const context = useContext(SidebarContext);
  return {
    theme: context?.darkMode ? 'dark' : 'light',
    darkMode: context?.darkMode ?? false,
    toggleTheme: context?.toggleDarkMode ?? (() => {}),
    toggleDarkMode: context?.toggleDarkMode ?? (() => {}),
  };
}
