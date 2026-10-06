"use client";

import { useDemoStore } from "@/lib/store";
import Link from "next/link";
import {
  Plus, X, LayoutGrid, List, ChevronDown,
  Star, MoreHorizontal, Users, Clock, Search, Filter
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Role } from "../../../../shared/types";

const DEPT_COLORS: Record<string, string> = {
  Engineering: "bg-blue-500",
  Product: "bg-violet-500",
  Design: "bg-pink-500",
  Marketing: "bg-orange-500",
  Operations: "bg-emerald-500",
  Sales: "bg-amber-500",
  HR: "bg-rose-500",
};

function getBoardColor(dept: string) {
  return DEPT_COLORS[dept] ?? "bg-slate-400";
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function RolesPage() {
  const { roles, addRole, isSeeded, seedDemoData } = useDemoStore();
  const router = useRouter();
  
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
    if (!isSeeded || !roles.find(r => r.id === 'role-fde')) {
      seedDemoData();
    }
  }, [isSeeded, seedDemoData, roles]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [starred, setStarred] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    department: "",
    location: "",
    hiringManager: "",
    jobDescription: "",
  });

  if (!hasHydrated) return null; // Avoid hydration mismatch

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = "role-" + Math.random().toString(36).substr(2, 9);
    const newRole: Role = {
      id: newId,
      ...formData,
      status: "open",
      createdAt: new Date().toISOString(),
    };
    addRole(newRole);
    setIsModalOpen(false);
    setFormData({ title: "", department: "", location: "", hiringManager: "", jobDescription: "" });
    router.push(`/roles/${newId}/board`);
  };

  const filtered = roles.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-full">
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-slate-900">Boards in this team</h1>
        <div className="flex items-center gap-2">
          
          <button className="px-3.5 py-2 text-[13px] font-medium text-slate-600 border border-slate-200 bg-white rounded-lg hover:bg-slate-50 transition-colors">
            Explore templates
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-semibold px-3.5 py-2 rounded-lg transition-colors">
            <Plus className="w-4 h-4" />
            Create new
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-2 mb-5 flex-wrap">
        <div className="flex items-center gap-1.5 text-[12px] text-slate-500 mr-1">
          <Filter className="w-3.5 h-3.5" />
          Filter by
        </div>
        {["All boards", "Owned by me", "Shared with me"].map((f, i) => (
          <button key={f}
            className={`flex items-center gap-1 px-3 py-1.5 text-[12px] rounded-lg border transition-colors ${i === 0 ? "border-blue-300 bg-blue-50 text-blue-700 font-medium" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}>
            {f} <ChevronDown className="w-3 h-3" />
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2">
          {/* Search */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search boards..."
              className="text-[12px] text-slate-700 outline-none w-36 placeholder-slate-400 bg-transparent"
            />
          </div>
          {/* Sort */}
          <button className="flex items-center gap-1 px-3 py-1.5 text-[12px] rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            Last opened <ChevronDown className="w-3 h-3" />
          </button>
          {/* View toggle */}
          <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white">
            <button onClick={() => setViewMode("grid")}
              className={`p-1.5 transition-colors ${viewMode === "grid" ? "bg-slate-100 text-slate-800" : "text-slate-400 hover:text-slate-600"}`}>
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button onClick={() => setViewMode("list")}
              className={`p-1.5 transition-colors ${viewMode === "list" ? "bg-slate-100 text-slate-800" : "text-slate-400 hover:text-slate-600"}`}>
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── LIST VIEW ── */}
      {viewMode === "list" && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_40px] gap-4 px-4 py-2.5 border-b border-slate-100 bg-slate-50">
            {["Name", "Active agents", "Department", "Status", "Last opened", ""].map((h) => (
              <span key={h} className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">{h}</span>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="py-20 text-center">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <Plus className="w-6 h-6 text-slate-400" />
              </div>
              <p className="text-sm font-medium text-slate-600 mb-1">No boards yet</p>
              <p className="text-xs text-slate-400">Create your first hiring board to get started</p>
              <button onClick={() => setIsModalOpen(true)}
                className="mt-4 px-4 py-2 bg-blue-600 text-white text-[13px] font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                + Create new board
              </button>
            </div>
          ) : (
            filtered.map((role) => (
              <div key={role.id}
                className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_40px] gap-4 px-4 py-3.5 border-b border-slate-50 hover:bg-slate-50/70 transition-colors group items-center">

                {/* Name */}
                <Link href={`/roles/${role.id}/board`} className="flex items-center gap-3 min-w-0">
                  <div className={`w-9 h-9 rounded-xl ${getBoardColor(role.department)} flex items-center justify-center text-white text-[12px] font-bold shrink-0`}>
                    {role.title.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-slate-900 truncate group-hover:text-blue-600 transition-colors">{role.title}</p>
                    <p className="text-[11px] text-slate-400 truncate">Modified {timeAgo(role.createdAt)}</p>
                  </div>
                </Link>

                {/* Active agents */}
                <div className="flex -space-x-1.5">
                  {["sourcing", "verifier", "analyzer"].slice(0, 2).map((a, i) => (
                    <div key={i} className="w-6 h-6 rounded-full border-2 border-white overflow-hidden bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center text-white text-[9px] font-bold">
                      {a[0].toUpperCase()}
                    </div>
                  ))}
                  <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-slate-500 text-[9px] font-bold">
                    +4
                  </div>
                </div>

                {/* Department */}
                <span className="text-[12px] text-slate-600 truncate">{role.department || "—"}</span>

                {/* Status */}
                <span className={`inline-flex w-fit items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full
                  ${role.status === "open" ? "bg-emerald-50 text-emerald-700" :
                    role.status === "closed" ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-700"}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${role.status === "open" ? "bg-emerald-500" : role.status === "closed" ? "bg-red-400" : "bg-amber-400"}`}></span>
                  {role.status.charAt(0).toUpperCase() + role.status.slice(1)}
                </span>

                {/* Last opened */}
                <span className="text-[12px] text-slate-500">{timeAgo(role.createdAt)}</span>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setStarred((s) => { const n = new Set(s); n.has(role.id) ? n.delete(role.id) : n.add(role.id); return n; })}
                    className="p-1 rounded hover:bg-slate-200 transition-colors">
                    <Star className={`w-3.5 h-3.5 ${starred.has(role.id) ? "fill-amber-400 text-amber-400" : "text-slate-400"}`} />
                  </button>
                  <button className="p-1 rounded hover:bg-slate-200 transition-colors">
                    <MoreHorizontal className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ── GRID VIEW ── */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* New board card */}
          <button onClick={() => setIsModalOpen(true)}
            className="aspect-[4/3] rounded-xl border-2 border-dashed border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50 transition-colors flex flex-col items-center justify-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
              <Plus className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
            </div>
            <span className="text-[13px] font-medium text-slate-500 group-hover:text-blue-600 transition-colors">New board</span>
          </button>

          {filtered.map((role) => (
            <Link key={role.id} href={`/roles/${role.id}/board`}
              className="aspect-[4/3] rounded-xl border border-slate-200 bg-white overflow-hidden hover:shadow-md hover:border-slate-300 transition-all group flex flex-col">
              {/* Preview area */}
              <div className={`flex-1 ${getBoardColor(role.department)} opacity-80 flex items-center justify-center`}>
                <span className="text-white text-3xl font-bold opacity-40">{role.title.charAt(0)}</span>
              </div>
              {/* Card footer */}
              <div className="p-3 flex items-center gap-2 border-t border-slate-100">
                <div className={`w-6 h-6 rounded-lg ${getBoardColor(role.department)} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>
                  {role.title.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-semibold text-slate-900 truncate">{role.title}</p>
                  <p className="text-[10px] text-slate-400 truncate">{timeAgo(role.createdAt)}</p>
                </div>
                <button onClick={(e) => { e.preventDefault(); setStarred((s) => { const n = new Set(s); n.has(role.id) ? n.delete(role.id) : n.add(role.id); return n; }); }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-slate-100">
                  <Star className={`w-3.5 h-3.5 ${starred.has(role.id) ? "fill-amber-400 text-amber-400" : "text-slate-300"}`} />
                </button>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* ── CREATE MODAL ── */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="text-[15px] font-bold text-slate-900">Create new hiring board</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-[12px] font-semibold text-slate-700 mb-1.5">Role Title *</label>
                <input required type="text" value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2.5 text-[13px] text-slate-900 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-400"
                  placeholder="e.g. Senior Product Manager" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-semibold text-slate-700 mb-1.5">Department *</label>
                  <select required value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2.5 text-[13px] text-slate-900 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    <option value="">Select...</option>
                    {Object.keys(DEPT_COLORS).map((d) => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-slate-700 mb-1.5">Location *</label>
                  <input required type="text" value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2.5 text-[13px] text-slate-900 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
                    placeholder="Remote, US" />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-slate-700 mb-1.5">Hiring Manager *</label>
                <input required type="text" value={formData.hiringManager}
                  onChange={(e) => setFormData({ ...formData, hiringManager: e.target.value })}
                  className="w-full px-3 py-2.5 text-[13px] text-slate-900 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
                  placeholder="e.g. Jane Doe" />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-slate-700 mb-1.5">Job Description</label>
                <textarea rows={3} value={formData.jobDescription}
                  onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
                  className="w-full px-3 py-2.5 text-[13px] text-slate-900 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none placeholder-slate-400"
                  placeholder="Brief summary of the role..." />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-[13px] font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                  Cancel
                </button>
                <button type="submit"
                  className="px-5 py-2.5 text-[13px] font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                  Create Board →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
