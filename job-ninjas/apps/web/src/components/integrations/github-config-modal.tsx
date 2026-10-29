"use client";

import { useState, useEffect } from "react";
import { X, Check, Loader2, Code, AlertCircle, CheckCircle2, ShieldCheck, Search } from "lucide-react";

interface GitHubConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function GitHubConfigModal({ isOpen, onClose, onSuccess }: GitHubConfigModalProps) {
  const [token, setToken] = useState("ghp_••••••••••••••••••••");
  const [testUser, setTestUser] = useState("octocat");
  const [testResult, setTestResult] = useState<any>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [status, setStatus] = useState<"ACTIVE" | "READY">("ACTIVE");

  useEffect(() => {
    if (!isOpen) return;
    setError(null);
    setSuccess(null);
    setTestResult(null);
    fetch("/api/integrations/github/config")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.status) setStatus(data.status);
      })
      .catch(() => {});
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestVerification = async () => {
    if (!testUser) return;
    setIsVerifying(true);
    setError(null);

    try {
      const res = await fetch("/api/integrations/github/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify", username: testUser }),
      });
      const data = await res.json();
      if (data.success && data.profile) {
        setTestResult(data.profile);
      } else {
        setError(data.error || "Could not verify GitHub profile.");
      }
    } catch {
      setError("Network error contacting GitHub API.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSave = async (useDemo = false) => {
    setError(null);
    setSuccess(null);
    setIsSaving(true);

    try {
      const payload = useDemo
        ? { token: "demo", status: "ACTIVE" }
        : { token, status };

      const res = await fetch("/api/integrations/github/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess("GitHub candidate verification is active! Profiles on resumes will be automatically cross-checked.");
        onSuccess?.();
      } else {
        setError(data.error || "Could not save GitHub configuration.");
      }
    } catch {
      setError("Network error saving GitHub configuration.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 w-full max-w-lg overflow-hidden font-sans">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-100/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-md shadow-slate-900/20">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                GitHub Verification
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-200 text-slate-800">
                  Code Signals
                </span>
              </h3>
              <p className="text-xs text-slate-500">Verify engineering repositories & authenticity</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-xs text-rose-700 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-xs text-emerald-800 font-semibold">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{success}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
              <span>GitHub Personal Access Token (Optional)</span>
              <button
                type="button"
                onClick={() => handleSave(true)}
                className="text-[11px] font-semibold text-slate-700 hover:underline cursor-pointer"
              >
                Use Public Rate-Limits
              </button>
            </label>
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="ghp_••••••••••••••••••••"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-slate-500 focus:bg-white font-mono"
            />
            <p className="text-[11px] text-slate-400">
              Optional token to raise GitHub API rate limits from 60 to 5,000 requests per hour.
            </p>
          </div>

          {/* Test verification runner */}
          <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2.5">
            <span className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Test Profile Lookup
            </span>
            <div className="flex gap-2">
              <input
                type="text"
                value={testUser}
                onChange={(e) => setTestUser(e.target.value)}
                placeholder="GitHub username (e.g. torvalds)"
                className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white outline-none focus:border-slate-500 font-mono"
              />
              <button
                type="button"
                onClick={handleTestVerification}
                disabled={isVerifying}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
              >
                {isVerifying ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                Verify
              </button>
            </div>

            {testResult && (
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs space-y-1">
                <div className="flex items-center justify-between font-bold text-slate-800">
                  <span>@{testResult.username} ({testResult.name})</span>
                  <span className="text-emerald-600 flex items-center gap-1 font-semibold text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5" /> Authenticity {testResult.recentActivityScore}%
                  </span>
                </div>
                <p className="text-slate-500 text-[11px]">Languages: {testResult.topLanguages.join(', ')} · {testResult.publicRepos} repos · {testResult.totalStars} stars</p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50">
            <div>
              <span className="block text-xs font-bold text-slate-800">Verification Engine</span>
              <span className="block text-[11px] text-slate-500">Auto-enrich candidate scorecards with GitHub repos</span>
            </div>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-200 bg-white outline-none cursor-pointer"
            >
              <option value="ACTIVE">Active</option>
              <option value="READY">Ready (Paused)</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => handleSave(false)}
            disabled={isSaving}
            className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-colors disabled:opacity-60 flex items-center gap-2 cursor-pointer"
          >
            {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
            Save & Connect
          </button>
        </div>
      </div>
    </div>
  );
}
