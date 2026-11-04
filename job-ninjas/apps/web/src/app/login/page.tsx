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
    <div className="relative flex min-h-screen items-center justify-center bg-[#fbfbfa] p-4 font-sans text-neutral-900 antialiased selection:bg-[#ea4b71]/20">
      {/* n8n clean SVG dot grid background */}
      <svg className="pointer-events-none fixed inset-0 size-full -z-10 text-neutral-300/50" aria-hidden="true">
        <defs>
          <pattern id="n8n-login-dots" x="50%" y="0" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="translate(-10 0)">
            <circle cx="10" cy="10" r="1.2" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#n8n-login-dots)" />
      </svg>

      <div className="relative z-10 w-full max-w-md rounded-3xl border border-neutral-200/90 bg-white p-8 sm:p-10 shadow-xl shadow-neutral-200/60">
        <div className="flex flex-col items-center text-center">
          <Link href="/" className="mb-4 inline-flex items-center gap-2 group">
            <div className="flex size-10 items-center justify-center rounded-xl bg-neutral-900 text-white font-mono text-sm font-bold shadow-xs group-hover:scale-105 transition-transform">
              <span className="text-[#ea4b71]">J</span>N
            </div>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-950 font-sans">
            Welcome to JobNinjas
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-neutral-500 leading-relaxed">
            Autonomous AI workflows for high-conviction hiring teams.
          </p>
        </div>

        {/* Demo Fast Track Button */}
        <div className="mt-8">
          <Link
            href={TRIAL_HREF}
            className="group flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#ea4b71] hover:bg-[#df3860] px-4 text-sm font-semibold text-white shadow-xs transition-all hover:shadow-md active:scale-95"
          >
            <span>Open Demo Role Board</span>
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <p className="mt-2 text-center text-[11px] text-neutral-400">
            Instant sandbox access with pre-loaded candidates & 15 agents
          </p>
        </div>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-3 text-[11px] font-semibold text-neutral-400 font-mono tracking-wider">
              Or Team Member Login
            </span>
          </div>
        </div>

        <LoginForm />

        <div className="mt-8 border-t border-neutral-100 pt-6 flex items-center justify-between text-xs text-neutral-400">
          <Link href="/privacy" className="hover:text-neutral-700 transition-colors">Privacy</Link>
          <span>·</span>
          <Link href="/terms" className="hover:text-neutral-700 transition-colors">Terms</Link>
          <span>·</span>
          <Link href="mailto:support@jobninjas.ai" className="hover:text-neutral-700 transition-colors">Support</Link>
        </div>
      </div>
    </div>
  );
}
