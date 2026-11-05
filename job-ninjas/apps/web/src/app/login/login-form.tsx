"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, AlertCircle, Loader2, CheckCircle2, Shield, User, Briefcase } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("recruiter@jobninjas.ai");
  const [password, setPassword] = useState("••••••••••••");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ssoMessage, setSsoMessage] = useState(false);

  const handleLogin = async (
    loginEmail: string, 
    loginRole = "Lead Technical Recruiter", 
    loginOrg = "Acme AI Hiring", 
    loginPlan = "Team Pro"
  ) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginEmail,
          password: password || "demo-password",
          role: loginRole,
          org: loginOrg,
          plan: loginPlan,
        }),
      });

      const data = await res.json();
      if (data.success && data.redirectUrl) {
        router.push(data.redirectUrl);
      } else {
        setError(data.error || "Failed to sign in");
      }
    } catch {
      setError("Network error connecting to auth service.");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin(email);
  };

  return (
    <div className="space-y-5 font-sans">
      
      {/* Quick 1-Click Demo Profiles */}
      <div>
        <span className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">
          1-Click Demo Access Profiles:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleLogin("sarah.lin@company.com", "Lead Technical Recruiter", "Linear Technologies", "Team Pro")}
            className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50/70 hover:border-blue-200 p-2.5 text-left transition-all cursor-pointer group shadow-2xs"
          >
            <div className="size-7 rounded-lg bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
              SL
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 group-hover:text-blue-700 truncate">
                Sarah (Recruiter)
              </p>
              <p className="text-[10px] text-slate-500 font-mono">
                Team Pro Plan
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleLogin("rad.vance@linear.app", "VP of Engineering", "Linear Technologies", "Enterprise")}
            className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-purple-50/70 hover:border-purple-200 p-2.5 text-left transition-all cursor-pointer group shadow-2xs"
          >
            <div className="size-7 rounded-lg bg-purple-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
              RV
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 group-hover:text-purple-700 truncate">
                Rad (VP Engineering)
              </p>
              <p className="text-[10px] text-slate-500 font-mono">
                Enterprise Plan
              </p>
            </div>
          </button>
        </div>

        {/* Admin Shortcut Button */}
        <button
          type="button"
          onClick={() => handleLogin("admin@jobninjas.ai", "Platform Administrator", "JobNinjas Global", "Enterprise")}
          className="mt-2 w-full flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 p-2.5 px-3 text-white transition-all cursor-pointer shadow-xs text-xs"
        >
          <div className="flex items-center gap-2">
            <Shield className="size-3.5 text-sky-400" />
            <span className="font-semibold text-sky-200">Admin Console Sign In</span>
            <span className="font-mono text-[10px] text-slate-400">(admin.jobninjas.ai)</span>
          </div>
          <ArrowRight className="size-3 text-slate-400" />
        </button>
      </div>

      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
        <span className="relative bg-white px-3 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
          Or Enter Credentials
        </span>
      </div>

      {/* Main Email/Password Form */}
      <form className="space-y-3.5" onSubmit={onSubmit}>
        <div>
          <label htmlFor="email-address" className="block text-xs font-semibold text-slate-700 mb-1">
            Work Email
          </label>
          <input
            id="email-address"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all shadow-2xs"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-xs font-semibold text-slate-700 mb-1">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all shadow-2xs"
          />
        </div>

        {error && (
          <div className="flex items-center gap-1.5 p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
            <AlertCircle className="size-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-xs font-semibold text-white transition-all shadow-sm cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>Authenticating Session...</span>
            </>
          ) : (
            <>
              <span>Sign In to Workspace</span>
              <ArrowRight className="size-3.5" />
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => setSsoMessage(!ssoMessage)}
          className="flex h-10 w-full items-center justify-center rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 transition-all cursor-pointer shadow-2xs"
        >
          Sign in with Enterprise SAML / Okta SSO
        </button>

        {ssoMessage && (
          <div className="flex items-start gap-2 p-3 rounded-xl bg-sky-50 border border-sky-200 text-sky-900 text-xs animate-in fade-in duration-150">
            <AlertCircle className="size-4 shrink-0 text-sky-600 mt-0.5" />
            <span>Enterprise single sign-on is active for your domain. Choose your profile above or sign in with your work email to proceed.</span>
          </div>
        )}
      </form>

    </div>
  );
}
