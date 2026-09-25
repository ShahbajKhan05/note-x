"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface Note {
  id: string;
  title: string;
  content: string;
  bgColor: string;
  pinned: boolean;
  archived: boolean;
  trashed: boolean;
  createdAt: number;
  updatedAt: number;
  reminderAt?: number | null;
  labels?: string[];
  imageUrl?: string | null;
}

interface NotesContextType {
  notes: Note[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  addNote: (data: {
    title: string;
    content: string;
    bgColor?: string;
    pinned?: boolean;
    labels?: string[];
    reminderAt?: number | null;
    imageUrl?: string | null;
  }, addToBottom?: boolean) => Note;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  restoreNote: (id: string) => void;
  permanentlyDeleteNote: (id: string) => void;
  emptyTrash: () => void;
  togglePin: (id: string) => void;
  toggleArchive: (id: string) => void;
  toggleReminder: (id: string) => void;
  updateColor: (id: string, color: string) => void;
}

const STORAGE_KEY = "note-x-notes";

const INITIAL_NOTES: Note[] = [
  {
    id: "seed-1",
    title: "SHORT TERM",
    content:
      "Looking for a short-term Work From Home earning opportunity? Join our upcoming Crowdsourcing Project!",
    bgColor: "bg-white",
    pinned: true,
    archived: false,
    trashed: false,
    createdAt: Date.now() - 3600000 * 24,
    updatedAt: Date.now() - 3600000 * 24,
    labels: ["Work"],
  },
  {
    id: "seed-2",
    title: "EPFO",
    content: "UAN :\nPASS : Shahbaj@2002",
    bgColor: "bg-[#fff475]",
    pinned: false,
    archived: false,
    trashed: false,
    createdAt: Date.now() - 3600000 * 12,
    updatedAt: Date.now() - 3600000 * 12,
  },
  {
    id: "seed-3",
    title: "TECH MAHINDRA login Details",
    content: "Flipkart LDAP\nLDAP ID : techmk@partner.flipkart.com",
    bgColor: "bg-[#aecbfa]",
    pinned: false,
    archived: false,
    trashed: false,
    createdAt: Date.now() - 3600000 * 6,
    updatedAt: Date.now() - 3600000 * 6,
    labels: ["Work"],
  },
];

function generateId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `note-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export function NotesProvider({ children }: { children: React.ReactNode }) {
  const [notes, setNotes] = useState<Note[]>(INITIAL_NOTES);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  // 1. Initial Load from localStorage (runs once)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setNotes(parsed);
        }
      }
    } catch (e) {
      console.error("Failed to load notes from localStorage:", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // 2. Persist to localStorage whenever notes change (guarded against initial empty overwrite)
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch (e) {
      console.error("Failed to save notes to localStorage:", e);
    }
  }, [notes, isLoaded]);

  // Create a new note (supports top or bottom insertion based on settings)
  const addNote = (
    data: {
      title: string;
      content: string;
      bgColor?: string;
      pinned?: boolean;
      labels?: string[];
      reminderAt?: number | null;
      imageUrl?: string | null;
    },
    addToBottom = false
  ): Note => {
    const newNote: Note = {
      id: generateId(),
      title: data.title || "",
      content: data.content || "",
      bgColor: data.bgColor || "bg-white",
      pinned: data.pinned ?? false,
      archived: false,
      trashed: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      reminderAt: data.reminderAt ?? null,
      labels: data.labels || [],
      imageUrl: data.imageUrl ?? null,
    };

    setNotes((prev) => (addToBottom ? [...prev, newNote] : [newNote, ...prev]));
    return newNote;
  };

  // Update existing note by ID
  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id
          ? {
              ...note,
              ...updates,
              updatedAt: Date.now(),
            }
          : note
      )
    );
  };

  // Soft delete: Move note to Trash
  const deleteNote = (id: string) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id
          ? {
              ...note,
              trashed: true,
              pinned: false,
              updatedAt: Date.now(),
            }
          : note
      )
    );
  };

  // Restore note from Trash
  const restoreNote = (id: string) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id
          ? {
              ...note,
              trashed: false,
              updatedAt: Date.now(),
            }
          : note
      )
    );
  };

  // Hard delete: Remove note permanently
  const permanentlyDeleteNote = (id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
  };

  // Empty all notes in trash
  const emptyTrash = () => {
    setNotes((prev) => prev.filter((note) => !note.trashed));
  };

  // Toggle Pinned
  const togglePin = (id: string) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id
          ? {
              ...note,
              pinned: !note.pinned,
              archived: false, // unarchive if pinned
              updatedAt: Date.now(),
            }
          : note
      )
    );
  };

  // Toggle Archive
  const toggleArchive = (id: string) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id
          ? {
              ...note,
              archived: !note.archived,
              pinned: false, // unpin if archived
              updatedAt: Date.now(),
            }
          : note
      )
    );
  };

  // Toggle Reminder
  const toggleReminder = (id: string) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id
          ? {
              ...note,
              reminderAt: note.reminderAt ? null : Date.now() + 86400000, // set 24h default or clear
              updatedAt: Date.now(),
            }
          : note
      )
    );
  };

  // Update note background color
  const updateColor = (id: string, color: string) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id
          ? {
              ...note,
              bgColor: color,
              updatedAt: Date.now(),
            }
          : note
      )
    );
  };

  return (
    <NotesContext.Provider
      value={{
        notes,
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
      }}
    >
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error("useNotes must be used within a NotesProvider");
  }
  return context;
}
