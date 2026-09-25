"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ShortcutRow {
  label: string;
  keys: string[];
}

export default function KeyboardShortcutsModal({
  isOpen,
  onClose,
}: KeyboardShortcutsModalProps) {
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

  const isMac =
    typeof navigator !== "undefined" &&
    navigator.platform.toUpperCase().indexOf("MAC") >= 0;
  const modKey = isMac ? "⌘" : "Ctrl";

  const actionShortcuts: ShortcutRow[] = [
    { label: "Archive note", keys: ["E"] },
    { label: "Trash note", keys: ["#"] },
    { label: "Pin or unpin notes", keys: ["F"] },
    { label: "Select note", keys: ["X"] },
    { label: "Toggle list / grid view", keys: [`${modKey} + G`] },
  ];

  const editorShortcuts: ShortcutRow[] = [
    { label: "Finish editing", keys: ["Esc"] },
    { label: "Finish editing & save", keys: [`${modKey} + Enter`] },
    { label: "Bold text", keys: [`${modKey} + B`] },
    { label: "Italic text", keys: [`${modKey} + I`] },
    { label: "Underline text", keys: [`${modKey} + U`] },
  ];

  const generalShortcuts: ShortcutRow[] = [
    { label: "Create a note", keys: ["C"] },
    { label: "Search your notes", keys: ["/"] },
    { label: "Toggle navigation sidebar", keys: [`${modKey} + B`] },
    { label: "Close modal or clear selection", keys: ["Esc"] },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-dialog-title"
      className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-4 bg-black/50 transition-opacity duration-200"
      onClick={onClose}
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
            id="shortcuts-dialog-title"
            className="text-[19px] sm:text-[20px] font-medium text-gray-900 dark:text-gray-100"
          >
            Keyboard shortcuts
          </h2>
          <button
            type="button"
            aria-label="Close keyboard shortcuts"
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full text-gray-600 dark:text-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* Actions Section */}
          <div>
            <h3 className="text-xs font-bold tracking-wider uppercase text-[#1a73e8] dark:text-[#8ab4f8] mb-3">
              Actions
            </h3>
            <div className="divide-y divide-gray-100 dark:divide-white/5">
              {actionShortcuts.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between py-2.5"
                >
                  <span className="text-[15px] text-gray-800 dark:text-gray-200">
                    {item.label}
                  </span>
                  <div className="flex items-center gap-1">
                    {item.keys.map((k) => (
                      <kbd
                        key={k}
                        className="px-2.5 py-1 bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-gray-200 rounded font-mono text-xs font-semibold shadow-sm border border-gray-200 dark:border-white/10"
                      >
                        {k}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Editor Section */}
          <div>
            <h3 className="text-xs font-bold tracking-wider uppercase text-[#1a73e8] dark:text-[#8ab4f8] mb-3">
              Editor
            </h3>
            <div className="divide-y divide-gray-100 dark:divide-white/5">
              {editorShortcuts.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between py-2.5"
                >
                  <span className="text-[15px] text-gray-800 dark:text-gray-200">
                    {item.label}
                  </span>
                  <div className="flex items-center gap-1">
                    {item.keys.map((k) => (
                      <kbd
                        key={k}
                        className="px-2.5 py-1 bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-gray-200 rounded font-mono text-xs font-semibold shadow-sm border border-gray-200 dark:border-white/10"
                      >
                        {k}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* General Section */}
          <div>
            <h3 className="text-xs font-bold tracking-wider uppercase text-[#1a73e8] dark:text-[#8ab4f8] mb-3">
              General
            </h3>
            <div className="divide-y divide-gray-100 dark:divide-white/5">
              {generalShortcuts.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between py-2.5"
                >
                  <span className="text-[15px] text-gray-800 dark:text-gray-200">
                    {item.label}
                  </span>
                  <div className="flex items-center gap-1">
                    {item.keys.map((k) => (
                      <kbd
                        key={k}
                        className="px-2.5 py-1 bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-gray-200 rounded font-mono text-xs font-semibold shadow-sm border border-gray-200 dark:border-white/10"
                      >
                        {k}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-4 bg-gray-50/70 dark:bg-white/5 border-t border-gray-100 dark:border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 text-sm font-medium text-white bg-[#1a73e8] hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm transition-colors focus:outline-none"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
