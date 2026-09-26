"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface AppSettings {
  addNewItemsToBottom: boolean;
  moveCheckedItemsToBottom: boolean;
  richLinkPreviews: boolean;
  darkTheme: boolean;
  sharingEnabled: boolean;
}

export const DEFAULT_SETTINGS: AppSettings = {
  addNewItemsToBottom: true,
  moveCheckedItemsToBottom: true,
  richLinkPreviews: true,
  darkTheme: false,
  sharingEnabled: true,
};

const SETTINGS_STORAGE_KEY = "note-x-settings";

interface SettingsContextType {
  settings: AppSettings;
  updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
  saveSettings: (newSettings: AppSettings) => void;
  resetSettings: () => void;
  activeNoteId: string | null;
  setActiveNoteId: (id: string | null) => void;
  selectedNoteIds: string[];
  toggleSelectNote: (id: string) => void;
  clearSelectedNotes: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [selectedNoteIds, setSelectedNoteIds] = useState<string[]>([]);

  // 1. Initial Load from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
      const themeStored = localStorage.getItem("note-x-theme");
      const isDark = themeStored === "dark" || document.documentElement.classList.contains("dark");

      if (stored) {
        const parsed = JSON.parse(stored);
        setSettings({
          ...DEFAULT_SETTINGS,
          ...parsed,
          darkTheme: isDark,
        });
      } else {
        setSettings((prev) => ({
          ...prev,
          darkTheme: isDark,
        }));
      }
    } catch (e) {
      console.error("Failed to load settings from localStorage:", e);
      setSettings(DEFAULT_SETTINGS);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // 2. Keep theme synchronized with document.documentElement
  useEffect(() => {
    if (!isLoaded) return;
    if (settings.darkTheme) {
      document.documentElement.classList.add("dark");
      try {
        localStorage.setItem("note-x-theme", "dark");
      } catch {}
    } else {
      document.documentElement.classList.remove("dark");
      try {
        localStorage.setItem("note-x-theme", "light");
      } catch {}
    }
  }, [settings.darkTheme, isLoaded]);

  // Update a single setting and immediately persist
  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings((prev) => {
      const updated = { ...prev, [key]: value };
      try {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.error("Failed to save setting:", err);
      }
      return updated;
    });
  };

  // Bulk save settings (e.g. from Settings modal Save button)
  const saveSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(newSettings));
    } catch (err) {
      console.error("Failed to save settings:", err);
    }
  };

  // Reset to defaults
  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
    } catch (err) {
      console.error("Failed to reset settings:", err);
    }
  };

  const toggleSelectNote = (id: string) => {
    setSelectedNoteIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const clearSelectedNotes = () => {
    setSelectedNoteIds([]);
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSetting,
        saveSettings,
        resetSettings,
        activeNoteId,
        setActiveNoteId,
        selectedNoteIds,
        toggleSelectNote,
        clearSelectedNotes,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
