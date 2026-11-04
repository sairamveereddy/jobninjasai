"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { Menu, X, ArrowRight, CheckCircle2, ChevronRight, Sparkles, Terminal, Shield, Zap } from "lucide-react";
import { TRIAL_HREF } from "@/lib/marketing/site";

const LINKS = [
  { href: "/product", label: "Product" },
  { href: "/#pipeline", label: "Agent Pipeline" },
  { href: "/templates", label: "Workflow Templates" },
  { href: "/solutions", label: "Solutions" },
  { href: "/pricing", label: "Pricing" },
  { href: "/resources", label: "Docs" },
];

const FOOTER = [
  {
    title: "Intelligent Canvas",
    links: [
      { href: "/product", label: "Spatial Role Canvas" },
      { href: "/product/resume-parser", label: "GitHub & AST Auditor" },
      { href: "/product/interview-analysis", label: "Audio Transcript Scorer" },
      { href: "/templates", label: "Autonomous Agent Blueprints" },
      { href: "/product/integrations", label: "Ophelia Travel Concierge" },
    ],
  },
  {
    title: "Complex Blueprints",
    links: [
      { href: "/use-cases/technical", label: "Distributed Systems Engineers" },
      { href: "/use-cases/high-volume", label: "High Volume Sourcing Loops" },
      { href: "/use-cases/executive", label: "Executive Search & Comp Bands" },
      { href: "/use-cases/campus", label: "Campus Engineering Cohorts" },
    ],
  },
  {
    title: "Enterprise Solutions",
    links: [
      { href: "/solutions/startups", label: "Founding Teams & Startups" },
      { href: "/solutions/enterprise", label: "Private VPC & SSO Governance" },
      { href: "/solutions/agencies", label: "Talent Advisory Partners" },
      { href: "/resources/docs", label: "REST APIs & MCP Contracts" },
    ],
  },
  {
    title: "Company & Security",
    links: [
      { href: "/pricing", label: "Transparent Pricing" },
      { href: "/privacy", label: "Zero-Training PII Privacy" },
      { href: "/terms", label: "Enterprise Service Terms" },
      { href: "mailto:support@jobninjas.ai", label: "Engineering Support" },
    ],
  },
];

export function MarketingNav() {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <header className="fixed top-0 right-0 left-0 z-50 flex flex-col items-center px-4 pt-3.5 transition-all duration-300">
      <nav 
        aria-label="Global navigation" 
        className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between rounded-full border border-slate-200/90 bg-white/90 px-4 sm:px-6 shadow-xs backdrop-blur-md transition-shadow hover:shadow-md"
      >
        {/* Left: Brand */}
        <div className="flex items-center gap-7">
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group" onClick={() => setOpen(false)}>
            <div className="flex size-8 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white shadow-xs group-hover:scale-105 transition-transform">
              <span className="font-mono text-xs font-black tracking-tight">JN</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-[17px] font-bold tracking-tight text-slate-900 font-sans">jobNinjas</span>
              <span className="size-1.5 rounded-full bg-sky-500" />
            </div>
          </Link>

          {/* Desktop Nav links */}
          <div className="hidden lg:flex items-center gap-1">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full px-3.5 py-1.5 text-[13px] font-medium text-slate-600 transition-colors hover:bg-sky-50/70 hover:text-blue-600"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Right CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-full px-4 py-1.5 text-[13px] font-semibold text-slate-700 transition-colors hover:text-slate-950 hover:bg-slate-100/80"
          >
            Sign in
          </Link>
          <Link
            href={TRIAL_HREF}
            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 px-5 py-2 text-[13px] font-semibold text-white shadow-sm shadow-blue-500/20 transition-all hover:shadow-md active:scale-95"
          >
            <span>Get Started Free</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        {/* Mobile menu hamburger */}
        <button
          ref={buttonRef}
          type="button"
          aria-expanded={open}
          aria-controls={menuId}
          aria-label={open ? "Close navigation" : "Open navigation"}
          onClick={() => setOpen(!open)}
          className="flex size-9 items-center justify-center rounded-full text-slate-700 hover:bg-slate-100 lg:hidden cursor-pointer"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {/* Mobile Drawer */}
      {open && (
        <div
          id={menuId}
          className="fixed inset-0 top-[68px] z-40 bg-slate-900/30 backdrop-blur-sm lg:hidden p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-2">
              {LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-sky-50 hover:text-blue-600 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-2.5 border-t border-slate-100 pt-4">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="flex h-11 items-center justify-center rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 hover:bg-slate-50"
              >
                Sign in
              </Link>
              <Link
                href={TRIAL_HREF}
                onClick={() => setOpen(false)}
                className="flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-sky-600 text-sm font-semibold text-white shadow-xs hover:brightness-105"
              >
                <span>Get Started Free</span>
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export function MarketingFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white font-sans text-slate-600">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand Col */}
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-lg bg-gradient-to-tr from-sky-500 to-blue-600 text-white font-mono text-xs font-bold">
                JN
              </div>
              <span className="font-bold text-slate-900 tracking-tight text-base">jobNinjas</span>
            </Link>
            <p className="mt-3 text-xs leading-relaxed text-slate-500 max-w-xs">
              The spatial intelligence canvas for autonomous recruiting agents and verifiable multi-round hiring pipelines.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50/70 px-3 py-1 text-[11px] font-medium text-sky-800">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Multi-Agent Engine Operational</span>
            </div>
          </div>

          {/* Links Cols */}
          {FOOTER.map((group) => (
            <div key={group.title}>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-mono">
                {group.title}
              </h3>
              <ul className="mt-3.5 space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-xs text-slate-500 hover:text-blue-600 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-8 sm:flex-row text-xs text-slate-400">
          <p>© {new Date().getFullYear()} JobNinjas, Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-slate-600 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-slate-600 transition-colors">Terms of Service</Link>
            <Link href="/pricing" className="hover:text-slate-600 transition-colors">Security & Trust</Link>
            <Link href="mailto:support@jobninjas.ai" className="hover:text-slate-600 transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function MarketingShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-sky-500/20 selection:text-blue-900">
      {/* Miro / n8n subtle SVG dot grid background */}
      <svg className="pointer-events-none fixed inset-0 size-full -z-10 text-slate-300/40" aria-hidden="true">
        <defs>
          <pattern id="light-blue-dots" x="50%" y="0" width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="translate(-11 0)">
            <circle cx="11" cy="11" r="1.2" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#light-blue-dots)" />
      </svg>

      {/* Ambient soft light blue glow */}
      <div className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-sky-100/60 via-blue-50/30 to-transparent blur-3xl -z-10" />

      <MarketingNav />
      <main className="relative z-10 pt-20">{children}</main>
      <MarketingFooter />
    </div>
  );
}
