"use client";

import { useState } from 'react';
import {
  Pin,
  Bell,
  Palette,
  Archive,
  ArchiveRestore,
  Trash2,
  RotateCcw,
  Tag,
  Share2,
  CheckCircle2,
} from 'lucide-react';
import { formatNoteContent } from '@/utils/formatContent';
import { useSettings } from '@/context/SettingsContext';

const KEEP_COLORS = [
  'bg-white',
  'bg-[#f28b82]',
  'bg-[#fbbc04]',
  'bg-[#fff475]',
  'bg-[#ccff90]',
  'bg-[#a7ffeb]',
  'bg-[#cbf0f8]',
  'bg-[#aecbfa]',
  'bg-[#d7aefb]',
  'bg-[#e8eaed]',
];

const DARK_NOTE_BG_MAP: Record<string, string> = {
  'bg-white': 'dark:bg-[#303134]',
  'bg-[#f28b82]': 'dark:bg-[#5c2b29]',
  'bg-[#fbbc04]': 'dark:bg-[#614a19]',
  'bg-[#fff475]': 'dark:bg-[#635d19]',
  'bg-[#ccff90]': 'dark:bg-[#345920]',
  'bg-[#a7ffeb]': 'dark:bg-[#16504b]',
  'bg-[#cbf0f8]': 'dark:bg-[#2d555e]',
  'bg-[#aecbfa]': 'dark:bg-[#1e3a5f]',
  'bg-[#d7aefb]': 'dark:bg-[#42275e]',
  'bg-[#e8eaed]': 'dark:bg-[#3c3f41]',
};

interface NoteCardProps {
  id?: string;
  title?: string;
  content: string | React.ReactNode;
  bgColor?: string;
  pinned?: boolean;
  archived?: boolean;
  trashed?: boolean;
  reminderAt?: number | null;
  labels?: string[];
  imageUrl?: string | null;
  onPin?: (e: React.MouseEvent) => void;
  onArchive?: (e: React.MouseEvent) => void;
  onDelete?: (e: React.MouseEvent) => void;
  onRestore?: (e: React.MouseEvent) => void;
  onPermanentDelete?: (e: React.MouseEvent) => void;
  onColorChange?: (color: string, e: React.MouseEvent) => void;
  onReminder?: (e: React.MouseEvent) => void;
}

export default function NoteCard({
  id,
  title,
  content,
  bgColor = "bg-white",
  pinned = false,
  archived = false,
  trashed = false,
  reminderAt = null,
  labels = [],
  imageUrl = null,
  onPin,
  onArchive,
  onDelete,
  onRestore,
  onPermanentDelete,
  onColorChange,
  onReminder,
}: NoteCardProps) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  const { settings, selectedNoteIds, toggleSelectNote } = useSettings();
  const isSelected = id ? selectedNoteIds.includes(id) : false;

  // Process checklist sorting if moveCheckedItemsToBottom is true
  let processedContent = content;
  if (typeof content === 'string' && settings.moveCheckedItemsToBottom) {
    const lines = content.split('\n');
    const checked: string[] = [];
    const unchecked: string[] = [];
    const regular: string[] = [];
    let hasChecklist = false;

    lines.forEach((line) => {
      if (line.match(/^(\s*[-*]\s*)?\[x\]/i)) {
        hasChecklist = true;
        checked.push(line);
      } else if (line.match(/^(\s*[-*]\s*)?\[ \]/i)) {
        hasChecklist = true;
        unchecked.push(line);
      } else {
        regular.push(line);
      }
    });

    if (hasChecklist) {
      processedContent = [...regular, ...unchecked, ...checked].join('\n');
    }
  }

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareText = `${title ? title + '\n' : ''}${typeof content === 'string' ? content : ''}`;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  return (
    <div
      className={`relative group rounded-xl border mb-4 break-inside-avoid w-full min-w-0 ${bgColor} ${
        DARK_NOTE_BG_MAP[bgColor] || 'dark:bg-[#303134]'
      } hover:shadow-md transition-all duration-300 cursor-default overflow-hidden ${
        isSelected
          ? 'ring-2 ring-blue-500 border-transparent shadow-md'
          : 'border-gray-300 dark:border-[#3c4043]'
      }`}
    >
      {/* Optional Attached Image */}
      {imageUrl && (
        <div className="w-full max-h-60 overflow-hidden bg-black/5 dark:bg-white/5">
          <img
            src={imageUrl}
            alt={title || "Note attachment"}
            className="w-full object-cover max-h-60"
          />
        </div>
      )}

      {/* Select Checkmark (Top Left, visible on hover or when selected) */}
      {!trashed && id && (
        <button
          type="button"
          aria-label={isSelected ? "Deselect note" : "Select note"}
          title={isSelected ? "Deselect note" : "Select note"}
          onClick={(e) => {
            e.stopPropagation();
            toggleSelectNote(id);
          }}
          className={`absolute top-2 left-2 p-1.5 rounded-full transition-all focus:outline-none z-10 ${
            isSelected
              ? "opacity-100 text-blue-600 bg-white dark:bg-[#202124] shadow-sm"
              : "opacity-0 sm:group-hover:opacity-80 text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white bg-white/80 dark:bg-[#202124]/80"
          }`}
        >
          <CheckCircle2
            size={18}
            className={isSelected ? "fill-blue-600 text-white" : ""}
          />
        </button>
      )}

      <div className="p-3.5 sm:p-4">
        {/* Pin Icon (always accessible on mobile, hover on desktop) */}
        {!trashed && onPin && (
          <button
            type="button"
            aria-label={pinned ? "Unpin note" : "Pin note"}
            title={pinned ? "Unpin note" : "Pin note"}
            onClick={(e) => {
              e.stopPropagation();
              onPin(e);
            }}
            className={`absolute top-2 right-2 p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-all focus:outline-none z-10 ${
              pinned
                ? "opacity-100 text-gray-900 dark:text-[#e8eaed]"
                : "opacity-70 sm:opacity-0 sm:group-hover:opacity-100 text-gray-500 dark:text-[#9aa0a6]"
            }`}
          >
            <Pin
              size={18}
              className={pinned ? "fill-gray-800 dark:fill-[#e8eaed]" : ""}
            />
          </button>
        )}

        {/* Note Title (Bold and strong hierarchy) */}
        {title && (
          <h3 className="font-bold text-[16px] sm:text-[18px] mb-2 sm:mb-2.5 text-gray-900 dark:text-[#e8eaed] pr-8 pl-1 break-words [overflow-wrap:anywhere] leading-snug tracking-tight transition-colors duration-300">
            {title}
          </h3>
        )}

        {/* Note Content (Bold parts, clickable URLs, preserved linebreaks) */}
        <div className="text-[13.5px] sm:text-[15px] leading-[1.6] mb-3 px-1 break-words [overflow-wrap:anywhere] text-gray-800 dark:text-[#d0d4d9] transition-colors duration-300">
          {typeof processedContent === 'string'
            ? formatNoteContent(processedContent, settings.richLinkPreviews)
            : processedContent}
        </div>

        {/* Badges: Reminder & Labels */}
        {(reminderAt || (labels && labels.length > 0)) && (
          <div className="flex flex-wrap gap-1.5 mb-3 px-1">
            {reminderAt && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full">
                <Bell size={11} />
                Reminder
              </span>
            )}
            {labels.map((lbl) => (
              <span
                key={lbl}
                className="inline-flex items-center gap-1 text-[11px] font-medium bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full"
              >
                <Tag size={10} />
                {lbl}
              </span>
            ))}
          </div>
        )}

        {/* Bottom Actions (Always visible on mobile/touch, hover on desktop) */}
        <div className="flex flex-wrap items-center justify-between opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity mt-2 text-gray-600 dark:text-gray-300 focus-within:opacity-100 relative">
          {trashed ? (
            // Trash mode actions: Restore and Delete Permanently
            <div className="flex items-center gap-2 w-full justify-end">
              {onRestore && (
                <button
                  type="button"
                  aria-label="Restore note"
                  title="Restore note"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRestore(e);
                  }}
                  className="hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 p-1.5 rounded-full focus:outline-none"
                >
                  <RotateCcw size={16} />
                </button>
              )}
              {onPermanentDelete && (
                <button
                  type="button"
                  aria-label="Delete permanently"
                  title="Delete permanently"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPermanentDelete(e);
                  }}
                  className="hover:text-red-600 dark:hover:text-red-400 hover:bg-black/5 dark:hover:bg-white/10 p-1.5 rounded-full focus:outline-none"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ) : (
            // Standard note actions
            <>
              <div className="flex items-center gap-0.5 sm:gap-1">
                {onReminder && (
                  <button
                    type="button"
                    aria-label="Remind me"
                    title="Remind me"
                    onClick={(e) => {
                      e.stopPropagation();
                      onReminder(e);
                    }}
                    className={`hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 p-1.5 rounded-full focus:outline-none ${
                      reminderAt ? "text-blue-600 dark:text-blue-400" : ""
                    }`}
                  >
                    <Bell size={16} />
                  </button>
                )}

                {/* Sharing Action (Enabled based on settings.sharingEnabled) */}
                {settings.sharingEnabled && (
                  <button
                    type="button"
                    aria-label={copiedShare ? "Note copied!" : "Share note"}
                    title={copiedShare ? "Copied to clipboard!" : "Share note"}
                    onClick={handleShare}
                    className={`hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 p-1.5 rounded-full focus:outline-none transition-colors ${
                      copiedShare ? "text-green-600 dark:text-green-400" : ""
                    }`}
                  >
                    <Share2 size={16} />
                  </button>
                )}

                {onColorChange && (
                  <div className="relative">
                    <button
                      type="button"
                      aria-label="Background color"
                      title="Background color"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowColorPicker(!showColorPicker);
                      }}
                      className="hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 p-1.5 rounded-full focus:outline-none"
                    >
                      <Palette size={16} />
                    </button>

                    {/* Inline Color Palette on Card */}
                    {showColorPicker && (
                      <div
                        className="absolute bottom-8 left-0 bg-white dark:bg-[#2d2e30] shadow-lg rounded-lg p-1.5 flex flex-wrap gap-1 z-50 border border-gray-200 dark:border-[#5f6368]/40 w-36"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {KEEP_COLORS.map((col) => (
                          <button
                            key={col}
                            type="button"
                            aria-label={`Select ${col}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              onColorChange(col, e);
                              setShowColorPicker(false);
                            }}
                            className={`w-5 h-5 rounded-full border hover:border-black dark:hover:border-white ${col} ${
                              bgColor === col ? "border-black dark:border-white" : "border-gray-300 dark:border-gray-600"
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {onArchive && (
                  <button
                    type="button"
                    aria-label={archived ? "Unarchive" : "Archive"}
                    title={archived ? "Unarchive" : "Archive"}
                    onClick={(e) => {
                      e.stopPropagation();
                      onArchive(e);
                    }}
                    className={`hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 p-1.5 rounded-full focus:outline-none ${
                      archived ? "text-blue-600 dark:text-blue-400" : ""
                    }`}
                  >
                    {archived ? <ArchiveRestore size={16} /> : <Archive size={16} />}
                  </button>
                )}
              </div>

              {onDelete && (
                <button
                  type="button"
                  aria-label="Delete note"
                  title="Delete note"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(e);
                  }}
                  className="hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 p-1.5 rounded-full focus:outline-none"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}