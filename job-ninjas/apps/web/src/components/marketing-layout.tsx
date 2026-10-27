"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { TRIAL_HREF } from "@/lib/marketing/site";

const LINKS = [
  { href: "/product", label: "Product" },
  { href: "/#pipeline", label: "Pipeline" },
  { href: "/templates", label: "Agents" },
  { href: "/solutions", label: "Solutions" },
  { href: "/pricing", label: "Pricing" },
];

const FOOTER = [
  {
    title: "Product",
    links: [
      { href: "/product", label: "Role board" },
      { href: "/product/resume-parser", label: "Resume Parser" },
      { href: "/product/integrations", label: "Greenhouse import" },
      { href: "/templates", label: "Agents" },
    ],
  },
  {
    title: "Use cases",
    links: [
      { href: "/use-cases/technical", label: "Technical hiring" },
      { href: "/use-cases/high-volume", label: "High volume" },
      { href: "/use-cases/executive", label: "Executive search" },
      { href: "/use-cases/campus", label: "Campus" },
    ],
  },
  {
    title: "Teams",
    links: [
      { href: "/solutions/startups", label: "Startups" },
      { href: "/solutions/enterprise", label: "Enterprise" },
      { href: "/solutions/agencies", label: "Agencies" },
      { href: "/resources/docs", label: "How a role works" },
    ],
  },
];

const linkClass =
  "rounded-[4px] px-3 py-2 text-[13px] text-[#b1b3b8] transition-colors hover:bg-white/[0.04] hover:text-white";

function TrialLink({ className, onClick }: { className: string; onClick?: () => void }) {
  return (
    <Link href={TRIAL_HREF} onClick={onClick} className={className}>
      Try a role
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
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#08090a]/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-5">
        <Link href="/" className="flex items-center gap-2.5 shrink-0 rounded-[4px]" onClick={() => setOpen(false)}>
          <Image src="/logo.png" alt="" width={28} height={28} className="size-7 rounded-[4px]" unoptimized />
          <span className="text-[15px] font-medium tracking-[-0.02em] text-white">JobNinjas</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={linkClass}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link href="/login" className={linkClass}>
            Sign in
          </Link>
          <TrialLink className="rounded-[4px] bg-[#5e6ad2] px-3.5 py-2 text-[13px] font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] transition-colors hover:bg-[#6d78d8]" />
        </div>

        <button
          ref={buttonRef}
          type="button"
          className="inline-flex size-11 items-center justify-center rounded-[4px] border border-white/[0.15] text-white md:hidden"
          aria-expanded={open}
          aria-controls={menuId}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="size-4" aria-hidden /> : <Menu className="size-4" aria-hidden />}
        </button>
      </div>

      {open && (
        <div id={menuId} ref={panelRef} className="border-t border-white/[0.08] bg-[#08090a] px-5 py-4 md:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-[4px] px-3 py-3 text-[15px] text-[#b1b3b8] hover:bg-white/[0.04] hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="rounded-[4px] px-3 py-3 text-[15px] text-[#b1b3b8] hover:bg-white/[0.04] hover:text-white"
            >
              Sign in
            </Link>
            <TrialLink
              onClick={() => setOpen(false)}
              className="mt-2 rounded-[4px] bg-[#5e6ad2] px-3 py-3 text-center text-[15px] font-medium text-white"
            />
          </nav>
        </div>
      )}
    </header>
  );
}

export function MarketingFooter() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#08090a]">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" className="inline-flex items-center gap-2.5 rounded-[4px]">
            <Image src="/logo.png" alt="" width={24} height={24} className="size-6 rounded-[4px]" unoptimized />
            <span className="text-[15px] font-medium tracking-[-0.02em] text-white">JobNinjas</span>
          </Link>
          <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-[#94969c]">
            The OS for one open role. Agents parse the job, score candidates, and write a recommendation. Your team still hires.
          </p>
          <TrialLink className="mt-5 inline-flex rounded-[4px] bg-[#5e6ad2] px-3.5 py-2 text-[13px] font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] hover:bg-[#6d78d8]" />
        </div>
        {FOOTER.map((col) => (
          <div key={col.title}>
            <p className="text-[12px] font-medium uppercase tracking-[0.14em] text-[#94969c]">{col.title}</p>
            <ul className="mt-4 space-y-1">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="inline-flex rounded-[4px] py-1 text-[13px] text-[#b1b3b8] transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/[0.08]">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-5 text-[12px] text-[#94969c] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} JobNinjas</p>
          <p>One board. One role. Agents that run the hire.</p>
          <nav aria-label="Legal" className="flex gap-4">
            <Link href="/privacy" className="rounded-[4px] hover:text-white">Privacy</Link>
            <Link href="/terms" className="rounded-[4px] hover:text-white">Terms</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}

export function MarketingShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="marketing-root min-h-screen bg-[#08090a] font-sans text-white antialiased selection:bg-[#5e6ad2]/40">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[80] focus:rounded-[4px] focus:bg-[#5e6ad2] focus:px-3 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to content
      </a>
      <MarketingNav />
      <div id="main">{children}</div>
      <MarketingFooter />
    </div>
  );
}
