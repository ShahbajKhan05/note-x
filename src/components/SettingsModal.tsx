"use client";

import React, { useState, useEffect } from "react";
import { X, Check } from "lucide-react";
import { useSettings, AppSettings } from "@/context/SettingsContext";
import { useSidebar } from "@/context/SidebarContext";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { settings, saveSettings } = useSettings();
  const sidebar = useSidebar();

  // Staged local state so changes aren't applied until "Save" is clicked
  const [localSettings, setLocalSettings] = useState<AppSettings>(settings);
  const [prevSettings, setPrevSettings] = useState(settings);

  // Sync staged state when settings change
  if (settings !== prevSettings) {
    setPrevSettings(settings);
    setLocalSettings(settings);
  }

  // Escape key handler
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleToggle = (key: keyof AppSettings) => {
    setLocalSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = () => {
    saveSettings(localSettings);

    // Synchronize dark theme with sidebar context / DOM if changed
    if (sidebar && sidebar.darkMode !== localSettings.darkTheme) {
      sidebar.toggleDarkMode();
    }

    onClose();
  };

  const handleCancel = () => {
    setLocalSettings(settings);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-dialog-title"
      className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-4 bg-black/50 transition-opacity duration-200"
      onClick={handleCancel}
    >
      <div
        className="w-full max-w-[540px] bg-white dark:bg-[#282a2d] rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-gray-200 dark:border-[#5f6368]/40 transition-all duration-200"
        style={{
          width: "min(540px, calc(100vw - 24px))",
          maxHeight: "calc(100vh - 48px)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/10">
          <h2
            id="settings-dialog-title"
            className="text-[19px] sm:text-[20px] font-medium text-gray-900 dark:text-gray-100"
          >
            Settings
          </h2>
          <button
            type="button"
            aria-label="Close settings"
            onClick={handleCancel}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full text-gray-600 dark:text-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body - Scrollable internally */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-[#3c4043] dark:text-[#d0d4d9]">
          {/* Section 1: Notes and Lists */}
          <div>
            <h3 className="text-xs font-bold tracking-wider uppercase text-[#1a73e8] dark:text-[#8ab4f8] mb-3">
              Notes and Lists
            </h3>

            <div className="space-y-3">
              {/* Add new items to the bottom */}
              <label className="flex items-start gap-3 cursor-pointer group select-none">
                <div className="relative flex items-center pt-0.5">
                  <input
                    type="checkbox"
                    checked={localSettings.addNewItemsToBottom}
                    onChange={() => handleToggle("addNewItemsToBottom")}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                      localSettings.addNewItemsToBottom
                        ? "bg-[#1a73e8] border-[#1a73e8] text-white"
                        : "border-gray-400 dark:border-gray-500 bg-transparent"
                    }`}
                  >
                    {localSettings.addNewItemsToBottom && <Check size={14} strokeWidth={3} />}
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-[14.5px] font-normal text-gray-800 dark:text-gray-200 group-hover:text-black dark:group-hover:text-white">
                    Add new items to the bottom
                  </span>
                </div>
              </label>

              {/* Move checked items to the bottom */}
              <label className="flex items-start gap-3 cursor-pointer group select-none">
                <div className="relative flex items-center pt-0.5">
                  <input
                    type="checkbox"
                    checked={localSettings.moveCheckedItemsToBottom}
                    onChange={() => handleToggle("moveCheckedItemsToBottom")}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                      localSettings.moveCheckedItemsToBottom
                        ? "bg-[#1a73e8] border-[#1a73e8] text-white"
                        : "border-gray-400 dark:border-gray-500 bg-transparent"
                    }`}
                  >
                    {localSettings.moveCheckedItemsToBottom && <Check size={14} strokeWidth={3} />}
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-[14.5px] font-normal text-gray-800 dark:text-gray-200 group-hover:text-black dark:group-hover:text-white">
                    Move checked items to the bottom
                  </span>
                </div>
              </label>

              {/* Display rich link previews */}
              <label className="flex items-start gap-3 cursor-pointer group select-none">
                <div className="relative flex items-center pt-0.5">
                  <input
                    type="checkbox"
                    checked={localSettings.richLinkPreviews}
                    onChange={() => handleToggle("richLinkPreviews")}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                      localSettings.richLinkPreviews
                        ? "bg-[#1a73e8] border-[#1a73e8] text-white"
                        : "border-gray-400 dark:border-gray-500 bg-transparent"
                    }`}
                  >
                    {localSettings.richLinkPreviews && <Check size={14} strokeWidth={3} />}
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-[14.5px] font-normal text-gray-800 dark:text-gray-200 group-hover:text-black dark:group-hover:text-white">
                    Display rich link previews
                  </span>
                </div>
              </label>

              {/* Enable dark theme */}
              <label className="flex items-start gap-3 cursor-pointer group select-none">
                <div className="relative flex items-center pt-0.5">
                  <input
                    type="checkbox"
                    checked={localSettings.darkTheme}
                    onChange={() => handleToggle("darkTheme")}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                      localSettings.darkTheme
                        ? "bg-[#1a73e8] border-[#1a73e8] text-white"
                        : "border-gray-400 dark:border-gray-500 bg-transparent"
                    }`}
                  >
                    {localSettings.darkTheme && <Check size={14} strokeWidth={3} />}
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-[14.5px] font-normal text-gray-800 dark:text-gray-200 group-hover:text-black dark:group-hover:text-white">
                    Enable dark theme
                  </span>
                </div>
              </label>
            </div>
          </div>

          <div className="border-t border-gray-100 dark:border-white/10" />

          {/* Section 2: Sharing */}
          <div>
            <h3 className="text-xs font-bold tracking-wider uppercase text-[#1a73e8] dark:text-[#8ab4f8] mb-3">
              Sharing
            </h3>

            <label className="flex items-start gap-3 cursor-pointer group select-none">
              <div className="relative flex items-center pt-0.5">
                <input
                  type="checkbox"
                  checked={localSettings.sharingEnabled}
                  onChange={() => handleToggle("sharingEnabled")}
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                    localSettings.sharingEnabled
                      ? "bg-[#1a73e8] border-[#1a73e8] text-white"
                      : "border-gray-400 dark:border-gray-500 bg-transparent"
                  }`}
                >
                  {localSettings.sharingEnabled && <Check size={14} strokeWidth={3} />}
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-[14.5px] font-normal text-gray-800 dark:text-gray-200 group-hover:text-black dark:group-hover:text-white">
                  Enable sharing
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Allows sharing note links and contents with collaborators.
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50/70 dark:bg-white/5 border-t border-gray-100 dark:border-white/10">
          <button
            type="button"
            onClick={handleCancel}
            className="px-5 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200/60 dark:hover:bg-white/10 rounded-lg transition-colors focus:outline-none"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2 text-sm font-medium text-white bg-[#1a73e8] hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm transition-colors focus:outline-none"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
