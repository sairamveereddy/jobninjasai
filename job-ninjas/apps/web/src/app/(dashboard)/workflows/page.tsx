"use client";

import { useEffect, useState } from "react";
import { 
  Play, 
  CheckCircle, 
  Clock, 
  Workflow, 
  ArrowRight, 
  Plus, 
  Loader2, 
  Sparkles, 
  Layers, 
  Code2, 
  FileText, 
  Headphones, 
  Plane, 
  UserCheck, 
  Zap,
  SlidersHorizontal,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Blueprint {
  id: string;
  title: string;
  badge: string;
  department: string;
  description: string;
  agentChain: string[];
  stages: string[];
}

const BLUEPRINTS: Blueprint[] = [
  {
    id: "full-stack-eng",
    title: "End-to-End Systems & Full-Stack Pipeline",
    badge: "5 Autonomous Agents",
    department: "Engineering",
    description: "Evaluates candidates across real GitHub repositories, runs automated AST syntax checks, scores architecture audio debates, and reserves onsite travel.",
    agentChain: ["Resume Screener", "GitHub AST Auditor", "Audio Transcript Scorer", "Ophelia Travel Concierge", "Slack Offer Gate"],
    stages: ["ATS Intake", "Code Forensics", "System Architecture", "VIP Travel", "Hiring Committee"],
  },
  {
    id: "product-design",
    title: "Product Design & Design Systems Loop",
    badge: "4 Autonomous Agents",
    department: "Design & UX",
    description: "Audits Figma component libraries, checks WCAG AAA accessibility contrast, scores presentation clarity, and prepares competitive equity compensation.",
    agentChain: ["Portfolio Reviewer", "WCAG Accessibility Agent", "Interview Audio Scorer", "Offer Gate"],
    stages: ["Portfolio Intake", "Design System Audit", "Critique Loop", "Offer Decision"],
  },
  {
    id: "exec-search",
    title: "Executive Leadership & Board Sign-Off",
    badge: "5 Autonomous Agents",
    department: "Leadership & Product",
    description: "Cross-checks $15M+ ARR track record case studies, evaluates executive communication, and dispatches luxury boutique travel packages.",
    agentChain: ["Track Record Auditor", "Executive Transcript Scorer", "Ophelia 5-Star Concierge", "Board Dossier Gate"],
    stages: ["Executive Sourcing", "Strategic Case Study", "Executive Debrief", "VIP Onsite", "Board Approval"],
  },
  {
    id: "campus-grad",
    title: "High-Volume Early Career & University Cohort",
    badge: "3 Autonomous Agents",
    department: "Campus Recruiting",
    description: "Fast-tracks hundreds of incoming student applications using deterministic rubrics, coding assessment checks, and automated batch scheduling.",
    agentChain: ["Bulk Resume Screener", "Automated Coding Quiz", "Batch Offer Gate"],
    stages: ["Bulk Resume Parse", "Coding Assessment", "Batch Decision"],
  },
];

export default function WorkflowsPage() {
  const router = useRouter();
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWorkflows() {
      try {
        setLoading(true);
        const res = await fetch("/api/roles");
        const data = await res.json();
        if (data.success && data.roles) {
          setRoles(data.roles);
        }
      } catch (e) {
        console.error("Failed to load workflow boards:", e);
      } finally {
        setLoading(false);
      }
    }

    fetchWorkflows();
  }, []);

  return (
    <div className="p-6 sm:p-8 h-full flex flex-col gap-8 relative overflow-y-auto font-sans">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-sky-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden flex-shrink-0">
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="p-1.5 bg-white/20 rounded-lg backdrop-blur-xs text-white">
              <Workflow className="size-4" />
            </span>
            <span className="text-xs font-mono font-bold tracking-wider uppercase text-blue-200">
              Autonomous Workflow Orchestration
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Executable Multi-Agent Hiring Workflows
          </h2>
          <p className="mt-2 text-indigo-100 text-xs sm:text-sm leading-relaxed max-w-2xl">
            Each requisition in JobNinjas operates an isolated multi-agent pipeline. Launch pre-built blueprints or configure custom agent chains linking resume screening, GitHub audits, interview audio analysis, and Ophelia VIP travel.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href="/roles"
              className="inline-flex items-center gap-2 bg-white text-blue-700 font-bold px-4 py-2 rounded-full hover:bg-blue-50 transition-colors shadow-xs text-xs cursor-pointer"
            >
              <Plus className="size-3.5" />
              <span>Create Custom Requisition</span>
            </Link>
            <span className="text-xs text-indigo-200 font-mono">
              {roles.length} Active Role Pipelines Running
            </span>
          </div>
        </div>
      </div>

      {/* 1. Pre-Configured Executable Blueprints */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Pre-Configured Pipeline Blueprints
            </h3>
            <p className="text-xs text-slate-500">
              Instantiate proven, production-tested agent sequences directly onto any open requisition.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {BLUEPRINTS.map((bp) => (
            <div
              key={bp.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-mono font-bold text-blue-700 border border-blue-200">
                    {bp.department}
                  </span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-mono font-semibold text-slate-600">
                    {bp.badge}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900">
                  {bp.title}
                </h4>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                  {bp.description}
                </p>

                {/* Agent Sequence Flow */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    Autonomous Agent Sequence:
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {bp.agentChain.map((agent, i) => (
                      <div key={agent} className="flex items-center gap-1">
                        <span className="rounded-lg bg-slate-50 border border-slate-200/80 px-2 py-0.5 text-[10px] font-mono text-slate-700 font-medium">
                          {agent}
                        </span>
                        {i < bp.agentChain.length - 1 && (
                          <ChevronRight className="size-3 text-slate-400" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-emerald-700 font-semibold font-mono flex items-center gap-1">
                  <CheckCircle className="size-3 text-emerald-600" /> Ready to instantiate
                </span>
                <Link
                  href="/roles"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors group"
                >
                  <span>Launch on Requisition</span>
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Active Pipeline Boards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Active Pipeline Boards ({roles.length})
            </h3>
            <p className="text-xs text-slate-500">
              Real-time spatial canvases running candidate screening on your open roles.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center text-slate-400 gap-3">
            <Loader2 className="size-6 animate-spin text-blue-600" />
            <p className="text-xs font-medium">Loading active workflows...</p>
          </div>
        ) : roles.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center shadow-xs">
            <div className="size-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
              <Workflow className="size-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-800 mb-1">No active workflow pipelines</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
              Create a role to run resume screening, interview analysis, and the decision on that requisition.
            </p>
            <Link
              href="/roles"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full text-xs font-semibold hover:bg-blue-700 transition-colors"
            >
              <Plus className="size-3.5" /> Create First Requisition
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roles.map((role) => (
              <div
                key={role.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md">
                      {role.department || "General"}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      LIVE CANVAS
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">{role.title}</h4>
                  <p className="text-xs text-slate-500 mb-4 line-clamp-2">
                    {role.jobDescription || "Requisition pipeline configured with autonomous resume screening and scorecard generation."}
                  </p>

                  <div className="space-y-1.5 border-t border-slate-100 pt-3 mb-4 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span className="text-slate-400">Location:</span>
                      <span className="font-medium text-slate-800">{role.location || "Remote"}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span className="text-slate-400">Candidates in Pipeline:</span>
                      <span className="font-mono font-bold text-blue-600">{role.candidates?.length || 0}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span className="text-slate-400">Hiring Lead:</span>
                      <span className="font-medium text-slate-800">{role.hiringManager || "Hiring Team"}</span>
                    </div>
                  </div>
                </div>

                <Link
                  href={`/roles/${role.id}/board`}
                  className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-xl text-xs transition-colors shadow-2xs cursor-pointer"
                >
                  <Layers className="size-3.5" />
                  <span>Open Spatial Canvas</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
