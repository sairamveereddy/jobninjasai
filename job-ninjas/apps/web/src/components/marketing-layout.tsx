"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { Menu, X, ArrowRight, Sparkles, ChevronRight, Layers, Workflow, CheckCircle2 } from "lucide-react";
import { TRIAL_HREF } from "@/lib/marketing/site";

const LINKS = [
  { href: "/product", label: "Product" },
  { href: "/#pipeline", label: "Agent Pipeline" },
  { href: "/templates", label: "Workflow Templates" },
  { href: "/solutions", label: "Solutions" },
  { href: "/pricing", label: "Pricing" },
];

const FOOTER = [
  {
    title: "Product",
    links: [
      { href: "/product", label: "Visual Role Canvas" },
      { href: "/product/resume-parser", label: "Resume Intelligence" },
      { href: "/product/interview-analysis", label: "Interview Scorer" },
      { href: "/templates", label: "Pre-built Agent Pipelines" },
      { href: "/product/integrations", label: "Greenhouse & ATS Sync" },
    ],
  },
  {
    title: "Workflow Blueprints",
    links: [
      { href: "/use-cases/technical", label: "Technical & Systems Hiring" },
      { href: "/use-cases/high-volume", label: "High Volume Sourcing" },
      { href: "/use-cases/executive", label: "Executive Search & Comp" },
      { href: "/use-cases/campus", label: "Campus Cohort Evaluation" },
    ],
  },
  {
    title: "Platform",
    links: [
      { href: "/solutions/startups", label: "High-Growth Startups" },
      { href: "/solutions/enterprise", label: "Enterprise & Security" },
      { href: "/solutions/agencies", label: "Talent Partners & Agencies" },
      { href: "/resources/docs", label: "Documentation & Architecture" },
    ],
  },
];

const linkClass =
  "rounded-lg px-3.5 py-2 text-[13.5px] font-medium text-slate-300 transition-colors hover:bg-white/[0.06] hover:text-white";

function TrialButton({ className, onClick, label = "Try live workspace" }: { className?: string; onClick?: () => void; label?: string }) {
  return (
    <Link
      href={TRIAL_HREF}
      onClick={onClick}
      className={
        className ||
        "group relative inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#ff6d5a] via-[#ff5844] to-[#f03d27] px-4 py-2 text-[13.5px] font-semibold text-white shadow-lg shadow-[#ff6d5a]/25 transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
      }
    >
      <span>{label}</span>
      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
    </Link>
  );
}

export function MarketingNav() {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

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
    <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#090a0f]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group" onClick={() => setOpen(false)}>
            <div className="relative size-8 rounded-xl bg-gradient-to-tr from-[#ff6d5a] to-[#7d52ff] p-0.5 shadow-md shadow-[#ff6d5a]/20 transition-transform group-hover:scale-105">
              <div className="size-full bg-[#090a0f] rounded-[10px] flex items-center justify-center overflow-hidden">
                <Image src="/logo.png" alt="JobNinjas" width={24} height={24} className="size-6 object-contain" unoptimized />
              </div>
            </div>
            <span className="text-[17px] font-bold tracking-tight text-white flex items-center gap-1.5">
              JobNinjas
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 bg-[#ff6d5a]/15 text-[#ff7a68] border border-[#ff6d5a]/30 rounded-md">
                AI
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
            {LINKS.map((link) => (
              <Link key={link.href} href={link.href} className={linkClass}>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link href="/login" className="px-3.5 py-2 text-[13.5px] font-medium text-slate-300 hover:text-white transition-colors">
            Sign in
          </Link>
          <TrialButton label="Open Role Board" />
        </div>

        <button
          ref={buttonRef}
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-xl border border-white/[0.12] text-white hover:bg-white/[0.06] md:hidden cursor-pointer"
          aria-expanded={open}
          aria-controls={menuId}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
        </button>
      </div>

      {open && (
        <div id={menuId} ref={panelRef} className="border-t border-white/[0.08] bg-[#090a0f] px-6 py-6 md:hidden animate-in fade-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col gap-2" aria-label="Mobile">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-[15px] font-medium text-slate-200 hover:bg-white/[0.06] hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-white/[0.08] flex flex-col gap-3">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-center text-[15px] font-medium text-slate-300 hover:bg-white/[0.06] hover:text-white"
              >
                Sign in
              </Link>
              <TrialButton
                onClick={() => setOpen(false)}
                label="Open Role Board"
                className="w-full justify-center rounded-xl bg-gradient-to-r from-[#ff6d5a] to-[#f03d27] py-3.5 text-[15px] font-semibold text-white shadow-lg shadow-[#ff6d5a]/25 flex items-center gap-2"
              />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

export function MarketingFooter() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#07080b] relative overflow-hidden">
      {/* Subtle bottom glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[250px] bg-gradient-to-t from-[#ff6d5a]/10 to-transparent blur-3xl pointer-events-none" />

      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 sm:grid-cols-2 lg:grid-cols-5 relative z-10">
        <div className="lg:col-span-2">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="size-7 rounded-lg bg-gradient-to-tr from-[#ff6d5a] to-[#7d52ff] p-0.5">
              <div className="size-full bg-[#090a0f] rounded-[6px] flex items-center justify-center">
                <Image src="/logo.png" alt="" width={20} height={20} className="size-5 object-contain" unoptimized />
              </div>
            </div>
            <span className="text-[17px] font-bold tracking-tight text-white">JobNinjas</span>
          </Link>
          <p className="mt-4 max-w-sm text-[14px] leading-relaxed text-slate-400">
            The visual AI recruiting operating system for hiring teams. Orchestrate 15 autonomous agents across screening, interview scoring, and decisions on an infinite canvas.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <TrialButton label="Try Demo Workspace" />
          </div>
          <div className="mt-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-500/20 text-[12px] text-emerald-400 font-medium">
            <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>AI Inference Engine Operational</span>
          </div>
        </div>

        {FOOTER.map((col) => (
          <div key={col.title}>
            <p className="text-[12px] font-bold uppercase tracking-wider text-slate-400">{col.title}</p>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="inline-flex text-[13.5px] text-slate-400 transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/[0.08] relative z-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-6 text-[13px] text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} JobNinjas, Inc. All rights reserved.</p>
          <p className="flex items-center gap-2">
            <span>Visual workflows for hiring</span>
            <span>·</span>
            <span className="text-slate-400 font-medium">Inspired by fair-code automation</span>
          </p>
          <nav aria-label="Legal" className="flex gap-6">
            <Link href="/privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-slate-300 transition-colors">Terms of Service</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}

export function MarketingShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="marketing-root min-h-screen bg-[#090a0f] font-sans text-slate-100 antialiased selection:bg-[#ff6d5a]/30">
      {/* Background n8n grid pattern */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-40" 
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.08) 1px, transparent 0)`,
          backgroundSize: '28px 28px'
        }}
      />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[80] focus:rounded-xl focus:bg-[#ff6d5a] focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to content
      </a>
      <div className="relative z-10 flex flex-col min-h-screen">
        <MarketingNav />
        <div id="main" className="flex-1">{children}</div>
        <MarketingFooter />
      </div>
    </div>
  );
}
