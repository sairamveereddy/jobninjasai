"use client";

import { useState, useEffect } from "react";
import { X, Check, Loader2, Database, AlertCircle, CheckCircle2, Key } from "lucide-react";

interface GreenhouseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function GreenhouseConfigModal({ isOpen, onClose, onSuccess }: GreenhouseConfigModalProps) {
  const [apiKey, setApiKey] = useState("demo");
  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [accountName, setAccountName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [status, setStatus] = useState<"ACTIVE" | "READY">("ACTIVE");

  useEffect(() => {
    if (!isOpen) return;
    setError(null);
    setSuccess(null);
    fetch("/api/integrations/greenhouse/config")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          if (data.settings?.accountName) setAccountName(data.settings.accountName);
          if (data.status) setStatus(data.status);
        }
      })
      .catch(() => {});
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestAndSave = async () => {
    setError(null);
    setSuccess(null);
    setIsSaving(true);

    try {
      const res = await fetch("/api/integrations/greenhouse/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey, status }),
      });
      const data = await res.json();
      if (data.success) {
        setAccountName(data.accountName);
        setSuccess(`Connected to ${data.accountName}! Ready to import jobs and candidates.`);
        onSuccess?.();
      } else {
        setError(data.error || "Could not connect to Greenhouse.");
      }
    } catch {
      setError("Network error connecting to Greenhouse.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 w-full max-w-lg overflow-hidden font-sans">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-emerald-50/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                Greenhouse ATS
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                  Harvest v3
                </span>
              </h3>
              <p className="text-xs text-slate-500">Configure your ATS connection</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
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
              <span>Harvest API Key</span>
              <button
                type="button"
                onClick={() => setApiKey("demo")}
                className="text-[11px] font-semibold text-emerald-700 hover:underline cursor-pointer"
              >
                Use Demo Sandbox
              </button>
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Paste your Greenhouse Harvest key..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-emerald-500 focus:bg-white font-mono"
              />
            </div>
            <p className="text-[11px] text-slate-400">
              Generated in Greenhouse under Dev Center → API Credential Management.
            </p>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50">
            <div>
              <span className="block text-xs font-bold text-slate-800">Connection Status</span>
              <span className="block text-[11px] text-slate-500">Active connectors sync with role boards</span>
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

          {accountName && (
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
              <span className="font-semibold text-slate-800">Verified Account:</span> {accountName}
            </div>
          )}
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
            onClick={handleTestAndSave}
            disabled={isSaving}
            className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-xs transition-colors disabled:opacity-60 flex items-center gap-2 cursor-pointer"
          >
            {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
            Save & Connect
          </button>
        </div>
      </div>
    </div>
  );
}
