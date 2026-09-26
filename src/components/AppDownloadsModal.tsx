"use client";

import React, { useEffect } from "react";
import { X, Smartphone, Monitor, DownloadCloud } from "lucide-react";

interface AppDownloadsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AppDownloadsModal({
  isOpen,
  onClose,
}: AppDownloadsModalProps) {
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
      aria-labelledby="downloads-dialog-title"
      className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-4 bg-black/50 transition-opacity duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[500px] bg-white dark:bg-[#282a2d] rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-gray-200 dark:border-[#5f6368]/40 transition-all duration-200"
        style={{
          width: "min(500px, calc(100vw - 24px))",
          maxHeight: "calc(100vh - 48px)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/10">
          <h2
            id="downloads-dialog-title"
            className="text-[19px] sm:text-[20px] font-medium text-gray-900 dark:text-gray-100"
          >
            Get Note-X
          </h2>
          <button
            type="button"
            aria-label="Close downloads"
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full text-gray-600 dark:text-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-sm">
          {/* PWA Card (Live & Working) */}
          <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/20 flex items-start gap-3.5">
            <div className="p-2.5 bg-blue-600 text-white rounded-lg shrink-0">
              <DownloadCloud size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  Web & PWA App
                </h3>
                <span className="text-[11px] font-bold text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/60 px-2 py-0.5 rounded-full">
                  Available Now
                </span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                Install Note-X directly from your browser: Tap <strong>&quot;Add to Home Screen&quot;</strong> on iOS/Android or click the <strong>Install</strong> icon in your browser address bar on Desktop.
              </p>
            </div>
          </div>

          {/* Native Desktop (Coming Soon) */}
          <div className="p-4 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/5 flex items-start gap-3.5">
            <div className="p-2.5 bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-gray-300 rounded-lg shrink-0">
              <Monitor size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  Windows & macOS Native
                </h3>
                <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-white/10 px-2 py-0.5 rounded-full">
                  Coming Soon
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Dedicated desktop builds with offline sync and system tray quick notes are currently in development.
              </p>
            </div>
          </div>

          {/* Native Mobile (Coming Soon) */}
          <div className="p-4 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/5 flex items-start gap-3.5">
            <div className="p-2.5 bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-gray-300 rounded-lg shrink-0">
              <Smartphone size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  Android & iOS Native Apps
                </h3>
                <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-white/10 px-2 py-0.5 rounded-full">
                  Coming Soon
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Native app store builds for Google Play Store and Apple App Store are planned for upcoming releases.
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
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
