"use client";

import { useEffect, useMemo, useState } from "react";
import { FileText, StickyNote, Users } from "lucide-react";
import { useBoardStore } from "@/store/board";
import { LayerType } from "@/types/canvas";

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

  useEffect(() => {
    if (!roleId) return;
    fetch(`/api/candidates?roleId=${roleId}`)
      .then((res) => res.json())
      .then((data) => setCandidates(Array.isArray(data) ? data : data?.candidates || []))
      .catch(() => setCandidates([]));
  }, [roleId, layerIds.length]);

  useEffect(() => {
    const refresh = () => {
      fetch(`/api/candidates?roleId=${roleId}`)
        .then((res) => res.json())
        .then((data) => setCandidates(Array.isArray(data) ? data : data?.candidates || []))
        .catch(() => undefined);
    };
    window.addEventListener("candidateChanged", refresh);
    return () => window.removeEventListener("candidateChanged", refresh);
  }, [roleId]);

  const documents = useMemo(
    () =>
      layerIds
        .map((id) => ({ id, layer: layers[id] }))
        .filter(({ layer }) => layer && (layer.type === LayerType.Slide || layer.type === LayerType.Image || layer.type === LayerType.Text)),
    [layerIds, layers]
  );
  const notes = layerIds.filter((id) => layers[id]?.type === LayerType.Note);

  const addNote = () => {
    const id = insertLayer(
      LayerType.Note,
      { x: 80, y: 80 + notes.length * 36 },
      { r: 94, g: 106, b: 210 }
    );
    updateLayer(id, { width: 240, height: 200, value: "" });
  };

  const addDocument = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const id = insertLayer(LayerType.Slide, { x: 80, y: 420 }, { r: 255, g: 255, b: 255 });
      updateLayer(id, {
        width: 280,
        height: 180,
        fileSrc: String(reader.result || ""),
        fileName: file.name,
        value: file.name,
      } as any);
    };
    reader.readAsDataURL(file);
  };

  const selectCandidate = (candidate: any) => {
    window.localStorage.setItem("activeCandidateId", candidate.id);
    window.dispatchEvent(new CustomEvent("candidateChanged", { detail: { candidate } }));
  };

  return (
    <div className="absolute bottom-4 left-4 z-40 w-[340px] overflow-hidden rounded-lg border border-white/10 bg-[#111214] text-white shadow-xl">
      <button type="button" onClick={() => setOpen((value) => !value)} className="flex w-full items-center justify-between px-3 py-2.5 text-left">
        <span>
          <span className="block text-[10px] uppercase tracking-[0.14em] text-[#8b8fa8]">This role</span>
          <span className="block text-sm font-medium">{roleTitle || "Open role"}</span>
        </span>
        <span className="text-xs text-[#8b8fa8]">{open ? "Hide" : "Show"}</span>
      </button>
      {open && (
        <div className="space-y-3 border-t border-white/10 px-3 py-3">
          <div>
            <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-[#8b8fa8]">
              <Users className="h-3.5 w-3.5" /> Candidates ({candidates.length})
            </div>
            {candidates.length === 0 ? (
              <p className="text-xs text-[#b1b3b8]">No candidates yet. Add them from the bar above, or drop a resume on the board.</p>
            ) : (
              <div className="flex max-h-28 flex-col gap-1 overflow-y-auto">
                {candidates.map((candidate) => (
                  <button
                    key={candidate.id}
                    type="button"
                    onClick={() => selectCandidate(candidate)}
                    className="flex items-center justify-between rounded-md px-2 py-1.5 text-left text-xs hover:bg-white/5"
                  >
                    <span className="truncate">{candidate.firstName} {candidate.lastName}</span>
                    <span className={candidate.resumeText ? "text-emerald-300" : "text-amber-200"}>
                      {candidate.resumeText ? "Resume" : "No resume"}
                    </span>
                  </button>
                ))}
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
              <ul className="max-h-20 space-y-1 overflow-y-auto text-xs text-[#b1b3b8]">
                {documents.map(({ id, layer }) => (
                  <li key={id} className="truncate">{(layer as any).fileName || (layer as any).value || "Document"}</li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={addNote} className="inline-flex items-center gap-1 rounded-md border border-white/10 px-2 py-1.5 text-xs hover:bg-white/5">
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
            <button type="button" onClick={onEditSetup} className="rounded-md bg-[#5e6ad2] px-2 py-1.5 text-xs font-medium">
              Edit role setup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
