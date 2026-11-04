import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { pageSeo, TRIAL_HREF } from "@/lib/marketing/site";
import { LoginForm } from "./login-form";

export const metadata: Metadata = pageSeo(
  "Sign In to JobNinjas",
  "Sign in to your JobNinjas workspace or open the instant demo sandbox to test autonomous recruiting workflows.",
);

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#f8fafc] p-4 font-sans text-slate-900 antialiased selection:bg-sky-500/20">
      {/* Light blue subtle SVG dot grid background */}
      <svg className="pointer-events-none fixed inset-0 size-full -z-10 text-slate-300/40" aria-hidden="true">
        <defs>
          <pattern id="light-login-dots" x="50%" y="0" width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="translate(-11 0)">
            <circle cx="11" cy="11" r="1.2" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#light-login-dots)" />
      </svg>

      {/* Ambient soft glow */}
      <div className="pointer-events-none fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-sky-200/40 via-blue-100/30 to-transparent blur-3xl -z-10" />

      <div className="relative z-10 w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 sm:p-10 shadow-xl shadow-sky-100/60">
        <div className="flex flex-col items-center text-center">
          <Link href="/" className="mb-4 inline-flex items-center gap-2 group">
            <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white font-mono text-sm font-bold shadow-xs group-hover:scale-105 transition-transform">
              JN
            </div>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-sans">
            Welcome to JobNinjas
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-500 leading-relaxed">
            The spatial intelligence canvas for high-conviction hiring.
          </p>
        </div>

        {/* Demo Fast Track Button */}
        <div className="mt-8">
          <Link
            href={TRIAL_HREF}
            className="group flex h-12 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 px-4 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg active:scale-95"
          >
            <span>Open Demo Role Board</span>
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <p className="mt-2 text-center text-[11px] text-slate-400">
            Instant sandbox access with pre-loaded candidates & 15 agents
          </p>
        </div>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-3 text-[11px] font-semibold text-slate-400 font-mono tracking-wider">
              Or Team Member Login
            </span>
          </div>
        </div>

        <LoginForm />

        <div className="mt-8 border-t border-slate-100 pt-6 flex items-center justify-between text-xs text-slate-400">
          <Link href="/privacy" className="hover:text-blue-600 transition-colors">Privacy</Link>
          <span>·</span>
          <Link href="/terms" className="hover:text-blue-600 transition-colors">Terms</Link>
          <span>·</span>
          <Link href="mailto:support@jobninjas.ai" className="hover:text-blue-600 transition-colors">Support</Link>
        </div>
      </div>
    </div>
  );
}
