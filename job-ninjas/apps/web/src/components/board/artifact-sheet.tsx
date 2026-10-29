"use client";

import { useEffect, useRef, useState } from "react";
import { X, Send, Calendar, Video, Loader2, CheckCircle2, Copy } from "lucide-react";
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
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
      <ul className="mt-1 list-disc space-y-1 pl-4 text-sm text-slate-600">
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
  yes: "text-emerald-700",
  maybe: "text-amber-700",
  no: "text-rose-700",
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

  // Live integration states
  const [sendingGmail, setSendingGmail] = useState(false);
  const [gmailSent, setGmailSent] = useState(false);
  const [bookingGCal, setBookingGCal] = useState(false);
  const [bookedMeeting, setBookedMeeting] = useState<any>(null);

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

  const handleSendGmail = async () => {
    setSendingGmail(true);
    try {
      const res = await fetch('/api/integrations/gmail/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: data?.candidateEmail || 'candidate@example.com',
          subject,
          body,
          candidateName,
        }),
      });
      const resData = await res.json();
      if (resData.success) {
        setGmailSent(true);
        onSaveOutreach?.({ subject, body });
      }
    } catch {} finally {
      setSendingGmail(false);
    }
  };

  const handleBookGCal = async () => {
    const selectedSlot = slots[preferred >= 0 ? preferred : 0];
    setBookingGCal(true);
    try {
      const res = await fetch('/api/integrations/gcal/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'book',
          candidateName: candidateName || 'Candidate',
          candidateEmail: data?.candidateEmail || 'candidate@example.com',
          slotLabel: selectedSlot?.label || 'Tomorrow at 10:00 AM EDT',
        }),
      });
      const resData = await res.json();
      if (resData.success) {
        setBookedMeeting(resData);
      }
    } catch {} finally {
      setBookingGCal(false);
    }
  };

  const notifySlack = async (title: string, text: string) => {
    try {
      await fetch('/api/integrations/slack/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          text,
          candidateName,
        }),
      });
    } catch {}
  };

  const finishEmail = () => {
    onSaveOutreach?.({ subject, body });
    onClose();
  };

  const chooseShortlist = (choice: (typeof SHORTLIST_CHOICES)[number]) => {
    setAdvance(choice.advance);
    setRankLabel(choice.rankLabel);
    onSaveShortlist?.({ advance: choice.advance, rankLabel: choice.rankLabel, rationale });
    notifySlack(`Shortlist Decision: ${choice.rankLabel}`, `${candidateName} marked as ${choice.rankLabel}. Rationale: ${rationale || 'None provided'}`);
  };

  const saveReason = () => {
    onSaveShortlist?.({ advance, rankLabel, rationale });
  };

  const decision = recommendationPresentation(data?.recommendation);
  const slots = Array.isArray(data?.slots) ? data.slots : [];

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4" onClick={onClose}>
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="artifact-title"
        className="max-h-[min(85vh,720px)] w-[min(560px,calc(100vw-2rem))] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 text-slate-800 shadow-2xl outline-none font-sans"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">Result</p>
            <h2 id="artifact-title" className="text-xl font-bold text-slate-900">{artifactTitle(kind)}</h2>
            {candidateName ? <p className="text-xs font-medium text-slate-500 mt-0.5">{candidateName}</p> : null}
          </div>
          <button type="button" onClick={onClose} aria-label="Close result" className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        {kind === "scorecard" && (
          <div className="space-y-3.5 text-sm">
            <p className="text-3xl font-extrabold text-slate-900">{data.overallMatch ?? "—"}<span className="ml-2.5 text-sm font-semibold text-slate-500">{words(data.recommendation)}</span></p>
            {data.candidateSummary && <p className="leading-relaxed text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">{data.candidateSummary}</p>}
            <List label="Strengths" items={data.strengths} />
            <List label="Gaps" items={data.gaps} />
            <List label="Ask about" items={data.interviewFocusAreas} />
          </div>
        )}

        {kind === "shortlist" && (
          <div className="space-y-3.5 text-sm">
            <p className="text-lg font-bold text-slate-800">{rankLabel || (advance ? "Advance" : "Pass")}</p>
            {data.nextStep && <p className="text-xs font-medium text-indigo-700 bg-indigo-50 px-2.5 py-1.5 rounded-lg border border-indigo-100">Suggested next: {data.nextStep}</p>}
            <div className="flex flex-wrap gap-2">
              {SHORTLIST_CHOICES.map((choice) => (
                <button
                  key={choice.rankLabel}
                  type="button"
                  aria-pressed={rankLabel === choice.rankLabel}
                  onClick={() => chooseShortlist(choice)}
                  className={`rounded-xl px-3.5 py-2 text-sm font-semibold transition-colors cursor-pointer ${
                    rankLabel === choice.rankLabel
                      ? "bg-[#5e6ad2] text-white shadow-xs"
                      : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-2xs"
                  }`}
                >
                  {choice.label}
                </button>
              ))}
            </div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
              Reason
              <textarea
                value={rationale}
                aria-label="Shortlist reason"
                onChange={(event) => setRationale(event.target.value)}
                onBlur={saveReason}
                className="mt-1 min-h-24 w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-sm leading-relaxed text-slate-800 outline-none focus:border-[#5e6ad2] focus:bg-white"
              />
            </label>
            {onSelectCandidate && (
              <button
                type="button"
                onClick={onSelectCandidate}
                aria-label={candidateSelected ? "This person is selected" : "Select this person for the next run"}
                className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
              >
                {candidateSelected ? "Selected for the next run" : `Select ${candidateName || "this person"}`}
              </button>
            )}
          </div>
        )}

        {kind === "outreach" && (
          <div className="space-y-3.5">
            <p className="text-xs text-slate-500">Review or edit the AI outreach email. Send directly via Gmail or copy text.</p>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
              Subject
              <input
                value={subject}
                aria-label="Outreach subject"
                onChange={(event) => setSubject(event.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-800 outline-none focus:border-[#5e6ad2] focus:bg-white"
              />
            </label>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
              Email
              <textarea
                value={body}
                aria-label="Outreach email"
                onChange={(event) => setBody(event.target.value)}
                className="mt-1 min-h-40 w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-sm leading-relaxed text-slate-800 outline-none focus:border-[#5e6ad2] focus:bg-white"
              />
            </label>
            {data.callToAction && <p className="text-xs font-medium text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">Ask: {data.callToAction}</p>}
            
            {gmailSent && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Dispatched to candidate inbox via Gmail!</span>
              </div>
            )}

            <div className="flex items-center justify-between gap-2 pt-1">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => copyText(`${subject}\n\n${body}`, "email")}
                  className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copied === "email" ? "Copied" : "Copy"}
                </button>
                <button
                  type="button"
                  onClick={handleSendGmail}
                  disabled={sendingGmail || gmailSent}
                  className="rounded-xl bg-rose-600 hover:bg-rose-500 text-white px-3.5 py-2 text-xs font-bold transition-colors shadow-xs cursor-pointer flex items-center gap-1.5 disabled:opacity-60"
                  title="Send directly via connected Gmail"
                >
                  {sendingGmail ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  <span>{gmailSent ? "Sent via Gmail" : "Send via Gmail"}</span>
                </button>
              </div>
              <button type="button" onClick={finishEmail} aria-label="Save outreach draft" className="rounded-xl bg-[#5e6ad2] px-4 py-2 text-xs font-bold text-white hover:bg-[#4f59b6] transition-colors shadow-xs cursor-pointer">
                Save Draft
              </button>
            </div>
          </div>
        )}

        {kind === "schedule" && (
          <div className="space-y-3.5 text-sm">
            <p className="font-semibold text-slate-700">
              {[data.durationMinutes ? `${data.durationMinutes} min` : null, data.format, data.timezone].filter(Boolean).join(" · ") || "Proposed times"}
            </p>
            <p className="text-xs text-slate-500">Pick a preferred interview slot to book directly on Google Calendar.</p>
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
                    className={`flex w-full items-center justify-between gap-3 rounded-xl border p-3 text-left transition-colors cursor-pointer ${
                      preferred === index ? "border-[#5e6ad2] bg-indigo-50/70" : "border-slate-200 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <span>
                      <span className="block font-medium text-slate-800">{slot.label || `Option ${index + 1}`}</span>
                      {slot.interviewerRole ? <span className="text-xs text-slate-500">{slot.interviewerRole}</span> : null}
                    </span>
                    <span className="text-xs font-semibold text-indigo-700">{preferred === index ? "Preferred" : "Prefer"}</span>
                  </button>
                </li>
              ))}
            </ul>
            {data.candidateMessage && <p className="leading-relaxed text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">{data.candidateMessage}</p>}

            {bookedMeeting && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs space-y-1.5 text-emerald-900">
                <div className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Interview Booked on Google Calendar!</span>
                </div>
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-indigo-600" />
                  <a href={bookedMeeting.meetUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-indigo-700 underline">
                    {bookedMeeting.meetUrl}
                  </a>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleBookGCal}
                disabled={bookingGCal || !!bookedMeeting}
                className="rounded-xl bg-amber-600 hover:bg-amber-500 text-white px-3.5 py-2 text-xs font-bold transition-colors shadow-xs cursor-pointer flex items-center gap-1.5 disabled:opacity-60"
                title="Book on Google Calendar with Google Meet video link"
              >
                {bookingGCal ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Calendar className="w-3.5 h-3.5" />}
                <span>{bookedMeeting ? "Calendar Invite Created" : "Book on Google Calendar"}</span>
              </button>
              <button
                type="button"
                aria-label="Copy interview times"
                onClick={() => copyText(formatInterviewSlots({ ...data, preferredSlot: preferred >= 0 ? preferred : undefined }), "times")}
                className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
              >
                {copied === "times" ? "Copied" : "Copy times"}
              </button>
            </div>
          </div>
        )}

        {kind === "interview" && (
          <div className="space-y-3.5 text-sm">
            <p className="text-lg font-bold text-slate-900">{words(data.overallRecommendation)}</p>
            <p className="text-xs font-semibold text-slate-500">Technical {data.technicalScore ?? "—"} · Communication {data.communicationScore ?? "—"}</p>
            {data.feedbackSummary && <p className="leading-relaxed text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">{data.feedbackSummary}</p>}
            <List label="Showed" items={data.strengthsDemonstrated} />
            <List label="Red flags" items={data.redFlagsSpotted} />
          </div>
        )}

        {kind === "recommendation" && (
          <div className="space-y-3.5 text-sm">
            <p className={`text-3xl font-extrabold ${TONE_CLASS[decision.tone]}`}>{decision.title}</p>
            {data.confidence != null ? <p className="text-xs font-medium text-slate-500">{data.confidence}% confidence · You still make the call</p> : <p className="text-xs font-medium text-slate-500">You still make the call</p>}
            {data.rationale && <p className="leading-relaxed text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">{data.rationale}</p>}
            <List label="Criteria met" items={data.strengths} />
            <List label="Criteria missed" items={data.concerns} />
            <List label="Still open" items={data.unresolvedQuestions} />
            {data.compensationRecommendation?.notes && <p className="text-xs text-slate-500">{data.compensationRecommendation.notes}</p>}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
              <p className="text-xs font-semibold text-indigo-700">{decision.nextStep}</p>
              <div className="mt-2.5 flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Copy next step"
                  onClick={() => copyText(decision.nextStep, "next")}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                >
                  {copied === "next" ? "Copied" : "Copy next step"}
                </button>
                <button
                  type="button"
                  onClick={() => notifySlack(`Hiring Recommendation: ${decision.title}`, `${candidateName} has completed interview loop. Recommendation: ${decision.title}. Next: ${decision.nextStep}`)}
                  className="rounded-lg bg-purple-600 hover:bg-purple-500 text-white px-3 py-1.5 text-xs font-bold transition-colors shadow-2xs cursor-pointer flex items-center gap-1"
                >
                  <span>Post to Slack</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
