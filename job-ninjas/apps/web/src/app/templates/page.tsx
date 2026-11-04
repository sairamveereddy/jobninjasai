import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Sparkles, Bot, Zap, Filter, Search, Layers, ChevronRight } from "lucide-react";
import { pageSeo, TRIAL_HREF } from "@/lib/marketing/site";

export const metadata: Metadata = pageSeo(
  "Pre-built Recruiting Workflow Templates",
  "Explore production-ready visual hiring pipelines for engineering, sales, leadership, and high-volume recruiting.",
);

const BLUEPRINTS = [
  {
    title: "Senior Engineering Assessment Pipeline",
    category: "Technical Hiring",
    nodes: 8,
    model: "Llama 3.3 70B",
    desc: "Inbound Greenhouse sync ➔ JD skill extraction ➔ GitHub code verification ➔ System design rubric ➔ Slack team broadcast.",
    tags: ["GitHub", "Greenhouse", "Slack", "Coding Rubric"],
  },
  {
    title: "Executive Search & Compensation Benchmarking",
    category: "Leadership",
    nodes: 6,
    model: "DeepSeek R1",
    desc: "Confidential inbound parsing ➔ Multi-round board rubric ➔ Comprehensive comp matrix ($220k - $340k) ➔ Offer drafting.",
    tags: ["Confidential", "Comp Matrix", "Board Dossier"],
  },
  {
    title: "High-Volume Campus & Early Career Screening",
    category: "University",
    nodes: 5,
    model: "Llama 3.3 70B",
    desc: "Bulk PDF parsing (500+ resumes) ➔ Objective coursework & project verification ➔ Batch calendar scheduling.",
    tags: ["Bulk PDF", "Google Calendar", "Coursework Scorer"],
  },
  {
    title: "VIP Onsite Travel Concierge & Candidate Care",
    category: "Operations",
    nodes: 5,
    model: "Ophelia OS Live",
    desc: "Advisory hiring recommendation ➔ Real flight & hotel price discovery via Ophelia ➔ Recruiter approval ➔ Candidate itinerary email.",
    tags: ["Ophelia Travel", "Hotel Discovery", "Gmail"],
  },
  {
    title: "Automated Reference Check & Behavioral Audit",
    category: "Verification",
    nodes: 4,
    model: "Deterministic",
    desc: "Reference outreach scheduling ➔ Question structured synthesis ➔ Cross-check against interview claims ➔ Red flag report.",
    tags: ["Reference Audit", "Fraud Detection", "Structured Notes"],
  },
  {
    title: "Inbound Rejection with Constructive Feedback",
    category: "Candidate Experience",
    nodes: 3,
    model: "Llama 3.3 70B",
    desc: "Disqualification criteria met ➔ Grounded feedback generation ➔ Recruiter review gate ➔ Respectful candidate email.",
    tags: ["Candidate Care", "Human-in-the-loop", "Gmail"],
  },
];

export default function TemplatesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-20 font-sans">
      <div className="text-center max-w-3xl mx-auto">
        <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-3 py-1 text-xs font-mono font-semibold text-neutral-700">
          <Layers className="size-3 text-[#ea4b71]" /> WORKFLOW BLUEPRINTS
        </span>
        <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold tracking-tight text-neutral-950">
          Pre-built workflows for <br className="hidden sm:inline" />
          every recruiting team.
        </h1>
        <p className="mt-4 text-sm sm:text-base text-neutral-600 leading-relaxed">
          Clone proven visual agent pipelines in one click. Customize thresholds, connect your ATS, or wire in custom interview rubrics without starting from scratch.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {BLUEPRINTS.map((bp) => (
          <div
            key={bp.title}
            className="group relative flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-7 shadow-xs hover:border-neutral-300 hover:shadow-md transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">
                  {bp.category}
                </span>
                <span className="rounded-full border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-[10px] font-mono text-neutral-600">
                  {bp.nodes} Nodes
                </span>
              </div>

              <h3 className="text-base font-bold text-neutral-900 group-hover:text-[#ea4b71] transition-colors leading-snug">
                {bp.title}
              </h3>

              <p className="mt-2.5 text-xs text-neutral-500 leading-relaxed min-h-[48px]">
                {bp.desc}
              </p>

              <div className="mt-5 flex flex-wrap gap-1.5">
                {bp.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md border border-neutral-100 bg-neutral-50 px-2 py-0.5 text-[10px] font-mono text-neutral-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between">
              <span className="text-[11px] font-mono text-neutral-400">
                Model: {bp.model}
              </span>
              <Link
                href={TRIAL_HREF}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#ea4b71] hover:underline"
              >
                Use Template
                <ArrowRight className="size-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
