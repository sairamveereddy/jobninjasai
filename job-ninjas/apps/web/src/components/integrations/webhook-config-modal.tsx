"use client";

import { useState, useEffect } from "react";
import { X, Check, Loader2, Webhook, AlertCircle, CheckCircle2, Copy } from "lucide-react";

interface WebhookConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function WebhookConfigModal({ isOpen, onClose, onSuccess }: WebhookConfigModalProps) {
  const [inboundSecret, setInboundSecret] = useState("whsec_live_9a8b7c6d5e");
  const [outboundUrl, setOutboundUrl] = useState("https://hooks.zapier.com/hooks/catch/...");
  const [copied, setCopied] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [status, setStatus] = useState<"ACTIVE" | "READY">("ACTIVE");

  const endpointUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/api/integrations/webhooks/incoming`
    : "https://jobninjas.ai/api/integrations/webhooks/incoming";

  useEffect(() => {
    if (!isOpen) return;
    setError(null);
    setSuccess(null);
    fetch("/api/integrations/webhooks/config")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          if (data.settings.inboundSecret) setInboundSecret(data.settings.inboundSecret);
          if (data.settings.outboundUrl) setOutboundUrl(data.settings.outboundUrl);
          if (data.status) setStatus(data.status);
        }
      })
      .catch(() => {});
  }, [isOpen]);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleSave = async () => {
    setError(null);
    setSuccess(null);
    setIsSaving(true);

    try {
      const res = await fetch("/api/integrations/webhooks/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inboundSecret, outboundUrl, status }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess("Webhooks configured! Inbound applications & outbound event broadcasting active.");
        onSuccess?.();
      } else {
        setError(data.error || "Could not configure webhooks.");
      }
    } catch {
      setError("Network error saving webhook settings.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 w-full max-w-lg overflow-hidden font-sans">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-indigo-50/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20">
              <Webhook className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                Generic Webhooks
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                  Inbound & Outbound
                </span>
              </h3>
              <p className="text-xs text-slate-500">Connect Zapier, Make, or custom application forms</p>
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

          {/* Inbound Webhook URL */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
              <span>Inbound Application Ingest URL</span>
              <button
                type="button"
                onClick={() => copyToClipboard(endpointUrl, "url")}
                className="text-[11px] font-semibold text-indigo-700 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3 h-3" />
                {copied === "url" ? "Copied!" : "Copy URL"}
              </button>
            </label>
            <input
              type="text"
              readOnly
              value={endpointUrl}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-100 text-slate-600 font-mono select-all cursor-pointer"
            />
            <p className="text-[11px] text-slate-400">
              POST candidate applications here with JSON: <code>firstName, lastName, email, resumeText</code>.
            </p>
          </div>

          {/* Outbound Webhook Destination */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Outbound Event Dispatch URL (Zapier / Make)
            </label>
            <input
              type="url"
              value={outboundUrl}
              onChange={(e) => setOutboundUrl(e.target.value)}
              placeholder="https://hooks.zapier.com/hooks/catch/..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-indigo-500 focus:bg-white font-mono"
            />
            <p className="text-[11px] text-slate-400">
              Broadcasts pipeline events (<code>candidate.scored, interview.completed, decision.ready</code>).
            </p>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50">
            <div>
              <span className="block text-xs font-bold text-slate-800">Webhook Engine State</span>
              <span className="block text-[11px] text-slate-500">Allow incoming payloads and event emission</span>
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
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-xs transition-colors disabled:opacity-60 flex items-center gap-2 cursor-pointer"
          >
            {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
            Save & Connect
          </button>
        </div>
      </div>
    </div>
  );
}
