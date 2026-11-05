"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowRight, 
  AlertCircle, 
  Loader2, 
  CheckCircle2, 
  Shield, 
  Copy, 
  Check, 
  KeyRound, 
  Sparkles,
  Lock,
  Mail
} from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("demo@jobninjas.ai");
  const [password, setPassword] = useState("demo1234");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [ssoMessage, setSsoMessage] = useState(false);

  const handleLogin = async (
    loginEmail: string, 
    loginRole = "Head of Talent & Hiring Operations", 
    loginOrg = "JobNinjas AI Demo", 
    loginPlan = "Enterprise Pro"
  ) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginEmail,
          password: password || "demo1234",
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

  const copyDemoCreds = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText("demo@jobninjas.ai / demo1234");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin(email);
  };

  return (
    <div className="space-y-5 font-sans">
      
      {/* Primary Dummy Demo Credentials Card */}
      <div className="rounded-2xl border-2 border-blue-500/30 bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50/40 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="flex size-2 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-blue-900">
              Interactive Demo Credentials
            </span>
          </div>
          <button
            type="button"
            onClick={copyDemoCreds}
            className="flex items-center gap-1 text-[11px] font-semibold text-blue-700 hover:text-blue-900 bg-white/80 hover:bg-white px-2 py-0.5 rounded-lg border border-blue-200 shadow-2xs transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="size-3 text-emerald-600" />
                <span className="text-emerald-700">Copied</span>
              </>
            ) : (
              <>
                <Copy className="size-3 text-blue-600" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs bg-white/90 rounded-xl p-2.5 border border-blue-100 shadow-2xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Demo Email</span>
            <span className="font-mono font-semibold text-slate-900 select-all">demo@jobninjas.ai</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Password</span>
            <span className="font-mono font-semibold text-slate-900 select-all">demo1234</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => handleLogin("demo@jobninjas.ai", "Head of Talent & Hiring Operations", "JobNinjas AI Demo", "Enterprise Pro")}
          className="mt-3 w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2.5 px-3 transition-all shadow-sm shadow-blue-500/20 cursor-pointer active:scale-[0.99]"
        >
          <Sparkles className="size-3.5 text-blue-200" />
          <span>1-Click Sign In with Demo Account</span>
          <ArrowRight className="size-3 text-blue-200 ml-0.5" />
        </button>
      </div>

      {/* Role Personas */}
      <div>
        <span className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">
          Or Switch Demo Role Persona:
        </span>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleLogin("recruiter@jobninjas.ai", "Lead Technical Recruiter", "Linear Technologies", "Team Pro")}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50/70 hover:border-blue-200 p-2 text-left transition-all cursor-pointer group shadow-2xs"
          >
            <div className="size-6.5 rounded-lg bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center shrink-0">
              SL
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-slate-900 group-hover:text-blue-700 truncate">
                Sarah (Recruiter)
              </p>
              <p className="text-[9px] text-slate-500 font-mono">
                Team Pro
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleLogin("hiringmanager@jobninjas.ai", "VP of Engineering", "Linear Technologies", "Enterprise Pro")}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-purple-50/70 hover:border-purple-200 p-2 text-left transition-all cursor-pointer group shadow-2xs"
          >
            <div className="size-6.5 rounded-lg bg-purple-600 text-white text-[11px] font-bold flex items-center justify-center shrink-0">
              RV
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-slate-900 group-hover:text-purple-700 truncate">
                Rad (VP Eng)
              </p>
              <p className="text-[9px] text-slate-500 font-mono">
                Enterprise
              </p>
            </div>
          </button>
        </div>

        {/* Admin Shortcut */}
        <button
          type="button"
          onClick={() => handleLogin("admin@jobninjas.ai", "Platform Administrator", "JobNinjas Global", "Enterprise Pro")}
          className="mt-2 w-full flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 p-2 px-3 text-white transition-all cursor-pointer shadow-xs text-xs"
        >
          <div className="flex items-center gap-2">
            <Shield className="size-3 text-sky-400" />
            <span className="font-semibold text-sky-200 text-xs">Admin Console Sign In</span>
            <span className="font-mono text-[9px] text-slate-400">(admin.jobninjas.ai)</span>
          </div>
          <ArrowRight className="size-3 text-slate-400" />
        </button>
      </div>

      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
        <span className="relative bg-white px-3 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
          Or Enter Credentials Manually
        </span>
      </div>

      {/* Main Form */}
      <form className="space-y-3" onSubmit={onSubmit}>
        <div>
          <label htmlFor="email-address" className="block text-xs font-semibold text-slate-700 mb-1">
            Work Email
          </label>
          <div className="relative">
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all shadow-2xs font-mono"
            />
          </div>
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
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all shadow-2xs font-mono"
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
          className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-xs font-semibold text-white transition-all shadow-sm cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>Authenticating Session...</span>
            </>
          ) : (
            <>
              <span>Sign In with Entered Credentials</span>
              <ArrowRight className="size-3.5" />
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => setSsoMessage(!ssoMessage)}
          className="flex h-9 w-full items-center justify-center rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-600 hover:bg-slate-50 transition-all cursor-pointer shadow-2xs"
        >
          Sign in with Enterprise SAML / Okta SSO
        </button>

        {ssoMessage && (
          <div className="flex items-start gap-2 p-3 rounded-xl bg-sky-50 border border-sky-200 text-sky-900 text-xs animate-in fade-in duration-150">
            <AlertCircle className="size-4 shrink-0 text-sky-600 mt-0.5" />
            <span>Enterprise single sign-on is active. You can sign in using demo credentials or choose a profile above to test.</span>
          </div>
        )}
      </form>

    </div>
  );
}
