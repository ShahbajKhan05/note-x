"use client";

import React, { useEffect } from "react";
import { X, Lightbulb, Pin, Archive, Search, Keyboard } from "lucide-react";

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HelpModal({ isOpen, onClose }: HelpModalProps) {
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

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-dialog-title"
      className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-4 bg-black/50 transition-opacity duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[560px] bg-white dark:bg-[#282a2d] rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-gray-200 dark:border-[#5f6368]/40 transition-all duration-200"
        style={{
          width: "min(560px, calc(100vw - 24px))",
          maxHeight: "calc(100vh - 48px)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/10">
          <h2
            id="help-dialog-title"
            className="text-[19px] sm:text-[20px] font-medium text-gray-900 dark:text-gray-100"
          >
            Note-X Help & Guide
          </h2>
          <button
            type="button"
            aria-label="Close help"
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full text-gray-600 dark:text-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-gray-700 dark:text-gray-300">
          {/* Item 1 */}
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-yellow-100 dark:bg-yellow-950/40 text-yellow-700 dark:text-yellow-400 flex items-center justify-center shrink-0">
              <Lightbulb size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-[15px] mb-1">
                Creating & Editing Notes
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm leading-relaxed">
                Click &quot;Take a note...&quot; or press <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-white/10 rounded font-mono text-xs">C</kbd> anywhere on the dashboard. Click on any existing card to edit its title, content, or background color.
              </p>
            </div>
          </div>

          {/* Item 2 */}
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Pin size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-[15px] mb-1">
                Pinning Notes
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm leading-relaxed">
                Pin important notes to keep them anchored at the top under the <strong>PINNED</strong> section. All other notes will appear under <strong>NOTES</strong>.
              </p>
            </div>
          </div>

          {/* Item 3 */}
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 flex items-center justify-center shrink-0">
              <Archive size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-[15px] mb-1">
                Archive vs. Trash
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm leading-relaxed">
                Archived notes are safely hidden from your main feed but kept permanently. Trashed notes remain in the Trash bin until restored or permanently emptied.
              </p>
            </div>
          </div>

          {/* Item 4 */}
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Search size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-[15px] mb-1">
                Instant Search
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm leading-relaxed">
                Press <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-white/10 rounded font-mono text-xs">/</kbd> to search notes across all sections. Search filters titles, note body text, and custom tags in real-time.
              </p>
            </div>
          </div>

          {/* Item 5 */}
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 flex items-center justify-center shrink-0">
              <Keyboard size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-[15px] mb-1">
                Formatting & Shortcuts
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm leading-relaxed">
                Paste any URL to make it clickable. Use <code className="text-xs bg-gray-100 dark:bg-white/10 px-1 py-0.5 rounded">**bold text**</code> or labels to organize your workflow quickly.
              </p>
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
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
