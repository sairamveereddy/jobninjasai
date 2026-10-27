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
      className={`absolute bottom-4 left-4 z-40 w-[min(360px,calc(100vw-2rem))] overflow-hidden rounded-lg border bg-[#111214] text-white shadow-xl ${dragOver ? "border-[#5e6ad2]" : "border-white/10"}`}
      onDragOver={(event) => { event.preventDefault(); event.stopPropagation(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={onDropResume}
    >
      <button type="button" onClick={() => setOpen((value) => !value)} className="flex w-full items-center justify-between px-3 py-2.5 text-left">
        <span>
          <span className="block text-[10px] uppercase tracking-[0.14em] text-[#8b8fa8]">This role</span>
          <span className="block text-sm font-medium">{roleTitle || "Open role"}</span>
        </span>
        <span className="text-xs text-[#8b8fa8]">{open ? "Hide" : "Show"}</span>
      </button>
      {open && (
        <div className="max-h-[min(70vh,560px)] space-y-3 overflow-y-auto border-t border-white/10 px-3 py-3">
          <div>
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-[#8b8fa8]">
                <Users className="h-3.5 w-3.5" /> Candidates ({candidates.length})
              </div>
              <div className="flex items-center gap-2">
                {selected && (
                  <label className="cursor-pointer text-[11px] text-[#c7c9ff]">
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
                <button type="button" onClick={() => { setAdding((value) => !value); setFormError(""); }} className="text-[11px] text-[#c7c9ff]">
                  {adding ? "Cancel" : "Add person"}
                </button>
              </div>
            </div>
            {dragOver && <p className="mb-2 text-[11px] text-[#c7c9ff]">Drop to attach this file to {selected ? `${selected.firstName}` : "the board"}.</p>}
            {adding && (
              <div className="mb-2 space-y-2 rounded-md border border-white/10 bg-black/30 p-2">
                <input className={fieldClass} placeholder="First name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
                <input className={fieldClass} placeholder="Last name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
                <input className={fieldClass} placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                <label className="block text-[11px] text-[#b1b3b8]">
                  Resume (optional)
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    className="mt-1 block w-full text-[11px]"
                    onChange={(event) => setResumeFile(event.target.files?.[0] || null)}
                  />
                </label>
                <button type="button" disabled={busy} onClick={addCandidate} className="rounded-md bg-[#5e6ad2] px-2 py-1.5 text-xs font-medium disabled:opacity-60">
                  {busy ? "Adding…" : "Add to this role"}
                </button>
              </div>
            )}
            {formError && <p className="mb-2 text-xs text-red-300">{formError}</p>}
            {candidates.length > 0 && !candidates.some((candidate) => candidate.id === activeId) && (
              <p className="mb-2 text-[11px] text-amber-200">Select a person before you run the pipeline. The steps score whoever is selected.</p>
            )}
            {candidates.length === 0 ? (
              <p className="text-xs text-[#b1b3b8]">No candidates yet. Add a person here, import from Greenhouse, or drop a resume on the board.</p>
            ) : (
              <div className="flex max-h-40 flex-col gap-1 overflow-y-auto">
                {candidates.map((candidate) => {
                  const results = viewableResults(candidate, layers, activeId);
                  const active = candidate.id === activeId;
                  return (
                    <div
                      key={candidate.id}
                      className={`rounded-md px-2 py-1.5 text-xs ${active ? "bg-[#5e6ad2]/20 ring-1 ring-[#5e6ad2]" : "hover:bg-white/5"}`}
                    >
                      <button type="button" onClick={() => selectCandidate(candidate)} className="flex w-full items-center justify-between text-left">
                        <span className="truncate">
                          {candidate.firstName} {candidate.lastName}
                          {active ? <span className="ml-1 text-[10px] uppercase tracking-wide text-[#c7c9ff]">Selected</span> : null}
                        </span>
                        <span className={candidate.resumeText ? "text-emerald-300" : "text-amber-200"}>
                          {candidate.resumeText ? "Resume" : "No resume"}
                        </span>
                      </button>
                      {results.length > 0 ? (
                        <div className="mt-1 flex flex-wrap gap-1">
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
                              className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-[#c7c9ff] hover:bg-white/20"
                            >
                              {item.label}
                            </button>
                          ))}
                        </div>
                      ) : active ? (
                        <p className="mt-1 text-[10px] leading-snug text-[#8b8fa8]">{candidate.resumeText ? "No results yet. Run the pipeline for this person." : "No resume yet, so Screen & Score stays blocked. Attach one, then run the pipeline."}</p>
                      ) : null}
                      <label className="mt-1 inline-block cursor-pointer text-[11px] text-[#c7c9ff]">
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
            <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-[#8b8fa8]">
              <FileText className="h-3.5 w-3.5" /> Documents ({documents.length})
            </div>
            {documents.length === 0 ? (
              <p className="text-xs text-[#b1b3b8]">Job files live here: the JD, decks, and resumes you want the team to see.</p>
            ) : (
              <ul className="max-h-24 space-y-1 overflow-y-auto text-xs text-[#b1b3b8]">
                {documents.map(({ id, layer }) => {
                  const name = (layer as any).fileName || (layer as any).value || "Document";
                  const kind = documentKind(name, (layer as any).docKind);
                  return (
                    <li key={id} className="flex items-center gap-2">
                      <span className="shrink-0 rounded bg-white/10 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-[#c7c9ff]">{kind}</span>
                      <span className="truncate">{name}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={addMustAsk} title="A checklist for your team. Agents do not read it." className="inline-flex items-center gap-1 rounded-md border border-white/10 px-2 py-1.5 text-xs hover:bg-white/5">
              Must-ask note
            </button>
            <button type="button" onClick={addNote} title="Sticky notes are for your team. Agents do not read them." className="inline-flex items-center gap-1 rounded-md border border-white/10 px-2 py-1.5 text-xs hover:bg-white/5">
              <StickyNote className="h-3.5 w-3.5" /> HR note ({notes.length})
            </button>
            <label className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-white/10 px-2 py-1.5 text-xs hover:bg-white/5">
              <FileText className="h-3.5 w-3.5" /> Add document
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
            <button type="button" onClick={() => setGreenhouseOpen(true)} className="rounded-md border border-white/10 px-2 py-1.5 text-xs hover:bg-white/5">
              Import from Greenhouse
            </button>
            <button type="button" onClick={onEditSetup} className="rounded-md bg-[#5e6ad2] px-2 py-1.5 text-xs font-medium">
              Edit role setup
            </button>
          </div>
          <p className="text-[11px] leading-relaxed text-[#8b8fa8]">
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

const fieldClass = "w-full rounded-md border border-white/10 bg-black/40 px-2 py-1.5 text-xs text-white outline-none placeholder:text-[#94969c] focus:border-[#5e6ad2]";
