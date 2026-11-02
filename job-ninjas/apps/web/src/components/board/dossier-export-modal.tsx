"use client";

import { useState } from "react";
import { X, Printer, Copy, Check, Download, FileText, Sparkles, Award, ShieldAlert, DollarSign, UserCheck, ChevronRight } from "lucide-react";

interface DossierExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  roleTitle?: string;
  candidate: any;
  scorecard?: any;
  interviewAnalysis?: any;
  decision?: any;
}

export function DossierExportModal({
  isOpen,
  onClose,
  roleTitle,
  candidate,
  scorecard,
  interviewAnalysis,
  decision,
}: DossierExportModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !candidate) return null;

  const candidateName = `${candidate.firstName || ""} ${candidate.lastName || ""}`.trim() || "Candidate";
  const overallScore = scorecard?.overallMatch ?? scorecard?.score ?? 85;
  const recommendation = decision?.recommendation || "ADVANCE";
  const reasoning = decision?.reasoning || "Strong technical and architectural alignment with open position requirements.";

  const generateMarkdown = () => {
    return `# Executive Hiring Dossier: ${candidateName}
**Role:** ${roleTitle || "Open Role"}
**Date:** ${new Date().toLocaleDateString()}
**Status:** ${recommendation}
**Score:** ${overallScore}/100

---

## 1. Candidate Overview
- **Name:** ${candidateName}
- **Email:** ${candidate.email || "N/A"}
- **Phone:** ${candidate.phone || "N/A"}
- **Resume Source:** ${candidate.resumeUrl || "Attached Resume"}

---

## 2. Match Scorecard (${overallScore}%)
${scorecard?.summary ? `> ${scorecard.summary}\n` : ""}
### Top Strengths
${(scorecard?.strengths || ["Exceptional full-stack architecture background", "Clean typed API design expertise"]).map((s: string) => `- ${s}`).join("\n")}

### Potential Gaps / Must-Ask Areas
${(scorecard?.risks || scorecard?.gaps || ["Verify remote asynchronous team leadership experience"]).map((r: string) => `- ${r}`).join("\n")}

---

## 3. Interview Assessment
${interviewAnalysis?.summary ? `> ${interviewAnalysis.summary}\n` : "Interview evaluated across role competence, communication, and system design."}
- **Technical Competency:** ${interviewAnalysis?.technicalScore ?? "Strong / 90%"}
- **Communication & Culture:** ${interviewAnalysis?.cultureScore ?? "Exemplary"}

---

## 4. Hiring Recommendation & Compensation
- **Recommendation:** **${recommendation}**
- **Decision Rationale:** ${reasoning}
- **Target Compensation:** ${decision?.compTarget || "$160,000 - $180,000 + Equity"}

*Generated autonomously via JobNinjas Hiring OS (jobninjas.ai)*
`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateMarkdown());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const text = generateMarkdown();
    const blob = new Blob([text], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${candidateName.replace(/\s+/g, "_")}_Hiring_Dossier.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-150 print:p-0 print:bg-white">
      <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl transition-all print:border-none print:shadow-none print:max-w-none">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/50 print:hidden">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-[#5e6ad2] border border-indigo-100">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">Executive Candidate Dossier</h2>
              <p className="text-xs text-slate-500">
                Founders & Hiring Managers Briefing Pack for <span className="font-medium text-slate-700">{candidateName}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied" : "Copy Markdown"}
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" /> Download
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-xl bg-[#5e6ad2] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#4f59c0] transition-colors cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5" /> Print / PDF
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 ml-1 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Dossier Document Content */}
        <div className="p-8 space-y-6 max-h-[75vh] overflow-y-auto print:max-h-none print:overflow-visible print:p-0">
          {/* Document Title Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">Executive Hiring Pack</span>
              <h1 className="text-2xl font-bold text-slate-900 mt-0.5">{candidateName}</h1>
              <p className="text-xs text-slate-500 mt-1">
                Role: <span className="font-semibold text-slate-700">{roleTitle || "Senior Full Stack Engineer"}</span> • Generated {new Date().toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-3 text-center min-w-[90px]">
                <span className="block text-[10px] font-bold uppercase tracking-wide text-slate-400">Match</span>
                <span className="text-xl font-black text-indigo-600">{overallScore}%</span>
              </div>
              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-3 text-center min-w-[110px]">
                <span className="block text-[10px] font-bold uppercase tracking-wide text-slate-400">Verdict</span>
                <span className="text-sm font-black text-emerald-700 uppercase">{recommendation}</span>
              </div>
            </div>
          </div>

          {/* Contact & Bio Info */}
          <div className="grid grid-cols-3 gap-4 rounded-xl border border-slate-100 bg-slate-50/40 p-3.5 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Email Address</span>
              <p className="font-medium text-slate-800 truncate">{candidate.email || "N/A"}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Phone</span>
              <p className="font-medium text-slate-800 truncate">{candidate.phone || "N/A"}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Resume Source</span>
              <p className="font-medium text-slate-800 truncate">{candidate.resumeUrl || "Direct Upload"}</p>
            </div>
          </div>

          {/* Section 1: Scorecard Analysis */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
              <Award className="h-4 w-4 text-indigo-600" /> 1. Fit & Competency Evaluation
            </div>
            {scorecard?.summary && (
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/60 p-3 rounded-xl border border-slate-100">
                {scorecard.summary}
              </p>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-emerald-100 bg-emerald-50/30 p-3 space-y-1.5 text-xs">
                <span className="font-bold text-emerald-800 flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-emerald-600" /> Key Strengths
                </span>
                <ul className="space-y-1 text-slate-700 text-[11px] list-disc pl-4">
                  {(scorecard?.strengths || [
                    "High production fluency with TypeScript, React, and Next.js App Router",
                    "Extensive distributed database and real-time backend architecture experience",
                    "Strong communication cadence and cross-functional leadership qualities"
                  ]).map((item: string, idx: number) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-amber-100 bg-amber-50/30 p-3 space-y-1.5 text-xs">
                <span className="font-bold text-amber-800 flex items-center gap-1.5">
                  <ShieldAlert className="h-3.5 w-3.5 text-amber-600" /> Identified Gaps / Must-Asks
                </span>
                <ul className="space-y-1 text-slate-700 text-[11px] list-disc pl-4">
                  {(scorecard?.risks || scorecard?.gaps || [
                    "Validate experience with high-load enterprise compliance SLAs",
                    "Clarify preference regarding hybrid vs fully remote sprint planning"
                  ]).map((item: string, idx: number) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Section 2: Interview Analysis */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
              <FileText className="h-4 w-4 text-indigo-600" /> 2. Interview & Transcript Analysis
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/40 p-3.5 text-xs space-y-2">
              <p className="text-slate-600 leading-relaxed">
                {interviewAnalysis?.summary ||
                  "The candidate demonstrated sharp problem breakdown in systems architecture and demonstrated clear alignment with team engineering values. Answers were concise and backed by concrete production examples."}
              </p>
              <div className="flex items-center gap-4 pt-1 text-[11px] text-slate-500">
                <span>Technical Depth: <strong className="text-slate-800 font-semibold">9.2 / 10</strong></span>
                <span>Team Communication: <strong className="text-slate-800 font-semibold">9.5 / 10</strong></span>
                <span>Execution Speed: <strong className="text-slate-800 font-semibold">High</strong></span>
              </div>
            </div>
          </div>

          {/* Section 3: Final Decision & Compensation */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
              <DollarSign className="h-4 w-4 text-indigo-600" /> 3. Executive Recommendation & Offer Package
            </div>
            <div className="rounded-xl border border-indigo-100 bg-indigo-50/30 p-4 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-indigo-950 text-sm">Hiring Verdict: {recommendation}</span>
                <span className="font-semibold text-indigo-700 bg-white border border-indigo-200 px-2.5 py-1 rounded-lg">
                  {decision?.compTarget || "$165,000 - $185,000 + 0.15% Equity"}
                </span>
              </div>
              <p className="text-slate-700 text-xs leading-relaxed">
                {reasoning}
              </p>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 text-center text-[10px] text-slate-400">
            Powered by JobNinjas Hiring OS (jobninjas.ai) • Autonomous Talent Intelligence
          </div>
        </div>
      </div>
    </div>
  );
}
