import React, { useState, useMemo } from 'react';
import {
  Trophy, Flame, Mic, Github, Star, BarChart3,
  MapPin, Briefcase, ChevronUp, ChevronDown, Building2,
  Mail, CheckCircle, Sparkles, ArrowRight, Lock, Globe,
  Award, Zap, Search
} from 'lucide-react';
import { useLeaderboard, useV2Leaderboard } from '../../hooks/useN8n';
import { motion, AnimatePresence } from 'framer-motion';
import SkeletonCard, { SkeletonTable } from '../ui/SkeletonCard';

const firstName = (name = '') => name.trim().split(/\s+/)[0] || 'Ninja';
const initial   = (name = '') => firstName(name).charAt(0).toUpperCase();

const CATEGORIES = [
  { key:'compositeScore', label:'Overall',    icon:Trophy,   color:'var(--jobninjas-accent)', unit:'%',        desc:'Composite score: interview accuracy × streak bonus', round:true },
  { key:'streak',         label:'Call Streak', icon:Flame,   color:'#f97316', unit:' days',    desc:'Consecutive daily AI interview calls without missing', round:false },
  { key:'avgScore',       label:'Interview',  icon:Mic,      color:'#8b5cf6', unit:'/10',      desc:'Average AI evaluation score across all completed calls', round:true },
  { key:'githubRepos',    label:'GitHub',     icon:Github,   color:'#22c55e', unit:' projects',desc:'Verified GitHub repositories and notable projects', round:false },
];

const MEDALS = ['🥇','🥈','🥉'];

const RecruiterSignup = () => {
  const [form, setForm] = useState({ name:'', company:'', email:'', roles:'', size:'' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const base = process.env.REACT_APP_API_URL || process.env.REACT_APP_BACKEND_URL || '';
      await fetch(`${base}/api/recruiter-signup`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(form) });
    } catch (_) {}
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) return (
    <div className="max-w-lg mx-auto my-16 text-center bg-[#eeeafc] border border-black/5 rounded-2xl p-12 shadow-xl">
      <CheckCircle className="w-14 h-14 text-emerald-500 mx-auto mb-4" />
      <div className="text-2xl font-medium text-[var(--text-main)] mb-3">You're on the list!</div>
      <p className="text-[#5c5c7a] text-sm font-light leading-relaxed">We'll send you curated candidate profiles from our top 5% Ninjas within 48 hours.</p>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
      <div>
        <div className="inline-flex items-center gap-2 bg-[var(--jobninjas-accent)]/10 text-[var(--jobninjas-accent)] border border-[var(--jobninjas-accent)]/20 rounded-full px-4 py-1 text-[10px] font-medium uppercase tracking-wider mb-6">
          <Sparkles size={12} /> For Recruiters
        </div>
        <h2 className="text-4xl font-medium text-[var(--text-main)] leading-tight mb-4 tracking-tight">
          Hire Pre-Vetted Candidates <br />
          <span className="text-[var(--jobninjas-accent)]">Proven by AI Interviews.</span>
        </h2>
        <p className="text-[#5c5c7a] text-base font-light leading-relaxed mb-8">
          Every Ninja has been evaluated by real AI-conducted interviews — scored on technical accuracy, communication, and confidence. No fluff. Just verified performance.
        </p>
        <div className="space-y-4 mb-8">
          {[
            [CheckCircle,'Top 5% candidates shared with platinum recruiters'],
            [BarChart3,'See AI interview scores, streaks & GitHub projects'],
            [Lock,'Full names revealed only to verified companies'],
            [Globe,'Filter by role, location, experience level'],
          ].map(([Icon, text], i) => (
            <div key={i} className="flex items-center gap-3 text-sm text-[var(--text-main)]/80 font-light">
              <Icon className="w-4 h-4 text-emerald-500 shrink-0" />{text}
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {['Google','Microsoft','Stripe','Airbnb','NVIDIA'].map((c,i) => (
            <span key={i} className="text-[10px] font-medium text-[#5c5c7a] bg-[#e8e3f8] rounded-md px-2.5 py-1 border border-black/5">{c}</span>
          ))}
        </div>
      </div>

      <div className="sticky top-8">
        <form onSubmit={handleSubmit} className="bg-[#eeeafc] border border-black/5 rounded-2xl p-8 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 text-sm font-medium text-[var(--text-main)] pb-4 border-b border-black/5">
            <Building2 size={16} /> Recruiter Access Request
          </div>
          <div className="grid grid-cols-1 gap-4">
            {[
              ['name','Your Name','text','Jane Smith'],
              ['company','Company','text','Google, Stripe, YC Startup…'],
              ['email','Work Email','email','jane@company.com'],
              ['roles','Roles Hiring For','text','SWE, Data Scientist, PM…']
            ].map(([k,lbl,type,ph]) => (
              <div key={k} className="space-y-1.5">
                <label className="text-[10px] font-medium text-[#5c5c7a] uppercase tracking-wider">{lbl}</label>
                <input 
                  type={type} 
                  placeholder={ph} 
                  value={form[k]} 
                  onChange={set(k)} 
                  required={['name','company','email'].includes(k)} 
                  className="w-full bg-[#e8e3f8] border border-black/5 rounded-lg px-4 py-2 text-sm text-[var(--text-main)] placeholder:text-[var(--text-main)]/20 focus:outline-none focus:border-[var(--jobninjas-accent)]/40 transition-colors"
                />
              </div>
            ))}
            <div className="space-y-1.5">
              <label className="text-[10px] font-medium text-[#5c5c7a] uppercase tracking-wider">Company Size</label>
              <select 
                value={form.size} 
                onChange={set('size')} 
                className="w-full bg-[#e8e3f8] border border-black/5 rounded-lg px-4 py-2 text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--jobninjas-accent)]/40 transition-colors"
              >
                <option value="" className="bg-[#eeeafc]">Select size</option>
                {['1–10 (Startup)','11–100','101–500','500–5000','5000+ (Enterprise)'].map(o => <option key={o} value={o} className="bg-[#eeeafc]">{o}</option>)}
              </select>
            </div>
          </div>
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full btn-premium-primary h-11 flex items-center justify-center gap-2 text-xs font-medium mt-2"
          >
            {loading ? 'Submitting…' : <><Mail size={14} /> Request Candidate Access <ArrowRight size={14} /></>}
          </button>
          <p className="text-[10px] text-[#5c5c7a] text-center mt-2 font-light">Free to sign up. We manually review every recruiter account.</p>
        </form>
      </div>
    </div>
  );
};

const PodiumCard = ({ ninja, pos, cat }) => {
  const isFirst = pos === 0;
  const val = ninja?.[cat.key] ?? 0;
  const display = cat.round ? Math.round(val * 10) / 10 : Math.floor(val);

  return (
    <motion.div
      initial={{ opacity:0, y: isFirst ? -10 : 10 }}
      animate={{ opacity:1, y:0 }}
      transition={{ delay: pos * 0.1, type:'spring', stiffness:120 }}
      className={`
        relative flex flex-col items-center p-6 rounded-2xl border transition-all duration-300
        ${isFirst ? 'bg-[#e8e3f8] border-[var(--jobninjas-accent)]/30 scale-105 z-10 shadow-[0_0_40px_-10px_rgba(94,106,210,0.2)]' : 'bg-[#eeeafc] border-black/5 mt-4'}
      `}
    >
      {isFirst && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--jobninjas-accent)] text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
          Champion
        </div>
      )}
      
      <div className={`
        relative rounded-full flex items-center justify-center text-[var(--text-main)] font-medium mb-4
        ${isFirst ? 'w-20 h-20 text-2xl border-2 border-[var(--jobninjas-accent)]' : 'w-14 h-14 text-lg border border-black/10'}
        bg-gradient-to-br from-white/10 to-transparent
      `}>
        {initial(ninja?.displayName)}
        <div className="absolute -bottom-1 -right-1 bg-[#eeeafc] border border-black/10 rounded-full w-6 h-6 flex items-center justify-center text-[10px]">
          {MEDALS[pos]}
        </div>
      </div>

      <div className="text-center space-y-1">
        <div className="text-base font-medium text-[var(--text-main)] truncate max-w-[120px]">{firstName(ninja?.displayName)}</div>
        <div className="text-[10px] text-[#5c5c7a] font-medium uppercase tracking-tight truncate max-w-[120px]">{ninja?.targetRole || 'Engineer'}</div>
      </div>

      <div className="mt-4 flex items-center gap-2 px-3 py-1 bg-[#e8e3f8] rounded-full border border-black/5">
        <cat.icon size={12} style={{ color: cat.color }} />
        <span className="text-sm font-medium text-[var(--text-main)]">{display}{cat.unit}</span>
      </div>
    </motion.div>
  );
};

const NinjaLeaderboard = () => {
  const { data, isLoading, isError, refetch } = useLeaderboard(50);
  const { data: v2LbData } = useV2Leaderboard(50);
  const [activeCat, setActiveCat] = useState(0);
  const [activeTab, setActiveTab] = useState('leaderboard');
  const [sortDir, setSortDir]     = useState('desc');

  const cat = CATEGORIES[activeCat];
  
  const v2Entries = (v2LbData?.leaderboard || []).map(e => ({
    displayName: e.name || 'Ninja',
    email: e.email,
    compositeScore: e.avg_score || 0,
    avgScore: e.avg_score || 0,
    streak: e.current_streak || 0,
    githubRepos: 0,
    targetRole: 'Software Engineer',
    totalSessions: e.total_sessions || 0,
    leaderboard_rank: e.leaderboard_rank,
    trend: e.trend || 'neutral',
  }));
  
  const legacyList = data?.leaderboard || [];
  const ninjaList = v2Entries.length > 0 ? v2Entries : legacyList;

  const sorted = useMemo(() => {
    return [...ninjaList].sort((a,b) =>
      sortDir === 'desc' ? (b[cat.key]??0)-(a[cat.key]??0) : (a[cat.key]??0)-(b[cat.key]??0)
    );
  }, [ninjaList, cat.key, sortDir]);

  const top3 = sorted.slice(0,3);
  const rest  = sorted.slice(3);
  const currentUser = data?.currentUser;

  const renderBody = () => {
    if (isLoading) return (
      <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1,2,3].map(i => <SkeletonCard key={i} lines={3} />)}
        </div>
        <SkeletonTable rows={8} />
      </div>
    );

    return (
      <div className="max-w-5xl mx-auto py-6 px-4 space-y-8 flex flex-col">
        {/* User Status Bar */}
        {currentUser && (
          <div className="flex flex-wrap items-center gap-3 bg-[#eeeafc] border border-black/5 rounded-xl p-4">
            <span className="text-[10px] font-medium text-[#5c5c7a] uppercase tracking-widest mr-2 px-2 border-r border-black/10">Personal Status</span>
            {[
              { label:'Overall Rank', val:`#${currentUser.rank}`, icon: Trophy, color:'var(--jobninjas-accent)' },
              { label:'Active Streak', val:`${currentUser.streakRank}d`, icon: Flame, color:'#f97316' },
              { label:'Performance', val:`${Math.round(currentUser.compositeScore??0)}%`, icon: Award, color:'#8b5cf6' },
            ].map((s,i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-2 bg-[#e8e3f8] rounded-lg border border-black/5 min-w-[120px] flex-1">
                <s.icon size={14} style={{ color: s.color }} />
                <div>
                  <div className="text-xs font-medium text-[var(--text-main)]">{s.val}</div>
                  <div className="text-[10px] text-[#5c5c7a] font-light">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Category Controls */}
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c,i) => {
              const active = activeCat === i;
              return (
                <button 
                  key={c.key} 
                  onClick={() => setActiveCat(i)} 
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all border
                    ${active ? 'bg-[var(--jobninjas-accent)] border-[var(--jobninjas-accent)] text-white shadow-[0_0_20px_-10px_rgba(94,106,210,0.3)]' : 'bg-[#eeeafc] border-black/5 text-[#5c5c7a] hover:bg-[#e8e3f8] hover:text-[var(--text-main)]'}
                  `}
                >
                  <c.icon size={14} style={{ color: active ? '#ffffff' : 'currentColor' }} />
                  {c.label}
                </button>
              );
            })}
          </div>
          <p className="text-[11px] text-[#5c5c7a] font-light flex items-center gap-2 italic">
            <Sparkles size={12} className="text-[var(--jobninjas-accent)]" />
            {cat.desc}
          </p>
        </div>

        {/* Top 3 Podium */}
        {top3.length >= 3 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end py-4">
            <div className="order-2 md:order-1"><PodiumCard ninja={top3[1]} pos={1} cat={cat} /></div>
            <div className="order-1 md:order-2"><PodiumCard ninja={top3[0]} pos={0} cat={cat} /></div>
            <div className="order-3 md:order-3"><PodiumCard ninja={top3[2]} pos={2} cat={cat} /></div>
          </div>
        )}

        {/* List Table */}
        <div className="bg-[#eeeafc] border border-black/5 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#e8e3f8] text-left border-b border-black/5">
                  <th className="px-6 py-4 text-[10px] font-medium text-[#5c5c7a] uppercase tracking-wider w-16 text-center">Rank</th>
                  <th className="px-6 py-4 text-[10px] font-medium text-[#5c5c7a] uppercase tracking-wider">Candidate</th>
                  <th className="px-6 py-4 text-[10px] font-medium text-[#5c5c7a] uppercase tracking-wider hidden sm:table-cell">Focus</th>
                  <th className="px-6 py-4 text-[10px] font-medium text-[#5c5c7a] uppercase tracking-wider text-right">
                    <button 
                      onClick={() => setSortDir(d => d==='desc'?'asc':'desc')}
                      className="flex items-center gap-2 justify-end ml-auto group transition-colors hover:text-[var(--text-main)]"
                    >
                      {cat.label}
                      {sortDir==='desc' ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
                    </button>
                  </th>
                  <th className="px-6 py-4 text-[10px] font-medium text-[#5c5c7a] uppercase tracking-wider text-center">Streak</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                <AnimatePresence mode="wait">
                  {rest.map((ninja,i) => {
                    const rank = i + 4;
                    const val  = ninja[cat.key] ?? 0;
                    const display = cat.round ? Math.round(val * 10)/10 : Math.floor(val);
                    const isYou = ninja.isCurrentUser;
                    return (
                      <motion.tr 
                        key={`${ninja.userId||i}-${cat.key}`}
                        initial={{ opacity:0, y: 5 }} 
                        animate={{ opacity:1, y: 0 }}
                        className={`group hover:bg-[#eeeafc] transition-colors ${isYou ? 'bg-[var(--jobninjas-accent)]/5' : ''}`}
                      >
                        <td className="px-6 py-4 text-center">
                          <span className="text-xs font-medium text-[#5c5c7a] group-hover:text-[var(--text-main)]/60 transition-colors">{rank}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#e8e3f8] border border-black/10 flex items-center justify-center text-[10px] font-medium text-[var(--text-main)] shrink-0">
                              {initial(ninja.displayName)}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-[var(--text-main)] flex items-center gap-2">
                                {firstName(ninja.displayName)}
                                {isYou && <span className="bg-[var(--jobninjas-accent)] text-[8px] px-1.5 py-0.5 rounded uppercase font-black tracking-tighter">YOU</span>}
                              </span>
                              <span className="text-[10px] text-[#5c5c7a] font-light sm:hidden">{ninja.targetRole || 'Engineer'}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 hidden sm:table-cell">
                          <span className="text-xs text-[#5c5c7a] font-light italic truncate max-w-[150px] block">{ninja.targetRole || 'Generalist'}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="inline-block px-2.5 py-1 rounded bg-[var(--jobninjas-accent)]/10 border border-[var(--jobninjas-accent)]/20 text-[11px] font-medium text-[var(--jobninjas-accent)]">
                            {display}{cat.unit}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="inline-flex items-center gap-1.5 text-xs text-[#5c5c7a] font-medium">
                            <Flame size={12} className="text-orange-500" />
                            {ninja.streak??0}d
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
                {rest.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-[#5c5c7a] text-sm font-light">
                      No active ninjas found for this category.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recruiter Footer CTA */}
        <div className="flex flex-col md:flex-row items-center justify-between bg-gradient-to-r from-[#eeeafc] to-white border border-[var(--jobninjas-accent)]/20 rounded-2xl p-8 gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-[var(--jobninjas-accent)]/10 p-3 rounded-xl border border-[var(--jobninjas-accent)]/20">
              <Search className="text-[var(--jobninjas-accent)]" size={24} />
            </div>
            <div>
              <h4 className="text-lg font-medium text-[var(--text-main)] tracking-tight">Are you a talent partner?</h4>
              <p className="text-[#5c5c7a] text-sm font-light leading-relaxed">Access the top 5% of engineers pre-vetted by our proprietary AI agents.</p>
            </div>
          </div>
          <button 
            onClick={() => setActiveTab('recruiter')} 
            className="btn-premium-primary h-11 px-8 flex items-center gap-2 text-xs font-medium shrink-0"
          >
            Enter Recruiter Portal <ArrowRight size={14} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#f5f3ff] min-h-screen">
      {/* Tab Switcher Area */}
      <div className="border-b border-black/5 bg-[#eeeafc]/50 backdrop-blur-xl sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-between">
          <div className="flex gap-8 py-4">
            {[
              { id:'leaderboard', icon: Trophy, label: 'Leaderboard' },
              { id:'recruiter', icon: Building2, label: 'Recruiter' }
            ].map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 text-xs font-medium transition-all relative
                    ${active ? 'text-[var(--jobninjas-accent)]' : 'text-[#5c5c7a] hover:text-[var(--text-main)]'}
                  `}
                >
                  <tab.icon size={14} />
                  {tab.label}
                  {active && (
                    <motion.div 
                      layoutId="tab-active" 
                      className="absolute -bottom-4 left-0 right-0 h-0.5 bg-[var(--jobninjas-accent)]" 
                    />
                  )}
                </button>
              );
            })}
          </div>
          <div className="hidden sm:flex items-center gap-2 text-[10px] font-medium text-[#5c5c7a] uppercase tracking-widest bg-[#e8e3f8] px-3 py-1 rounded-full border border-black/5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live Rankings
          </div>
        </div>
      </div>

      <div className="py-8">
        {activeTab === 'recruiter' ? (
          <div className="max-w-5xl mx-auto px-4 py-8">
            <RecruiterSignup />
          </div>
        ) : renderBody()}
      </div>
    </div>
  );
};

export default NinjaLeaderboard;
