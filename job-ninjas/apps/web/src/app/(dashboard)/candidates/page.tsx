"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Users, Search, Loader2, ArrowRight, Briefcase, Mail, MapPin, Sparkles, FileText, CheckCircle2, AlertCircle, Upload } from "lucide-react";
import Link from "next/link";
import { DossierExportModal } from "@/components/board/dossier-export-modal";
import { BulkResumeModal } from "@/components/board/bulk-resume-modal";

interface CandidateRecord {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  location?: string;
  stage: string;
  createdAt: string;
  resumeUrl?: string;
  role?: {
    id: string;
    title: string;
    department: string;
  };
  interviews?: any[];
  artifacts?: Array<{
    artifactType: string;
    data: any;
    createdAt: string;
  }>;
}

const STAGE_COLORS: Record<string, string> = {
  APPLIED: "bg-blue-50 text-blue-700 border-blue-200",
  SCREENING: "bg-violet-50 text-violet-700 border-violet-200",
  SHORTLISTED: "bg-indigo-50 text-indigo-700 border-indigo-200",
  INTERVIEW: "bg-amber-50 text-amber-700 border-amber-200",
  OFFER: "bg-purple-50 text-purple-700 border-purple-200",
  HIRED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  REJECTED: "bg-rose-50 text-rose-700 border-rose-200",
};

export default function CandidatesPage() {
  const router = useRouter();
  const [candidates, setCandidates] = useState<CandidateRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("all");
  const [topMatchOnly, setTopMatchOnly] = useState(false);
  const [selectedForDossier, setSelectedForDossier] = useState<CandidateRecord | null>(null);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/candidates');
      const data = await res.json();
      if (data.success && data.candidates) {
        setCandidates(data.candidates);
      }
    } catch (err) {
      console.error('Failed to load candidates:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const getScorecard = (c: CandidateRecord) => {
    return c.artifacts?.find(a => a.artifactType === 'Scorecard' || a.artifactType === 'ResumeAnalysis')?.data;
  };

  const getDecision = (c: CandidateRecord) => {
    return c.artifacts?.find(a => a.artifactType === 'CandidateDecision')?.data;
  };

  const getInterviewAnalysis = (c: CandidateRecord) => {
    return c.artifacts?.find(a => a.artifactType === 'InterviewAnalysis')?.data;
  };

  const filtered = candidates.filter((c) => {
    const fullName = `${c.firstName} ${c.lastName}`.toLowerCase();
    const matchesSearch =
      fullName.includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      (c.role?.title && c.role.title.toLowerCase().includes(search.toLowerCase()));

    const matchesStage = stageFilter === "all" || c.stage.toUpperCase() === stageFilter.toUpperCase();

    const score = getScorecard(c)?.overallMatch ?? getScorecard(c)?.score;
    const matchesTop = !topMatchOnly || (typeof score === 'number' && score >= 80);

    return matchesSearch && matchesStage && matchesTop;
  });

  const handleOpenBoard = (candidate: CandidateRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    if (candidate.role?.id) {
      if (typeof window !== "undefined") {
        window.localStorage.setItem("activeCandidateId", candidate.id);
      }
      router.push(`/roles/${candidate.role.id}/board`);
    }
  };

  const handleOpenDossier = (candidate: CandidateRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedForDossier(candidate);
  };

  return (
    <div className="p-6 max-w-full font-sans">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Candidates & Talent Hub</h1>
          <p className="text-[13px] text-slate-500 mt-0.5">Applicant records with AI match scoring and pipeline actions across roles.</p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setBulkModalOpen(true)}
            className="flex items-center gap-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-[13px] font-semibold px-3.5 py-2 rounded-xl transition-colors shadow-2xs cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-[#5e6ad2]" />
            Bulk Intake
          </button>
          <Link
            href="/roles"
            className="flex items-center gap-1.5 bg-[#5e6ad2] hover:bg-[#4f59c0] text-white text-[13px] font-semibold px-3.5 py-2 rounded-xl transition-colors shadow-sm"
          >
            <Briefcase className="w-4 h-4" />
            View Role Pipelines
          </Link>
        </div>
      </div>

      {/* Filter and Query bar */}
      <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-2xs">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search candidate, email, or role..."
              className="text-[12px] text-slate-700 outline-none w-64 placeholder-slate-400 bg-transparent"
            />
          </div>

          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="text-[12px] px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 outline-none hover:bg-slate-50 cursor-pointer shadow-2xs"
          >
            <option value="all">All stages</option>
            <option value="APPLIED">Applied</option>
            <option value="SCREENING">Screening</option>
            <option value="SHORTLISTED">Shortlisted</option>
            <option value="INTERVIEW">Interview</option>
            <option value="OFFER">Offer</option>
            <option value="HIRED">Hired</option>
            <option value="REJECTED">Rejected</option>
          </select>

          <button
            type="button"
            onClick={() => setTopMatchOnly(!topMatchOnly)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-semibold border transition-colors cursor-pointer shadow-2xs ${
              topMatchOnly
                ? "bg-indigo-50 border-indigo-200 text-[#5e6ad2]"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Top Matches (≥80%)
          </button>
        </div>

        <span className="text-xs text-slate-400 font-medium">
          Showing {filtered.length} of {candidates.length} candidates
        </span>
      </div>

      {/* Content Table */}
      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center text-slate-400 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#5e6ad2]" />
          <p className="text-sm font-medium">Loading talent database...</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50/70">
              <tr>
                <th scope="col" className="px-6 py-3.5 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Candidate</th>
                <th scope="col" className="px-6 py-3.5 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Applied Role</th>
                <th scope="col" className="px-6 py-3.5 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">AI Fit Match</th>
                <th scope="col" className="px-6 py-3.5 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Verdict</th>
                <th scope="col" className="px-6 py-3.5 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Stage</th>
                <th scope="col" className="px-6 py-3.5 text-right text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {filtered.map((candidate) => {
                const scoreData = getScorecard(candidate);
                const score = scoreData?.overallMatch ?? scoreData?.score;
                const decisionData = getDecision(candidate);
                const verdict = decisionData?.recommendation;

                return (
                  <tr
                    key={candidate.id}
                    onClick={(e) => handleOpenBoard(candidate, e)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-50 text-[#5e6ad2] border border-indigo-100 flex items-center justify-center font-bold text-xs shrink-0">
                          {candidate.firstName?.[0] || 'C'}{candidate.lastName?.[0] || ''}
                        </div>
                        <div>
                          <div className="text-[13px] font-semibold text-slate-900 group-hover:text-[#5e6ad2] transition-colors">
                            {candidate.firstName} {candidate.lastName}
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                            <Mail className="w-3 h-3 text-slate-400" /> {candidate.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-[12px] font-medium text-slate-800">
                        {candidate.role?.title || 'Open Pipeline'}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {candidate.role?.department || 'Engineering'}
                      </div>
                    </td>

                    {/* AI Fit Match */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {typeof score === 'number' ? (
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                score >= 80 ? 'bg-emerald-500' : score >= 60 ? 'bg-[#5e6ad2]' : 'bg-amber-500'
                              }`}
                              style={{ width: `${score}%` }}
                            />
                          </div>
                          <span className={`text-xs font-bold ${
                            score >= 80 ? 'text-emerald-700' : score >= 60 ? 'text-[#5e6ad2]' : 'text-amber-700'
                          }`}>
                            {score}% Fit
                          </span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">Unscreened</span>
                      )}
                    </td>

                    {/* Verdict */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {verdict ? (
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                          verdict === 'ADVANCE'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : verdict === 'HOLD'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {verdict}
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400">—</span>
                      )}
                    </td>

                    {/* Stage */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold border ${STAGE_COLORS[candidate.stage.toUpperCase()] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                        {candidate.stage}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-[12px] space-x-2">
                      <button
                        type="button"
                        onClick={(e) => handleOpenDossier(candidate, e)}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3 text-amber-500" /> Dossier
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleOpenBoard(candidate, e)}
                        className="inline-flex items-center gap-1 rounded-lg bg-[#5e6ad2] px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-[#4f59c0] transition-colors shadow-2xs cursor-pointer"
                      >
                        Open Board <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-slate-500">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
                      <Users className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-semibold text-slate-700 mb-1">No matching candidates found</p>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
                      Add people directly on a role board or run bulk intake to add resumes.
                    </p>
                    <button
                      type="button"
                      onClick={() => setBulkModalOpen(true)}
                      className="px-4 py-2 bg-[#5e6ad2] text-white text-[13px] font-semibold rounded-xl hover:bg-[#4f59c0] transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" /> Bulk Intake Resumes
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Dossier Modal */}
      {selectedForDossier && (
        <DossierExportModal
          isOpen={!!selectedForDossier}
          onClose={() => setSelectedForDossier(null)}
          roleTitle={selectedForDossier.role?.title}
          candidate={selectedForDossier}
          scorecard={getScorecard(selectedForDossier)}
          interviewAnalysis={getInterviewAnalysis(selectedForDossier)}
          decision={getDecision(selectedForDossier)}
        />
      )}

      {/* Bulk Upload Modal (uses first role or fallback) */}
      <BulkResumeModal
        isOpen={bulkModalOpen}
        onClose={() => setBulkModalOpen(false)}
        roleId={candidates[0]?.role?.id || 'general-role'}
        roleTitle={candidates[0]?.role?.title || 'Active Role'}
        onUploadSuccess={() => {
          fetchCandidates();
        }}
      />
    </div>
  );
}
