"use client";

import { useState, useEffect } from "react";
import { X, Check, Loader2, Calendar, AlertCircle, CheckCircle2, Video } from "lucide-react";

interface GCalConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function GCalConfigModal({ isOpen, onClose, onSuccess }: GCalConfigModalProps) {
  const [calendarId, setCalendarId] = useState("primary");
  const [interviewerEmail, setInterviewerEmail] = useState("hiring-manager@company.com");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [status, setStatus] = useState<"ACTIVE" | "READY">("ACTIVE");

  useEffect(() => {
    if (!isOpen) return;
    setError(null);
    setSuccess(null);
    fetch("/api/integrations/gcal/config")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          if (data.settings.calendarId) setCalendarId(data.settings.calendarId);
          if (data.settings.interviewerEmail) setInterviewerEmail(data.settings.interviewerEmail);
          if (data.status) setStatus(data.status);
        }
      })
      .catch(() => {});
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = async (useDemo = false) => {
    setError(null);
    setSuccess(null);
    setIsSaving(true);

    try {
      const payload = useDemo
        ? { calendarId: "primary", interviewerEmail: "interviews@jobninjas.ai", status: "ACTIVE" }
        : { calendarId, interviewerEmail, status };

      const res = await fetch("/api/integrations/gcal/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(`Connected Google Calendar (${calendarId})! Real-time interview slots and Google Meet links active.`);
        onSuccess?.();
      } else {
        setError(data.error || "Could not configure Google Calendar.");
      }
    } catch {
      setError("Network error saving Google Calendar settings.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 w-full max-w-lg overflow-hidden font-sans">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-amber-50/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                Google Calendar
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  Google Meet
                </span>
              </h3>
              <p className="text-xs text-slate-500">Live availability & video interview scheduling</p>
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
              <span>Calendar ID / Account</span>
              <button
                type="button"
                onClick={() => handleSave(true)}
                className="text-[11px] font-semibold text-amber-700 hover:underline cursor-pointer"
              >
                Use Primary Calendar
              </button>
            </label>
            <input
              type="text"
              value={calendarId}
              onChange={(e) => setCalendarId(e.target.value)}
              placeholder="primary or calendar-id@group.calendar.google.com"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-amber-500 focus:bg-white font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Default Interviewer Host Email
            </label>
            <input
              type="email"
              value={interviewerEmail}
              onChange={(e) => setInterviewerEmail(e.target.value)}
              placeholder="lead-interviewer@yourcompany.com"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-amber-500 focus:bg-white"
            />
          </div>

          <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center gap-2.5 text-xs text-slate-600">
            <Video className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>Automatically adds <strong>Google Meet</strong> video room links to all booked candidate interviews.</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50">
            <div>
              <span className="block text-xs font-bold text-slate-800">Booking Engine</span>
              <span className="block text-[11px] text-slate-500">Allow instant calendar booking from Interview Schedule steps</span>
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
            className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 rounded-xl shadow-xs transition-colors disabled:opacity-60 flex items-center gap-2 cursor-pointer"
          >
            {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
            Save & Connect
          </button>
        </div>
      </div>
    </div>
  );
}
