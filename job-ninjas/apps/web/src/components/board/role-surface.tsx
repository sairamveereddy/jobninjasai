"use client";

import { useEffect, useMemo, useState } from "react";
import { FileText, StickyNote, Users } from "lucide-react";
import { useBoardStore } from "@/store/board";
import { LayerType } from "@/types/canvas";
import { GreenhouseImportModal } from "./greenhouse-import-modal";
import { MUST_ASK_NOTE, documentKind, isMustAskNote, recommendationPresentation } from "@/lib/agents/contracts";
import { ArtifactSheet, type ArtifactKind } from "./artifact-sheet";
import { personResult, saveResultEdit } from "./result-edits";

function latestArtifact(candidate: any, type: string) {
  return (candidate.artifacts || []).find((item: any) => item.artifactType === type)?.data;
}

function viewableResults(candidate: any, layers: Record<string, any>, activeId: string | null) {
  const items: { key: string; kind: ArtifactKind; label: string; data: any }[] = [];
  const score = latestArtifact(candidate, "Scorecard") || latestArtifact(candidate, "ResumeAnalysis");
  if (score) {
    const label = score.overallMatch != null ? `Score ${score.overallMatch}` : "Scorecard";
    items.push({ key: "scorecard", kind: "scorecard", label, data: score });
  }
  const shortlist = personResult(layers, candidate.id, activeId, "agent-shortlist", latestArtifact(candidate, "Shortlist"), "shortlistByCandidate");
  if (shortlist?.rankLabel || typeof shortlist?.advance === "boolean") {
    items.push({
      key: "shortlist",
      kind: "shortlist",
      label: shortlist.rankLabel || (shortlist.advance ? "Advance" : "Pass"),
      data: shortlist,
    });
  }
  const outreach = personResult(layers, candidate.id, activeId, "agent-outreach", latestArtifact(candidate, "EmailDraft"), "outreachByCandidate");
  if (outreach?.subject || outreach?.body) {
    items.push({ key: "outreach", kind: "outreach", label: "Outreach", data: outreach });
  }
  const schedule = personResult(layers, candidate.id, activeId, "agent-schedule", latestArtifact(candidate, "InterviewSlots"), "scheduleByCandidate");
  if (Array.isArray(schedule?.slots) && schedule.slots.length) {
    const preferred = schedule.slots[schedule.preferredSlot];
    items.push({ key: "schedule", kind: "schedule", label: preferred?.label ? `Times · ${preferred.label}` : "Times", data: schedule });
  }
  const interview = latestArtifact(candidate, "InterviewAnalysis");
  if (interview) items.push({ key: "interview", kind: "interview", label: "Interview", data: interview });
  const decision = latestArtifact(candidate, "CandidateDecision");
  if (decision) {
    items.push({
      key: "recommendation",
      kind: "recommendation",
      label: recommendationPresentation(decision.recommendation).title,
      data: decision,
    });
  }
  return items;
}

export function RoleSurface({
  roleId,
  roleTitle,
  onEditSetup,
}: {
  roleId: string;
  roleTitle?: string;
  onEditSetup: () => void;
}) {
  const layerIds = useBoardStore((state) => state.layerIds);
  const layers = useBoardStore((state) => state.layers);
  const insertLayer = useBoardStore((state) => state.insertLayer);
  const updateLayer = useBoardStore((state) => state.updateLayer);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [open, setOpen] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [greenhouseOpen, setGreenhouseOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "" });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [sheet, setSheet] = useState<{ kind: ArtifactKind; data: any; candidateId: string; candidateName: string } | null>(null);

  const refresh = () => {
    if (!roleId) return;
    fetch(`/api/candidates?roleId=${roleId}`)
      .then((res) => res.json())
      .then((data) => setCandidates(Array.isArray(data) ? data : data?.candidates || []))
      .catch(() => setCandidates([]));
  };

  useEffect(() => {
    refresh();
  }, [roleId, layerIds.length]);

  useEffect(() => {
    setActiveId(window.localStorage.getItem("activeCandidateId"));
    const onChange = (event: Event) => {
      const nextId = (event as CustomEvent).detail?.candidate?.id || window.localStorage.getItem("activeCandidateId");
      setActiveId(nextId);
      refresh();
    };
    window.addEventListener("candidateChanged", onChange);
    return () => window.removeEventListener("candidateChanged", onChange);
  }, [roleId]);

  const documents = useMemo(
    () =>
      layerIds
        .map((id) => ({ id, layer: layers[id] }))
        .filter(({ layer }) => layer && (layer.type === LayerType.Slide || layer.type === LayerType.Image || layer.type === LayerType.Text)),
    [layerIds, layers]
  );
  const notes = layerIds.filter((id) => layers[id]?.type === LayerType.Note);

  const addMustAsk = () => {
    const existing = layerIds.find((id) => layers[id]?.type === LayerType.Note && isMustAskNote((layers[id] as { value?: string }).value));
    if (existing) return;
    const id = insertLayer(LayerType.Note, { x: 80, y: 700 }, { r: 94, g: 106, b: 210 });
    updateLayer(id, { width: 280, height: 240, value: MUST_ASK_NOTE, config: { pinned: true, scaffoldKey: "must-ask" } } as any);
  };

  const addNote = () => {
    const id = insertLayer(
      LayerType.Note,
      { x: 80, y: 80 + notes.length * 36 },
      { r: 94, g: 106, b: 210 }
    );
    updateLayer(id, { width: 240, height: 200, value: "" });
  };

  const addDocument = (file: File, kind?: string) => {
    const reader = new FileReader();
    reader.onload = () => {
      const id = insertLayer(LayerType.Slide, { x: 80, y: 420 }, { r: 255, g: 255, b: 255 });
      const docKind = kind || documentKind(file.name).toLowerCase();
      updateLayer(id, {
        width: 280,
        height: 180,
        fileSrc: String(reader.result || ""),
        fileName: file.name,
        value: file.name,
        docKind,
      } as any);
    };
    reader.readAsDataURL(file);
  };

  const selected = candidates.find((candidate) => candidate.id === activeId);

  const onDropResume = async (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setDragOver(false);
    const file = event.dataTransfer.files?.[0];
    if (!file) return;
    const kind = documentKind(file.name) === "JD" ? "jd" : "resume";
    addDocument(file, kind);
    if (kind === "jd") {
      setFormError("");
      return;
    }
    if (!activeId) {
      setFormError("Select a person, then drop the resume again. The file is already on this role.");
      return;
    }
    await uploadResume(activeId, file);
  };

  const selectCandidate = (candidate: any) => {
    window.localStorage.setItem("activeCandidateId", candidate.id);
    setActiveId(candidate.id);
    window.dispatchEvent(new CustomEvent("candidateChanged", { detail: { candidate } }));
  };

  const uploadResume = async (candidateId: string, file: File) => {
    const body = new FormData();
    body.append("candidateId", candidateId);
    body.append("file", file);
    const res = await fetch("/api/resumes/upload", { method: "POST", body });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.candidate) {
      setFormError(data.error || "Could not attach that resume. The file is still on this role.");
      return;
    }
    setFormError("");
    useBoardStore.getState().pushActivity(candidateId, `Resume attached · ${file.name}`);
    refresh();
    window.dispatchEvent(new CustomEvent("candidateChanged", { detail: { candidate: data.candidate } }));
  };

  const addCandidate = async () => {
    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim()) {
      setFormError("First name, last name, and email are required.");
      return;
    }
    setBusy(true);
    setFormError("");
    try {
      const res = await fetch("/api/candidates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roleId, firstName: form.firstName.trim(), lastName: form.lastName.trim(), email: form.email.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data.candidate) {
        setFormError(data.error || "Could not add this person.");
        return;
      }
      if (resumeFile) await uploadResume(data.candidate.id, resumeFile);
      selectCandidate(data.candidate);
      setAdding(false);
      setForm({ firstName: "", lastName: "", email: "" });
      setResumeFile(null);
      refresh();
    } catch {
      setFormError("Could not add this person.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className={`absolute bottom-6 left-6 z-40 w-[min(380px,calc(100vw-2rem))] overflow-hidden rounded-2xl border bg-white/95 backdrop-blur-md text-slate-800 shadow-2xl pointer-events-auto transition-all ${
        dragOver ? "border-[#5e6ad2] ring-2 ring-[#5e6ad2]/20" : "border-slate-200/90"
      }`}
      onDragOver={(event) => { event.preventDefault(); event.stopPropagation(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={onDropResume}
    >
      <button type="button" onClick={() => setOpen((value) => !value)} className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-slate-50/50 transition-colors">
        <span>
          <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">This role</span>
          <span className="block text-sm font-semibold text-slate-900">{roleTitle || "Open role"}</span>
        </span>
        <span className="text-xs font-medium text-slate-500 hover:text-slate-700">{open ? "Hide" : "Show"}</span>
      </button>
      {open && (
        <div className="max-h-[min(70vh,560px)] space-y-3.5 overflow-y-auto border-t border-slate-100 px-4 py-3.5">
          <div>
            <div className="mb-2 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <Users className="h-3.5 w-3.5 text-slate-400" /> Candidates ({candidates.length})
              </div>
              <div className="flex items-center gap-2">
                {selected && (
                  <label className="cursor-pointer text-[11px] font-semibold text-[#5e6ad2] hover:underline">
                    {selected.resumeText ? "Replace resume" : "Attach resume"}
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.txt"
                      className="hidden"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) {
                          uploadResume(selected.id, file);
                          addDocument(file, "resume");
                        }
                        event.target.value = "";
                      }}
                    />
                  </label>
                )}
                <button type="button" onClick={() => { setAdding((value) => !value); setFormError(""); }} className="text-[11px] font-semibold text-[#5e6ad2] hover:underline cursor-pointer">
                  {adding ? "Cancel" : "+ Add person"}
                </button>
              </div>
            </div>
            {dragOver && <p className="mb-2 text-[11px] font-medium text-[#5e6ad2]">Drop to attach this file to {selected ? `${selected.firstName}` : "the board"}.</p>}
            {adding && (
              <div className="mb-2.5 space-y-2 rounded-xl border border-slate-200 bg-slate-50/80 p-3">
                <input className={fieldClass} placeholder="First name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
                <input className={fieldClass} placeholder="Last name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
                <input className={fieldClass} placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                <label className="block text-[11px] font-medium text-slate-600">
                  Resume (optional)
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    className="mt-1 block w-full text-[11px] text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    onChange={(event) => setResumeFile(event.target.files?.[0] || null)}
                  />
                </label>
                <button type="button" disabled={busy} onClick={addCandidate} className="w-full rounded-lg bg-[#5e6ad2] px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#4f59b6] disabled:opacity-60 transition-colors cursor-pointer">
                  {busy ? "Adding…" : "Add to this role"}
                </button>
              </div>
            )}
            {formError && <p className="mb-2 text-xs text-rose-600 font-medium">{formError}</p>}
            {candidates.length > 0 && !candidates.some((candidate) => candidate.id === activeId) && (
              <p className="mb-2 text-[11px] text-amber-700 bg-amber-50 rounded-lg p-2 border border-amber-200">Select a person before you run the pipeline. The steps score whoever is selected.</p>
            )}
            {candidates.length === 0 ? (
              <p className="text-xs text-slate-500">No candidates yet. Add a person here, import from Greenhouse, or drop a resume on the board.</p>
            ) : (
              <div className="flex max-h-48 flex-col gap-1.5 overflow-y-auto">
                {candidates.map((candidate) => {
                  const results = viewableResults(candidate, layers, activeId);
                  const active = candidate.id === activeId;
                  return (
                    <div
                      key={candidate.id}
                      className={`rounded-xl p-2.5 text-xs transition-colors ${
                        active ? "bg-indigo-50/70 border border-indigo-200/80" : "bg-white border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50"
                      }`}
                    >
                      <button type="button" onClick={() => selectCandidate(candidate)} className="flex w-full items-center justify-between text-left cursor-pointer">
                        <span className="truncate font-medium text-slate-800">
                          {candidate.firstName} {candidate.lastName}
                          {active ? <span className="ml-1.5 text-[10px] font-bold uppercase tracking-wider text-indigo-600">Selected</span> : null}
                        </span>
                        <span className={`text-[11px] font-medium ${candidate.resumeText ? "text-emerald-600" : "text-amber-600"}`}>
                          {candidate.resumeText ? "Resume" : "No resume"}
                        </span>
                      </button>
                      {results.length > 0 ? (
                        <div className="mt-1.5 flex flex-wrap gap-1">
                          {results.map((item) => (
                            <button
                              key={item.key}
                              type="button"
                              aria-label={`View ${item.label} for ${candidate.firstName}`}
                              onClick={() => {
                                setSheet({
                                  kind: item.kind,
                                  data: item.data,
                                  candidateId: candidate.id,
                                  candidateName: `${candidate.firstName || ""} ${candidate.lastName || ""}`.trim(),
                                });
                              }}
                              className="rounded-lg bg-indigo-100/70 border border-indigo-200/50 px-2 py-0.5 text-[10px] font-semibold text-indigo-800 hover:bg-indigo-200/70 transition-colors cursor-pointer"
                            >
                              {item.label}
                            </button>
                          ))}
                        </div>
                      ) : active ? (
                        <p className="mt-1.5 text-[10px] leading-snug text-slate-500">{candidate.resumeText ? "No results yet. Run the pipeline for this person." : "No resume yet, so Screen & Score stays blocked. Attach one, then run the pipeline."}</p>
                      ) : null}
                      <label className="mt-1.5 inline-block cursor-pointer text-[11px] font-medium text-indigo-600 hover:underline">
                        {candidate.resumeText ? "Replace resume" : "Attach resume"}
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,.txt"
                          className="hidden"
                          onChange={(event) => {
                            const file = event.target.files?.[0];
                            if (file) {
                              uploadResume(candidate.id, file);
                              addDocument(file, "resume");
                            }
                            event.target.value = "";
                          }}
                        />
                      </label>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              <FileText className="h-3.5 w-3.5 text-slate-400" /> Documents ({documents.length})
            </div>
            {documents.length === 0 ? (
              <p className="text-xs text-slate-500">Job files live here: the JD, decks, and resumes you want the team to see.</p>
            ) : (
              <ul className="max-h-24 space-y-1 overflow-y-auto text-xs text-slate-700">
                {documents.map(({ id, layer }) => {
                  const name = (layer as any).fileName || (layer as any).value || "Document";
                  const kind = documentKind(name, (layer as any).docKind);
                  return (
                    <li key={id} className="flex items-center gap-2 rounded-lg bg-slate-50 px-2 py-1">
                      <span className="shrink-0 rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-700">{kind}</span>
                      <span className="truncate">{name}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            <button type="button" onClick={addMustAsk} title="A checklist for your team. Agents do not read it." className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer">
              Must-ask note
            </button>
            <button type="button" onClick={addNote} title="Sticky notes are for your team. Agents do not read them." className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer">
              <StickyNote className="h-3.5 w-3.5 text-slate-500" /> HR note ({notes.length})
            </button>
            <label className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs">
              <FileText className="h-3.5 w-3.5 text-slate-500" /> Add document
              <input
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.png,.jpg,.jpeg"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) addDocument(file);
                  event.target.value = "";
                }}
              />
            </label>
            <button type="button" onClick={() => setGreenhouseOpen(true)} className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer">
              Import Greenhouse
            </button>
            <button type="button" onClick={onEditSetup} className="rounded-lg bg-[#5e6ad2] px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-[#4f59b6] transition-colors shadow-xs cursor-pointer">
              Edit role setup
            </button>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-400">
            HR notes are for your team. Agents do not read them. Attach a resume to a candidate, or connect the Resume step.
          </p>
        </div>
      )}
      {sheet && (
        <ArtifactSheet
          key={`${sheet.kind}-${sheet.candidateId}`}
          kind={sheet.kind}
          data={sheet.data}
          candidateName={sheet.candidateName}
          candidateSelected={sheet.candidateId === activeId}
          onSelectCandidate={() => {
            const person = candidates.find((item) => item.id === sheet.candidateId);
            if (person) selectCandidate(person);
          }}
          onClose={() => setSheet(null)}
          onSaveOutreach={(next) => {
            saveResultEdit("outreach", sheet.candidateId, next);
            setSheet((open) => (open ? { ...open, data: { ...open.data, ...next } } : open));
          }}
          onSaveShortlist={(next) => {
            saveResultEdit("shortlist", sheet.candidateId, next);
            setSheet((open) => (open ? { ...open, data: { ...open.data, ...next } } : open));
          }}
          onSaveSchedule={(next) => {
            saveResultEdit("schedule", sheet.candidateId, next);
            setSheet((open) => (open ? { ...open, data: { ...open.data, ...next } } : open));
          }}
        />
      )}
      <GreenhouseImportModal
        isOpen={greenhouseOpen}
        onClose={() => setGreenhouseOpen(false)}
        roleId={roleId}
        roleTitle={roleTitle}
        onImportSuccess={(people) => {
          const first = people?.[0];
          if (first?.id) {
            window.localStorage.setItem('activeCandidateId', first.id);
            setActiveId(first.id);
            window.dispatchEvent(new CustomEvent('candidateChanged', { detail: { candidate: first } }));
          }
          refresh();
        }}
      />
    </div>
  );
}

const fieldClass = "w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-800 outline-none placeholder:text-slate-400 focus:border-[#5e6ad2] focus:ring-1 focus:ring-[#5e6ad2]";
