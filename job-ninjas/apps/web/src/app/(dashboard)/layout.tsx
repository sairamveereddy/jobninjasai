"use client";

import { useEffect, useState } from "react";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { DashboardTopBar } from "@/components/dashboard-topbar";
import { LoadingScreen } from "@/components/loading-screen";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const isBoardPage = pathname.includes("/board");

  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <LoadingScreen />;

  // Board page — full screen, no chrome
  if (isBoardPage) {
    return <div className="w-full h-screen overflow-hidden">{children}</div>;
  }

  return (
    <div className="flex h-screen bg-[#f7f8fa] overflow-hidden">
      {/* Permanent left sidebar */}
      <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Right side: topbar + content */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-60">
        <DashboardTopBar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
