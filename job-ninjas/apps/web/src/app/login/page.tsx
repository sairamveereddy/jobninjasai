import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { pageSeo, TRIAL_HREF } from "@/lib/marketing/site";
import { ArrowRight } from "lucide-react";
import { LoginForm } from "./login-form";

export const metadata: Metadata = pageSeo(
  "Sign In to JobNinjas",
  "Sign in to your JobNinjas workspace or open the instant demo sandbox to test autonomous recruiting workflows.",
);

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#090a0f] p-4 font-sans text-slate-100 antialiased selection:bg-[#ff6d5a]/30">
      {/* Background dot grid */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-40" 
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.08) 1px, transparent 0)`,
          backgroundSize: '28px 28px'
        }}
      />
      {/* Glow aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-gradient-to-tr from-[#ff6d5a]/20 via-[#7d52ff]/15 to-transparent blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/[0.12] bg-[#0e1017]/95 p-8 sm:p-10 shadow-2xl shadow-black/80 backdrop-blur-xl">
        <div className="flex flex-col items-center text-center">
          <Link href="/" className="mb-4 inline-flex items-center gap-2 group">
            <div className="size-12 rounded-2xl bg-gradient-to-tr from-[#ff6d5a] to-[#7d52ff] p-0.5 shadow-lg shadow-[#ff6d5a]/20 transition-transform group-hover:scale-105">
              <div className="size-full bg-[#090a0f] rounded-[14px] flex items-center justify-center">
                <Image src="/logo.png" alt="JobNinjas" width={32} height={32} className="size-8 object-contain" unoptimized />
              </div>
            </div>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-white">Welcome to JobNinjas</h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
            Autonomous AI workflows for high-conviction hiring teams.
          </p>
        </div>

        {/* Demo Fast Track Button */}
        <div className="mt-8">
          <Link
            href={TRIAL_HREF}
            className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#ff6d5a] via-[#ff5844] to-[#f03d27] px-4 text-sm font-bold text-white shadow-lg shadow-[#ff6d5a]/25 transition-all hover:brightness-110 active:scale-95"
          >
            <span>Open Demo Role Board</span>
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <p className="mt-2 text-center text-[11px] text-slate-500">
            Instant sandbox access with pre-loaded candidates & agents
          </p>
        </div>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/[0.08]" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#0e1017] px-3 text-[11px] font-semibold text-slate-500 tracking-wider">
              Or Team Member Login
            </span>
          </div>
        </div>

        <LoginForm />

        <div className="mt-8 border-t border-white/[0.08] pt-6 flex items-center justify-between text-[11.5px] text-slate-500">
          <Link href="/privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
          <span>·</span>
          <Link href="/terms" className="hover:text-slate-300 transition-colors">Terms of Service</Link>
          <span>·</span>
          <Link href="mailto:veereddy@jobninjas.org" className="hover:text-slate-300 transition-colors">Support</Link>
        </div>
      </div>
    </div>
  );
}
