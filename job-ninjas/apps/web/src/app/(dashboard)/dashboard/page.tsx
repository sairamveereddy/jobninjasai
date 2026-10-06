"use client";

import { useDemoStore } from "@/lib/store";
import Link from "next/link";
import {
  Briefcase, Users, Activity, ArrowRight,
  Clock, CheckCircle2, AlertCircle, TrendingUp,
  Bot, Plus, ChevronRight
} from "lucide-react";

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "Yesterday";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const DEPT_COLORS: Record<string, string> = {
  Engineering: "bg-blue-500",
  Product: "bg-violet-500",
  Design: "bg-pink-500",
  Marketing: "bg-orange-500",
  Operations: "bg-emerald-500",
  Sales: "bg-amber-500",
  HR: "bg-rose-500",
};

export default function DashboardPage() {
  const { roles, candidates } = useDemoStore();
  const openRoles = roles.filter((r) => r.status === "open").length;

  const stats = [
    {
      label: "Open Roles",
      value: openRoles || 0,
      sub: `${roles.length} total`,
      icon: Briefcase,
      color: "text-blue-600",
      bg: "bg-blue-50",
      trend: "+2 this week",
      trendUp: true,
    },
    {
      label: "Candidates in Pipeline",
      value: candidates.length || 24,
      sub: "Across all roles",
      icon: Users,
      color: "text-violet-600",
      bg: "bg-violet-50",
      trend: "+8 this week",
      trendUp: true,
    },
    {
      label: "Agent Runs Today",
      value: 47,
      sub: "12 pending",
      icon: Bot,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      trend: "↑ 18% vs yesterday",
      trendUp: true,
    },
    {
      label: "Interviews Scheduled",
      value: 9,
      sub: "Next: Today 3PM",
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
      trend: "3 this week",
      trendUp: false,
    },
  ];

  const activity = [
    { icon: CheckCircle2, color: "text-emerald-500", text: "Resume Verifier completed for Senior React Engineer", time: "2m ago" },
    { icon: Bot, color: "text-blue-500", text: "Sourcing Agent found 14 new candidates for Product Designer", time: "18m ago" },
    { icon: AlertCircle, color: "text-amber-500", text: "Background check flagged 1 candidate for review", time: "1h ago" },
    { icon: CheckCircle2, color: "text-emerald-500", text: "Offer letter sent to Alex M. via DocuSign", time: "2h ago" },
    { icon: Bot, color: "text-violet-500", text: "Transcript Analyzer reviewed 3 interviews for Data Analyst", time: "3h ago" },
    { icon: CheckCircle2, color: "text-emerald-500", text: "Candidate ranker updated shortlist — 6 moved forward", time: "4h ago" },
  ];

  return (
    <div className="p-6 max-w-full">
      {/* Welcome header */}
      <div className="mb-7">
        <h1 className="text-xl font-bold text-slate-900">Good morning, HR Team 👋</h1>
        <p className="text-[13px] text-slate-500 mt-0.5">Here&apos;s what&apos;s happening across your hiring pipelines today.</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center`}>
                <s.icon className={`w-4.5 h-4.5 ${s.color}`} />
              </div>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${s.trendUp ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"}`}>
                {s.trend}
              </span>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{s.value}</p>
              <p className="text-[12px] font-medium text-slate-500">{s.label}</p>
              <p className="text-[11px] text-slate-400">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom two-col layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Active boards (2/3 width) */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[14px] font-bold text-slate-900">Recent Boards</h2>
            <Link href="/roles" className="flex items-center gap-1 text-[12px] text-blue-600 hover:text-blue-700 font-medium">
              View all <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            {roles.length === 0 ? (
              <div className="py-14 flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                  <Plus className="w-6 h-6 text-slate-400" />
                </div>
                <p className="text-[13px] font-medium text-slate-600">No boards yet</p>
                <Link href="/roles"
                  className="px-4 py-2 bg-blue-600 text-white text-[12px] font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                  Create your first board
                </Link>
              </div>
            ) : (
              roles.slice(0, 6).map((role, idx) => (
                <Link key={role.id} href={`/roles/${role.id}/board`}
                  className={`flex items-center gap-3 px-4 py-3.5 hover:bg-slate-50 transition-colors group ${idx !== 0 ? "border-t border-slate-50" : ""}`}>
                  <div className={`w-8 h-8 rounded-xl ${DEPT_COLORS[role.department] ?? "bg-slate-400"} flex items-center justify-center text-white text-[11px] font-bold shrink-0`}>
                    {role.title.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-slate-900 truncate group-hover:text-blue-600 transition-colors">{role.title}</p>
                    <p className="text-[11px] text-slate-400 truncate">{role.department} · {role.location}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full
                      ${role.status === "open" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                      {role.status}
                    </span>
                    <span className="text-[11px] text-slate-400">{timeAgo(role.createdAt)}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-400 transition-colors" />
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Activity feed (1/3 width) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[14px] font-bold text-slate-900">Agent Activity</h2>
            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block"></span>
              Live
            </span>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            {activity.map((a, i) => (
              <div key={i} className={`flex items-start gap-3 px-4 py-3 ${i !== 0 ? "border-t border-slate-50" : ""}`}>
                <a.icon className={`w-4 h-4 mt-0.5 shrink-0 ${a.color}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-slate-700 leading-relaxed">{a.text}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
