"use client";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { useSidebar } from "@/context/SidebarContext";

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const sidebar = useSidebar();
  const collapsed = sidebar?.collapsed ?? false;

  return (
    <div className="min-h-screen bg-white dark:bg-[#202124] text-[#202124] dark:text-[#e8eaed] transition-colors duration-200">
      {/* 1. Fixed Header at the top (64px) */}
      <Header />

      {/* 2. Fixed Sidebar starting below the header */}
      <Sidebar />

      {/* 3. Main Content Area */}
      <main
        className={`pt-16 min-h-screen transition-[margin] duration-200 ease-in-out ml-0 ${
          collapsed ? "md:ml-[72px]" : "md:ml-[280px]"
        }`}
      >
        <div className="px-2.5 py-3 sm:p-6 lg:p-8 max-w-[1600px] mx-auto w-full min-w-0">
          {children}
        </div>
      </main>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayoutContent>{children}</DashboardLayoutContent>;
}