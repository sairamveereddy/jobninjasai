"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
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
      { href: "/product/resume-parser", label: "Resume Intelligence" },
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
    title: "Company",
    links: [
      { href: "/solutions/startups", label: "Startups" },
      { href: "/solutions/enterprise", label: "Enterprise" },
      { href: "/solutions/agencies", label: "Agencies" },
      { href: "/resources/docs", label: "How a role works" },
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
    ],
  },
];

function TrialLink({ className, onClick }: { className: string; onClick?: () => void }) {
  return (
    <Link href={TRIAL_HREF} onClick={onClick} className={className}>
      Try a role
    </Link>
  );
}

export function MarketingNav() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#08090a]/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-5">
        <Link href="/" className="flex items-center gap-2.5 shrink-0" onClick={close}>
          <Image src="/logo.png" alt="" width={28} height={28} className="size-7 rounded-[4px]" unoptimized />
          <span className="text-[15px] font-medium tracking-[-0.02em] text-white">JobNinjas</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-[4px] px-3 py-1.5 text-[13px] text-[#b1b3b8] transition-colors hover:bg-white/[0.04] hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            href="/login"
            className="rounded-[4px] px-3 py-1.5 text-[13px] text-[#b1b3b8] transition-colors hover:text-white"
          >
            Sign in
          </Link>
          <TrialLink className="rounded-[4px] bg-[#5e6ad2] px-3.5 py-1.5 text-[13px] font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] transition-colors hover:bg-[#6d78d8]" />
        </div>

        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-[4px] border border-white/[0.08] text-white md:hidden"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/[0.08] bg-[#08090a] px-5 py-4 md:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={close}
                className="rounded-[4px] px-3 py-3 text-[15px] text-[#b1b3b8] hover:bg-white/[0.04] hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/login"
              onClick={close}
              className="rounded-[4px] px-3 py-3 text-[15px] text-[#b1b3b8] hover:bg-white/[0.04] hover:text-white"
            >
              Sign in
            </Link>
            <TrialLink
              onClick={close}
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
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/logo.png" alt="" width={24} height={24} className="size-6 rounded-[4px]" unoptimized />
            <span className="text-[15px] font-medium tracking-[-0.02em] text-white">JobNinjas</span>
          </Link>
          <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-[#707277]">
            The operating system for one open role. Agents screen, plan, and write the decision. Your team still hires.
          </p>
        </div>
        {FOOTER.map((col) => (
          <div key={col.title}>
            <p className="text-[12px] font-medium uppercase tracking-[0.14em] text-[#707277]">{col.title}</p>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[13px] text-[#b1b3b8] transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/[0.08]">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-5 text-[12px] text-[#707277] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} JobNinjas</p>
          <p>One board. One role. Agents that run the hire.</p>
        </div>
      </div>
    </footer>
  );
}

export function MarketingShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#08090a] font-sans text-white antialiased selection:bg-[#5e6ad2]/40">
      <MarketingNav />
      {children}
      <MarketingFooter />
    </div>
  );
}
