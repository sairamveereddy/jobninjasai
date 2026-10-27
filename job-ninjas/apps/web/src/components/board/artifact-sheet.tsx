"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { formatInterviewSlots, recommendationPresentation } from "@/lib/agents/contracts";

export type ArtifactKind = "scorecard" | "shortlist" | "outreach" | "schedule" | "interview" | "recommendation";

export function artifactKind(agentRole?: string, data?: any): ArtifactKind | null {
  if (!data || typeof data !== "object") return null;
  if (agentRole === "agent-outreach") return "outreach";
  if (agentRole === "agent-shortlist") return "shortlist";
  if (agentRole === "agent-schedule") return "schedule";
  if (agentRole === "agent-interview-analysis") return "interview";
  if (agentRole === "agent-decision") return "recommendation";
  if (agentRole === "agent-screen" || agentRole === "agent-resume") return "scorecard";
  if (Array.isArray(data.slots)) return "schedule";
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
  schedule: "Interview times",
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

const SHORTLIST_CHOICES = [
  { label: "Advance", advance: true, rankLabel: "Advance" },
  { label: "Hold", advance: false, rankLabel: "Hold" },
  { label: "Pass", advance: false, rankLabel: "Pass" },
];

const TONE_CLASS = {
  yes: "text-emerald-300",
  maybe: "text-amber-200",
  no: "text-rose-300",
};

export function ArtifactSheet({
  kind,
  data,
  onClose,
  onSaveOutreach,
  onSaveShortlist,
  onSaveSchedule,
  onSelectCandidate,
  candidateName,
  candidateSelected,
}: {
  kind: ArtifactKind;
  data: any;
  onClose: () => void;
  onSaveOutreach?: (next: { subject: string; body: string }) => void;
  onSaveShortlist?: (next: { advance: boolean; rankLabel: string; rationale: string }) => void;
  onSaveSchedule?: (next: { preferredSlot: number }) => void;
  onSelectCandidate?: () => void;
  candidateName?: string;
  candidateSelected?: boolean;
}) {
  const [subject, setSubject] = useState(data?.subject || "");
  const [body, setBody] = useState(data?.body || "");
  const [copied, setCopied] = useState("");
  const [rationale, setRationale] = useState(data?.rationale || "");
  const [rankLabel, setRankLabel] = useState(data?.rankLabel || (data?.advance ? "Advance" : "Pass"));
  const [advance, setAdvance] = useState(!!data?.advance);
  const [preferred, setPreferred] = useState<number>(typeof data?.preferredSlot === "number" ? data.preferredSlot : -1);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSubject(data?.subject || "");
    setBody(data?.body || "");
    setRationale(data?.rationale || "");
    setRankLabel(data?.rankLabel || (data?.advance ? "Advance" : "Pass"));
    setAdvance(!!data?.advance);
    setPreferred(typeof data?.preferredSlot === "number" ? data.preferredSlot : -1);
  }, [data]);

  useEffect(() => {
    dialogRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const copyText = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
    } catch {
      setCopied("blocked");
    }
  };

  const finishEmail = () => {
    onSaveOutreach?.({ subject, body });
    onClose();
  };

  const chooseShortlist = (choice: (typeof SHORTLIST_CHOICES)[number]) => {
    setAdvance(choice.advance);
    setRankLabel(choice.rankLabel);
    onSaveShortlist?.({ advance: choice.advance, rankLabel: choice.rankLabel, rationale });
  };

  const saveReason = () => {
    onSaveShortlist?.({ advance, rankLabel, rationale });
  };

  const decision = recommendationPresentation(data?.recommendation);
  const slots = Array.isArray(data?.slots) ? data.slots : [];

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="artifact-title"
        className="max-h-[min(80vh,720px)] w-[min(520px,calc(100vw-2rem))] overflow-y-auto rounded-lg border border-white/10 bg-[#111214] p-5 text-white shadow-2xl outline-none"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.14em] text-[#8b8fa8]">Result</p>
            <h2 id="artifact-title" className="text-lg font-medium">{artifactTitle(kind)}</h2>
            {candidateName ? <p className="text-xs text-[#b1b3b8]">{candidateName}</p> : null}
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
            <p className="text-lg">{rankLabel || (advance ? "Advance" : "Pass")}</p>
            {data.nextStep && <p className="text-[#c7c9ff]">Suggested next: {data.nextStep}</p>}
            <div className="flex flex-wrap gap-2">
              {SHORTLIST_CHOICES.map((choice) => (
                <button
                  key={choice.rankLabel}
                  type="button"
                  aria-pressed={rankLabel === choice.rankLabel}
                  onClick={() => chooseShortlist(choice)}
                  className={`rounded-md px-3 py-1.5 text-sm ${rankLabel === choice.rankLabel ? "bg-[#5e6ad2] text-white" : "border border-white/15 text-[#d0d2d8]"}`}
                >
                  {choice.label}
                </button>
              ))}
            </div>
            <label className="block text-xs text-[#8b8fa8]">
              Reason
              <textarea
                value={rationale}
                aria-label="Shortlist reason"
                onChange={(event) => setRationale(event.target.value)}
                onBlur={saveReason}
                className="mt-1 min-h-24 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm leading-relaxed text-white outline-none focus:border-[#5e6ad2]"
              />
            </label>
            {onSelectCandidate && (
              <button
                type="button"
                onClick={onSelectCandidate}
                aria-label={candidateSelected ? "This person is selected" : "Select this person for the next run"}
                className="rounded-md border border-white/15 px-3 py-2 text-sm"
              >
                {candidateSelected ? "Selected for the next run" : `Select ${candidateName || "this person"}`}
              </button>
            )}
          </div>
        )}

        {kind === "outreach" && (
          <div className="space-y-3">
            <p className="text-xs text-[#8b8fa8]">Edit the email, copy it, then mark it done. Nothing is sent.</p>
            <label className="block text-xs text-[#8b8fa8]">
              Subject
              <input
                value={subject}
                aria-label="Outreach subject"
                onChange={(event) => setSubject(event.target.value)}
                className="mt-1 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-[#5e6ad2]"
              />
            </label>
            <label className="block text-xs text-[#8b8fa8]">
              Email
              <textarea
                value={body}
                aria-label="Outreach email"
                onChange={(event) => setBody(event.target.value)}
                className="mt-1 min-h-40 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm leading-relaxed text-white outline-none focus:border-[#5e6ad2]"
              />
            </label>
            {data.callToAction && <p className="text-xs text-[#b1b3b8]">Ask: {data.callToAction}</p>}
            <div className="flex gap-2">
              <button type="button" onClick={() => copyText(`${subject}\n\n${body}`, "email")} aria-label="Copy outreach email" className="rounded-md border border-white/15 px-3 py-2 text-sm">
                {copied === "email" ? "Copied" : copied === "blocked" ? "Copy blocked" : "Copy email"}
              </button>
              <button type="button" onClick={finishEmail} aria-label="Save outreach draft" className="rounded-md bg-[#5e6ad2] px-3 py-2 text-sm font-medium">
                Done
              </button>
            </div>
          </div>
        )}

        {kind === "schedule" && (
          <div className="space-y-3 text-sm">
            <p className="text-[#b1b3b8]">
              {[data.durationMinutes ? `${data.durationMinutes} min` : null, data.format, data.timezone].filter(Boolean).join(" · ") || "Proposed times"}
            </p>
            <p className="text-xs text-[#8b8fa8]">These are suggestions. Nothing is booked.</p>
            <ul className="space-y-2">
              {slots.map((slot: { label?: string; interviewerRole?: string }, index: number) => (
                <li key={`${slot.label}-${index}`}>
                  <button
                    type="button"
                    aria-pressed={preferred === index}
                    aria-label={`Mark ${slot.label || `option ${index + 1}`} as preferred`}
                    onClick={() => {
                      setPreferred(index);
                      onSaveSchedule?.({ preferredSlot: index });
                    }}
                    className={`flex w-full items-center justify-between gap-3 rounded-md border px-3 py-2 text-left ${preferred === index ? "border-[#5e6ad2] bg-[#5e6ad2]/20" : "border-white/10"}`}
                  >
                    <span>
                      <span className="block">{slot.label || `Option ${index + 1}`}</span>
                      {slot.interviewerRole ? <span className="text-xs text-[#b1b3b8]">{slot.interviewerRole}</span> : null}
                    </span>
                    <span className="text-xs text-[#c7c9ff]">{preferred === index ? "Preferred" : "Prefer"}</span>
                  </button>
                </li>
              ))}
            </ul>
            {data.candidateMessage && <p className="leading-relaxed text-[#d0d2d8]">{data.candidateMessage}</p>}
            <button
              type="button"
              aria-label="Copy interview times"
              onClick={() => copyText(formatInterviewSlots({ ...data, preferredSlot: preferred >= 0 ? preferred : undefined }), "times")}
              className="rounded-md border border-white/15 px-3 py-2 text-sm"
            >
              {copied === "times" ? "Copied" : copied === "blocked" ? "Copy blocked" : "Copy times"}
            </button>
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
            <p className={`text-3xl font-medium ${TONE_CLASS[decision.tone]}`}>{decision.title}</p>
            {data.confidence != null ? <p className="text-[#b1b3b8]">{data.confidence}% confidence · You still make the call</p> : <p className="text-[#b1b3b8]">You still make the call</p>}
            {data.rationale && <p className="leading-relaxed text-[#d0d2d8]">{data.rationale}</p>}
            <List label="Criteria met" items={data.strengths} />
            <List label="Criteria missed" items={data.concerns} />
            <List label="Still open" items={data.unresolvedQuestions} />
            {data.compensationRecommendation?.notes && <p className="text-[#b1b3b8]">{data.compensationRecommendation.notes}</p>}
            <div className="rounded-md border border-white/10 bg-black/30 p-3">
              <p className="text-[#c7c9ff]">{decision.nextStep}</p>
              <button
                type="button"
                aria-label="Copy next step"
                onClick={() => copyText(decision.nextStep, "next")}
                className="mt-2 rounded-md border border-white/15 px-3 py-1.5 text-xs"
              >
                {copied === "next" ? "Copied" : copied === "blocked" ? "Copy blocked" : "Copy next step"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
