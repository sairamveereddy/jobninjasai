"use client";

import { useState, useEffect } from "react";
import { X, Check, Loader2, Briefcase, AlertCircle, CheckCircle2, Shield } from "lucide-react";

interface WorkdayConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function WorkdayConfigModal({ isOpen, onClose, onSuccess }: WorkdayConfigModalProps) {
  const [tenantUrl, setTenantUrl] = useState("https://wd5-impl-services1.workday.com/demo");
  const [clientId, setClientId] = useState("jobninjas_raas_client");
  const [clientSecret, setClientSecret] = useState("••••••••••••••••");
  const [isSaving, setIsSaving] = useState(false);
  const [tenantName, setTenantName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [status, setStatus] = useState<"ACTIVE" | "READY">("ACTIVE");

  useEffect(() => {
    if (!isOpen) return;
    setError(null);
    setSuccess(null);
    fetch("/api/integrations/workday/config")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          if (data.settings.tenantUrl) setTenantUrl(data.settings.tenantUrl);
          if (data.settings.clientId) setClientId(data.settings.clientId);
          if (data.settings.tenantName) setTenantName(data.settings.tenantName);
          if (data.status) setStatus(data.status);
        }
      })
      .catch(() => {});
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConnect = async (useDemo = false) => {
    setError(null);
    setSuccess(null);
    setIsSaving(true);

    try {
      const payload = useDemo
        ? { tenantUrl: "demo", clientId: "demo_client", clientSecret: "demo_secret", isDemo: true, status: "ACTIVE" }
        : { tenantUrl, clientId, clientSecret, status };

      const res = await fetch("/api/integrations/workday/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setTenantName(data.tenantName);
        setSuccess(`Connected to ${data.tenantName}! Ready to sync enterprise requisitions.`);
        onSuccess?.();
      } else {
        setError(data.error || "Could not authenticate with Workday.");
      }
    } catch {
      setError("Network error connecting to Workday.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 w-full max-w-lg overflow-hidden font-sans">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-blue-50/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                Workday ATS
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                  RaaS & REST
                </span>
              </h3>
              <p className="text-xs text-slate-500">Connect enterprise requisitions & applicants</p>
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
              <span>Workday Tenant Service URL</span>
              <button
                type="button"
                onClick={() => handleConnect(true)}
                className="text-[11px] font-semibold text-blue-700 hover:underline cursor-pointer"
              >
                Use Demo Sandbox
              </button>
            </label>
            <input
              type="text"
              value={tenantUrl}
              onChange={(e) => setTenantUrl(e.target.value)}
              placeholder="https://wd5-services1.myworkday.com/ccx/service/..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-blue-500 focus:bg-white font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                API Client ID
              </label>
              <input
                type="text"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                placeholder="client_id"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-blue-500 focus:bg-white font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Client Secret
              </label>
              <input
                type="password"
                value={clientSecret}
                onChange={(e) => setClientSecret(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-blue-500 focus:bg-white font-mono"
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50">
            <div>
              <span className="block text-xs font-bold text-slate-800">Connection State</span>
              <span className="block text-[11px] text-slate-500">Allow candidate pipeline synchronization</span>
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

          {tenantName && (
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Verified Workday Tenant: <strong>{tenantName}</strong></span>
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
            onClick={() => handleConnect(false)}
            disabled={isSaving}
            className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-xs transition-colors disabled:opacity-60 flex items-center gap-2 cursor-pointer"
          >
            {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
            Save & Connect
          </button>
        </div>
      </div>
    </div>
  );
}
