import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { 
  ShieldCheck, 
  Building2, 
  Users, 
  Workflow, 
  CreditCard, 
  Activity, 
  ExternalLink,
  LogOut,
  Sliders,
  Database
} from "lucide-react";

export const metadata: Metadata = {
  title: "Admin Portal · JobNinjas Cloud (admin.jobninjas.ai)",
  description: "Global operations and platform administration console for JobNinjas.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 font-sans antialiased selection:bg-blue-600/30 selection:text-white">
      {/* Top Admin Header Bar */}
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-[#0e1322]/90 backdrop-blur-md px-4 sm:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4 sm:gap-6">
          <Link href="/admin" className="flex items-center gap-2.5 group">
            <Image
              src="/logo.png"
              alt="JobNinjas"
              width={28}
              height={28}
              className="size-7 object-contain"
              unoptimized
            />
            <div className="flex items-baseline gap-1">
              <span className="font-bold text-base tracking-tight text-white font-sans">jobNinjas</span>
              <span className="text-[11px] font-mono font-bold text-sky-400 bg-sky-950/80 px-1.5 py-0.5 rounded border border-sky-800">
                admin.jobninjas.ai
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1.5 rounded-full bg-emerald-950/70 border border-emerald-800/80 px-2.5 py-1 text-[11px] font-medium text-emerald-400 font-mono">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Multi-Tenant Cluster Operational (99.98% Uptime)</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/70 hover:bg-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-200 transition-colors"
          >
            <span>Customer App</span>
            <ExternalLink className="size-3 text-slate-400" />
          </Link>
          <Link
            href="/login"
            className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <LogOut className="size-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="p-4 sm:p-8 max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
}
