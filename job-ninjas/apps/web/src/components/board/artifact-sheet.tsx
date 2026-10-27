"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

export type ArtifactKind = "scorecard" | "shortlist" | "outreach" | "interview" | "recommendation";

export function artifactKind(agentRole?: string, data?: any): ArtifactKind | null {
  if (!data || typeof data !== "object") return null;
  if (agentRole === "agent-outreach" || agentRole === "agent-screen" || agentRole === "agent-resume" || agentRole === "agent-shortlist" || agentRole === "agent-interview-analysis" || agentRole === "agent-decision") {
    if (agentRole === "agent-outreach") return "outreach";
    if (agentRole === "agent-shortlist") return "shortlist";
    if (agentRole === "agent-interview-analysis") return "interview";
    if (agentRole === "agent-decision") return "recommendation";
    return "scorecard";
  }
  if (data.subject && data.body) return "outreach";
  if (data.rankLabel || typeof data.advance === "boolean") return "shortlist";
  if (data.feedbackSummary) return "interview";
  if (data.rationale && data.recommendation) return "recommendation";
  if (data.overallMatch != null || data.candidateSummary) return "scorecard";
  return null;
}

const TITLES: Record<ArtifactKind, string> = {
  scorecard: "Scorecard",
  shortlist: "Shortlist",
  outreach: "Outreach draft",
  interview: "Interview analysis",
  recommendation: "Hiring recommendation",
};

export function artifactTitle(kind: ArtifactKind) {
  return TITLES[kind];
}

function words(value: unknown) {
  return String(value || "").replace(/_/g, " ");
}

function List({ label, items }: { label: string; items?: string[] }) {
  if (!items?.length) return null;
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wide text-[#8b8fa8]">{label}</p>
      <ul className="mt-1 list-disc space-y-1 pl-4 text-sm text-[#d0d2d8]">
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </div>
  );
}

export function ArtifactSheet({
  kind,
  data,
  onClose,
  onSaveOutreach,
}: {
  kind: ArtifactKind;
  data: any;
  onClose: () => void;
  onSaveOutreach?: (next: { subject: string; body: string }) => void;
}) {
  const [subject, setSubject] = useState(data?.subject || "");
  const [body, setBody] = useState(data?.body || "");
  const [copied, setCopied] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dialogRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const copyEmail = async () => {
    const text = `${subject}\n\n${body}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  const finishEmail = () => {
    onSaveOutreach?.({ subject, body });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 p-4" onMouseDown={onClose}>
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="artifact-title"
        className="max-h-[min(80vh,720px)] w-[min(520px,calc(100vw-2rem))] overflow-y-auto rounded-lg border border-white/10 bg-[#111214] p-5 text-white shadow-2xl outline-none"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.14em] text-[#8b8fa8]">Result</p>
            <h2 id="artifact-title" className="text-lg font-medium">{artifactTitle(kind)}</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close result" className="rounded-md p-1 text-[#8b8fa8] hover:bg-white/5 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        {kind === "scorecard" && (
          <div className="space-y-3 text-sm">
            <p className="text-2xl font-medium text-white">{data.overallMatch ?? "—"}<span className="ml-2 text-sm font-normal text-[#b1b3b8]">{words(data.recommendation)}</span></p>
            {data.candidateSummary && <p className="leading-relaxed text-[#d0d2d8]">{data.candidateSummary}</p>}
            <List label="Strengths" items={data.strengths} />
            <List label="Gaps" items={data.gaps} />
            <List label="Ask about" items={data.interviewFocusAreas} />
          </div>
        )}

        {kind === "shortlist" && (
          <div className="space-y-3 text-sm">
            <p className="text-lg">{data.rankLabel || (data.advance ? "Advance" : "Pass")}</p>
            {data.rationale && <p className="leading-relaxed text-[#d0d2d8]">{data.rationale}</p>}
            {data.nextStep && <p className="text-[#c7c9ff]">Next: {data.nextStep}</p>}
          </div>
        )}

        {kind === "outreach" && (
          <div className="space-y-3">
            <p className="text-xs text-[#8b8fa8]">Edit the email, copy it, then mark it done. Nothing is sent.</p>
            <label className="block text-xs text-[#8b8fa8]">
              Subject
              <input
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                className="mt-1 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-[#5e6ad2]"
              />
            </label>
            <label className="block text-xs text-[#8b8fa8]">
              Email
              <textarea
                value={body}
                onChange={(event) => setBody(event.target.value)}
                className="mt-1 min-h-40 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm leading-relaxed text-white outline-none focus:border-[#5e6ad2]"
              />
            </label>
            {data.callToAction && <p className="text-xs text-[#b1b3b8]">Ask: {data.callToAction}</p>}
            <div className="flex gap-2">
              <button type="button" onClick={copyEmail} aria-label="Copy outreach email" className="rounded-md border border-white/15 px-3 py-2 text-sm">
                {copied ? "Copied" : "Copy email"}
              </button>
              <button type="button" onClick={finishEmail} aria-label="Save outreach draft" className="rounded-md bg-[#5e6ad2] px-3 py-2 text-sm font-medium">
                Done
              </button>
            </div>
          </div>
        )}

        {kind === "interview" && (
          <div className="space-y-3 text-sm">
            <p>{words(data.overallRecommendation)}</p>
            <p className="text-[#b1b3b8]">Technical {data.technicalScore ?? "—"} · Communication {data.communicationScore ?? "—"}</p>
            {data.feedbackSummary && <p className="leading-relaxed text-[#d0d2d8]">{data.feedbackSummary}</p>}
            <List label="Showed" items={data.strengthsDemonstrated} />
            <List label="Red flags" items={data.redFlagsSpotted} />
          </div>
        )}

        {kind === "recommendation" && (
          <div className="space-y-3 text-sm">
            <p className="text-lg">{words(data.recommendation)}{data.confidence != null ? <span className="ml-2 text-sm text-[#b1b3b8]">{data.confidence}% confidence</span> : null}</p>
            {data.rationale && <p className="leading-relaxed text-[#d0d2d8]">{data.rationale}</p>}
            <List label="Strengths" items={data.strengths} />
            <List label="Concerns" items={data.concerns} />
            <List label="Still open" items={data.unresolvedQuestions} />
            {data.compensationRecommendation?.notes && <p className="text-[#b1b3b8]">{data.compensationRecommendation.notes}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
