import React, { useState, useRef } from 'react';
import {
  FileText, MessageSquare, Award, AlertCircle,
  TrendingUp, Calendar, ChevronRight, Zap, BarChart2,
  Download, Printer, CheckCircle2, XCircle, Target,
  Brain, Lightbulb, ArrowUpRight, Star, Phone,
  RefreshCw, ChevronDown, ChevronUp, BookOpen
} from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useDailyReports, useWeeklyReports, useMonthlyReports } from '../../hooks/useReports';
import { useAuth } from '../../contexts/AuthContext';
import SkeletonCard from '../ui/SkeletonCard';
import ApiError from '../ui/ApiError';

// ──────────────────────────────────────────────────────────────────────────────
// PDF Export Utility
// ──────────────────────────────────────────────────────────────────────────────
const exportToPDF = (report, userName) => {
  const printWindow = window.open('', '_blank');
  const date = report.interview_date
    ? new Date(report.interview_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : `Day ${report.day_number || '?'}`;
  const score = report.scores?.overall ? Math.round(report.scores.overall) : null;
  const strengths = report.strengths || report.scores?.strengths || [];
  const improvements = report.improvements || report.areas_to_improve || [];
  const feedback = report.feedback || report.summary || '';
  const targetRole = report.target_role || 'Target Role';
  const phase = report.phase || 'Depth Phase';

  printWindow.document.write(`
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>AI Ninja Report – ${date}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Georgia', serif; background: #fff; color: #1a1a1a; padding: 60px; max-width: 900px; margin: 0 auto; }
    .header { border-bottom: 3px solid #1a3a5f; padding-bottom: 32px; margin-bottom: 40px; }
    .logo-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
    .logo { font-family: sans-serif; font-size: 22px; font-weight: 900; color: #1a3a5f; letter-spacing: -0.5px; }
    .logo span { color: #c5a059; }
    .report-id { font-family: sans-serif; font-size: 11px; color: #999; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; }
    .report-title { font-size: 32px; font-weight: 700; color: #1a3a5f; margin-bottom: 8px; }
    .report-meta { font-family: sans-serif; font-size: 14px; color: #666; }
    .score-box { display: inline-flex; align-items: center; gap: 16px; background: #1a3a5f; color: white; padding: 20px 32px; border-radius: 16px; margin: 32px 0; }
    .score-num { font-size: 48px; font-weight: 900; font-family: sans-serif; color: #c5a059; line-height: 1; }
    .score-label { font-size: 12px; font-family: sans-serif; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; opacity: 0.7; }
    .score-desc { font-size: 16px; font-family: sans-serif; }
    section { margin-bottom: 36px; }
    h2 { font-family: sans-serif; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; color: #c5a059; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 1px solid #eee; }
    p { line-height: 1.8; color: #333; font-size: 15px; margin-bottom: 12px; }
    ul { padding-left: 0; list-style: none; }
    li { padding: 10px 0; border-bottom: 1px solid #f5f5f5; font-size: 14px; color: #333; font-family: sans-serif; padding-left: 20px; position: relative; line-height: 1.6; }
    li::before { content: '•'; position: absolute; left: 0; color: #c5a059; font-weight: bold; }
    li.green::before { color: #10b981; }
    li.red::before { color: #ef4444; }
    .improvement-box { background: #fffbf0; border-left: 4px solid #c5a059; padding: 20px 24px; border-radius: 0 12px 12px 0; margin-bottom: 16px; }
    .improvement-box h3 { font-family: sans-serif; font-size: 14px; font-weight: 800; color: #92400e; margin-bottom: 8px; }
    .improvement-box p { font-size: 14px; color: #78350f; margin: 0; }
    .action-box { background: #f0f9ff; border-left: 4px solid #1a3a5f; padding: 20px 24px; border-radius: 0 12px 12px 0; margin-bottom: 16px; }
    .action-box h3 { font-family: sans-serif; font-size: 14px; font-weight: 800; color: #1e3a5f; margin-bottom: 8px; }
    .action-box p { font-size: 14px; color: #1e40af; margin: 0; }
    .score-breakdown { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 16px; }
    .score-item { background: #f8fafc; border-radius: 12px; padding: 16px; text-align: center; }
    .score-item .val { font-family: sans-serif; font-size: 28px; font-weight: 900; color: #1a3a5f; }
    .score-item .lbl { font-family: sans-serif; font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin-top: 4px; }
    .footer { margin-top: 60px; padding-top: 24px; border-top: 1px solid #eee; text-align: center; font-family: sans-serif; font-size: 12px; color: #999; }
    @media print { body { padding: 40px; } }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo-row">
      <div class="logo">job<span>Ninjas</span>.ai</div>
      <div class="report-id">AI Ninja Performance Report • Confidential</div>
    </div>
    <div class="report-title">Session Analysis Report</div>
    <div class="report-meta">${date} &nbsp;|&nbsp; ${targetRole} &nbsp;|&nbsp; ${phase} &nbsp;|&nbsp; ${userName || 'Ninja'}</div>
  </div>

  <div class="score-box">
    <div>
      <div class="score-label">Overall Score</div>
      <div class="score-num">${score !== null ? score + '%' : 'N/A'}</div>
    </div>
    <div>
      <div class="score-desc">${score >= 85 ? '🏆 Elite Performance' : score >= 70 ? '📈 Strong Progress' : score >= 55 ? '📊 Developing Skills' : '🎯 Building Foundation'}</div>
    </div>
  </div>

  ${report.scores && (report.scores.communication || report.scores.technical || report.scores.structure) ? `
  <section>
    <h2>Score Breakdown</h2>
    <div class="score-breakdown">
      <div class="score-item"><div class="val">${Math.round(report.scores.communication || 0)}%</div><div class="lbl">Communication</div></div>
      <div class="score-item"><div class="val">${Math.round(report.scores.technical || 0)}%</div><div class="lbl">Technical Depth</div></div>
      <div class="score-item"><div class="val">${Math.round(report.scores.structure || 0)}%</div><div class="lbl">Structure</div></div>
    </div>
  </section>` : ''}

  <section>
    <h2>AI Analysis & Coaching Feedback</h2>
    <p>${feedback || 'Your AI Ninja coach analyzed this session and prepared detailed feedback to accelerate your interview readiness. Complete more sessions to unlock richer insights.'}</p>
    ${report.ai_coaching_notes ? `<p>${report.ai_coaching_notes}</p>` : `
    <p>Based on your performance in this session, our AI has identified specific patterns in your response structure, technical depth, and communication clarity. The recommendations below are tailored to your ${targetRole} target role.</p>`}
  </section>

  ${strengths.length > 0 ? `
  <section>
    <h2>Strengths Demonstrated</h2>
    <ul>${strengths.map(s => `<li class="green">${typeof s === 'string' ? s : s.skill || s.area || JSON.stringify(s)}</li>`).join('')}</ul>
  </section>` : ''}

  <section>
    <h2>Areas for Improvement</h2>
    ${improvements.length > 0
      ? improvements.map(imp => {
          const text = typeof imp === 'string' ? imp : imp.area || imp.skill || JSON.stringify(imp);
          return `<div class="improvement-box"><h3>Focus Area</h3><p>${text}</p></div>`;
        }).join('')
      : `
    <div class="improvement-box">
      <h3>Depth of Technical Responses</h3>
      <p>Push beyond surface-level answers. For ${targetRole} interviews, interviewers expect you to discuss trade-offs, system constraints, and real-world implications of your architectural decisions.</p>
    </div>
    <div class="improvement-box">
      <h3>Structured Communication (STAR Method)</h3>
      <p>Use the Situation-Task-Action-Result framework consistently. This structure makes your responses 40% more memorable and shows clear problem-solving thinking to interviewers.</p>
    </div>
    <div class="improvement-box">
      <h3>Quantifying Impact</h3>
      <p>Back every achievement with data. Instead of "I improved performance," say "I reduced API latency by 67% serving 2M+ daily requests." Numbers create credibility.</p>
    </div>`}
  </section>

  <section>
    <h2>Action Plan for Next Session</h2>
    <div class="action-box">
      <h3>📚 Recommended Practice</h3>
      <p>Before your next AI Ninja call, review system design fundamentals for ${targetRole} and practice 2-3 behavioral stories using the STAR method. Focus on quantifying outcomes.</p>
    </div>
    <div class="action-box">
      <h3>🎯 Session Goal</h3>
      <p>Aim to improve your communication score by 5-10 points by incorporating more specific technical examples and concluding each answer with a clear, measurable result.</p>
    </div>
    <div class="action-box">
      <h3>🔁 Review This Report</h3>
      <p>Read this report within 2 hours of your session. Research shows that reviewing AI feedback immediately leads to 40% faster skill improvement in subsequent interviews.</p>
    </div>
  </section>

  <div class="footer">
    Generated by jobNinjas.ai AI Ninja System &nbsp;•&nbsp; ${new Date().toLocaleDateString()} &nbsp;•&nbsp; Confidential – For Personal Use Only
  </div>
</body>
</html>`);
  printWindow.document.close();
  setTimeout(() => printWindow.print(), 500);
};

// ──────────────────────────────────────────────────────────────────────────────
// Main Component
// ──────────────────────────────────────────────────────────────────────────────
const TABS = [
  { key: 'daily',   label: 'Session Reports', icon: <Phone size={16} /> },
  { key: 'weekly',  label: 'Weekly Digest',   icon: <TrendingUp size={16} /> },
  { key: 'monthly', label: 'Monthly Summary', icon: <BarChart2 size={16} /> },
];

const NinjaReports = () => {
  const [activeTab, setActiveTab] = useState('daily');
  const { user } = useAuth();

  const daily   = useDailyReports();
  const weekly  = useWeeklyReports();
  const monthly = useMonthlyReports();

  const activeQuery = activeTab === 'daily' ? daily : activeTab === 'weekly' ? weekly : monthly;
  const { data, isLoading, isError, error, refetch } = activeQuery;

  const reports = Array.isArray(data) ? data : [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">

      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <Badge className="bg-slate-900/5 text-slate-600 border-none font-bold uppercase tracking-widest text-[10px]">
            PERFORMANCE INTELLIGENCE
          </Badge>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">
            AI Ninja Reports
          </h2>
          <p className="text-slate-500 font-medium max-w-xl">
            Every call generates a full coaching report with personalized AI feedback, score breakdowns, and a concrete action plan to level up.
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <div className="bg-blue-50 border border-blue-100 rounded-2xl px-4 py-2 text-blue-700 text-sm font-bold flex items-center gap-2">
            <FileText size={15} />
            {reports.length} Report{reports.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* ── Tab Switcher ── */}
      <div className="flex gap-2 flex-wrap">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all border-2 ${
              activeTab === tab.key
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Loading ── */}
      {isLoading && (
        <div className="space-y-6">
          {[1, 2, 3].map(i => <SkeletonCard key={i} lines={4} />)}
        </div>
      )}

      {/* ── Error ── */}
      {isError && <ApiError error={error} retry={refetch} />}

      {/* ── Content ── */}
      {!isLoading && !isError && (
        <div className="grid lg:grid-cols-3 gap-8">

          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            {activeTab === 'daily' && (
              reports.length > 0
                ? reports.map((item, i) => (
                    <SessionReportCard
                      key={item.id || i}
                      item={item}
                      index={i}
                      userName={user?.name || user?.email}
                    />
                  ))
                : <EmptyState
                    icon={<Phone size={40} className="text-slate-200" />}
                    title="No Call Reports Yet"
                    message="Your first AI Ninja call report will appear here after your session is completed. Each call generates a full PDF coaching report with personalized feedback."
                    cta="Start your first session from the Dashboard →"
                    ctaLink="/ai-ninja/dashboard"
                  />
            )}

            {activeTab === 'weekly' && (
              reports.length > 0
                ? reports.map((item, i) => (
                    <WeeklyDigestCard key={item.id || i} item={item} index={i} userName={user?.name} />
                  ))
                : <EmptyState
                    icon={<TrendingUp size={40} className="text-slate-200" />}
                    title="No Weekly Digest Yet"
                    message="Weekly summaries appear after you complete your first full week of AI Ninja calls. They roll up all your session scores into a strategic overview."
                  />
            )}

            {activeTab === 'monthly' && (
              reports.length > 0
                ? reports.map((item, i) => (
                    <MonthlySummaryCard key={item.id || i} item={item} index={i} />
                  ))
                : <EmptyState
                    icon={<BarChart2 size={40} className="text-slate-200" />}
                    title="No Monthly Report Yet"
                    message="Monthly performance summaries will be generated after your first complete month of training. Keep your streak going!"
                  />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Coach Panel */}
            <Card className="p-6 bg-slate-900 text-white rounded-[28px] overflow-hidden relative">
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl" />
              <div className="relative z-10 space-y-4">
                <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <Brain size={20} className="text-blue-400" />
                </div>
                <Badge className="bg-blue-500 text-white border-none font-black px-3 py-1 text-[10px] uppercase tracking-wider">
                  AI Coach Insight
                </Badge>
                <h4 className="text-xl font-bold">
                  {reports.length > 0
                    ? `${reports.length} sessions analyzed`
                    : 'Your coach is ready'}
                </h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {reports.length > 0
                    ? 'Each report is generated by your personal AI coach. Click "Export PDF" on any report to download a formatted coaching document.'
                    : 'Complete your first AI Ninja call to receive a personalized coaching report with detailed feedback on your communication, technical depth, and structure.'}
                </p>
              </div>
            </Card>

            {/* How Reports Work */}
            <Card className="p-6 border-slate-100 rounded-[28px] space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
                  <Lightbulb size={18} />
                </div>
                <h4 className="font-bold text-slate-900">How Reports Work</h4>
              </div>
              {[
                { icon: <Phone size={14} />, text: 'Complete an AI Ninja call session' },
                { icon: <Brain size={14} />, text: 'AI analyzes your responses in real-time' },
                { icon: <FileText size={14} />, text: 'Full coaching report is generated' },
                { icon: <Download size={14} />, text: 'Export any report as a PDF' },
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-slate-600">
                  <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 flex-shrink-0">
                    {step.icon}
                  </div>
                  {step.text}
                </div>
              ))}
            </Card>

            {/* Improvement Tips */}
            <Card className="p-6 border-amber-100 bg-amber-50/30 rounded-[28px] space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <AlertCircle size={16} className="text-amber-600" />
                <h4 className="font-bold text-amber-900 text-sm">Pro Tip</h4>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Review your report within 2 hours of your session. Studies show that reviewing AI feedback immediately leads to <strong>40% faster skill improvement</strong> in subsequent interviews.
              </p>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

// ──────────────────────────────────────────────────────────────────────────────
// Session Report Card (expandable, with PDF export)
// ──────────────────────────────────────────────────────────────────────────────
const SessionReportCard = ({ item, index, userName }) => {
  const [expanded, setExpanded] = useState(index === 0); // first report open by default
  const score = item.scores?.overall ? Math.round(item.scores.overall) : null;
  const strengths = item.strengths || item.scores?.strengths || [];
  const improvements = item.improvements || item.areas_to_improve || [];
  const feedback = item.feedback || item.summary || '';
  const date = item.interview_date
    ? new Date(item.interview_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    : `Day ${item.day_number || index + 1}`;

  const scoreColor = score >= 85 ? 'text-emerald-600' : score >= 70 ? 'text-blue-600' : score >= 55 ? 'text-amber-600' : 'text-red-500';
  const scoreBg = score >= 85 ? 'bg-emerald-50 border-emerald-200' : score >= 70 ? 'bg-blue-50 border-blue-200' : 'bg-amber-50 border-amber-200';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
    >
      <Card className="border-slate-100 rounded-[28px] overflow-hidden hover:border-blue-200 transition-all shadow-sm hover:shadow-md">

        {/* Card Header */}
        <div
          className="p-6 cursor-pointer flex items-start justify-between gap-4"
          onClick={() => setExpanded(v => !v)}
        >
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center font-black text-sm flex-shrink-0 ${scoreBg} ${scoreColor}`}>
              {score !== null ? `${score}%` : '—'}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{date}</span>
                {item.phase && (
                  <Badge className="bg-slate-100 border-none text-slate-500 font-bold text-[10px] uppercase">
                    {item.phase}
                  </Badge>
                )}
                {item.target_role && (
                  <Badge className="bg-blue-50 border-none text-blue-600 font-bold text-[10px]">
                    {item.target_role}
                  </Badge>
                )}
              </div>
              <h4 className="text-lg font-black text-slate-900">
                {item.title || `Session ${item.day_number || index + 1} – AI Ninja Coaching Report`}
              </h4>
              <p className="text-sm text-slate-500 font-medium line-clamp-1">
                {feedback || 'Click to view your full AI coaching analysis.'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              className="rounded-xl font-bold text-slate-400 hover:text-blue-600 hover:bg-blue-50 gap-1"
              onClick={e => { e.stopPropagation(); exportToPDF(item, userName); }}
            >
              <Download size={14} /> PDF
            </Button>
            <div className="text-slate-300">
              {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </div>
          </div>
        </div>

        {/* Expanded Content */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6 space-y-6 border-t border-slate-100 pt-6">

                {/* Score Breakdown */}
                {item.scores && (item.scores.communication || item.scores.technical || item.scores.structure) && (
                  <div>
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Score Breakdown</p>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: 'Communication', value: item.scores.communication },
                        { label: 'Technical Depth', value: item.scores.technical },
                        { label: 'Structure', value: item.scores.structure },
                      ].map(s => s.value !== undefined && (
                        <div key={s.label} className="bg-slate-50 rounded-2xl p-4 text-center border border-slate-100">
                          <div className="text-2xl font-black text-slate-900">{Math.round(s.value)}%</div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">{s.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI Feedback */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Brain size={16} className="text-blue-500" />
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">AI Coaching Analysis</p>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                    <p className="text-slate-700 text-sm leading-relaxed">
                      {feedback || 'Your AI Ninja coach analyzed your session responses and communication patterns. Keep completing sessions to receive richer, more personalized feedback on your specific strengths and areas for growth.'}
                    </p>
                    {item.ai_coaching_notes && (
                      <p className="text-slate-600 text-sm leading-relaxed mt-3 pt-3 border-t border-slate-200">
                        {item.ai_coaching_notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Strengths */}
                {strengths.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle2 size={16} className="text-emerald-500" />
                      <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Strengths Demonstrated</p>
                    </div>
                    <div className="space-y-2">
                      {strengths.map((s, i) => (
                        <div key={i} className="flex items-start gap-3 bg-emerald-50 rounded-xl p-3 border border-emerald-100">
                          <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-emerald-800 font-medium">{typeof s === 'string' ? s : s.skill || s.area || ''}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Improvement Areas */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Target size={16} className="text-amber-500" />
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Focus Areas & Improvement Plan</p>
                  </div>
                  <div className="space-y-3">
                    {improvements.length > 0 ? improvements.map((imp, i) => {
                      const text = typeof imp === 'string' ? imp : imp.area || imp.skill || '';
                      return (
                        <div key={i} className="bg-amber-50 border-l-4 border-amber-400 rounded-r-2xl p-4">
                          <p className="text-sm text-amber-900 font-medium leading-relaxed">{text}</p>
                        </div>
                      );
                    }) : (
                      <>
                        <ImprovementItem
                          title="Deepen Technical Responses"
                          desc={`For a ${item.target_role || 'senior'} role, go beyond surface-level answers. Discuss trade-offs, constraints, and real-world edge cases that show system-level thinking.`}
                        />
                        <ImprovementItem
                          title="Quantify Every Achievement"
                          desc='Replace vague claims with measurable outcomes. "I improved performance by 67%, reducing p99 latency from 800ms to 270ms serving 2M daily requests" creates far more credibility.'
                        />
                        <ImprovementItem
                          title="Use the STAR Framework Consistently"
                          desc="Structure behavioral answers as: Situation → Task → Action → Result. This format makes responses 40% more memorable and clearly demonstrates problem-solving ability."
                        />
                      </>
                    )}
                  </div>
                </div>

                {/* Action Plan */}
                <div className="bg-[#1a3a5f] rounded-2xl p-5 text-white">
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb size={16} className="text-[#c5a059]" />
                    <p className="text-[11px] font-black text-white/60 uppercase tracking-widest">Next Session Action Plan</p>
                  </div>
                  <div className="space-y-2">
                    {[
                      'Review this report within 2 hours for maximum retention',
                      'Practice 2-3 STAR behavioral stories before your next call',
                      `Research current trends in ${item.target_role || 'your target'} to reference in responses`,
                      'Record yourself answering a mock question and compare to AI feedback patterns',
                    ].map((action, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-white/80">
                        <span className="text-[#c5a059] font-bold flex-shrink-0">{i + 1}.</span>
                        {action}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Export Button */}
                <div className="flex justify-end">
                  <Button
                    onClick={() => exportToPDF(item, userName)}
                    className="rounded-xl bg-slate-900 text-white font-bold gap-2 hover:bg-slate-800"
                  >
                    <Download size={15} />
                    Export Full PDF Report
                  </Button>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};

// ──────────────────────────────────────────────────────────────────────────────
// Sub-components
// ──────────────────────────────────────────────────────────────────────────────
const ImprovementItem = ({ title, desc }) => (
  <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-2xl p-4 space-y-1">
    <p className="text-sm font-bold text-amber-900">{title}</p>
    <p className="text-sm text-amber-800 leading-relaxed">{desc}</p>
  </div>
);

const WeeklyDigestCard = ({ item, index, userName }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.06 }}
  >
    <Card className="p-6 border-slate-100 rounded-[28px] hover:border-blue-200 transition-all shadow-sm space-y-5">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <Badge className="bg-blue-50 text-blue-600 border-none font-bold text-[10px] uppercase">
            Week of {item.week_start ? new Date(item.week_start).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}
          </Badge>
          <h4 className="text-xl font-black text-slate-900">{item.title || item.narrative_title || 'Weekly Digest'}</h4>
        </div>
        <div className="text-right">
          <div className="text-2xl font-black text-blue-600">{item.avg_score ? `${Math.round(item.avg_score)}%` : '—'}</div>
          <div className="text-[10px] font-bold text-slate-400 uppercase">Avg Score</div>
        </div>
      </div>
      <p className="text-sm text-slate-600 leading-relaxed">{item.summary || item.narrative || 'Your weekly summary is being compiled from your session data.'}</p>
      {item.sessions_count && (
        <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
          <Phone size={14} className="text-slate-400" />
          {item.sessions_count} session{item.sessions_count !== 1 ? 's' : ''} completed this week
        </div>
      )}
      <Button
        onClick={() => {
          const win = window.open('', '_blank');
          win.document.write(`<pre>${JSON.stringify(item, null, 2)}</pre>`);
          win.print();
        }}
        variant="outline"
        className="rounded-xl font-bold gap-2 text-sm"
      >
        <Download size={14} /> Export Weekly PDF
      </Button>
    </Card>
  </motion.div>
);

const MonthlySummaryCard = ({ item, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.06 }}
  >
    <Card className="p-6 border-slate-100 rounded-[28px] hover:border-blue-200 transition-all shadow-sm space-y-4">
      <div className="flex justify-between items-start">
        <Badge className="bg-emerald-50 text-emerald-600 border-none font-bold text-[10px] uppercase">
          {item.month ? new Date(item.year, item.month - 1).toLocaleString('default', { month: 'long', year: 'numeric' }) : 'Monthly Report'}
        </Badge>
        <span className="text-2xl font-black text-emerald-600">{item.avg_score ? `${Math.round(item.avg_score)}%` : '—'}</span>
      </div>
      <h4 className="text-xl font-black text-slate-900">{item.title || 'Monthly Performance Summary'}</h4>
      <p className="text-sm text-slate-500 leading-relaxed">{item.summary || 'Your monthly summary will be generated at the end of the month, rolling up all session scores into a strategic performance overview.'}</p>
    </Card>
  </motion.div>
);

const EmptyState = ({ icon, title, message, cta, ctaLink }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <Card className="p-16 border-slate-100 rounded-[32px] text-center space-y-4">
      <div className="flex justify-center">{icon}</div>
      <h3 className="text-xl font-black text-slate-700">{title}</h3>
      <p className="text-slate-400 font-medium max-w-md mx-auto leading-relaxed">{message}</p>
      {cta && ctaLink && (
        <a href={ctaLink} className="inline-block mt-2 text-blue-600 font-bold text-sm hover:underline">
          {cta}
        </a>
      )}
    </Card>
  </motion.div>
);

export default NinjaReports;
