"use client";

import { useState } from "react";

export function LoginForm() {
  const [ssoMessage, setSsoMessage] = useState(false);

  return (
    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
      <div>
        <label htmlFor="email-address" className="block text-xs font-medium text-slate-300 mb-1.5">
          Work Email
        </label>
        <input
          id="email-address"
          name="email"
          type="email"
          autoComplete="email"
          defaultValue="admin@jobninjas.org"
          placeholder="you@company.com"
          className="w-full rounded-xl border border-white/[0.1] bg-black/40 px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:border-[#ff6d5a] focus:ring-1 focus:ring-[#ff6d5a] outline-none transition-all"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-xs font-medium text-slate-300 mb-1.5">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••••••"
          className="w-full rounded-xl border border-white/[0.1] bg-black/40 px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:border-[#ff6d5a] focus:ring-1 focus:ring-[#ff6d5a] outline-none transition-all"
        />
      </div>
      <button
        type="button"
        onClick={() => setSsoMessage(true)}
        className="flex h-11 w-full items-center justify-center rounded-xl border border-white/[0.15] bg-white/[0.04] text-xs font-semibold text-slate-300 hover:bg-white/[0.08] hover:text-white transition-all cursor-pointer"
      >
        Sign in with Enterprise SSO
      </button>
      {ssoMessage && (
        <p className="text-[11px] text-amber-400 bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-xl text-center">
          Direct SSO sign-in is rolling out to enterprise teams. Use the demo sandbox button above for instant access.
        </p>
      )}
    </form>
  );
}
