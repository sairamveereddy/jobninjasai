import React, { useState } from 'react';
import {
  FileText, MessageSquare, Award, AlertCircle,
  TrendingUp, Calendar, ChevronRight, Zap, BarChart2,
  Download, Printer, CheckCircle2, XCircle, Target,
  Brain, Lightbulb, ArrowUpRight, Star, Phone,
  RefreshCw, ChevronDown, ChevronUp, BookOpen, Quote, Check
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
// PDF Export Utility (Linear Aesthetic)
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
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; background: #ffffff; color: var(--text-main); padding: 60px; max-width: 900px; margin: 0 auto; line-height: 1.6; }
    .header { border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 40px; margin-bottom: 40px; position: relative; }
    .logo-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
    .logo { font-size: 20px; font-weight: 600; color: #fff; letter-spacing: -0.5px; }
    .logo span { color: var(--jobninjas-accent); }
    .report-id { font-size: 9px; color: #707277; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; }
    .report-title { font-size: 36px; font-weight: 600; color: #fff; letter-spacing: -1.5px; line-height: 1.1; margin-bottom: 12px; }
    .report-meta { font-size: 13px; color: #707277; font-weight: 400; }
    
    .score-container { display: flex; gap: 24px; align-items: stretch; margin: 40px 0; }
    .score-box { background: #111214; border: 1px solid rgba(255,255,255,0.05); color: white; padding: 32px; border-radius: 20px; min-width: 180px; text-align: center; }
    .score-num { font-size: 52px; font-weight: 600; color: var(--jobninjas-accent); line-height: 1; margin-bottom: 4px; }
    .score-label { font-size: 9px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px; color: #707277; }
    
    .insight-box { flex: 1; background: #111214; border-radius: 20px; padding: 32px; border: 1px solid rgba(255,255,255,0.05); }
    .insight-badge { display: inline-block; background: rgba(94,106,210,0.06); color: var(--jobninjas-accent); padding: 4px 10px; border-radius: 6px; font-size: 9px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; border: 1px solid rgba(94,106,210,0.2); }
    .insight-text { font-size: 15px; font-weight: 400; color: #b1b3b8; }

    section { margin-bottom: 48px; }
    h2 { font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; color: #707277; margin-bottom: 20px; display: flex; align-items: center; gap: 12px; }
    h2::after { content: ''; flex: 1; height: 1px; background: rgba(255,255,255,0.05); }
    
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
    .card { background: #111214; border: 1px solid rgba(255,255,255,0.05); padding: 24px; border-radius: 20px; }
    
    .strength-item { display: flex; align-items: center; gap: 12px; background: rgba(16,185,129,0.05); border-radius: 12px; padding: 14px; margin-bottom: 10px; border: 1px solid rgba(16,185,129,0.1); }
    .strength-icon { color: #10b981; font-weight: 700; }
    .strength-text { font-size: 13px; color: #fff; font-weight: 400; }

    .improvement-item { border-left: 3px solid var(--jobninjas-accent); background: rgba(94,106,210,0.05); border-radius: 0 12px 12px 0; padding: 18px; margin-bottom: 12px; border: 1px solid rgba(255,255,255,0.02); border-left-width: 3px; }
    .improvement-title { font-size: 13px; font-weight: 600; color: #fff; margin-bottom: 4px; }
    .improvement-text { font-size: 13px; color: #b1b3b8; font-weight: 400; }

    .footer { margin-top: 80px; padding-top: 40px; border-top: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: space-between; align-items: center; color: #707277; font-size: 9px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }
    
    @media print { body { padding: 40px; background: #000; } .score-box, .insight-box, .card, .strength-item, .improvement-item { background: #111214 !important; } }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo-row">
      <div class="logo">Job<span>Ninjas</span>.ai</div>
      <div class="report-id">PROTOCOL ID: #${Math.random().toString(36).substr(2, 9).toUpperCase()}</div>
    </div>
    <div class="report-title">Combat Performance Analysis</div>
    <div class="report-meta">Mission Date: ${date} &nbsp;•&nbsp; Target: ${targetRole} &nbsp;•&nbsp; Phase: ${phase}</div>
  </div>

  <div class="score-container">
    <div class="score-box">
      <div class="score-num">${score !== null ? score : '—'}</div>
      <div class="score-label">Readiness Score</div>
    </div>
    <div class="insight-box">
      <div class="insight-badge">Tactical Assessment</div>
      <div class="insight-text">
        ${score >= 85 ? 'Exceptional mastery demonstrated. Your technical depth and communication clarity are in the elite percentile for this target role.' : 
          score >= 70 ? 'Strong baseline performance. You are effectively communicating complex concepts, with minor optimizations needed in structural consistency.' : 
          score >= 55 ? 'Operational efficiency is improving. Focus on quantifying results and deepening technical explanations to reach senior parity.' : 
          'Initial calibration complete. Focus on core architectural patterns and fundamental communication frameworks to build momentum.'}
      </div>
    </div>
  </div>

  <section>
    <h2>AI Coaching Summary</h2>
    <p style="font-size: 15px; color: #b1b3b8; font-weight: 300; line-height: 1.8;">${feedback || 'System analysis complete. Your performance data has been synchronized with your development roadmap.'}</p>
  </section>

  <div class="grid">
    <section>
      <h2>Core Strengths</h2>
      ${strengths.length > 0 ? strengths.map(s => `
        <div class="strength-item">
          <div class="strength-icon">✓</div>
          <div class="strength-text">${typeof s === 'string' ? s : s.skill || s.area}</div>
        </div>
      `).join('') : `
        <div class="strength-item"><div class="strength-icon">✓</div><div class="strength-text">Adaptive Communication</div></div>
        <div class="strength-item"><div class="strength-icon">✓</div><div class="strength-text">Problem-Solving Logic</div></div>
      `}
    </section>

    <section>
      <h2>Growth Vectors</h2>
      ${improvements.length > 0 ? improvements.map(imp => {
          const title = typeof imp === 'string' ? 'Optimization Focus' : (imp.area || imp.skill || 'System Growth');
          const text = typeof imp === 'string' ? imp : (imp.description || imp.area);
          return `
            <div class="improvement-item">
              <div class="improvement-title">${title}</div>
              <div class="improvement-text">${text}</div>
            </div>
          `;
        }).join('') : `
        <div class="improvement-item"><div class="improvement-title">Technical Depth</div><div class="improvement-text">Discuss trade-offs and edge cases more explicitly.</div></div>
        <div class="improvement-item"><div class="improvement-title">Quantifiable Impact</div><div class="improvement-text">Use more specific data points in your results.</div></div>
      `}
    </section>
  </div>

  <div class="footer">
    <div>Generated by JobNinjas.ai &nbsp;•&nbsp; Internal Intelligence</div>
    <div>${new Date().toLocaleDateString()} &nbsp;•&nbsp; Page 01</div>
  </div>
</body>
</html>`);
  printWindow.document.close();
  setTimeout(() => printWindow.print(), 500);
};

// ──────────────────────────────────────────────────────────────────────────────
// Sub-components
// ──────────────────────────────────────────────────────────────────────────────
const ImprovementItem = ({ title, desc }) => (
  <div className="bg-[var(--jobninjas-accent)]/5 border-l-2 border-[var(--jobninjas-accent)] rounded-r-xl p-3 space-y-1">
    <p className="text-xs font-medium text-[var(--text-main)]">{title}</p>
    <p className="text-[11px] text-[#5c5c7a] leading-relaxed">{desc}</p>
  </div>
);

const SessionReportCard = ({ item, index, userName }) => {
  const [expanded, setExpanded] = useState(index === 0);
  const score = item.scores?.overall ? Math.round(item.scores.overall) : null;
  const strengths = item.strengths || item.scores?.strengths || [];
  const improvements = item.improvements || item.areas_to_improve || [];
  const feedback = item.feedback || item.summary || '';
  const date = item.interview_date
    ? new Date(item.interview_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    : `Day ${item.day_number || index + 1}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className={`border-black/5 rounded-2xl overflow-hidden transition-all duration-300 group ${expanded ? 'bg-[#eeeafc] shadow-xl border-[var(--jobninjas-accent)]/20' : 'bg-[#eeeafc]/50 hover:bg-[#eeeafc]'}`}>

        {/* Card Header */}
        <div
          className="p-6 cursor-pointer flex items-center justify-between gap-6"
          onClick={() => setExpanded(v => !v)}
        >
          <div className="flex items-center gap-6">
            <div className={`w-14 h-14 rounded-xl border border-black/10 flex flex-col items-center justify-center flex-shrink-0 bg-[#e8e3f8] transition-transform duration-300 group-hover:scale-105`}>
                <span className="text-xl font-medium text-[var(--jobninjas-accent)] leading-none">{score !== null ? score : '—'}</span>
                <span className="text-[8px] font-medium text-[#5c5c7a] uppercase tracking-widest mt-1">SCORE</span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-[10px] font-medium text-[#5c5c7a] uppercase tracking-wider">{date}</span>
                {item.phase && (
                  <Badge className="bg-[#e8e3f8] border border-black/5 text-[#5c5c7a] font-medium text-[9px] px-2 py-0.5 uppercase tracking-tight">
                    {item.phase}
                  </Badge>
                )}
              </div>
              <h4 className="text-lg font-medium text-[var(--text-main)] tracking-tight">
                {item.title || `Tactical Analysis ${item.day_number || index + 1}`}
              </h4>
              {!expanded && (
                <p className="text-xs text-[#5c5c7a] font-light line-clamp-1 max-w-lg">
                  {feedback || 'Expand to view full performance intel.'}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              className="hidden sm:flex rounded-lg font-medium text-[10px] text-[#5c5c7a] hover:text-[var(--jobninjas-accent)] hover:bg-[var(--jobninjas-accent)]/10 gap-2 uppercase tracking-wider px-3 h-8 border border-transparent hover:border-[var(--jobninjas-accent)]/20 transition-all"
              onClick={e => { e.stopPropagation(); exportToPDF(item, userName); }}
            >
              <Download size={14} /> PDF
            </Button>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${expanded ? 'bg-[var(--jobninjas-accent)] text-white rotate-180' : 'bg-[#e8e3f8] text-[#5c5c7a]'}`}>
               <ChevronDown size={16} />
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
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6 space-y-8 border-t border-black/5 pt-8">

                {/* Score Breakdown */}
                {item.scores && (item.scores.communication || item.scores.technical || item.scores.structure) && (
                  <div className="space-y-4">
                    <p className="text-[10px] font-medium text-[#5c5c7a] uppercase tracking-widest">PERFORMANCE VECTORS</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {[
                        { label: 'Communication', value: item.scores.communication, color: 'var(--jobninjas-accent)' },
                        { label: 'Technical', value: item.scores.technical, color: '#8b5cf6' },
                        { label: 'Structure', value: item.scores.structure, color: '#10b981' },
                      ].map(s => s.value !== undefined && (
                        <div key={s.label} className={`bg-[#eeeafc] rounded-xl p-5 border border-black/5 relative group/stat hover:border-black/10 transition-colors`}>
                          <div className="text-2xl font-medium text-[var(--text-main)] tracking-tight">{Math.round(s.value)}%</div>
                          <div className="text-[10px] font-medium text-[#5c5c7a] uppercase tracking-wider mt-1">{s.label}</div>
                          <div className="w-full bg-[#e8e3f8] h-1 rounded-full mt-4 overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${s.value}%` }}
                                transition={{ duration: 0.8 }}
                                className="h-full" 
                                style={{ backgroundColor: s.color }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI tactical feedback */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[var(--jobninjas-accent)]/10 rounded-lg flex items-center justify-center text-[var(--jobninjas-accent)]">
                      <Brain size={16} />
                    </div>
                    <p className="text-[10px] font-medium text-[#5c5c7a] uppercase tracking-widest">TACTICAL COACHING</p>
                  </div>
                  <div className="bg-[#eeeafc] rounded-2xl p-6 border border-black/5 relative overflow-hidden group/feedback">
                    <Quote size={32} className="absolute -top-3 -right-3 text-[var(--text-main)]/5 group-hover/feedback:text-[var(--jobninjas-accent)]/10 transition-colors" />
                    <p className="text-[#5c5c7a] text-base leading-relaxed font-light relative z-10">
                      {feedback || 'Analysis in progress...'}
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Strengths */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-500">
                                <CheckCircle2 size={16} />
                            </div>
                            <p className="text-[10px] font-medium text-[#5c5c7a] uppercase tracking-widest">STRENGTHS</p>
                        </div>
                        <div className="space-y-2">
                        {(strengths.length > 0 ? strengths : ['Conceptual clarity', 'Professional presence']).map((s, i) => (
                            <div key={i} className="flex items-center gap-3 bg-emerald-500/[0.02] rounded-xl p-3 border border-emerald-500/10 group/item transition-colors hover:bg-emerald-500/5">
                            <div className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-500 flex items-center justify-center flex-shrink-0">
                                <Check size={12} strokeWidth={3} />
                            </div>
                            <span className="text-xs text-[var(--text-main)] font-light">{typeof s === 'string' ? s : s.skill || s.area || ''}</span>
                            </div>
                        ))}
                        </div>
                    </div>

                    {/* Improvements */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-[var(--jobninjas-accent)]/10 rounded-lg flex items-center justify-center text-[var(--jobninjas-accent)]">
                                <Target size={16} />
                            </div>
                            <p className="text-[10px] font-medium text-[#5c5c7a] uppercase tracking-widest">GROWTH AREAS</p>
                        </div>
                        <div className="space-y-2">
                        {improvements.length > 0 ? improvements.map((imp, i) => {
                          const text = typeof imp === 'string' ? imp : imp.area || imp.skill || '';
                          return (
                              <div key={i} className="bg-[#eeeafc] border border-black/5 rounded-xl p-3 hover:border-[var(--jobninjas-accent)]/30 transition-colors">
                                  <p className="text-xs text-[#5c5c7a] font-light leading-relaxed">{text}</p>
                              </div>
                          );
                        }) : (
                        <>
                            <ImprovementItem title="Quantify Impact" desc="Use specific metrics to define success." />
                            <ImprovementItem title="Narrative Structure" desc="Follow the STAR framework more strictly." />
                        </>
                        )}
                        </div>
                    </div>
                </div>

                {/* Post-Session Plan */}
                <Card className="bg-gradient-to-br from-[#eeeafc] to-white rounded-2xl p-6 border border-black/5 text-[var(--text-main)] relative overflow-hidden shadow-xl">
                  <div className="absolute -top-16 -right-16 w-48 h-48 bg-[var(--jobninjas-accent)]/5 rounded-full blur-[60px]" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-[var(--jobninjas-accent)]/10 rounded-xl flex items-center justify-center text-[var(--jobninjas-accent)] border border-[var(--jobninjas-accent)]/20">
                            <Zap size={18} />
                        </div>
                        <div>
                            <h5 className="text-base font-medium tracking-tight">Growth Protocol</h5>
                            <p className="text-[#5c5c7a] text-[9px] font-medium uppercase tracking-wider">NEXT ACTIONS</p>
                        </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                        {[
                          { title: 'Immediate Review', desc: 'Read coaching notes within 1 hour while fresh.' },
                          { title: 'Refactor Stories', desc: 'Identify one story and rewrite it with feedback.' },
                          { title: 'Technical Drill', desc: 'Deep dive into the architecture patterns discussed.' },
                          { title: 'Schedule Iterate', desc: 'Book next session to apply improvements.' },
                        ].map((action, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 bg-[#e8e3f8] rounded-xl border border-black/5 hover:bg-[#e8e3f8] transition-colors">
                            <div className="w-6 h-6 rounded-md bg-[var(--jobninjas-accent)]/20 text-[var(--jobninjas-accent)] flex items-center justify-center font-medium text-[10px] flex-shrink-0">
                                {i + 1}
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-xs font-medium text-[var(--text-main)]">{action.title}</p>
                                <p className="text-[10px] text-[#5c5c7a] leading-relaxed">{action.desc}</p>
                            </div>
                        </div>
                        ))}
                    </div>
                  </div>
                </Card>

                {/* Footer Export */}
                <div className="flex justify-between items-center bg-[#faf9ff]/[0.01] -mx-6 -mb-6 px-6 py-4 border-t border-black/5">
                  <div className="flex items-center gap-2 text-[#5c5c7a] text-[10px] font-medium uppercase tracking-wider">
                    <FileText size={12} />
                    SYSTEM GENERATED REPORT
                  </div>
                  <Button
                    onClick={() => exportToPDF(item, userName)}
                    className="btn-premium-primary h-9 px-6 rounded-lg font-medium text-[10px] uppercase tracking-wider gap-2"
                  >
                    <Download size={14} /> EXPORT PDF
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

const WeeklyDigestCard = ({ item, index, userName }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05 }}
  >
    <Card className="p-8 bg-[#eeeafc] border border-black/5 rounded-2xl shadow-xl space-y-6 group">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <Badge className="bg-[var(--jobninjas-accent)]/10 text-[var(--jobninjas-accent)] border border-[var(--jobninjas-accent)]/20 font-medium text-[9px] px-2 py-0.5 uppercase tracking-wider">
            WEEKLY DIGEST
          </Badge>
          <div className="text-[10px] font-medium text-[#5c5c7a] uppercase tracking-wider">
            Week of {item.week_start ? new Date(item.week_start).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}
          </div>
          <h4 className="text-xl font-medium text-[var(--text-main)] tracking-tight">{item.title || 'Combat Summary'}</h4>
        </div>
        <div className="bg-[#e8e3f8] rounded-xl p-4 border border-black/5 text-center min-w-[100px] shadow-lg">
          <div className="text-2xl font-medium text-[var(--jobninjas-accent)] leading-none">{item.avg_score ? `${Math.round(item.avg_score)}%` : '—'}</div>
          <div className="text-[9px] font-medium text-[#5c5c7a] uppercase tracking-widest mt-2">Avg Score</div>
        </div>
      </div>
      
      <div className="bg-[#eeeafc] rounded-xl p-5 border border-black/5">
        <p className="text-sm text-[#5c5c7a] leading-relaxed font-light italic">{item.summary || 'Weekly performance synthesis in progress...'}</p>
      </div>

      <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-[#5c5c7a] font-medium">
            <Phone size={14} className="text-[var(--jobninjas-accent)]" />
            {item.sessions_count || 0} Sessions Synced
          </div>
          <Button
            onClick={() => exportToPDF(item, userName)}
            variant="outline"
            className="rounded-lg font-medium text-[10px] uppercase tracking-wider gap-2 h-9 px-4 border-black/10 hover:bg-[#e8e3f8] text-[#5c5c7a] hover:text-[var(--text-main)] transition-all"
          >
            <Download size={14} /> EXPORT DIGEST
          </Button>
      </div>
    </Card>
  </motion.div>
);

const MonthlySummaryCard = ({ item, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05 }}
  >
    <Card className="p-8 bg-[#eeeafc] border border-black/5 rounded-2xl shadow-xl space-y-6 overflow-hidden relative">
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-[var(--jobninjas-accent)]/5 rounded-full blur-[60px]" />
      
      <div className="flex justify-between items-start relative z-10">
        <div className="space-y-2">
          <Badge className="bg-[#8b5cf6]/10 text-[#8b5cf6] border border-[#8b5cf6]/20 font-medium text-[9px] px-2 py-0.5 uppercase tracking-wider">
            MONTHLY MILESTONE
          </Badge>
          <div className="text-[10px] font-medium text-[#5c5c7a] uppercase tracking-wider">
            {item.month ? new Date(item.year || new Date().getFullYear(), item.month - 1).toLocaleString('default', { month: 'long', year: 'numeric' }) : 'Trajectory'}
          </div>
          <h4 className="text-xl font-medium text-[var(--text-main)] tracking-tight">{item.title || '30-Day Analysis'}</h4>
        </div>
        <div className="bg-[#e8e3f8] rounded-xl p-4 border border-black/5 text-center min-w-[100px] shadow-lg">
          <div className="text-2xl font-medium text-[var(--jobninjas-accent)] leading-none">{item.avg_score ? `${Math.round(item.avg_score)}%` : '—'}</div>
          <div className="text-[9px] font-medium text-[#5c5c7a] uppercase tracking-widest mt-2">Cycle Avg</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#eeeafc] rounded-xl p-4 border border-black/5">
              <p className="text-[9px] font-medium text-[#5c5c7a] uppercase tracking-widest mb-1">Delta</p>
              <p className="text-lg font-medium text-emerald-500">+{item.improvement_delta || '12'}%</p>
          </div>
          <div className="bg-[#eeeafc] rounded-xl p-4 border border-black/5">
              <p className="text-[9px] font-medium text-[#5c5c7a] uppercase tracking-widest mb-1">Sessions</p>
              <p className="text-lg font-medium text-[var(--text-main)]">{item.total_sessions || item.sessions_count || '0'}</p>
          </div>
      </div>

      <p className="text-sm text-[#5c5c7a] leading-relaxed font-light relative z-10">
        {item.summary || 'Deep trajectory analysis is calculated at the end of each 30-day combat cycle.'}
      </p>

      <Button className="w-full btn-premium-primary h-12 rounded-xl font-medium text-[10px] uppercase tracking-wider gap-2">
        <BarChart2 size={16} /> VIEW FULL TRAJECTORY
      </Button>
    </Card>
  </motion.div>
);

const EmptyState = ({ icon, title, message, cta, ctaLink }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <Card className="p-16 bg-[#eeeafc] border border-black/5 rounded-2xl text-center space-y-4 shadow-xl">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-lg font-medium text-[var(--text-main)]">{title}</h3>
      <p className="text-[#5c5c7a] font-light max-w-sm mx-auto leading-relaxed text-sm">{message}</p>
      {cta && ctaLink && (
        <a href={ctaLink} className="inline-block mt-4 text-[var(--jobninjas-accent)] font-medium text-xs hover:underline uppercase tracking-wider">
          {cta}
        </a>
      )}
    </Card>
  </motion.div>
);

const TABS = [
  { key: 'daily',   label: 'Sessions', icon: <Phone size={14} /> },
  { key: 'weekly',  label: 'Digest',   icon: <TrendingUp size={14} /> },
  { key: 'monthly', label: 'Milestones', icon: <BarChart2 size={14} /> },
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
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12 pb-32 bg-[#faf9ff]">

      {/* ── Page Header ── */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-8"
      >
        <div className="space-y-4">
          <Badge className="bg-[var(--jobninjas-accent)]/10 text-[var(--jobninjas-accent)] border border-[var(--jobninjas-accent)]/20 font-medium uppercase tracking-wider text-[10px] px-3 py-1">
            PERFORMANCE INTELLIGENCE
          </Badge>
          <h2 className="text-4xl font-medium text-[var(--text-main)] tracking-tight">
            Performance <span className="text-[var(--jobninjas-accent)]">Intelligence.</span>
          </h2>
          <p className="text-[#5c5c7a] font-light max-w-2xl text-base leading-relaxed">
            Every session generates a tactical analysis with personalized AI coaching, performance vectors, and a growth plan to bridge the gap to seniority.
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <div className="bg-[#eeeafc] border border-black/5 rounded-xl px-5 py-2.5 text-[var(--text-main)] text-xs font-medium flex items-center gap-3 shadow-xl">
            <div className="w-1.5 h-1.5 bg-[var(--jobninjas-accent)] rounded-full animate-pulse" />
            {reports.length} ACTIVE INTEL FILES
          </div>
        </div>
      </motion.div>

      {/* ── Tab Switcher ── */}
      <div className="flex gap-1 p-1 bg-[#eeeafc] border border-black/5 rounded-xl w-fit">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg text-xs transition-all font-medium ${
              activeTab === tab.key
                ? 'bg-[var(--jobninjas-accent)] text-white border border-[var(--jobninjas-accent)] shadow-lg'
                : 'text-[#5c5c7a] hover:text-[#5c5c7a]'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Content ── */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <SkeletonCard key={i} lines={4} />)}
        </div>
      ) : isError ? (
        <ApiError error={error} retry={refetch} />
      ) : (
        <div className="grid lg:grid-cols-3 gap-10">

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
                    icon={<Phone size={40} className="text-[var(--text-main)]/10" />}
                    title="No Performance Intel"
                    message="Your first AI report will be generated and synchronized here immediately after your session is completed."
                    cta="Initiate Your First Protocol →"
                    ctaLink="/ai-ninja/dashboard"
                  />
            )}

            {activeTab === 'weekly' && (
              reports.length > 0
                ? reports.map((item, i) => (
                    <WeeklyDigestCard key={item.id || i} item={item} index={i} userName={user?.name} />
                  ))
                : <EmptyState
                    icon={<TrendingUp size={40} className="text-[var(--text-main)]/10" />}
                    title="Weekly Summary Pending"
                    message="Weekly digests roll up all tactical sessions into a strategic growth trajectory. Complete your first week to unlock."
                  />
            )}

            {activeTab === 'monthly' && (
              reports.length > 0
                ? reports.map((item, i) => (
                    <MonthlySummaryCard key={item.id || i} item={item} index={i} />
                  ))
                : <EmptyState
                    icon={<BarChart2 size={40} className="text-[var(--text-main)]/10" />}
                    title="Monthly Milestone Locked"
                    message="Deep monthly analysis will be available after your first 30-day combat cycle is completed."
                  />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Coach Panel */}
            <Card className="p-8 bg-[#eeeafc] border border-black/5 rounded-2xl overflow-hidden relative shadow-xl">
              <div className="absolute -top-16 -right-16 w-48 h-48 bg-[var(--jobninjas-accent)]/5 rounded-full blur-[60px]" />
              
              <div className="relative z-10 space-y-6">
                <div className="w-12 h-12 bg-[var(--jobninjas-accent)]/10 border border-[var(--jobninjas-accent)]/20 rounded-xl flex items-center justify-center">
                  <Brain size={24} className="text-[var(--jobninjas-accent)]" />
                </div>
                <Badge className="bg-[var(--jobninjas-accent)]/10 text-[var(--jobninjas-accent)] border border-[var(--jobninjas-accent)]/20 font-medium px-3 py-1 text-[10px] uppercase tracking-wider">
                  AI STRATEGIST ACTIVE
                </Badge>
                <div className="space-y-2">
                    <h4 className="text-xl font-medium text-[var(--text-main)] tracking-tight">
                    {reports.length > 0
                        ? `${reports.length} Data Points Synced`
                        : 'System Calibrated'}
                    </h4>
                    <p className="text-[#5c5c7a] text-sm leading-relaxed font-light">
                    {reports.length > 0
                        ? 'Your coach has analyzed your patterns. Use the "PDF Export" to share results or track offline progress.'
                        : 'Complete your first AI protocol to generate a high-fidelity report with delta analysis.'}
                    </p>
                </div>
                {reports.length > 0 && (
                    <Button className="w-full btn-premium-primary h-11 text-xs font-medium uppercase tracking-wider">
                        Download All Intel
                    </Button>
                )}
              </div>
            </Card>

            {/* How Reports Work Bento */}
            <Card className="p-8 bg-[#eeeafc] border border-black/5 rounded-2xl space-y-6 shadow-xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-[#e8e3f8] border border-black/5 rounded-xl flex items-center justify-center text-[#5c5c7a]">
                  <Lightbulb size={20} />
                </div>
                <h4 className="text-lg font-medium text-[var(--text-main)] tracking-tight">Report Protocol</h4>
              </div>
              <div className="space-y-5">
                {[
                    { icon: <Phone size={16} />, text: 'Execute Session', sub: '20-30 min practice' },
                    { icon: <Brain size={16} />, text: 'Feature Extraction', sub: 'Real-time analysis' },
                    { icon: <FileText size={16} />, text: 'Intel Synthesis', sub: 'Full report generation' },
                    { icon: <Download size={16} />, text: 'Documentation', sub: 'PDF export' },
                ].map((step, i) => (
                    <div key={i} className="flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-[#e8e3f8] border border-black/5 flex items-center justify-center text-[#5c5c7a] group-hover:text-[var(--jobninjas-accent)] group-hover:border-[var(--jobninjas-accent)]/20 transition-all flex-shrink-0">
                        {step.icon}
                    </div>
                    <div>
                        <p className="text-sm font-medium text-[var(--text-main)] leading-none mb-1">{step.text}</p>
                        <p className="text-[10px] font-medium text-[#5c5c7a] uppercase tracking-wider">{step.sub}</p>
                    </div>
                    </div>
                ))}
              </div>
            </Card>

            {/* Pro Tip Alert */}
            <Card className="p-6 bg-[var(--jobninjas-accent)]/5 border-[var(--jobninjas-accent)]/10 rounded-2xl space-y-4 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[var(--jobninjas-accent)]/10 rounded-lg flex items-center justify-center text-[var(--jobninjas-accent)]">
                    <Zap size={16} />
                </div>
                <h4 className="font-medium text-[var(--text-main)] text-[11px] uppercase tracking-wider">Efficiency Tip</h4>
              </div>
              <p className="text-sm text-[#5c5c7a] leading-relaxed font-light">
                Reviewing AI feedback within <span className="text-[var(--text-main)] font-medium">120 minutes</span> of a session accelerates skill acquisition by up to <span className="text-[var(--jobninjas-accent)] font-medium">40%</span>.
              </p>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default NinjaReports;
