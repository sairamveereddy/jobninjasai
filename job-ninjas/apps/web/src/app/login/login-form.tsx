"use client";

import { useState } from "react";
import { ArrowRight, AlertCircle } from "lucide-react";

export function LoginForm() {
  const [ssoMessage, setSsoMessage] = useState(false);

  return (
    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
      <div>
        <label htmlFor="email-address" className="block text-xs font-semibold text-neutral-800 mb-1.5 font-sans">
          Work Email
        </label>
        <input
          id="email-address"
          name="email"
          type="email"
          autoComplete="email"
          defaultValue="recruiter@jobninjas.ai"
          placeholder="you@company.com"
          className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all shadow-2xs"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-xs font-semibold text-neutral-800 mb-1.5 font-sans">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••••••"
          className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all shadow-2xs"
        />
      </div>
      <button
        type="button"
        onClick={() => setSsoMessage(true)}
        className="flex h-11 w-full items-center justify-center rounded-xl border border-neutral-300 bg-white text-xs font-semibold text-neutral-800 hover:bg-neutral-50 transition-all cursor-pointer shadow-2xs"
      >
        Sign in with Enterprise SSO / SAML
      </button>
      {ssoMessage && (
        <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
          <AlertCircle className="size-4 shrink-0 text-amber-600 mt-0.5" />
          <span>Direct SAML sign-in is rolling out to enterprise workspaces. Use the Instant Demo Workspace button above for immediate access.</span>
        </div>
      )}
    </form>
  );
}
