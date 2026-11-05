"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Briefcase, Users, Workflow, Plug,
  BarChart2, Settings, Star, Clock, ChevronDown,
  Plus, Search, Bell, HelpCircle, Video, Hash, ChevronRight,
  Shield, LogOut, CreditCard, Sparkles, ExternalLink
} from "lucide-react";
import { useState, useEffect } from "react";

const mainNav = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Roles & Boards", href: "/roles", icon: Briefcase },
  { name: "Candidates", href: "/candidates", icon: Users },
  { name: "Workflows", href: "/workflows", icon: Workflow },
];

const spaces = [
  { name: "Engineering", href: "/roles?space=engineering", color: "bg-blue-500" },
  { name: "Operations", href: "/roles?space=ops", color: "bg-violet-500" },
  { name: "Product", href: "/roles?space=product", color: "bg-emerald-500" },
];

const bottomNav = [
  { name: "Analytics", href: "/analytics", icon: BarChart2 },
  { name: "Integrations", href: "/integrations", icon: Plug },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function DashboardSidebar({ isOpen, onClose }: { isOpen?: boolean, onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const [spacesOpen, setSpacesOpen] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>({
    name: "Sarah Lin",
    email: "recruiter@jobninjas.ai",
    role: "Lead Technical Recruiter",
    org: "Linear Technologies",
    plan: "Team Pro",
    isAdmin: true,
  });

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setCurrentUser(data.user);
        }
      })
      .catch(() => undefined);
  }, []);

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
    } catch {
      window.location.href = "/login";
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-30 md:hidden" 
          onClick={onClose}
        />
      )}
      
      <aside className={`fixed left-0 top-0 h-full w-60 bg-white border-r border-slate-200 flex flex-col z-40 select-none transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 font-sans`}>
        {/* Workspace header */}
        <div className="flex items-center gap-2.5 px-4 py-4 border-b border-slate-100 hover:bg-slate-50 transition-colors">
          <Image
            src="/logo.png"
            alt="JobNinjas"
            width={32}
            height={32}
            className="rounded-lg object-contain shrink-0"
            unoptimized
          />
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-bold text-slate-900 truncate">jobNinjas.ai</p>
            <p className="text-[11px] text-slate-400 truncate">{currentUser.org || "HR Workspace"}</p>
          </div>
          <span className="rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-mono text-[9px] font-bold px-1.5 py-0.5">
            {currentUser.plan || "PRO"}
          </span>
        </div>

        {/* Search */}
        <div className="px-3 py-2.5 border-b border-slate-100">
          <Link href="/roles" className="flex items-center gap-2 bg-slate-100 rounded-lg px-2.5 py-1.5 hover:bg-slate-200 transition-colors">
            <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-[12px] text-slate-400">Search roles or candidates</span>
          </Link>
        </div>

        {/* Main nav */}
        <nav className="flex-1 overflow-y-auto py-2">
          <div className="px-2 space-y-0.5">
            {mainNav.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href.split("?")[0]));
              return (
                <Link key={item.name} href={item.href}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors
                    ${isActive ? "bg-slate-100 text-slate-900 font-semibold" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}>
                  <item.icon className={`w-4 h-4 shrink-0 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Spaces */}
          <div className="mt-4 px-2">
            <button
              onClick={() => setSpacesOpen(!spacesOpen)}
              className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider hover:text-slate-600 transition-colors cursor-pointer">
              <span>Departments</span>
              <div className="flex items-center gap-1">
                <ChevronRight className={`w-3.5 h-3.5 transition-transform ${spacesOpen ? "rotate-90" : ""}`} />
              </div>
            </button>
            {spacesOpen && (
              <div className="mt-1 space-y-0.5">
                {spaces.map((space) => (
                  <Link key={space.name} href={space.href}
                    className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${space.color}`}></span>
                    {space.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="my-4 mx-4 border-t border-slate-100" />

          {/* Bottom nav */}
          <div className="px-2 space-y-0.5">
            {bottomNav.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link key={item.name} href={item.href}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors
                    ${isActive ? "bg-slate-100 text-slate-900 font-semibold" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}>
                  <item.icon className={`w-4 h-4 shrink-0 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                  {item.name}
                </Link>
              );
            })}

            {/* Admin Console Link */}
            <Link
              href="/admin"
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-semibold text-sky-700 bg-sky-50/60 hover:bg-sky-100/70 transition-colors border border-sky-100"
            >
              <Shield className="w-4 h-4 text-sky-600 shrink-0" />
              <span>Admin Console</span>
              <span className="ml-auto text-[9px] font-mono font-bold text-sky-600 bg-white px-1.5 py-0.2 rounded border border-sky-200">
                ADMIN
              </span>
            </Link>
          </div>
        </nav>

        {/* User Account / Plan Profile Box */}
        <div className="border-t border-slate-100 p-3 relative">
          
          {profileOpen && (
            <div className="absolute bottom-full left-3 right-3 mb-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl text-xs space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-150">
              <div className="pb-2 border-b border-slate-100">
                <p className="font-bold text-slate-900">{currentUser.name}</p>
                <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
              </div>

              <Link
                href="/pricing"
                onClick={() => setProfileOpen(false)}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 text-slate-700 font-medium transition-colors"
              >
                <span className="flex items-center gap-2">
                  <CreditCard className="size-3.5 text-blue-600" />
                  <span>Subscription Plan</span>
                </span>
                <span className="font-bold text-blue-600 text-[11px]">{currentUser.plan || "Team Pro"}</span>
              </Link>

              <Link
                href="/admin"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 text-slate-700 font-medium transition-colors"
              >
                <Shield className="size-3.5 text-sky-600" />
                <span>admin.jobninjas.ai</span>
              </Link>

              <button
                type="button"
                onClick={handleSignOut}
                className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-red-50 text-red-600 font-medium transition-colors cursor-pointer text-left"
              >
                <LogOut className="size-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}

          <div 
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
          >
            <div className="size-8 rounded-full bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-2xs">
              {currentUser.name?.charAt(0) || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</p>
              <p className="text-[10px] text-slate-400 font-mono truncate">{currentUser.plan || "Team Pro"} Plan</p>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
          </div>
        </div>
      </aside>
    </>
  );
}
