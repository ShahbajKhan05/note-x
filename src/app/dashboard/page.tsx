"use client";

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  CheckSquare,
  Brush,
  Image as ImageIcon,
  Palette,
  Pin,
  Trash2,
  Bell,
  Tag,
  Pencil,
  Archive,
  Lightbulb,
  X,
  Link as LinkIcon,
} from 'lucide-react';
import NoteCard from '@/components/NoteCard';
import { useSidebar } from '@/context/SidebarContext';
import { useNotes, Note } from '@/context/NotesContext';
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

function DashboardContent() {
  const searchParams = useSearchParams();
  const currentView = searchParams.get('view') || 'notes';

  const sidebar = useSidebar();
  const viewMode = sidebar?.viewMode ?? 'grid';

  const {
    notes,
    isLoaded,
    searchQuery,
    setSearchQuery,
    addNote,
    updateNote,
    deleteNote,
    restoreNote,
    permanentlyDeleteNote,
    emptyTrash,
    togglePin,
    toggleArchive,
    toggleReminder,
    updateColor,
  } = useNotes();

  const {
    settings,
    selectedNoteIds,
    toggleSelectNote,
    clearSelectedNotes,
    activeNoteId,
    setActiveNoteId,
  } = useSettings();

  // Create Note Local States
  const [isExpanded, setIsExpanded] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [selectedColor, setSelectedColor] = useState('bg-white');
  const [isPinned, setIsPinned] = useState(false);
  const [showPalette, setShowPalette] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState<string | null>(null);
  const [showImageInput, setShowImageInput] = useState(false);
  const [imageInputVal, setImageInputVal] = useState('');

  // Edit Note Modal State
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [editImageInput, setEditImageInput] = useState('');
  const [showEditImageInput, setShowEditImageInput] = useState(false);

  // Markdown format helper inside active textarea
  const applyMarkdownToActiveElement = (prefix: string, suffix: string = prefix) => {
    const el = document.activeElement as HTMLTextAreaElement | HTMLInputElement | null;
    if (!el || (el.tagName !== 'TEXTAREA' && el.tagName !== 'INPUT')) return;

    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? 0;
    const val = el.value;
    const selected = val.substring(start, end);

    const updated = val.substring(0, start) + prefix + selected + suffix + val.substring(end);
    el.value = updated;
    el.dispatchEvent(new Event('input', { bubbles: true }));

    const newPos = start + prefix.length + selected.length + suffix.length;
    el.setSelectionRange(newPos, newPos);
  };

  // Save New Note
  const handleSaveNote = useCallback(() => {
    if (newTitle.trim() === '' && newContent.trim() === '' && !newImageUrl) {
      setIsExpanded(false);
      return;
    }

    addNote(
      {
        title: newTitle.trim(),
        content: newContent.trim(),
        bgColor: selectedColor,
        pinned: isPinned,
        imageUrl: newImageUrl,
      },
      settings.addNewItemsToBottom
    );

    // Reset inputs
    setNewTitle('');
    setNewContent('');
    setSelectedColor('bg-white');
    setIsPinned(false);
    setShowPalette(false);
    setNewImageUrl(null);
    setShowImageInput(false);
    setImageInputVal('');
    setIsExpanded(false);
  }, [newTitle, newContent, newImageUrl, selectedColor, isPinned, addNote, settings.addNewItemsToBottom]);

  // Update existing note from modal
  const handleUpdateNote = useCallback(() => {
    if (!editingNote) return;
    updateNote(editingNote.id, {
      title: editingNote.title,
      content: editingNote.content,
      bgColor: editingNote.bgColor,
      pinned: editingNote.pinned,
      imageUrl: editingNote.imageUrl,
    });
    setEditingNote(null);
    setShowEditImageInput(false);
    setEditImageInput('');
  }, [editingNote, updateNote]);

  // Centralized Keyboard Shortcuts Handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac =
        typeof navigator !== 'undefined' &&
        navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const isModifier = isMac ? e.metaKey : e.ctrlKey;
      const activeEl = document.activeElement;
      const activeTag = (activeEl?.tagName || '').toLowerCase();
      const isInputActive = activeTag === 'input' || activeTag === 'textarea';

      // 1. Modifier Shortcuts (Global or In-Editor)
      if (isModifier) {
        // Toggle Grid / List: Ctrl/Cmd + G
        if (e.key === 'g' || e.key === 'G') {
          e.preventDefault();
          sidebar?.toggleViewMode();
          return;
        }

        // Finish editing & save: Ctrl/Cmd + Enter
        if (e.key === 'Enter') {
          e.preventDefault();
          if (editingNote) {
            handleUpdateNote();
          } else if (isExpanded) {
            handleSaveNote();
          }
          return;
        }

        // Text formatting inside editor (Bold, Italic, Underline)
        if (isInputActive) {
          if (e.key === 'b' || e.key === 'B') {
            e.preventDefault();
            applyMarkdownToActiveElement('**');
            return;
          }
          if (e.key === 'i' || e.key === 'I') {
            e.preventDefault();
            applyMarkdownToActiveElement('*');
            return;
          }
          if (e.key === 'u' || e.key === 'U') {
            e.preventDefault();
            applyMarkdownToActiveElement('__');
            return;
          }
        }
      }

      // 2. Escape handling with priority
      if (e.key === 'Escape') {
        if (editingNote) {
          e.preventDefault();
          handleUpdateNote();
          return;
        }
        if (isExpanded) {
          e.preventDefault();
          handleSaveNote();
          return;
        }
        if (selectedNoteIds.length > 0) {
          e.preventDefault();
          clearSelectedNotes();
          return;
        }
      }

      // 3. Safety check: do NOT trigger single-key action shortcuts while typing in inputs
      if (isInputActive) return;

      // 4. Non-modifier shortcuts when NOT typing
      if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        setIsExpanded(true);
        return;
      }

      if (e.key === '/') {
        e.preventDefault();
        const searchInput = document.querySelector(
          'input[placeholder="Search"]'
        ) as HTMLInputElement;
        if (searchInput) searchInput.focus();
        return;
      }

      // Target note IDs: selected notes, active hovered note, or first note in list
      const targetIds =
        selectedNoteIds.length > 0
          ? selectedNoteIds
          : activeNoteId
          ? [activeNoteId]
          : notes.length > 0
          ? [notes[0].id]
          : [];

      if (targetIds.length === 0) return;

      // E: Archive note
      if (e.key === 'e' || e.key === 'E') {
        e.preventDefault();
        targetIds.forEach((id) => toggleArchive(id));
        clearSelectedNotes();
        return;
      }

      // #: Trash note
      if (e.key === '#') {
        e.preventDefault();
        targetIds.forEach((id) => deleteNote(id));
        clearSelectedNotes();
        return;
      }

      // F: Pin / Unpin note
      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        targetIds.forEach((id) => togglePin(id));
        return;
      }

      // X: Select note
      if (e.key === 'x' || e.key === 'X') {
        e.preventDefault();
        if (targetIds[0]) toggleSelectNote(targetIds[0]);
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    editingNote,
    isExpanded,
    selectedNoteIds,
    activeNoteId,
    notes,
    sidebar,
    toggleArchive,
    deleteNote,
    togglePin,
    toggleSelectNote,
    clearSelectedNotes,
    handleSaveNote,
    handleUpdateNote,
  ]);

  // 1. Search Filtering
  const searchFiltered = notes.filter((note) => {
    if (!searchQuery || searchQuery.trim() === '') return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      note.title.toLowerCase().includes(q) ||
      note.content.toLowerCase().includes(q) ||
      note.labels?.some((lbl) => lbl.toLowerCase().includes(q))
    );
  });

  // 2. View-specific filtering
  let displayedNotes: Note[] = [];
  let pinnedNotes: Note[] = [];
  let otherNotes: Note[] = [];

  if (currentView === 'notes') {
    const activeNotes = searchFiltered.filter((n) => !n.archived && !n.trashed);
    pinnedNotes = activeNotes.filter((n) => n.pinned);
    otherNotes = activeNotes.filter((n) => !n.pinned);
  } else if (currentView === 'archive') {
    displayedNotes = searchFiltered.filter((n) => n.archived && !n.trashed);
  } else if (currentView === 'trash') {
    displayedNotes = searchFiltered.filter((n) => n.trashed);
  } else if (currentView === 'reminders') {
    displayedNotes = searchFiltered.filter((n) => n.reminderAt !== null && !n.trashed);
  } else if (currentView === 'loan') {
    displayedNotes = searchFiltered.filter(
      (n) =>
        !n.trashed &&
        (n.labels?.some((l) => l.toLowerCase() === 'loan') ||
          n.title.toLowerCase().includes('loan') ||
          n.content.toLowerCase().includes('loan'))
    );
  } else if (currentView === 'labels') {
    displayedNotes = searchFiltered.filter((n) => !n.trashed && n.labels && n.labels.length > 0);
  }

  // Render a collection of NoteCards
  const renderNoteList = (list: Note[]) => (
    <div
      className={`w-full min-w-0 transition-all duration-200 ${
        viewMode === 'grid'
          ? 'max-w-[1600px] columns-1 sm:columns-2 lg:columns-3 xl:columns-4 2xl:columns-5 gap-3 sm:gap-4'
          : 'max-w-[600px] flex flex-col gap-3 sm:gap-4 mx-auto'
      }`}
    >
      {list.map((note) => (
        <div
          key={note.id}
          className={`relative group cursor-pointer w-full min-w-0 ${
            viewMode === 'grid' ? 'break-inside-avoid mb-3 sm:mb-4' : 'w-full'
          }`}
          onMouseEnter={() => setActiveNoteId(note.id)}
          onClick={() => {
            if (!note.trashed) setEditingNote(note);
          }}
        >
          <NoteCard
            id={note.id}
            title={note.title}
            content={note.content}
            bgColor={note.bgColor}
            pinned={note.pinned}
            archived={note.archived}
            trashed={note.trashed}
            reminderAt={note.reminderAt}
            labels={note.labels}
            imageUrl={note.imageUrl}
            onPin={() => togglePin(note.id)}
            onArchive={() => toggleArchive(note.id)}
            onDelete={() => deleteNote(note.id)}
            onRestore={() => restoreNote(note.id)}
            onPermanentDelete={() => permanentlyDeleteNote(note.id)}
            onColorChange={(color) => updateColor(note.id, color)}
            onReminder={() => toggleReminder(note.id)}
          />
        </div>
      ))}
    </div>
  );

  if (!isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[45vh] text-center select-none py-16">
        <div className="w-9 h-9 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Loading your notes...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center mt-1 sm:mt-2 w-full min-w-0 relative">
      {/* --- CREATE NOTE COMPOSER (visible on Notes view) --- */}
      {currentView === 'notes' && (
        <div
          className={`w-full max-w-[600px] min-w-0 shadow-[0_1px_2px_0_rgba(60,64,67,0.3),0_2px_6px_2px_rgba(60,64,67,0.15)] rounded-lg mb-6 sm:mb-10 transition-colors duration-300 overflow-hidden ${selectedColor} ${
            DARK_NOTE_BG_MAP[selectedColor] || 'dark:bg-[#303134]'
          } border border-transparent dark:border-[#3c4043]`}
        >
          {/* Optional Attached Image in Composer */}
          {newImageUrl && (
            <div className="relative w-full max-h-56 overflow-hidden bg-black/5 dark:bg-white/5">
              <img
                src={newImageUrl}
                alt="Attachment preview"
                className="w-full object-cover max-h-56"
              />
              <button
                type="button"
                onClick={() => setNewImageUrl(null)}
                className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full hover:bg-black/80"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {!isExpanded ? (
            <div
              className={`p-2.5 sm:p-3.5 flex items-center justify-between cursor-text rounded-lg border border-transparent dark:border-[#3c4043] min-w-0 transition-colors duration-300 ${
                selectedColor === 'bg-white'
                  ? 'bg-white dark:bg-[#303134]'
                  : selectedColor + ' ' + (DARK_NOTE_BG_MAP[selectedColor] || '')
              }`}
              onClick={() => setIsExpanded(true)}
            >
              <span className="text-gray-500 dark:text-gray-400 font-medium ml-2 w-full text-[14.5px] sm:text-[15px] truncate">
                Take a note...
              </span>
              <div className="flex gap-1 sm:gap-2 text-gray-500 dark:text-gray-400 mr-0.5 sm:mr-1 shrink-0">
                <button
                  type="button"
                  aria-label="New list"
                  className="hover:bg-gray-100 dark:hover:bg-white/10 p-1.5 sm:p-2 rounded-full focus:outline-none"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded(true);
                  }}
                >
                  <CheckSquare size={19} />
                </button>
                <button
                  type="button"
                  aria-label="New note with drawing"
                  className="hover:bg-gray-100 dark:hover:bg-white/10 p-1.5 sm:p-2 rounded-full focus:outline-none"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded(true);
                  }}
                >
                  <Brush size={19} />
                </button>
                <button
                  type="button"
                  aria-label="New note with image"
                  className="hover:bg-gray-100 dark:hover:bg-white/10 p-1.5 sm:p-2 rounded-full focus:outline-none"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded(true);
                    setShowImageInput(true);
                  }}
                >
                  <ImageIcon size={19} />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 flex flex-col gap-3 relative">
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  placeholder="Title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="bg-transparent outline-none font-bold text-[17px] sm:text-[18px] w-full text-gray-900 dark:text-[#e8eaed] placeholder:text-gray-500 dark:placeholder:text-gray-400 transition-colors duration-300"
                  autoFocus
                />
                <button
                  type="button"
                  aria-label={isPinned ? 'Unpin note' : 'Pin note'}
                  onClick={() => setIsPinned(!isPinned)}
                  className="p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded-full text-gray-600 dark:text-gray-300 focus:outline-none"
                >
                  <Pin
                    size={18}
                    className={
                      isPinned
                        ? `fill-gray-800 dark:fill-[#e8eaed]`
                        : ''
                    }
                  />
                </button>
              </div>

              <textarea
                placeholder="Take a note..."
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                className="bg-transparent outline-none w-full text-[15px] resize-none min-h-[90px] leading-[1.6] text-gray-800 dark:text-[#d0d4d9] placeholder:text-gray-500 dark:placeholder:text-gray-400 transition-colors duration-300"
              />

              {/* Image Input field if toggled */}
              {showImageInput && (
                <div className="flex items-center gap-2 p-2 bg-black/5 dark:bg-white/10 rounded-lg text-xs">
                  <LinkIcon size={14} className="text-gray-500 dark:text-gray-400 shrink-0" />
                  <input
                    type="url"
                    placeholder="Paste image URL (https://...)"
                    value={imageInputVal}
                    onChange={(e) => setImageInputVal(e.target.value)}
                    className="bg-transparent outline-none flex-1 text-gray-800 dark:text-gray-100 placeholder:text-gray-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (imageInputVal.trim()) {
                        setNewImageUrl(imageInputVal.trim());
                        setShowImageInput(false);
                      }
                    }}
                    className="px-2.5 py-1 bg-blue-600 text-white font-medium rounded hover:bg-blue-700"
                  >
                    Attach
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowImageInput(false)}
                    className="p-1 text-gray-500 hover:text-black dark:hover:text-white"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}

              <div className="flex justify-between items-center mt-2 relative">
                <div className="flex gap-1.5 text-gray-500 dark:text-gray-400">
                  <div className="relative">
                    <button
                      type="button"
                      aria-label="Color options"
                      onClick={() => setShowPalette(!showPalette)}
                      className="hover:bg-black/10 dark:hover:bg-white/10 p-2 rounded-full focus:outline-none text-gray-600 dark:text-gray-300"
                    >
                      <Palette size={18} />
                    </button>

                    {showPalette && (
                      <div className="absolute top-10 left-0 bg-white dark:bg-[#2d2e30] shadow-lg rounded-lg p-2 flex flex-wrap gap-1 z-50 border border-gray-200 dark:border-[#5f6368]/40 max-w-[260px] sm:max-w-none">
                        {KEEP_COLORS.map((color) => (
                          <button
                            key={color}
                            type="button"
                            aria-label={`Select color ${color}`}
                            onClick={() => {
                              setSelectedColor(color);
                              setShowPalette(false);
                            }}
                            className={`w-6 h-6 rounded-full border hover:border-black dark:hover:border-white ${color} ${
                              selectedColor === color ? 'border-black dark:border-white' : 'border-gray-300 dark:border-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    aria-label="Add image"
                    onClick={() => setShowImageInput(!showImageInput)}
                    className="hover:bg-black/10 dark:hover:bg-white/10 p-2 rounded-full focus:outline-none text-gray-600 dark:text-gray-300"
                  >
                    <ImageIcon size={18} />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleSaveNote}
                  className={`text-sm font-medium hover:bg-black/10 dark:hover:bg-white/10 px-6 py-2 rounded-md focus:outline-none ${
                    selectedColor === 'bg-white'
                      ? 'text-gray-800 dark:text-gray-200'
                      : 'text-gray-800'
                  }`}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- TRASH TOP BAR BANNER --- */}
      {currentView === 'trash' && (
        <div className="w-full max-w-[800px] mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-[#f1f3f4] dark:bg-[#525355]/30 text-[#5f6368] dark:text-[#9aa0a6] text-sm">
          <span className="italic font-medium">Notes in Trash are deleted after 7 days.</span>
          {displayedNotes.length > 0 && (
            <button
              type="button"
              onClick={emptyTrash}
              className="text-blue-600 dark:text-blue-400 font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 px-4 py-2 rounded-lg transition-colors focus:outline-none shrink-0"
            >
              Empty Trash
            </button>
          )}
        </div>
      )}

      {/* --- NOTES RENDERING BY VIEW --- */}
      {currentView === 'notes' ? (
        <>
          {/* Pinned Section */}
          {pinnedNotes.length > 0 && (
            <div className="w-full mb-8">
              <div
                className={`w-full text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3 ml-1 sm:ml-2 tracking-wider ${
                  viewMode === 'grid' ? 'max-w-[1600px]' : 'max-w-[600px] mx-auto'
                }`}
              >
                PINNED
              </div>
              {renderNoteList(pinnedNotes)}
            </div>
          )}

          {/* Others Section */}
          {otherNotes.length > 0 && (
            <div className="w-full">
              {pinnedNotes.length > 0 && (
                <div
                  className={`w-full text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3 ml-1 sm:ml-2 tracking-wider ${
                    viewMode === 'grid' ? 'max-w-[1600px]' : 'max-w-[600px] mx-auto'
                  }`}
                >
                  NOTES
                </div>
              )}
              {renderNoteList(otherNotes)}
            </div>
          )}

          {/* Empty State */}
          {pinnedNotes.length === 0 && otherNotes.length === 0 && (
            <div className="flex flex-col items-center justify-center min-h-[40vh] text-center select-none py-12 px-4 max-w-md mx-auto">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#f1f3f4] dark:bg-[#303134] flex items-center justify-center mb-5 text-[#5f6368] dark:text-[#9aa0a6] shadow-sm">
                <Lightbulb size={52} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl sm:text-2xl font-medium text-gray-800 dark:text-gray-100 mb-2">
                {searchQuery ? 'No matching notes found' : 'Your notes will appear here'}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-6 leading-relaxed">
                {searchQuery
                  ? `No notes match "${searchQuery}". Try a different keyword.`
                  : 'Capture ideas, tasks, links, and reminders in one place.'}
              </p>
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="px-5 py-2.5 rounded-full text-sm font-medium bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 text-gray-700 dark:text-gray-200 transition-colors focus:outline-none"
                >
                  Clear search
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setIsExpanded(true);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-6 py-2.5 rounded-full text-sm font-medium bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-sm transition-all focus:outline-none"
                >
                  Take a note
                </button>
              )}
            </div>
          )}
        </>
      ) : (
        /* Other Views (Archive, Trash, Reminders, Loan, Labels) */
        <>
          {displayedNotes.length > 0 ? (
            renderNoteList(displayedNotes)
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[40vh] text-center select-none py-12 px-4 max-w-md mx-auto">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#f1f3f4] dark:bg-[#303134] flex items-center justify-center mb-5 text-[#5f6368] dark:text-[#9aa0a6] shadow-sm">
                {currentView === 'archive' && <Archive size={52} strokeWidth={1.5} />}
                {currentView === 'trash' && <Trash2 size={52} strokeWidth={1.5} />}
                {currentView === 'reminders' && <Bell size={52} strokeWidth={1.5} />}
                {currentView === 'loan' && <Tag size={52} strokeWidth={1.5} />}
                {currentView === 'labels' && <Pencil size={52} strokeWidth={1.5} />}
              </div>
              <h3 className="text-xl font-medium text-gray-800 dark:text-gray-100 mb-1">
                {currentView === 'archive' && 'Your archived notes appear here'}
                {currentView === 'trash' && 'No notes in Trash'}
                {currentView === 'reminders' && 'Notes with upcoming reminders appear here'}
                {currentView === 'loan' && 'Notes with the "Loan" label appear here'}
                {currentView === 'labels' && 'No labeled notes found'}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mt-1">
                {currentView === 'archive' && 'Archive notes you want to save without cluttering your main view.'}
                {currentView === 'trash' && 'Items moved to trash will be listed here.'}
                {currentView === 'reminders' && 'Add time reminders to notes to keep track of deadlines.'}
                {currentView === 'loan' && 'Tag notes with the "Loan" label to organize them together.'}
                {currentView === 'labels' && 'Organize your notes with custom labels.'}
              </p>
            </div>
          )}
        </>
      )}

      {/* --- EDIT NOTE MODAL (Popup) --- */}
      {editingNote && (
        <div
          className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-3 sm:p-4"
          onClick={() => handleUpdateNote()}
        >
          <div
            className={`w-full max-w-[600px] max-h-[90vh] overflow-y-auto shadow-2xl rounded-xl p-4 flex flex-col gap-3 relative border border-transparent dark:border-[#3c4043] ${
              editingNote.bgColor
            } ${
              DARK_NOTE_BG_MAP[editingNote.bgColor] || 'dark:bg-[#303134]'
            } transition-colors duration-300`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Optional Attached Image Preview in Modal */}
            {editingNote.imageUrl && (
              <div className="relative w-full max-h-56 overflow-hidden rounded-lg bg-black/5 dark:bg-white/5">
                <img
                  src={editingNote.imageUrl}
                  alt="Attachment"
                  className="w-full object-cover max-h-56"
                />
                <button
                  type="button"
                  onClick={() => setEditingNote({ ...editingNote, imageUrl: null })}
                  className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full hover:bg-black/80"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            <div className="flex items-center justify-between">
              <input
                type="text"
                placeholder="Title"
                value={editingNote.title}
                onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
                className="bg-transparent outline-none font-bold text-[18px] sm:text-[20px] w-full text-gray-900 dark:text-[#e8eaed] placeholder:text-gray-500 dark:placeholder:text-gray-400 transition-colors duration-300"
              />
              <button
                type="button"
                aria-label={editingNote.pinned ? 'Unpin note' : 'Pin note'}
                onClick={() => setEditingNote({ ...editingNote, pinned: !editingNote.pinned })}
                className="p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded-full text-gray-600 dark:text-gray-300 focus:outline-none"
              >
                <Pin
                  size={18}
                  className={
                    editingNote.pinned
                      ? 'fill-gray-800 dark:fill-[#e8eaed]'
                      : ''
                  }
                />
              </button>
            </div>

            <textarea
              placeholder="Note"
              value={editingNote.content}
              onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
              className="bg-transparent outline-none w-full text-[15px] sm:text-[16px] resize-none min-h-[160px] leading-[1.6] text-gray-800 dark:text-[#d0d4d9] placeholder:text-gray-500 dark:placeholder:text-gray-400 transition-colors duration-300"
            />

            {/* Modal Image URL input if toggled */}
            {showEditImageInput && (
              <div className="flex items-center gap-2 p-2 bg-black/5 dark:bg-white/10 rounded-lg text-xs">
                <LinkIcon size={14} className="text-gray-500 dark:text-gray-400 shrink-0" />
                <input
                  type="url"
                  placeholder="Paste image URL (https://...)"
                  value={editImageInput}
                  onChange={(e) => setEditImageInput(e.target.value)}
                  className="bg-transparent outline-none flex-1 text-gray-800 dark:text-gray-100 placeholder:text-gray-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (editImageInput.trim()) {
                      setEditingNote({ ...editingNote, imageUrl: editImageInput.trim() });
                      setShowEditImageInput(false);
                      setEditImageInput('');
                    }
                  }}
                  className="px-2.5 py-1 bg-blue-600 text-white font-medium rounded hover:bg-blue-700"
                >
                  Set Image
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditImageInput(false)}
                  className="p-1 text-gray-500 hover:text-black dark:hover:text-white"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            <div className="flex items-center justify-between mt-2 pt-2 border-t border-black/5 dark:border-white/10">
              <div className="flex items-center gap-1">
                {/* Palette in modal */}
                <div className="relative">
                  <button
                    type="button"
                    aria-label="Color options"
                    onClick={() => setShowPalette(!showPalette)}
                    className="p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded-full text-gray-600 dark:text-gray-300 focus:outline-none"
                  >
                    <Palette size={18} />
                  </button>
                  {showPalette && (
                    <div className="absolute bottom-10 left-0 bg-white dark:bg-[#2d2e30] shadow-lg rounded-lg p-2 flex flex-wrap gap-1 z-50 border border-gray-200 dark:border-[#5f6368]/40 max-w-[260px] sm:max-w-none">
                      {KEEP_COLORS.map((col) => (
                        <button
                          key={col}
                          type="button"
                          aria-label={`Select ${col}`}
                          onClick={() => {
                            setEditingNote({ ...editingNote, bgColor: col });
                            setShowPalette(false);
                          }}
                          className={`w-6 h-6 rounded-full border hover:border-black dark:hover:border-white ${col} ${
                            editingNote.bgColor === col ? 'border-black dark:border-white' : 'border-gray-300 dark:border-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Add Image in modal */}
                <button
                  type="button"
                  aria-label="Add image"
                  onClick={() => setShowEditImageInput(!showEditImageInput)}
                  className="p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded-full text-gray-600 dark:text-gray-300 focus:outline-none"
                >
                  <ImageIcon size={18} />
                </button>

                {/* Archive in modal */}
                <button
                  type="button"
                  aria-label={editingNote.archived ? 'Unarchive' : 'Archive'}
                  onClick={() => {
                    toggleArchive(editingNote.id);
                    setEditingNote(null);
                  }}
                  className="p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded-full text-gray-600 dark:text-gray-300 focus:outline-none"
                >
                  <Archive size={18} />
                </button>

                {/* Delete in modal */}
                <button
                  type="button"
                  aria-label="Delete note"
                  onClick={() => {
                    deleteNote(editingNote.id);
                    setEditingNote(null);
                  }}
                  className="p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded-full text-gray-600 dark:text-gray-300 focus:outline-none"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <button
                type="button"
                onClick={handleUpdateNote}
                className="text-sm font-medium hover:bg-black/10 dark:hover:bg-white/10 px-6 py-2 rounded-md focus:outline-none text-gray-800 dark:text-[#e8eaed] transition-colors duration-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="p-8 text-gray-500">Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}