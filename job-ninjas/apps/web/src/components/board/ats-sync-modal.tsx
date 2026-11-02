"use client";

import { useState, useEffect } from "react";
import { X, Check, Loader2, Sparkles, AlertCircle, Building2, Briefcase, Users, RefreshCw, CheckCircle2, ArrowRight, Webhook } from "lucide-react";

interface AtsSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  roleId: string;
  roleTitle?: string;
  onImportSuccess: (candidates: any[]) => void;
}

export function AtsSyncModal({
  isOpen,
  onClose,
  roleId,
  roleTitle,
  onImportSuccess,
}: AtsSyncModalProps) {
  const [activeTab, setActiveTab] = useState<"greenhouse" | "workday" | "webhook">("greenhouse");

  // Greenhouse state
  const [ghKey, setGhKey] = useState("demo");
  const [ghConnected, setGhConnected] = useState(false);
  const [ghVerifying, setGhVerifying] = useState(false);
  const [ghJobs, setGhJobs] = useState<any[]>([]);
  const [ghSelectedJobId, setGhSelectedJobId] = useState("");
  const [ghCandidates, setGhCandidates] = useState<any[]>([]);
  const [ghSelectedCandidateIds, setGhSelectedCandidateIds] = useState<string[]>([]);
  const [ghLoadingCandidates, setGhLoadingCandidates] = useState(false);

  // Workday state
  const [wdTenant, setWdTenant] = useState("acme_corp");
  const [wdDomain, setWdDomain] = useState("wd2-impl-services1.workday.com");
  const [wdClientId, setWdClientId] = useState("demo_client_id");
  const [wdConnected, setWdConnected] = useState(false);
  const [wdVerifying, setWdVerifying] = useState(false);
  const [wdCandidates, setWdCandidates] = useState<any[]>([]);
  const [wdSelectedCandidateIds, setWdSelectedCandidateIds] = useState<string[]>([]);
  const [wdLoadingCandidates, setWdLoadingCandidates] = useState(false);

  // General state
  const [isImporting, setIsImporting] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSimulate = async () => {
    setIsSimulating(true);
    setErrorMessage(null);
    try {
      const res = await fetch("/api/integrations/webhooks/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roleId }),
      });
      const data = await res.json();
      if (data.success && data.candidate) {
        setStatusMessage(data.message);
        onImportSuccess([data.candidate]);
      } else {
        setErrorMessage(data.error || "Simulation failed");
      }
    } catch {
      setErrorMessage("Could not simulate webhook application");
    } finally {
      setIsSimulating(false);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedGhKey = window.localStorage.getItem("gh_harvest_key");
      if (savedGhKey) setGhKey(savedGhKey);
      const savedWdTenant = window.localStorage.getItem("wd_tenant");
      if (savedWdTenant) setWdTenant(savedWdTenant);
    }
  }, []);

  if (!isOpen) return null;

  // Greenhouse handlers
  const handleTestGreenhouse = async () => {
    setGhVerifying(true);
    setErrorMessage(null);
    try {
      const res = await fetch("/api/integrations/greenhouse/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: ghKey }),
      });
      const data = await res.json();
      if (data.success) {
        setGhConnected(true);
        if (typeof window !== "undefined") window.localStorage.setItem("gh_harvest_key", ghKey);
        await loadGreenhouseJobs();
      } else {
        setGhConnected(false);
        setErrorMessage(data.error || "Greenhouse connection failed. Try 'demo' mode.");
      }
    } catch {
      setGhConnected(false);
      setErrorMessage("Could not connect to Greenhouse. Check your credentials.");
    } finally {
      setGhVerifying(false);
    }
  };

  const loadGreenhouseJobs = async () => {
    try {
      const res = await fetch("/api/integrations/greenhouse/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: ghKey }),
      });
      const data = await res.json();
      if (data.success && data.jobs?.length) {
        setGhJobs(data.jobs);
        const match = data.jobs.find((j: any) =>
          roleTitle && j.name.toLowerCase().includes(roleTitle.toLowerCase())
        );
        const activeId = match ? match.id : data.jobs[0].id;
        setGhSelectedJobId(activeId);
        loadGreenhouseCandidates(activeId);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadGreenhouseCandidates = async (jobId: string) => {
    setGhLoadingCandidates(true);
    try {
      const res = await fetch(`/api/integrations/greenhouse/candidates?jobId=${jobId}&apiKey=${ghKey}`);
      const data = await res.json();
      if (data.success && data.candidates) {
        setGhCandidates(data.candidates);
        setGhSelectedCandidateIds(data.candidates.map((c: any) => c.id));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setGhLoadingCandidates(false);
    }
  };

  // Workday handlers
  const handleTestWorkday = async () => {
    setWdVerifying(true);
    setErrorMessage(null);
    try {
      const res = await fetch("/api/integrations/workday/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenant: wdTenant, domain: wdDomain, clientId: wdClientId }),
      });
      const data = await res.json();
      if (data.success) {
        setWdConnected(true);
        if (typeof window !== "undefined") window.localStorage.setItem("wd_tenant", wdTenant);
        await loadWorkdayCandidates();
      } else {
        setWdConnected(false);
        setErrorMessage(data.error || "Workday connection failed. Try demo mode.");
      }
    } catch {
      setWdConnected(false);
      setErrorMessage("Could not reach Workday API.");
    } finally {
      setWdVerifying(false);
    }
  };

  const loadWorkdayCandidates = async () => {
    setWdLoadingCandidates(true);
    try {
      const res = await fetch("/api/integrations/workday/candidates");
      const data = await res.json();
      if (data.success && data.candidates) {
        setWdCandidates(data.candidates);
        setWdSelectedCandidateIds(data.candidates.map((c: any) => c.id));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setWdLoadingCandidates(false);
    }
  };

  // Import handler
  const handleImport = async () => {
    setIsImporting(true);
    setErrorMessage(null);
    try {
      let imported: any[] = [];
      if (activeTab === "greenhouse") {
        const toImport = ghCandidates.filter(c => ghSelectedCandidateIds.includes(c.id));
        for (const cand of toImport) {
          const res = await fetch("/api/candidates", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              roleId,
              firstName: cand.first_name || cand.name?.split(" ")[0] || "Candidate",
              lastName: cand.last_name || cand.name?.split(" ").slice(1).join(" ") || "Applicant",
              email: cand.email_addresses?.[0]?.value || cand.email || `${cand.id}@greenhouse.demo`,
            }),
          });
          const json = await res.json();
          if (json.candidate) imported.push(json.candidate);
        }
      } else if (activeTab === "workday") {
        const toImport = wdCandidates.filter(c => wdSelectedCandidateIds.includes(c.id));
        for (const cand of toImport) {
          const res = await fetch("/api/candidates", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              roleId,
              firstName: cand.name.split(" ")[0] || "Candidate",
              lastName: cand.name.split(" ").slice(1).join(" ") || "Workday",
              email: cand.email,
            }),
          });
          const json = await res.json();
          if (json.candidate) imported.push(json.candidate);
        }
      }

      setStatusMessage(`Successfully imported ${imported.length} candidates from ${activeTab === 'greenhouse' ? 'Greenhouse' : 'Workday'}!`);
      if (imported.length > 0) {
        onImportSuccess(imported);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to import candidates into role.");
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl transition-all">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <Building2 className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">Sync ATS Candidates</h2>
              <p className="text-xs text-slate-500">
                Connect and sync applicants for <span className="font-medium text-slate-700">{roleTitle || "this role"}</span>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Source Tabs */}
        <div className="flex border-b border-slate-100 px-6 pt-3 gap-6 text-xs font-semibold text-slate-500 bg-slate-50/20">
          <button
            type="button"
            onClick={() => setActiveTab("greenhouse")}
            className={`pb-2.5 transition-colors cursor-pointer ${
              activeTab === "greenhouse" ? "border-b-2 border-[#5e6ad2] text-[#5e6ad2]" : "hover:text-slate-800"
            }`}
          >
            Greenhouse Harvest
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("workday")}
            className={`pb-2.5 transition-colors cursor-pointer ${
              activeTab === "workday" ? "border-b-2 border-[#5e6ad2] text-[#5e6ad2]" : "hover:text-slate-800"
            }`}
          >
            Workday ATS
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("webhook")}
            className={`pb-2.5 transition-colors cursor-pointer ${
              activeTab === "webhook" ? "border-b-2 border-[#5e6ad2] text-[#5e6ad2]" : "hover:text-slate-800"
            }`}
          >
            Lever / Custom Webhook
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {errorMessage && (
            <div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {statusMessage && (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Tab 1: Greenhouse */}
          {activeTab === "greenhouse" && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Greenhouse Harvest API Key (or type 'demo')"
                  value={ghKey}
                  onChange={(e) => setGhKey(e.target.value)}
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:border-[#5e6ad2]"
                />
                <button
                  type="button"
                  onClick={handleTestGreenhouse}
                  disabled={ghVerifying}
                  className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {ghVerifying ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Connect & Fetch"}
                </button>
              </div>

              {ghConnected && ghJobs.length > 0 && (
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-600">Select Greenhouse Requisition</label>
                  <select
                    value={ghSelectedJobId}
                    onChange={(e) => {
                      setGhSelectedJobId(e.target.value);
                      loadGreenhouseCandidates(e.target.value);
                    }}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800"
                  >
                    {ghJobs.map((j) => (
                      <option key={j.id} value={j.id}>
                        {j.name} (Job #{j.id})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {ghCandidates.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span>Applicants ({ghCandidates.length})</span>
                    <button
                      type="button"
                      onClick={() =>
                        setGhSelectedCandidateIds(
                          ghSelectedCandidateIds.length === ghCandidates.length ? [] : ghCandidates.map((c) => c.id)
                        )
                      }
                      className="text-[#5e6ad2] hover:underline"
                    >
                      {ghSelectedCandidateIds.length === ghCandidates.length ? "Deselect all" : "Select all"}
                    </button>
                  </div>
                  <div className="max-h-48 overflow-y-auto space-y-1.5 border border-slate-100 rounded-xl p-2 bg-slate-50/50">
                    {ghCandidates.map((c) => (
                      <label key={c.id} className="flex items-center gap-2.5 p-2 rounded-lg bg-white border border-slate-100 text-xs hover:bg-slate-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={ghSelectedCandidateIds.includes(c.id)}
                          onChange={(e) => {
                            if (e.target.checked) setGhSelectedCandidateIds((prev) => [...prev, c.id]);
                            else setGhSelectedCandidateIds((prev) => prev.filter((id) => id !== c.id));
                          }}
                          className="rounded text-[#5e6ad2]"
                        />
                        <span className="font-semibold text-slate-800">{c.first_name} {c.last_name || c.name}</span>
                        <span className="text-slate-400 text-[11px] truncate">({c.email_addresses?.[0]?.value || c.email || 'applicant'})</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Workday */}
          {activeTab === "workday" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Tenant ID (e.g. acme_corp)"
                  value={wdTenant}
                  onChange={(e) => setWdTenant(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800"
                />
                <input
                  type="text"
                  placeholder="REST / RaaS Domain"
                  value={wdDomain}
                  onChange={(e) => setWdDomain(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800"
                />
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Client ID (or 'demo')"
                  value={wdClientId}
                  onChange={(e) => setWdClientId(e.target.value)}
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800"
                />
                <button
                  type="button"
                  onClick={handleTestWorkday}
                  disabled={wdVerifying}
                  className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {wdVerifying ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Connect & Sync"}
                </button>
              </div>

              {wdCandidates.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span>Workday Requisition Candidates ({wdCandidates.length})</span>
                    <button
                      type="button"
                      onClick={() =>
                        setWdSelectedCandidateIds(
                          wdSelectedCandidateIds.length === wdCandidates.length ? [] : wdCandidates.map((c) => c.id)
                        )
                      }
                      className="text-[#5e6ad2] hover:underline"
                    >
                      {wdSelectedCandidateIds.length === wdCandidates.length ? "Deselect all" : "Select all"}
                    </button>
                  </div>
                  <div className="max-h-48 overflow-y-auto space-y-1.5 border border-slate-100 rounded-xl p-2 bg-slate-50/50">
                    {wdCandidates.map((c) => (
                      <label key={c.id} className="flex items-center gap-2.5 p-2 rounded-lg bg-white border border-slate-100 text-xs hover:bg-slate-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={wdSelectedCandidateIds.includes(c.id)}
                          onChange={(e) => {
                            if (e.target.checked) setWdSelectedCandidateIds((prev) => [...prev, c.id]);
                            else setWdSelectedCandidateIds((prev) => prev.filter((id) => id !== c.id));
                          }}
                          className="rounded text-[#5e6ad2]"
                        />
                        <span className="font-semibold text-slate-800">{c.name}</span>
                        <span className="text-slate-400 text-[11px]">({c.email})</span>
                        <span className="ml-auto text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">{c.stage || 'Review'}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Webhook */}
          {activeTab === "webhook" && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                Connect external systems like <strong>Lever</strong>, <strong>Ashby</strong>, or proprietary application forms to this role via our real-time webhook endpoint:
              </p>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-[11px] text-slate-700 select-all">
                {typeof window !== "undefined" ? window.location.origin : "https://jobninjas.ai"}/api/integrations/webhooks/incoming
              </div>
              <p className="text-[11px] text-slate-400">
                Include <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-700">roleId: "{roleId}"</code> in the JSON payload to automatically direct applications straight into this board.
              </p>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="block text-xs font-semibold text-slate-800">Quick Test / Simulator</span>
                  <span className="block text-[11px] text-slate-400">Inject a realistic test applicant to test this pipeline immediately</span>
                </div>
                <button
                  type="button"
                  onClick={handleSimulate}
                  disabled={isSimulating}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-50 border border-indigo-200 text-[#5e6ad2] hover:bg-indigo-100 text-xs font-semibold cursor-pointer transition-colors disabled:opacity-50"
                >
                  {isSimulating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-amber-500" />}
                  Simulate Applicant
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4 bg-slate-50/50">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Close
          </button>
          {(activeTab === "greenhouse" ? ghCandidates.length > 0 : wdCandidates.length > 0) && (
            <button
              type="button"
              onClick={handleImport}
              disabled={isImporting}
              className="flex items-center gap-2 rounded-xl bg-[#5e6ad2] px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#4f59c0] transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isImporting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Importing Candidates...
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5" />
                  Import Selected Candidates ({activeTab === "greenhouse" ? ghSelectedCandidateIds.length : wdSelectedCandidateIds.length})
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
