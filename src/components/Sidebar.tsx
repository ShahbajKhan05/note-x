"use client";

import { Suspense } from 'react';
import { Lightbulb, Bell, Tag, Pencil, Archive, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useSidebar } from '@/context/SidebarContext';

const menuItems = [
  { name: 'Notes', icon: Lightbulb, view: 'notes', path: '/dashboard' },
  { name: 'Reminders', icon: Bell, view: 'reminders', path: '/dashboard?view=reminders' },
  { name: 'Loan', icon: Tag, view: 'loan', path: '/dashboard?view=loan' },
  { name: 'Edit labels', icon: Pencil, view: 'labels', path: '/dashboard?view=labels' },
  { name: 'Archive', icon: Archive, view: 'archive', path: '/dashboard?view=archive' },
  { name: 'Trash', icon: Trash2, view: 'trash', path: '/dashboard?view=trash' },
];

function SidebarInner() {
  const sidebar = useSidebar();
  const collapsed = sidebar?.collapsed ?? false;
  const mobileOpen = sidebar?.mobileOpen ?? false;
  const closeMobile = sidebar?.closeMobile ?? (() => {});

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentView = searchParams.get('view') || 'notes';

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Close sidebar"
          onClick={closeMobile}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') closeMobile();
          }}
          className="fixed inset-0 top-16 bg-black/40 z-30 md:hidden transition-opacity duration-200 cursor-pointer"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed left-0 top-16 bottom-0 bg-white dark:bg-[#202124] z-40 flex flex-col justify-between py-2 select-none border-r border-transparent dark:border-[#5f6368]/20 transition-[width,transform] duration-200 ease-in-out w-[280px] max-w-[85vw] ${
          collapsed ? 'md:w-[72px]' : 'md:w-[280px]'
        } ${
          mobileOpen
            ? 'translate-x-0 shadow-xl md:shadow-none'
            : '-translate-x-full md:translate-x-0'
        }`}
        aria-label="Main sidebar navigation"
      >
        <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden pt-1">
          {/* Navigation Item List */}
          <nav
            className={`flex flex-col pr-4 ${
              collapsed ? 'md:px-0 md:items-center md:pr-0' : 'md:pr-4'
            }`}
          >
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === '/dashboard' && currentView === item.view;

              return (
                <Link
                  key={item.name}
                  href={item.path}
                  onClick={() => closeMobile()}
                  title={collapsed ? item.name : undefined}
                  aria-label={item.name}
                  aria-current={isActive ? 'page' : undefined}
                  className={`h-12 flex items-center transition-colors my-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 w-full pl-6 pr-4 rounded-r-full gap-6 ${
                    collapsed
                      ? 'md:w-12 md:justify-center md:rounded-full md:p-0 md:gap-0'
                      : ''
                  } ${
                    isActive
                      ? 'bg-[#feefc3] text-[#202124] dark:bg-[#41331c] dark:text-[#feefc3]'
                      : 'text-[#5f6368] hover:bg-[#f1f3f4] dark:text-[#9aa0a6] dark:hover:bg-[#282a2d]'
                  }`}
                >
                  <Icon
                    size={24}
                    strokeWidth={1.8}
                    className={`shrink-0 ${
                      isActive
                        ? 'text-[#202124] dark:text-[#feefc3]'
                        : 'text-[#5f6368] dark:text-[#9aa0a6]'
                    }`}
                  />

                  <span
                    className={`text-[15px] tracking-wide truncate ${
                      collapsed ? 'inline md:hidden' : 'inline'
                    } ${
                      isActive
                        ? 'font-medium text-[#202124] dark:text-[#feefc3]'
                        : 'font-normal text-[#5f6368] dark:text-[#9aa0a6]'
                    }`}
                  >
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Open-source licenses */}
        <div
          className={`px-6 py-4 mt-auto shrink-0 ${
            collapsed ? 'block md:hidden' : 'block'
          }`}
        >
          <button
            type="button"
            className="text-xs text-[#5f6368] dark:text-[#9aa0a6] hover:underline cursor-pointer bg-transparent border-none p-0 text-left focus:outline-none"
          >
            Open-source licenses
          </button>
        </div>
      </aside>
    </>
  );
}

export default function Sidebar() {
  return (
    <Suspense fallback={null}>
      <SidebarInner />
    </Suspense>
  );
}