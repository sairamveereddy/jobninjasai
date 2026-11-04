"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { Menu, X, ArrowRight, CheckCircle2, ChevronRight, Sparkles, Terminal, Shield, Zap } from "lucide-react";
import { TRIAL_HREF } from "@/lib/marketing/site";

const LINKS = [
  { href: "/product", label: "Product" },
  { href: "/#pipeline", label: "Agent Pipeline" },
  { href: "/templates", label: "Templates" },
  { href: "/solutions", label: "Solutions" },
  { href: "/pricing", label: "Pricing" },
  { href: "/resources", label: "Docs" },
];

const FOOTER = [
  {
    title: "Product",
    links: [
      { href: "/product", label: "Visual Role Canvas" },
      { href: "/product/resume-parser", label: "Resume Intelligence" },
      { href: "/product/interview-analysis", label: "Interview Scorer" },
      { href: "/templates", label: "Workflow Templates" },
      { href: "/product/integrations", label: "ATS & Slack Connectors" },
    ],
  },
  {
    title: "Use cases",
    links: [
      { href: "/use-cases/technical", label: "Technical & Systems Hiring" },
      { href: "/use-cases/high-volume", label: "High Volume Sourcing" },
      { href: "/use-cases/executive", label: "Executive Search & Comp" },
      { href: "/use-cases/campus", label: "University & New Grad" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { href: "/solutions/startups", label: "High-Growth Startups" },
      { href: "/solutions/enterprise", label: "Enterprise Security & RBAC" },
      { href: "/solutions/agencies", label: "Recruiting Agencies" },
      { href: "/resources/docs", label: "API & Architecture Docs" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/pricing", label: "Pricing & Plans" },
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
      { href: "mailto:support@jobninjas.ai", label: "Contact Support" },
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
    <header className="fixed top-0 right-0 left-0 z-50 flex flex-col items-center px-4 pt-3 transition-all duration-300">
      <nav 
        aria-label="Global navigation" 
        className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between rounded-full border border-neutral-200/90 bg-white/95 px-4 sm:px-6 shadow-xs backdrop-blur-md transition-shadow hover:shadow-sm"
      >
        {/* Left: Brand */}
        <div className="flex items-center gap-7">
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group" onClick={() => setOpen(false)}>
            <div className="flex size-8 items-center justify-center rounded-xl bg-neutral-900 text-white shadow-xs group-hover:scale-105 transition-transform">
              <span className="font-mono text-sm font-black tracking-tight text-[#ea4b71]">J</span>
              <span className="font-mono text-xs font-bold text-white">N</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-base font-bold tracking-tight text-neutral-950 font-sans">jobNinjas</span>
              <span className="size-1.5 rounded-full bg-[#ea4b71]" />
            </div>
          </Link>

          {/* Desktop Nav links */}
          <div className="hidden lg:flex items-center gap-1">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full px-3.5 py-1.5 text-[13px] font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-950"
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
            className="rounded-full px-4 py-1.5 text-[13px] font-semibold text-neutral-700 transition-colors hover:text-neutral-950 hover:bg-neutral-100/80"
          >
            Sign in
          </Link>
          <Link
            href={TRIAL_HREF}
            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#ea4b71] hover:bg-[#df3860] px-5 py-2 text-[13px] font-semibold text-white shadow-xs transition-all hover:shadow-md active:scale-95"
          >
            <span>Get Started</span>
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
          className="flex size-9 items-center justify-center rounded-full text-neutral-700 hover:bg-neutral-100 lg:hidden cursor-pointer"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {/* Mobile Drawer */}
      {open && (
        <div
          id={menuId}
          className="fixed inset-0 top-[68px] z-40 bg-neutral-950/40 backdrop-blur-sm lg:hidden p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full rounded-3xl border border-neutral-200 bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-2">
              {LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-2.5 text-sm font-semibold text-neutral-800 hover:bg-neutral-100 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-2.5 border-t border-neutral-100 pt-4">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="flex h-11 items-center justify-center rounded-xl border border-neutral-200 text-sm font-semibold text-neutral-800 hover:bg-neutral-50"
              >
                Sign in
              </Link>
              <Link
                href={TRIAL_HREF}
                onClick={() => setOpen(false)}
                className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[#ea4b71] text-sm font-semibold text-white shadow-xs hover:bg-[#df3860]"
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
    <footer className="border-t border-neutral-200 bg-white font-sans text-neutral-600">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand Col */}
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-lg bg-neutral-900 text-white font-mono text-xs font-bold">
                <span className="text-[#ea4b71]">J</span>N
              </div>
              <span className="font-bold text-neutral-950 tracking-tight">jobNinjas</span>
            </Link>
            <p className="mt-3 text-xs leading-relaxed text-neutral-500 max-w-xs">
              The fair-code visual platform for autonomous recruiting agents and verifiable hiring workflows.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-[11px] font-medium text-neutral-700">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Inference Engine Operational</span>
            </div>
          </div>

          {/* Links Cols */}
          {FOOTER.map((group) => (
            <div key={group.title}>
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-950 font-mono">
                {group.title}
              </h3>
              <ul className="mt-3.5 space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-xs text-neutral-500 hover:text-neutral-950 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-neutral-100 pt-8 sm:flex-row text-xs text-neutral-400">
          <p>© {new Date().getFullYear()} JobNinjas, Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-neutral-600 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-neutral-600 transition-colors">Terms</Link>
            <Link href="/pricing" className="hover:text-neutral-600 transition-colors">Security</Link>
            <Link href="mailto:support@jobninjas.ai" className="hover:text-neutral-600 transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function MarketingShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-[#fbfbfa] text-neutral-900 font-sans selection:bg-[#ea4b71]/20 selection:text-neutral-950">
      {/* n8n clean SVG dot grid background */}
      <svg className="pointer-events-none fixed inset-0 size-full -z-10 text-neutral-300/50" aria-hidden="true">
        <defs>
          <pattern id="n8n-dot-grid" x="50%" y="0" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="translate(-10 0)">
            <circle cx="10" cy="10" r="1.2" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#n8n-dot-grid)" />
      </svg>

      <MarketingNav />
      <main className="relative z-10 pt-20">{children}</main>
      <MarketingFooter />
    </div>
  );
}
