"use client";

import { Bell, Plus, Menu } from "lucide-react";
import Link from "next/link";

export function DashboardTopBar({ onMenuClick }: { onMenuClick?: () => void }) {
  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center px-4 md:px-6 gap-4 shrink-0">
      <button 
        onClick={onMenuClick}
        className="md:hidden p-2 -ml-2 rounded-lg hover:bg-slate-100 text-slate-500"
      >
        <Menu className="w-5 h-5" />
      </button>
      <div className="flex-1" />
      <div className="flex items-center gap-2">
        <button className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-500">
          <Bell className="w-4.5 h-4.5" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
        </button>
        <Link
          href="/roles"
          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-semibold px-3.5 py-2 rounded-lg transition-colors">
          <Plus className="w-4 h-4" />
          Create new
        </Link>
      </div>
    </header>
  );
}
