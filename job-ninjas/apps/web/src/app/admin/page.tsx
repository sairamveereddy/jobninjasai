"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Building2, 
  Users, 
  CreditCard, 
  Workflow, 
  Activity, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  Filter, 
  ArrowUpRight, 
  RefreshCw, 
  Plane, 
  Clock, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Cpu,
  Layers,
  Sparkles
} from "lucide-react";
import { TRIAL_HREF } from "@/lib/marketing/site";

interface AdminOrg {
  id: string;
  name: string;
  domain: string;
  plan: "Starter" | "Team Pro" | "Enterprise";
  mrr: number;
  activeRoles: number;
  candidatesProcessed: number;
  status: "Active" | "Trial" | "Suspended";
  joinedDate: string;
}

const INITIAL_ORGS: AdminOrg[] = [
  {
    id: "org-1",
    name: "Linear Technologies",
    domain: "linear.app",
    plan: "Enterprise",
    mrr: 2490,
    activeRoles: 18,
    candidatesProcessed: 1420,
    status: "Active",
    joinedDate: "2026-02-14",
  },
  {
    id: "org-2",
    name: "Ramp Financial",
    domain: "ramp.com",
    plan: "Enterprise",
    mrr: 4800,
    activeRoles: 32,
    candidatesProcessed: 3280,
    status: "Active",
    joinedDate: "2026-03-01",
  },
  {
    id: "org-3",
    name: "Vercel Corp",
    domain: "vercel.com",
    plan: "Enterprise",
    mrr: 3600,
    activeRoles: 24,
    candidatesProcessed: 2190,
    status: "Active",
    joinedDate: "2026-01-20",
  },
  {
    id: "org-4",
    name: "Retool Inc",
    domain: "retool.com",
    plan: "Team Pro",
    mrr: 490,
    activeRoles: 10,
    candidatesProcessed: 890,
    status: "Active",
    joinedDate: "2026-04-10",
  },
  {
    id: "org-5",
    name: "Brex Global",
    domain: "brex.com",
    plan: "Team Pro",
    mrr: 588,
    activeRoles: 12,
    candidatesProcessed: 1120,
    status: "Active",
    joinedDate: "2026-05-18",
  },
  {
    id: "org-6",
    name: "Acme AI Hiring (Demo)",
    domain: "acme.ai",
    plan: "Team Pro",
    mrr: 49,
    activeRoles: 3,
    candidatesProcessed: 45,
    status: "Active",
    joinedDate: "2026-09-01",
  },
  {
    id: "org-7",
    name: "SeedStage AI",
    domain: "seedstage.dev",
    plan: "Starter",
    mrr: 0,
    activeRoles: 1,
    candidatesProcessed: 12,
    status: "Trial",
    joinedDate: "2026-10-12",
  },
];

interface ConnectorStatus {
  name: string;
  category: string;
  status: "Operational" | "Degraded" | "Active";
  latency: string;
  eventsToday: number;
}

const CONNECTORS: ConnectorStatus[] = [
  { name: "Greenhouse Harvest API v3", category: "ATS Ingestion", status: "Operational", latency: "14ms", eventsToday: 8420 },
  { name: "Ashby Webhooks Gateway", category: "ATS Live Sync", status: "Operational", latency: "9ms", eventsToday: 3120 },
  { name: "Workday Enterprise REST", category: "Global HRIS", status: "Operational", latency: "38ms", eventsToday: 1840 },
  { name: "Slack Interactive Block Kit", category: "Team Voting", status: "Operational", latency: "12ms", eventsToday: 12490 },
  { name: "Ophelia OS Travel Concierge", category: "VIP Hospitality", status: "Operational", latency: "82ms", eventsToday: 412 },
  { name: "GitHub Octokit AST Engine", category: "Code Forensics", status: "Operational", latency: "24ms", eventsToday: 5120 },
  { name: "Google Calendar & Meet", category: "Interview Slots", status: "Operational", latency: "29ms", eventsToday: 6940 },
];

export default function AdminPage() {
  const [tab, setTab] = useState<"orgs" | "pipelines" | "connectors" | "audit">("orgs");
  const [orgs, setOrgs] = useState<AdminOrg[]>(INITIAL_ORGS);
  const [search, setSearch] = useState("");
  const [selectedPlanFilter, setSelectedPlanFilter] = useState<string>("ALL");

  const filteredOrgs = orgs.filter((org) => {
    const matchSearch = org.name.toLowerCase().includes(search.toLowerCase()) || org.domain.toLowerCase().includes(search.toLowerCase());
    const matchPlan = selectedPlanFilter === "ALL" || org.plan === selectedPlanFilter;
    return matchSearch && matchPlan;
  });

  const totalMRR = orgs.reduce((acc, curr) => acc + curr.mrr, 0);
  const totalCandidates = orgs.reduce((acc, curr) => acc + curr.candidatesProcessed, 0);
  const totalRoles = orgs.reduce((acc, curr) => acc + curr.activeRoles, 0);

  const toggleOrgStatus = (id: string) => {
    setOrgs((prev) =>
      prev.map((org) => {
        if (org.id === id) {
          const next = org.status === "Active" ? "Suspended" : "Active";
          return { ...org, status: next };
        }
        return org;
      })
    );
  };

  const changeOrgPlan = (id: string, newPlan: "Starter" | "Team Pro" | "Enterprise") => {
    setOrgs((prev) =>
      prev.map((org) => {
        if (org.id === id) {
          const mrr = newPlan === "Starter" ? 0 : newPlan === "Team Pro" ? org.activeRoles * 49 : org.activeRoles * 199;
          return { ...org, plan: newPlan, mrr };
        }
        return org;
      })
    );
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* Platform Overview Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Platform Operations Console
            </h1>
            <span className="rounded-full bg-blue-900/60 border border-blue-700 text-blue-300 px-2.5 py-0.5 text-xs font-mono font-semibold">
              admin.jobninjas.ai
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            Real-time multi-tenant monitoring, organization subscriptions, autonomous workflow health, and connector telemetry.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/pricing"
            className="rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-2 text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <CreditCard className="size-3.5 text-slate-400" />
            <span>Manage Pricing Tiers</span>
          </Link>
          <Link
            href="/roles"
            className="rounded-xl bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-2 text-xs font-semibold shadow-sm transition-all"
          >
            <span>Open Requisition Canvas</span>
          </Link>
        </div>
      </div>

      {/* Real-Time Telemetry KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1 */}
        <div className="rounded-2xl border border-slate-800 bg-[#121829] p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono uppercase font-semibold">Monthly Recurring Revenue</span>
            <TrendingUp className="size-4 text-emerald-400" />
          </div>
          <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight">
            ${totalMRR.toLocaleString()}
          </p>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
            <span>+18.4% this month</span>
            <span className="text-slate-500">· 284 Active Subscriptions</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="rounded-2xl border border-slate-800 bg-[#121829] p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono uppercase font-semibold">Active Organizations</span>
            <Building2 className="size-4 text-blue-400" />
          </div>
          <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight">
            {orgs.length}
          </p>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-blue-400 font-mono">
            <span>{totalRoles} Active Role Boards</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="rounded-2xl border border-slate-800 bg-[#121829] p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono uppercase font-semibold">Candidates Screened</span>
            <Users className="size-4 text-purple-400" />
          </div>
          <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight">
            {totalCandidates.toLocaleString()}
          </p>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-purple-400 font-mono">
            <span>Zero hallucinated scorecards</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="rounded-2xl border border-slate-800 bg-[#121829] p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono uppercase font-semibold">Ophelia Onsite Hospitality</span>
            <Plane className="size-4 text-sky-400" />
          </div>
          <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight">
            $94,420
          </p>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-sky-400 font-mono">
            <span>412 VIP flights & boutique hotels</span>
          </div>
        </div>

      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => setTab("orgs")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
            tab === "orgs"
              ? "bg-blue-600 text-white shadow-sm"
              : "text-slate-400 hover:text-white hover:bg-slate-800/60"
          }`}
        >
          <Building2 className="size-3.5" />
          <span>Organizations & Subscriptions ({orgs.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setTab("pipelines")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
            tab === "pipelines"
              ? "bg-blue-600 text-white shadow-sm"
              : "text-slate-400 hover:text-white hover:bg-slate-800/60"
          }`}
        >
          <Workflow className="size-3.5" />
          <span>Global Pipelines & Role Boards</span>
        </button>

        <button
          type="button"
          onClick={() => setTab("connectors")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
            tab === "connectors"
              ? "bg-blue-600 text-white shadow-sm"
              : "text-slate-400 hover:text-white hover:bg-slate-800/60"
          }`}
        >
          <Activity className="size-3.5" />
          <span>Connector Health & API Latency</span>
        </button>

        <button
          type="button"
          onClick={() => setTab("audit")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
            tab === "audit"
              ? "bg-blue-600 text-white shadow-sm"
              : "text-slate-400 hover:text-white hover:bg-slate-800/60"
          }`}
        >
          <ShieldCheck className="size-3.5" />
          <span>Audit & EEOC Compliance</span>
        </button>
      </div>

      {/* TAB 1: Organizations & Subscriptions */}
      {tab === "orgs" && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search organization or domain..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-[#121829] pl-10 pr-4 py-2 text-xs text-white placeholder:text-slate-500 outline-none focus:border-blue-600"
              />
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <span className="text-xs text-slate-400 font-mono">Plan Filter:</span>
              {(["ALL", "Starter", "Team Pro", "Enterprise"] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setSelectedPlanFilter(p)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-mono font-semibold transition-colors cursor-pointer ${
                    selectedPlanFilter === p
                      ? "bg-blue-600 text-white"
                      : "bg-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Orgs Table */}
          <div className="rounded-2xl border border-slate-800 bg-[#121829] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-800 bg-slate-900/50 text-slate-400 font-mono uppercase text-[10px]">
                  <tr>
                    <th className="px-5 py-3.5 font-bold">Organization</th>
                    <th className="px-5 py-3.5 font-bold">Subscription Plan</th>
                    <th className="px-5 py-3.5 font-bold">MRR</th>
                    <th className="px-5 py-3.5 font-bold">Active Roles</th>
                    <th className="px-5 py-3.5 font-bold">Candidates</th>
                    <th className="px-5 py-3.5 font-bold">Status</th>
                    <th className="px-5 py-3.5 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredOrgs.map((org) => (
                    <tr key={org.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-5 py-4">
                        <div className="font-bold text-white text-sm">{org.name}</div>
                        <div className="text-[11px] font-mono text-slate-400">{org.domain}</div>
                      </td>

                      <td className="px-5 py-4">
                        <select
                          value={org.plan}
                          onChange={(e) => changeOrgPlan(org.id, e.target.value as any)}
                          className={`rounded-lg px-2.5 py-1 text-xs font-mono font-bold cursor-pointer outline-none border ${
                            org.plan === "Enterprise"
                              ? "bg-purple-950/80 text-purple-300 border-purple-800"
                              : org.plan === "Team Pro"
                              ? "bg-blue-950/80 text-blue-300 border-blue-800"
                              : "bg-slate-800 text-slate-300 border-slate-700"
                          }`}
                        >
                          <option value="Starter">Starter ($0)</option>
                          <option value="Team Pro">Team Pro ($49/role)</option>
                          <option value="Enterprise">Enterprise ($199/role)</option>
                        </select>
                      </td>

                      <td className="px-5 py-4 font-mono font-bold text-emerald-400">
                        ${org.mrr.toLocaleString()}
                      </td>

                      <td className="px-5 py-4 font-mono text-slate-300">
                        {org.activeRoles} boards
                      </td>

                      <td className="px-5 py-4 font-mono text-slate-300">
                        {org.candidatesProcessed.toLocaleString()}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wide border ${
                            org.status === "Active"
                              ? "bg-emerald-950/70 border-emerald-800 text-emerald-300"
                              : org.status === "Trial"
                              ? "bg-sky-950/70 border-sky-800 text-sky-300"
                              : "bg-red-950/70 border-red-800 text-red-300"
                          }`}
                        >
                          <span
                            className={`size-1.5 rounded-full ${
                              org.status === "Active" ? "bg-emerald-400" : "bg-amber-400"
                            }`}
                          />
                          {org.status}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => toggleOrgStatus(org.id)}
                          className="rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-[11px] font-semibold text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
                        >
                          {org.status === "Active" ? "Suspend" : "Activate"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Global Pipelines & Role Boards */}
      {tab === "pipelines" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-[#121829] p-6">
            <h3 className="text-base font-bold text-white mb-2">
              Cross-Organization Role Board Architecture
            </h3>
            <p className="text-xs text-slate-400 max-w-3xl leading-relaxed mb-6">
              Every requisition operates an isolated spatial canvas with its own agent pipeline, candidate state machine, and integration credentials.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                <span className="text-xs font-mono font-bold text-blue-400 uppercase">Engineering Requisitions</span>
                <p className="text-2xl font-bold text-white font-mono mt-1">842 Boards</p>
                <p className="text-[11px] text-slate-500 mt-1">Average 5.2 autonomous agents per role board</p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                <span className="text-xs font-mono font-bold text-purple-400 uppercase">Product & Design Loops</span>
                <p className="text-2xl font-bold text-white font-mono mt-1">394 Boards</p>
                <p className="text-[11px] text-slate-500 mt-1">Portfolio & WCAG design token analysis active</p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase">Executive & Go-To-Market</span>
                <p className="text-2xl font-bold text-white font-mono mt-1">184 Boards</p>
                <p className="text-[11px] text-slate-500 mt-1">Ophelia VIP travel concierge enabled</p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">
                Click any customer board to test-drive in sandbox mode:
              </span>
              <Link
                href={TRIAL_HREF}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300"
              >
                <span>Launch Demo Board</span>
                <ArrowUpRight className="size-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Connectors & Integrations Health */}
      {tab === "connectors" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-[#121829] p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white">Live Integration Gateways</h3>
                <p className="text-xs text-slate-400">Multi-tenant webhook and OAuth connector latencies.</p>
              </div>
              <button
                type="button"
                className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white"
              >
                <RefreshCw className="size-3" />
                <span>Ping Gateways</span>
              </button>
            </div>

            <div className="space-y-3">
              {CONNECTORS.map((c) => (
                <div
                  key={c.name}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/40 p-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                    <div>
                      <h4 className="text-xs font-bold text-white">{c.name}</h4>
                      <p className="text-[11px] text-slate-400 font-mono">{c.category}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-xs font-mono">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Round-Trip Latency</span>
                      <strong className="text-emerald-400">{c.latency}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Events Today</span>
                      <strong className="text-slate-200">{c.eventsToday.toLocaleString()}</strong>
                    </div>
                    <span className="rounded-full bg-emerald-950/70 border border-emerald-800 text-emerald-300 px-2 py-0.5 text-[10px] font-bold">
                      {c.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Audit & EEOC Compliance */}
      {tab === "audit" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-[#121829] p-6">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="size-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white">EEOC & Zero-Bias Audit Engine</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-3xl mb-6">
              JobNinjas runs automated adversarial checks to ensure candidate evaluations are 100% grounded on documented technical evidence. PII, age, gender, and school bias are mathematically stripped from evaluation vectors.
            </p>

            <div className="space-y-2 text-xs font-mono">
              <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-3 flex items-center justify-between text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-emerald-400" />
                  <span>Adversarial Audit: 38,490 scorecards validated against Title VII bias benchmarks.</span>
                </div>
                <span className="text-slate-500">Passed (0 Violations)</span>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-3 flex items-center justify-between text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-emerald-400" />
                  <span>PII Sanitization Gateway: Resumes stripped of photos, addresses, and graduation years before scoring.</span>
                </div>
                <span className="text-slate-500">100% Enforced</span>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-3 flex items-center justify-between text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-emerald-400" />
                  <span>SOC2 Type II Audit Log Storage: Immutably hashed on distributed ledger with automated retention policies.</span>
                </div>
                <span className="text-slate-500">Compliant</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
