import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Code2, FileText, HelpCircle, Sparkles, Terminal } from "lucide-react";
import { pageSeo, TRIAL_HREF } from "@/lib/marketing/site";

export const metadata: Metadata = pageSeo(
  "Developer & Recruiter Documentation",
  "Technical guides, agent contracts, REST API references, and architecture documentation for JobNinjas.",
);

const DOC_SECTIONS = [
  {
    title: "Quickstart Guide",
    desc: "Deploy your first autonomous role board in under 2 minutes. Import a job description and execute an initial candidate test run.",
    links: [
      { label: "5-minute Onboarding Tutorial", href: TRIAL_HREF },
      { label: "Greenhouse Webhook Setup", href: "/resources/docs" },
      { label: "Slack Channel Notification Config", href: "/resources/docs" },
    ],
  },
  {
    title: "Agent Contracts & Architecture",
    desc: "Detailed JSON schemas for all 15 agents, deterministic state transitions, and custom prompt overrides.",
    links: [
      { label: "Resume Parsing Contract Spec", href: "/resources/docs" },
      { label: "Interview Transcript Rubric Schema", href: "/resources/docs" },
      { label: "Model Context Protocol (MCP) Integration", href: "/resources/docs" },
    ],
  },
  {
    title: "Integrations & API Reference",
    desc: "Complete REST API documentation for programmatic candidate ingestion, stage updates, and webhook dispatch.",
    links: [
      { label: "REST API Endpoint Reference", href: "/resources/docs" },
      { label: "Authentication & Skip Tokens", href: "/resources/docs" },
      { label: "Ophelia OS Travel Discovery API", href: "/resources/docs" },
    ],
  },
  {
    title: "Compliance & Security",
    desc: "Data privacy practices, GDPR candidate deletion workflows, SOC2 compliance, and EEOC bias prevention audits.",
    links: [
      { label: "Candidate PII Data Isolation", href: "/privacy" },
      { label: "Zero-Model-Training Policy", href: "/terms" },
      { label: "VPC Self-Hosting Architecture", href: "/resources/docs" },
    ],
  },
];

export default function ResourcesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-20 font-sans">
      <div className="text-center max-w-3xl mx-auto">
        <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-3.5 py-1 text-xs font-mono font-semibold text-blue-700 border border-sky-200">
          <BookOpen className="size-3 text-blue-600" /> DOCUMENTATION & GUIDES
        </span>
        <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
          Everything you need to <br className="hidden sm:inline" />
          build and automate hiring.
        </h1>
        <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed">
          Comprehensive guides, API specifications, and architectural documentation for recruiters, founders, and engineering leaders.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-8">
        {DOC_SECTIONS.map((sec) => (
          <div
            key={sec.title}
            className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-10 shadow-xs hover:border-sky-300 transition-all"
          >
            <h3 className="text-xl font-bold text-slate-900">{sec.title}</h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed">
              {sec.desc}
            </p>

            <ul className="mt-6 space-y-3 border-t border-slate-100 pt-5">
              {sec.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-slate-800 hover:text-blue-600 transition-colors"
                  >
                    <ArrowRight className="size-3 text-slate-400" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
