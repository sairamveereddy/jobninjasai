import type { Metadata } from "next";
import Link from "next/link";
import { pageSeo, TRIAL_HREF } from "@/lib/marketing/site";

export const metadata: Metadata = pageSeo(
  "Sign in",
  "Sign in to JobNinjas, the OS for one open role, or open the demo workspace and try a requisition.",
);

export default function LoginPage() {
  return (
    <div className="marketing-root flex min-h-screen items-center justify-center bg-[#08090a] p-4 font-sans text-white">
      <div className="w-full max-w-md rounded-[8px] border border-white/[0.08] bg-[#111214] p-8">
        <div className="flex flex-col items-center text-center">
          <Link href="/" className="mb-4 block">
            <img src="/logo.png" alt="JobNinjas" className="size-16 rounded-[4px] object-contain" />
          </Link>
          <h1 className="text-[28px] font-medium tracking-[-0.02em]">JobNinjas</h1>
          <p className="mt-2 text-[14px] leading-relaxed text-[#b1b3b8]">
            One board for one open role. Team sign-in is rolling out. The demo workspace is ready.
          </p>
        </div>

        <form className="mt-8 space-y-4" action="#" method="POST">
          <div>
            <label htmlFor="email-address" className="sr-only">Email address</label>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="Email address"
              className="w-full rounded-[4px] border border-white/[0.08] bg-black/20 px-3 py-2 text-[14px] text-white placeholder:text-[#94969c] focus:border-[#5e6ad2] focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="Password"
              className="w-full rounded-[4px] border border-white/[0.08] bg-black/20 px-3 py-2 text-[14px] text-white placeholder:text-[#94969c] focus:border-[#5e6ad2] focus:outline-none"
            />
          </div>
          <button
            type="button"
            disabled
            className="flex h-10 w-full cursor-not-allowed items-center justify-center rounded-[4px] bg-[#5e6ad2]/50 text-[14px] font-medium text-white"
          >
            Sign in (coming soon)
          </button>
        </form>

        <div className="mt-6 border-t border-white/[0.08] pt-6">
          <Link
            href={TRIAL_HREF}
            className="flex h-10 w-full items-center justify-center rounded-[4px] border border-white/[0.15] text-[14px] font-medium text-white hover:bg-white/[0.04]"
          >
            Open the demo workspace
          </Link>
          <div className="mt-5 text-center text-[12px] text-[#94969c]">
            <Link href="/terms" className="underline underline-offset-2 hover:text-white">Terms</Link>
            <span className="mx-2">·</span>
            <Link href="/privacy" className="underline underline-offset-2 hover:text-white">Privacy</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
