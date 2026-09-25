"use client";

import { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Search,
  RefreshCcw,
  Settings,
  Grid2X2,
  List,
  AppWindow,
  X,
  Plus,
  LogOut,
  ChevronUp,
  Pencil,
  Keyboard,
  HelpCircle,
  MessageSquare,
  Smartphone,
  ArrowLeft,
  Sun,
  Moon,
} from 'lucide-react';
import { useSidebar } from '@/context/SidebarContext';
import { useNotes } from '@/context/NotesContext';
import { useAuth } from '@/context/AuthContext';
import SettingsModal from '@/components/SettingsModal';
import KeyboardShortcutsModal from '@/components/KeyboardShortcutsModal';
import FeedbackModal from '@/components/FeedbackModal';
import HelpModal from '@/components/HelpModal';
import AppDownloadsModal from '@/components/AppDownloadsModal';

export default function Header() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<
    'settings' | 'feedback' | 'help' | 'downloads' | 'shortcuts' | 'edit-profile' | null
  >(null);
  const [editName, setEditName] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');

  const { user, logout, updateProfile } = useAuth();

  const sidebar = useSidebar();
  const viewMode = sidebar?.viewMode ?? 'grid';
  const toggleViewMode = sidebar?.toggleViewMode ?? (() => {});
  const darkMode = sidebar?.darkMode ?? false;
  const toggleDarkMode = sidebar?.toggleDarkMode ?? (() => {});

  // Notes Search state
  let notesContext;
  try {
    notesContext = useNotes();
  } catch {
    // fallback
  }
  const searchQuery = notesContext?.searchQuery ?? '';
  const setSearchQuery = notesContext?.setSearchQuery ?? (() => {});

  const settingsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click or Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        settingsRef.current &&
        !settingsRef.current.contains(e.target as Node)
      ) {
        setIsSettingsOpen(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSettingsOpen(false);
        setIsProfileOpen(false);
        setIsMobileSearchOpen(false);
        setActiveModal(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleMenuClick = () => {
    if (sidebar) {
      if (typeof window !== 'undefined' && window.innerWidth < 768) {
        sidebar.toggleMobileOpen();
      } else {
        sidebar.toggleCollapsed();
      }
    }
  };

  return (
    <>
      <header className="w-full h-16 bg-white dark:bg-[#202124] border-b border-gray-200 dark:border-[#5f6368]/30 flex items-center justify-between px-2 sm:px-4 fixed top-0 z-50 transition-colors">
        {/* --- FULL-WIDTH MOBILE SEARCH MODE (Active when user taps search icon on phone) --- */}
        {isMobileSearchOpen ? (
          <div className="flex items-center w-full h-full gap-2 px-1">
            <button
              type="button"
              aria-label="Back to main header"
              onClick={() => {
                setIsMobileSearchOpen(false);
                setSearchQuery('');
              }}
              className="w-10 h-10 flex items-center justify-center hover:bg-[#f1f3f4] dark:hover:bg-[#282a2d] rounded-full text-gray-600 dark:text-gray-300 focus:outline-none shrink-0"
            >
              <ArrowLeft size={22} />
            </button>
            <div className="flex-1 flex items-center bg-[#f1f3f4] dark:bg-[#525355]/30 rounded-lg px-3 h-11 min-w-0">
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="bg-transparent w-full outline-none text-gray-800 dark:text-gray-200 placeholder:text-gray-500 dark:placeholder:text-gray-400 text-[15px] min-w-0"
              />
              {searchQuery && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => setSearchQuery('')}
                  className="p-1.5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full text-gray-500 dark:text-gray-400 focus:outline-none shrink-0"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        ) : (
          /* --- NORMAL HEADER (Desktop + Mobile) --- */
          <>
            {/* Left: Menu & Keep Logo */}
            <div className="flex items-center gap-1 sm:gap-2 shrink-0 md:w-64">
              <button
                type="button"
                onClick={handleMenuClick}
                aria-label={sidebar?.collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center hover:bg-[#f1f3f4] dark:hover:bg-[#282a2d] rounded-full text-gray-600 dark:text-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 transition-colors"
              >
                <Menu size={24} />
              </button>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-8 h-8 bg-yellow-400 rounded-sm flex items-center justify-center shrink-0">
                  <span className="text-white font-bold">Note</span>
                </div>
                <span className="text-[19px] sm:text-[22px] text-gray-600 dark:text-gray-200 font-medium font-sans">
                    X
                </span>
              </div>
            </div>

            {/* Center: Search Bar (Desktop only, hidden on mobile) */}
            <div className="hidden md:flex flex-1 max-w-3xl min-w-0 mx-2 sm:mx-4">
              <div className="bg-[#f1f3f4] dark:bg-[#525355]/30 flex items-center h-11 sm:h-12 rounded-lg px-3 sm:px-4 focus-within:bg-white dark:focus-within:bg-[#202124] focus-within:shadow-md border border-transparent focus-within:border-gray-200 dark:focus-within:border-[#5f6368] transition-all w-full">
                <Search size={20} className="text-gray-500 dark:text-gray-400 mr-2 sm:mr-4 shrink-0" />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent w-full outline-none text-gray-700 dark:text-gray-200 placeholder:text-gray-500 dark:placeholder:text-gray-400 text-sm sm:text-base min-w-0 truncate"
                />
                {searchQuery && (
                  <button
                    type="button"
                    aria-label="Clear search"
                    onClick={() => setSearchQuery('')}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full text-gray-500 dark:text-gray-400 mr-1 focus:outline-none"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Right: Controls & Profile */}
            <div className="flex items-center gap-0.5 sm:gap-1 text-gray-600 shrink-0 relative">
              {/* Compact Search Button on Mobile */}
              <button
                type="button"
                aria-label="Search"
                title="Search"
                onClick={() => setIsMobileSearchOpen(true)}
                className="w-10 h-10 flex md:hidden items-center justify-center hover:bg-[#f1f3f4] dark:hover:bg-[#282a2d] rounded-full text-[#5f6368] dark:text-[#9aa0a6] focus:outline-none"
              >
                <Search size={20} />
              </button>

              {/* Refresh Button */}
              <button
                type="button"
                aria-label="Refresh"
                title="Refresh"
                onClick={() => window.location.reload()}
                className="w-10 h-10 flex items-center justify-center hover:bg-[#f1f3f4] dark:hover:bg-[#282a2d] rounded-full text-[#5f6368] dark:text-[#9aa0a6] focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 transition-colors"
              >
                <RefreshCcw size={20} />
              </button>

              {/* Grid / List View Toggle (Desktop & Tablet only, mobile is naturally 1-col) */}
              <button
                type="button"
                aria-label={
                  viewMode === 'grid'
                    ? 'Switch to list view'
                    : 'Switch to grid view'
                }
                title={
                  viewMode === 'grid'
                    ? 'List view'
                    : 'Grid view'
                }
                onClick={toggleViewMode}
                className="w-10 h-10 hidden md:flex items-center justify-center rounded-full text-[#5f6368] dark:text-[#9aa0a6] hover:bg-[#f1f3f4] dark:hover:bg-[#282a2d] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
              >
                {viewMode === 'grid' ? (
                  <List size={20} className="sm:w-[22px] sm:h-[22px]" />
                ) : (
                  <Grid2X2 size={20} className="sm:w-[22px] sm:h-[22px]" />
                )}
              </button>

              {/* Settings Button & Dropdown */}
              <div className="relative" ref={settingsRef}>
                <button
                  type="button"
                  aria-label="Settings"
                  title="Settings"
                  onClick={() => {
                    setIsSettingsOpen(!isSettingsOpen);
                    setIsProfileOpen(false);
                  }}
                  className="w-10 h-10 flex items-center justify-center hover:bg-[#f1f3f4] dark:hover:bg-[#282a2d] rounded-full text-[#5f6368] dark:text-[#9aa0a6] focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 transition-colors"
                >
                  <Settings size={20} />
                </button>

                {/* Google Keep Style Settings Dropdown */}
                {isSettingsOpen && (
                  <div className="absolute top-12 right-0 w-[calc(100vw-1.5rem)] max-w-[250px] bg-white dark:bg-[#2d2e30] rounded-lg shadow-[0_1px_2px_0_rgba(60,64,67,0.3),0_2px_6px_2px_rgba(60,64,67,0.15)] py-2 z-50 border border-gray-100 dark:border-[#5f6368]/30 cursor-default text-[15px] text-[#3c4043] dark:text-[#e8eaed]">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveModal('settings');
                        setIsSettingsOpen(false);
                      }}
                      className="w-full text-left px-5 py-2.5 hover:bg-[#f1f3f4] dark:hover:bg-[#3c4043] transition-colors focus:outline-none"
                    >
                      Settings
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        toggleDarkMode();
                        setIsSettingsOpen(false);
                      }}
                      className="w-full text-left px-5 py-2.5 hover:bg-[#f1f3f4] dark:hover:bg-[#3c4043] transition-colors focus:outline-none flex items-center justify-between"
                    >
                      <span>{darkMode ? 'Disable dark theme' : 'Enable dark theme'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveModal('feedback');
                        setIsSettingsOpen(false);
                      }}
                      className="w-full text-left px-5 py-2.5 hover:bg-[#f1f3f4] dark:hover:bg-[#3c4043] transition-colors focus:outline-none"
                    >
                      Send feedback
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveModal('help');
                        setIsSettingsOpen(false);
                      }}
                      className="w-full text-left px-5 py-2.5 hover:bg-[#f1f3f4] dark:hover:bg-[#3c4043] transition-colors focus:outline-none"
                    >
                      Help
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveModal('downloads');
                        setIsSettingsOpen(false);
                      }}
                      className="w-full text-left px-5 py-2.5 hover:bg-[#f1f3f4] dark:hover:bg-[#3c4043] transition-colors focus:outline-none"
                    >
                      App downloads
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveModal('shortcuts');
                        setIsSettingsOpen(false);
                      }}
                      className="w-full text-left px-5 py-2.5 hover:bg-[#f1f3f4] dark:hover:bg-[#3c4043] transition-colors focus:outline-none"
                    >
                      Keyboard shortcuts
                    </button>
                  </div>
                )}
              </div>

              <div className="w-px h-8 bg-gray-200 dark:bg-gray-700 mx-1 hidden lg:block"></div>

              <button
                type="button"
                aria-label="Google apps"
                title="Google apps"
                className="w-10 h-10 hidden lg:flex items-center justify-center hover:bg-[#f1f3f4] dark:hover:bg-[#303134] rounded-full text-[#5f6368] dark:text-[#9aa0a6] focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 transition-colors duration-300"
              >
                <AppWindow size={20} />
              </button>

              {/* Theme Toggle Button (Light ↔ Dark) */}
              <button
                type="button"
                onClick={toggleDarkMode}
                aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                className="w-10 h-10 flex items-center justify-center hover:bg-[#f1f3f4] dark:hover:bg-[#303134] rounded-full text-[#5f6368] dark:text-[#9aa0a6] hover:text-[#202124] dark:hover:text-[#e8eaed] transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 shrink-0"
              >
                <div className="transition-transform duration-300 ease-in-out transform">
                  {darkMode ? (
                    <Sun
                      size={20}
                      className="text-[#fbbc04] transition-all duration-300 rotate-0 hover:rotate-45"
                    />
                  ) : (
                    <Moon
                      size={20}
                      className="transition-all duration-300 rotate-0 hover:-rotate-12"
                    />
                  )}
                </div>
              </button>

              {/* Profile Button */}
              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  aria-label="Google Account"
                  onClick={() => {
                    setIsProfileOpen(!isProfileOpen);
                    setIsSettingsOpen(false);
                  }}
                  className="w-8 h-8 rounded-full bg-blue-800 text-white flex items-center justify-center font-bold ml-0.5 sm:ml-1 hover:ring-2 hover:ring-gray-300 transition-all shrink-0 focus:outline-none"
                >
                  {user?.avatar || 'S'}
                </button>

            {/* --- PROFILE DROPDOWN MENU --- */}
            {isProfileOpen && (
              <div className="absolute top-14 right-0 sm:right-2 w-[calc(100vw-1.5rem)] max-w-[340px] bg-[#f0f4f9] dark:bg-[#282a2d] rounded-[24px] sm:rounded-[28px] shadow-xl p-3 sm:p-4 flex flex-col gap-2 z-50 border border-gray-200 dark:border-[#5f6368]/30 cursor-default">
                {/* Close Button */}
                <button
                  type="button"
                  aria-label="Close profile menu"
                  onClick={() => setIsProfileOpen(false)}
                  className="absolute top-4 right-4 p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-colors text-gray-700 dark:text-gray-300 focus:outline-none"
                >
                  <X size={20} />
                </button>

                {/* Profile Info Card */}
                <div className="bg-white dark:bg-[#202124] rounded-[24px] p-4 mt-8 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-blue-800 text-white text-2xl flex items-center justify-center font-medium border-2 border-blue-500 p-1">
                        <div className="w-full h-full bg-blue-800 rounded-full flex items-center justify-center">
                          {user?.avatar || 'S'}
                        </div>
                      </div>
                      <button
                        type="button"
                        aria-label="Edit Profile"
                        onClick={() => {
                          setEditName(user?.name || '');
                          setActiveModal('edit-profile');
                          setIsProfileOpen(false);
                        }}
                        className="absolute bottom-0 right-0 bg-white dark:bg-[#202124] p-1.5 rounded-full shadow-md border border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/10 focus:outline-none"
                      >
                        <Pencil size={12} className="text-gray-700 dark:text-gray-300" />
                      </button>
                    </div>

                    <div className="flex flex-col min-w-0">
                      <span className="text-[17px] font-medium text-gray-900 dark:text-gray-100 truncate">
                        {user?.name || 'Mo. Shahbaj'}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400 max-w-[160px] truncate">
                        {user?.email || 'mohammadshahbaj068@gmail.com'}
                      </span>
                      <span className="mt-1 text-xs font-medium border border-gray-300 dark:border-gray-600 rounded-full px-2 py-0.5 w-fit text-gray-700 dark:text-gray-300">
                        {user?.plan || 'Pro'}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    aria-label="Toggle details"
                    className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-300 focus:outline-none"
                  >
                    <ChevronUp size={20} />
                  </button>
                </div>

                {/* Actions Card 1 */}
                <div className="bg-white dark:bg-[#202124] rounded-[24px] shadow-sm overflow-hidden py-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditName(user?.name || '');
                      setActiveModal('edit-profile');
                      setIsProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-4 px-6 py-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-gray-700 dark:text-gray-200 font-medium focus:outline-none"
                  >
                    <Pencil size={18} className="text-blue-600 dark:text-blue-400" />
                    Edit profile name
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-4 px-6 py-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-gray-700 dark:text-gray-200 font-medium focus:outline-none text-red-600 dark:text-red-400"
                  >
                    <LogOut size={20} />
                    Sign out
                  </button>
                </div>

                {/* Actions Card 2 (Manage Google Account) */}
                <button
                  type="button"
                  className="bg-white dark:bg-[#202124] rounded-[24px] shadow-sm py-4 flex items-center justify-center gap-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors font-medium text-gray-700 dark:text-gray-200 focus:outline-none"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.81 15.69 17.6V20.35H19.26C21.35 18.43 22.56 15.6 22.56 12.25Z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23C14.97 23 17.46 22.02 19.26 20.35L15.69 17.6C14.71 18.25 13.46 18.66 12 18.66C9.18 18.66 6.78 16.76 5.89 14.22H2.21V17.07C4.01 20.65 7.7 23 12 23Z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.89 14.22C5.66 13.54 5.53 12.79 5.53 12C5.53 11.21 5.66 10.46 5.89 9.78V6.93H2.21C1.47 8.41 1.04 10.14 1.04 12C1.04 13.86 1.47 15.59 2.21 17.07L5.89 14.22Z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.34C13.62 5.34 15.07 5.9 16.21 6.99L19.34 3.86C17.45 2.1 14.96 1 12 1C7.7 1 4.01 3.35 2.21 6.93L5.89 9.78C6.78 7.24 9.18 5.34 12 5.34Z"
                      fill="#EA4335"
                    />
                  </svg>
                  Manage your Google Account
                </button>

                <div className="flex justify-center items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-2 mb-2">
                  <a href="#" className="hover:text-gray-700 dark:hover:text-gray-300 hover:underline">
                    Privacy Policy
                  </a>
                  <span>•</span>
                  <a href="#" className="hover:text-gray-700 dark:hover:text-gray-300 hover:underline">
                    Terms of Service
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </>
    )}
  </header>

      {/* --- FUNCTIONAL MODALS --- */}
      <SettingsModal
        isOpen={activeModal === 'settings'}
        onClose={() => setActiveModal(null)}
      />

      <KeyboardShortcutsModal
        isOpen={activeModal === 'shortcuts'}
        onClose={() => setActiveModal(null)}
      />

      <FeedbackModal
        isOpen={activeModal === 'feedback'}
        onClose={() => setActiveModal(null)}
      />

      <HelpModal
        isOpen={activeModal === 'help'}
        onClose={() => setActiveModal(null)}
      />

      <AppDownloadsModal
        isOpen={activeModal === 'downloads'}
        onClose={() => setActiveModal(null)}
      />

      {/* --- EDIT PROFILE MODAL --- */}
      {activeModal === 'edit-profile' && (
        <div
          className="fixed inset-0 bg-black/50 z-[120] flex items-center justify-center p-4"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="w-full max-w-md bg-white dark:bg-[#202124] rounded-2xl shadow-2xl p-6 relative border border-gray-100 dark:border-[#5f6368]/30"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 text-gray-900 dark:text-gray-100 font-medium text-lg">
                <Pencil size={20} className="text-gray-700 dark:text-gray-300" />
                Edit Profile
              </div>
              <button
                type="button"
                aria-label="Close edit profile"
                onClick={() => setActiveModal(null)}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full text-gray-600 dark:text-gray-300 focus:outline-none"
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (editName.trim()) {
                  updateProfile({
                    name: editName.trim(),
                    avatar: editName.trim().charAt(0).toUpperCase() || 'U',
                  });
                  setActiveModal(null);
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Display Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Enter your name"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Email
                </label>
                <div className="text-sm text-gray-700 dark:text-gray-300 py-1 font-mono">
                  {user?.email || 'mohammadshahbaj068@gmail.com'}
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2 rounded-lg focus:outline-none"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}