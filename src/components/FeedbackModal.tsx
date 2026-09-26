"use client";

import React, { useState, useEffect, useCallback } from "react";
import { X, CheckCircle, Loader2 } from "lucide-react";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FEEDBACK_STORAGE_KEY = "note-x-feedback";

export default function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const [feedback, setFeedback] = useState("");
  const [allowEmail, setAllowEmail] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleClose = useCallback(() => {
    setFeedback("");
    setIsSubmitting(false);
    setIsSuccess(false);
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      // Simulate submission & save locally
      await new Promise((resolve) => setTimeout(resolve, 600));

      const newEntry = {
        id: `fb-${Date.now()}`,
        content: feedback.trim(),
        allowEmail,
        createdAt: new Date().toISOString(),
      };

      try {
        const stored = localStorage.getItem(FEEDBACK_STORAGE_KEY);
        const list = stored ? JSON.parse(stored) : [];
        list.push(newEntry);
        localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(list));
      } catch (err) {
        console.error("Failed to store feedback locally:", err);
      }

      setIsSuccess(true);
      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="feedback-dialog-title"
      className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-4 bg-black/50 transition-opacity duration-200"
      onClick={handleClose}
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
            id="feedback-dialog-title"
            className="text-[19px] sm:text-[20px] font-medium text-gray-900 dark:text-gray-100"
          >
            Send feedback
          </h2>
          <button
            type="button"
            aria-label="Close feedback"
            onClick={handleClose}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full text-gray-600 dark:text-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        {isSuccess ? (
          <div className="p-8 flex flex-col items-center justify-center text-center space-y-3">
            <CheckCircle className="text-green-500 w-12 h-12" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Feedback received!
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs">
              Thank you for helping us improve Note-X. Your feedback has been recorded.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col flex-1">
            <div className="p-6 space-y-4">
              <div>
                <label
                  htmlFor="feedback-content"
                  className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2"
                >
                  Describe your feedback (required)
                </label>
                <textarea
                  id="feedback-content"
                  required
                  rows={5}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Tell us what you like, what needs improvement, or report an issue..."
                  className="w-full p-3.5 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 placeholder:text-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a73e8] resize-none"
                  autoFocus
                />
              </div>

              <label className="flex items-start gap-3 cursor-pointer group select-none">
                <input
                  type="checkbox"
                  checked={allowEmail}
                  onChange={(e) => setAllowEmail(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-[#1a73e8] focus:ring-[#1a73e8]"
                />
                <span className="text-xs text-gray-600 dark:text-gray-400 leading-normal">
                  We may email you for more information or updates regarding your feedback.
                </span>
              </label>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50/70 dark:bg-white/5 border-t border-gray-100 dark:border-white/10 mt-auto">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="px-5 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200/60 dark:hover:bg-white/10 rounded-lg transition-colors focus:outline-none"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!feedback.trim() || isSubmitting}
                className="px-6 py-2 text-sm font-medium text-white bg-[#1a73e8] hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  "Send"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
