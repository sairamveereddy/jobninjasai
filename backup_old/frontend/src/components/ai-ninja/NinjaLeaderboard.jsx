import React, { useState, useMemo } from 'react';
import {
  Trophy, Flame, Mic, Github, Star, BarChart3,
  MapPin, Briefcase, ChevronUp, ChevronDown, Building2,
  Mail, CheckCircle, Sparkles, ArrowRight, Lock, Globe,
} from 'lucide-react';
import { useLeaderboard, useV2Leaderboard } from '../../hooks/useN8n';
import { motion, AnimatePresence } from 'framer-motion';
import SkeletonCard, { SkeletonTable } from '../ui/SkeletonCard';

/* ── helpers ─────────────────────────────────────────────── */
const firstName = (name = '') => name.trim().split(/\s+/)[0] || 'Ninja';
const initial   = (name = '') => firstName(name).charAt(0).toUpperCase();

/* ── design tokens ────────────────────────────────────────── */
const T = {
  bg:         '#f5f4ed',
  surface:    '#ffffff',
  border:     'rgba(0,0,0,0.07)',
  navy:       '#1a3a5f',
  gold:       '#c5a059',
  text:       '#1a3a5f',
  muted:      '#3a3530',
  light:      '#6b6560',
  shadow:     '0 2px 8px rgba(0,0,0,0.04)',
};

const AVATAR_COLORS = {
  blue:   'linear-gradient(135deg,#3b82f6,#1d4ed8)',
  orange: 'linear-gradient(135deg,#f97316,#ea580c)',
  purple: 'linear-gradient(135deg,#8b5cf6,#7c3aed)',
  green:  'linear-gradient(135deg,#22c55e,#16a34a)',
};
const SCORE_COLORS = {
  blue:   { text: '#1d4ed8', bg: '#dbeafe' },
  orange: { text: '#c2410c', bg: '#ffedd5' },
  purple: { text: '#7c3aed', bg: '#ede9fe' },
  green:  { text: '#15803d', bg: '#dcfce7' },
};

/* ── mock data ───────────────────────────────────────────── */
const CATEGORIES = [
  { key:'compositeScore', label:'Overall',    icon:Trophy,   color:'blue',   unit:'%',        desc:'Composite score: interview accuracy × streak bonus', round:true },
  { key:'streak',         label:'Call Streak', icon:Flame,   color:'orange', unit:' days',    desc:'Consecutive daily AI interview calls without missing', round:false },
  { key:'avgScore',       label:'Interview',  icon:Mic,      color:'purple', unit:'/10',      desc:'Average AI evaluation score across all completed calls', round:true },
  { key:'githubRepos',    label:'GitHub',     icon:Github,   color:'green',  unit:' projects',desc:'Verified GitHub repositories and notable projects', round:false },
];

const MEDALS = ['🥇','🥈','🥉'];

/* ── Recruiter signup ─────────────────────────────────────── */
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
    <div style={{ maxWidth:480, margin:'4rem auto', textAlign:'center', background:T.surface, border:`1px solid ${T.border}`, borderRadius:24, padding:'3rem 2rem', boxShadow:T.shadow }}>
      <CheckCircle style={{ width:56, height:56, color:'#16a34a', margin:'0 auto 1rem' }} />
      <div style={{ fontSize:'1.5rem', fontWeight:800, color:T.navy, marginBottom:'0.75rem' }}>You're on the list!</div>
      <p style={{ color:T.muted, lineHeight:1.7, fontSize:'0.9rem' }}>We'll send you curated candidate profiles from our top 5% Ninjas within 48 hours.</p>
    </div>
  );

  const inputStyle = { width:'100%', padding:'0.65rem 0.9rem', border:`1.5px solid ${T.border}`, borderRadius:10, fontSize:'0.9rem', color:T.text, background:'#f8f6f0', outline:'none', boxSizing:'border-box', fontFamily:'inherit' };
  const labelStyle = { fontSize:'0.72rem', fontWeight:800, color:T.muted, textTransform:'uppercase', letterSpacing:'0.08em', display:'block', marginBottom:'0.3rem' };

  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'4rem', alignItems:'start' }}>
      {/* Pitch */}
      <div>
        <div style={{ display:'inline-flex', alignItems:'center', gap:'0.4rem', background:'rgba(26,58,95,0.07)', color:T.navy, border:`1px solid rgba(26,58,95,0.18)`, borderRadius:9999, fontSize:'0.7rem', fontWeight:800, letterSpacing:'0.06em', textTransform:'uppercase', padding:'0.35rem 0.9rem', marginBottom:'1.25rem' }}>
          <Sparkles style={{ width:14, height:14 }} /> For Recruiters
        </div>
        <div style={{ fontSize:'clamp(1.5rem,3vw,2.2rem)', fontWeight:800, color:T.navy, lineHeight:1.15, marginBottom:'1rem', letterSpacing:'-0.02em' }}>
          Hire Pre-Vetted Candidates<br/><span style={{ color:T.gold }}>Proven by AI Interviews</span>
        </div>
        <p style={{ fontSize:'0.9rem', color:T.muted, lineHeight:1.7, marginBottom:'1.75rem', fontWeight:500 }}>
          Every Ninja has been evaluated by real AI-conducted interviews — scored on technical accuracy, communication, and confidence. No fluff. Just verified performance.
        </p>
        <ul style={{ listStyle:'none', padding:0, margin:'0 0 2rem', display:'flex', flexDirection:'column', gap:'0.7rem' }}>
          {[
            [CheckCircle,'Top 5% candidates shared with platinum recruiters'],
            [BarChart3,'See AI interview scores, streaks & GitHub projects'],
            [Lock,'Full names revealed only to verified companies'],
            [Globe,'Filter by role, location, experience level'],
          ].map(([Icon, text], i) => (
            <li key={i} style={{ display:'flex', alignItems:'center', gap:'0.6rem', fontSize:'0.88rem', color:T.text, fontWeight:500 }}>
              <Icon style={{ width:16, height:16, color:'#16a34a', flexShrink:0 }} />{text}
            </li>
          ))}
        </ul>
        <div style={{ display:'flex', flexWrap:'wrap', gap:'0.5rem' }}>
          {['Google','Microsoft','Stripe','Airbnb','NVIDIA'].map((c,i) => (
            <span key={i} style={{ fontSize:'0.72rem', fontWeight:700, color:T.navy, background:'#eef2f7', borderRadius:8, padding:'0.3rem 0.75rem' }}>{c}</span>
          ))}
        </div>
      </div>
      {/* Form */}
      <div style={{ position:'sticky', top:'1.5rem' }}>
        <form onSubmit={handleSubmit} style={{ background:T.surface, border:`1.5px solid ${T.border}`, borderRadius:20, padding:'2rem', display:'flex', flexDirection:'column', gap:'1rem', boxShadow:T.shadow }}>
          <div style={{ display:'flex', alignItems:'center', gap:'0.6rem', fontSize:'0.95rem', fontWeight:800, color:T.navy, paddingBottom:'1rem', borderBottom:`1px solid ${T.border}` }}>
            <Building2 style={{ width:18, height:18 }} /> Recruiter Access Request
          </div>
          {[['name','Your Name','text','Jane Smith'],['company','Company','text','Google, Stripe, YC Startup…'],['email','Work Email','email','jane@company.com'],['roles','Roles Hiring For','text','SWE, Data Scientist, PM…']].map(([k,lbl,type,ph]) => (
            <div key={k}>
              <label style={labelStyle}>{lbl}</label>
              <input type={type} placeholder={ph} value={form[k]} onChange={set(k)} required={['name','company','email'].includes(k)} style={inputStyle} />
            </div>
          ))}
          <div>
            <label style={labelStyle}>Company Size</label>
            <select value={form.size} onChange={set('size')} style={inputStyle}>
              <option value="">Select size</option>
              {['1–10 (Startup)','11–100','101–500','500–5000','5000+ (Enterprise)'].map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <button type="submit" disabled={loading} style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'0.5rem', background:loading?'#999':T.navy, color:'#fff', border:'none', borderRadius:12, padding:'0.9rem 1.5rem', fontSize:'0.9rem', fontWeight:800, cursor:loading?'not-allowed':'pointer', marginTop:'0.25rem', fontFamily:'inherit', transition:'background 0.2s' }}>
            {loading ? 'Submitting…' : <><Mail style={{ width:16, height:16 }} /> Request Candidate Access <ArrowRight style={{ width:16, height:16 }} /></>}
          </button>
          <p style={{ fontSize:'0.7rem', color:T.light, textAlign:'center', margin:0 }}>Free to sign up. We manually review every recruiter account.</p>
        </form>
      </div>
    </div>
  );
};

/* ── Podium card ─────────────────────────────────────────── */
const PodiumCard = ({ ninja, pos, cat }) => {
  const isFirst = pos === 0;
  const val = ninja?.[cat.key] ?? 0;
  const display = cat.round ? Math.round(val * 10) / 10 : Math.floor(val);
  const sc = SCORE_COLORS[cat.color];
  const borderColors = ['#c5a059','#8a9db5','#c09060'];

  return (
    <motion.div
      initial={{ opacity:0, y: isFirst ? -20 : 20 }}
      animate={{ opacity:1, y:0 }}
      transition={{ delay: pos * 0.1, type:'spring', stiffness:180 }}
      style={{
        background: isFirst ? '#fdfaf2' : T.surface,
        border: `1.5px solid ${borderColors[pos]}`,
        borderTop: `4px solid ${borderColors[pos]}`,
        borderRadius: 20,
        padding: isFirst ? '2rem 1.5rem' : '1.5rem 1.25rem',
        textAlign:'center',
        display:'flex', flexDirection:'column', alignItems:'center', gap:'0.3rem',
        boxShadow: isFirst ? '0 6px 24px rgba(197,160,89,0.18)' : T.shadow,
        marginTop: isFirst ? 0 : '1.5rem',
      }}
    >
      {isFirst && <div style={{ fontSize:'1.5rem', marginBottom:'0.2rem' }}>👑</div>}
      <div style={{ width: isFirst?64:48, height: isFirst?64:48, borderRadius:'50%', background:AVATAR_COLORS[cat.color], display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:900, fontSize: isFirst?'1.4rem':'1.1rem', marginBottom:'0.2rem' }}>
        {initial(ninja?.displayName)}
      </div>
      <div style={{ fontSize:'1.3rem' }}>{MEDALS[pos]}</div>
      <div style={{ fontSize:'1rem', fontWeight:800, color:T.text }}>{firstName(ninja?.displayName)}</div>
      <div style={{ fontSize:'0.75rem', fontWeight:600, color:T.muted }}>{ninja?.targetRole || 'Software Engineer'}</div>
      {ninja?.location && (
        <div style={{ display:'flex', alignItems:'center', gap:'0.25rem', fontSize:'0.72rem', color:T.light }}>
          <MapPin style={{ width:10, height:10 }} />{ninja.location}
        </div>
      )}
      <div style={{ display:'flex', alignItems:'center', gap:'0.35rem', fontSize:'1.2rem', fontWeight:900, marginTop:'0.4rem', color:sc.text }}>
        <cat.icon style={{ width:16, height:16 }} />
        {display}{cat.unit}
      </div>
    </motion.div>
  );
};

/* ── Main component ──────────────────────────────────────── */
const NinjaLeaderboard = () => {
  const { data, isLoading, isError, refetch } = useLeaderboard(50);
  const { data: v2LbData } = useV2Leaderboard(50);
  const [activeCat, setActiveCat] = useState(0);
  const [activeTab, setActiveTab] = useState('leaderboard');
  const [sortDir, setSortDir]     = useState('desc');

  const cat = CATEGORIES[activeCat];
  
  // Merge V2 leaderboard entries (normalize field names for display)
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
  const isMock    = false;

  const sorted = useMemo(() => {
    return [...ninjaList].sort((a,b) =>
      sortDir === 'desc' ? (b[cat.key]??0)-(a[cat.key]??0) : (a[cat.key]??0)-(b[cat.key]??0)
    );
  }, [ninjaList, cat.key, sortDir]);

  const top3 = sorted.slice(0,3);
  const rest  = sorted.slice(3);
  const currentUser = data?.currentUser;
  const sc = SCORE_COLORS[cat.color];

  const renderBody = () => {
    if (isLoading) return (
      <div style={{ maxWidth:900, margin:'0 auto', padding:'3rem 1.5rem' }}>
        <div style={{ display:'flex', gap:'1rem', marginBottom:'2rem' }}>
          {[1,2].map(i => <SkeletonCard key={i} lines={1} />)}
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'1rem', marginBottom:'2rem' }}>
          {[1,2,3].map(i => <SkeletonCard key={i} lines={3} />)}
        </div>
        <SkeletonTable rows={8} />
      </div>
    );

    return (
      <div style={{ maxWidth:960, margin:'0 auto', padding:'1.5rem 1.5rem', display:'flex', flexDirection:'column', gap:'1.5rem' }}>

        {/* Demo banner */}
        {isMock && (
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:'1rem', background:'#fdf8ee', border:'1px solid rgba(197,160,89,0.35)', borderRadius:10, padding:'0.65rem 1rem' }}>
            <span style={{ fontSize:'0.85rem', color:'#6b4c10', fontWeight:600 }}>⚡ Showing sample data — connect the backend to see live rankings</span>
            {isError && <button onClick={refetch} style={{ fontSize:'0.78rem', fontWeight:800, background:T.gold, color:'#fff', border:'none', borderRadius:6, padding:'0.28rem 0.75rem', cursor:'pointer' }}>Retry</button>}
          </div>
        )}

        {/* Your stats */}
        {currentUser && (
          <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', background:T.surface, border:`1px solid ${T.border}`, borderRadius:14, padding:'1rem 1.5rem', flexWrap:'wrap', boxShadow:T.shadow }}>
            <span style={{ fontSize:'0.68rem', fontWeight:800, textTransform:'uppercase', letterSpacing:'0.1em', color:T.muted, marginRight:'0.5rem' }}>Your Rankings</span>
            {[
              { label:'Overall', val:`#${currentUser.rank}`, color:'#1d4ed8', bg:'#dbeafe' },
              { label:'Streak', val:`#${currentUser.streakRank}`, color:'#c2410c', bg:'#ffedd5' },
              { label:'Score', val:`${Math.round(currentUser.compositeScore??0)}%`, color:'#7c3aed', bg:'#ede9fe' },
            ].map((s,i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:'0.5rem', padding:'0.45rem 0.9rem', borderRadius:10, background:s.bg, color:s.color, flex:1, minWidth:90 }}>
                <div style={{ fontSize:'1.1rem', fontWeight:800 }}>{s.val}</div>
                <div style={{ fontSize:'0.68rem', fontWeight:700, opacity:0.75 }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Category tabs */}
        <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap' }}>
          {CATEGORIES.map((c,i) => {
            const active = activeCat === i;
            const asc = SCORE_COLORS[c.color];
            return (
              <button key={c.key} onClick={() => setActiveCat(i)} style={{
                display:'flex', alignItems:'center', gap:'0.4rem',
                padding:'0.5rem 1.1rem', borderRadius:10, fontSize:'0.85rem', fontWeight:700,
                cursor:'pointer', transition:'all 0.15s', border:'none',
                background: active ? asc.bg : T.surface,
                color: active ? asc.text : T.muted,
                boxShadow: active ? `0 0 0 1.5px ${asc.text}` : `0 0 0 1px ${T.border}`,
              }}>
                <c.icon style={{ width:15, height:15 }} />
                {c.label}
              </button>
            );
          })}
        </div>

        <p style={{ fontSize:'0.82rem', color:T.muted, margin:0, display:'flex', alignItems:'center', gap:'0.35rem', fontWeight:500 }}>
          <cat.icon style={{ width:14, height:14, color:sc.text }} />
          {cat.desc}
        </p>

        {/* Podium */}
        {top3.length >= 3 && (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'1rem', alignItems:'end' }}>
            <PodiumCard ninja={top3[1]} pos={1} cat={cat} />
            <PodiumCard ninja={top3[0]} pos={0} cat={cat} />
            <PodiumCard ninja={top3[2]} pos={2} cat={cat} />
          </div>
        )}

        {/* Table */}
        <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:16, overflow:'hidden', boxShadow:T.shadow }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ background:'#eef2f7' }}>
                {['#','Ninja','Role','Location',''].map((h,i) => (
                  <th key={i} style={{ padding:'0.8rem 1.1rem', fontSize:'0.67rem', fontWeight:800, letterSpacing:'0.1em', textTransform:'uppercase', color:T.navy, textAlign: i===0||i===4 ? 'center':'left', borderBottom:`1px solid ${T.border}`, whiteSpace:'nowrap' }}>
                    {i===4 ? (
                      <span onClick={() => setSortDir(d => d==='desc'?'asc':'desc')} style={{ cursor:'pointer', display:'flex', alignItems:'center', gap:'0.25rem', justifyContent:'flex-end' }}>
                        <cat.icon style={{ width:13, height:13 }} />
                        {cat.label}
                        {sortDir==='desc' ? <ChevronDown style={{ width:13, height:13 }} /> : <ChevronUp style={{ width:13, height:13 }} />}
                      </span>
                    ) : h==='#' ? (
                      <span style={{ display:'flex', justifyContent:'center' }}>#</span>
                    ) : (
                      <span style={{ display:'flex', alignItems:'center', gap:'0.3rem' }}>
                        {h==='Role' && <Briefcase style={{ width:12, height:12 }} />}
                        {h==='Location' && <MapPin style={{ width:12, height:12 }} />}
                        {h}
                      </span>
                    )}
                  </th>
                ))}
                <th style={{ padding:'0.8rem 1.1rem', fontSize:'0.67rem', fontWeight:800, letterSpacing:'0.1em', textTransform:'uppercase', color:T.navy, textAlign:'center', borderBottom:`1px solid ${T.border}` }}>
                  <span style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'0.25rem' }}>
                    <Flame style={{ width:12, height:12, color:'#ea580c' }} /> Streak
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="wait">
                {rest.map((ninja,i) => {
                  const rank = i + 4;
                  const val  = ninja[cat.key] ?? 0;
                  const display = cat.round ? Math.round(val * 10)/10 : Math.floor(val);
                  const isYou = ninja.isCurrentUser;
                  return (
                    <motion.tr key={`${ninja.userId||i}-${cat.key}`}
                      initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0 }}
                      transition={{ delay: i*0.025 }}
                      style={{ borderBottom:`1px solid ${T.border}`, background: isYou ? '#faf5ff' : 'transparent', borderLeft: isYou ? '3px solid #8b5cf6' : 'none' }}
                      onMouseEnter={e => { if (!isYou) e.currentTarget.style.background='#f8f6f0'; }}
                      onMouseLeave={e => { if (!isYou) e.currentTarget.style.background='transparent'; }}
                    >
                      <td style={{ padding:'0.8rem 1.1rem', textAlign:'center' }}>
                        <span style={{ fontSize:'0.85rem', fontWeight:700, color:T.muted }}>{rank}</span>
                      </td>
                      <td style={{ padding:'0.8rem 1.1rem' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:'0.65rem' }}>
                          <div style={{ width:34, height:34, borderRadius:'50%', background:AVATAR_COLORS[cat.color], display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:800, fontSize:'0.8rem', flexShrink:0 }}>
                            {initial(ninja.displayName)}
                          </div>
                          <span style={{ fontSize:'0.9rem', fontWeight:700, color:T.text, display:'flex', alignItems:'center', gap:'0.4rem' }}>
                            {firstName(ninja.displayName)}
                            {isYou && <span style={{ fontSize:'0.58rem', fontWeight:800, background:'#8b5cf6', color:'#fff', padding:'0.1rem 0.4rem', borderRadius:4, textTransform:'uppercase' }}>You</span>}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding:'0.8rem 1.1rem', fontSize:'0.82rem', fontWeight:600, color:T.muted, maxWidth:160 }}>{ninja.targetRole || '—'}</td>
                      <td style={{ padding:'0.8rem 1.1rem', fontSize:'0.82rem', color:T.muted, fontWeight:500 }}>
                        {ninja.location ? <><MapPin style={{ width:11, height:11, display:'inline', marginRight:3 }} />{ninja.location}</> : '—'}
                      </td>
                      <td style={{ padding:'0.8rem 1.1rem', textAlign:'right' }}>
                        <span style={{ fontSize:'0.85rem', fontWeight:800, padding:'0.2rem 0.6rem', borderRadius:8, color:sc.text, background:sc.bg }}>
                          {display}{cat.unit}
                        </span>
                      </td>
                      <td style={{ padding:'0.8rem 1.1rem', textAlign:'center' }}>
                        <span style={{ display:'inline-flex', alignItems:'center', gap:'0.25rem', fontSize:'0.85rem', fontWeight:700, color:T.muted }}>
                          <Flame style={{ width:13, height:13, color:'#ea580c' }} />{ninja.streak??0}d
                        </span>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
              {rest.length === 0 && (
                <tr><td colSpan={6} style={{ padding:'3rem', textAlign:'center', color:T.muted, fontSize:'0.9rem', fontWeight:500 }}>No ninjas ranked yet. Be the first!</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Recruiter CTA */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', background:'linear-gradient(135deg,#1a3a5f,#0f2744)', borderRadius:16, padding:'1.25rem 1.75rem', gap:'1.5rem', flexWrap:'wrap' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'0.85rem', color:'#fff', fontSize:'0.9rem' }}>
            <Star style={{ width:20, height:20, color:'#facc15', flexShrink:0 }} />
            <div>
              <strong style={{ fontWeight:800 }}>Are you a recruiter?</strong>
              <span style={{ color:'rgba(255,255,255,0.65)', marginLeft:'0.4rem' }}>Access pre-vetted candidates scored by real AI interviews.</span>
            </div>
          </div>
          <button onClick={() => setActiveTab('recruiter')} style={{ display:'flex', alignItems:'center', gap:'0.4rem', background:T.gold, color:'#fff', border:'none', borderRadius:10, padding:'0.65rem 1.25rem', fontSize:'0.85rem', fontWeight:800, cursor:'pointer', whiteSpace:'nowrap', flexShrink:0 }}>
            Get Recruiter Access <ArrowRight style={{ width:15, height:15 }} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div style={{ fontFamily:"'Inter', system-ui, sans-serif", color:T.text }}>

      {/* ── Page header ─────────────────────────────────── */}
      <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:16, padding:'1.5rem 2rem 0', marginBottom:'1.5rem', boxShadow:T.shadow }}>
        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', gap:'2rem', flexWrap:'wrap' }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:'0.6rem', marginBottom:'0.4rem' }}>
              <Trophy style={{ width:26, height:26, color:T.gold }} />
              <h1 style={{ margin:0, fontSize:'2rem', fontWeight:400, color:T.navy, letterSpacing:'-0.02em', lineHeight:1.1, fontFamily:"'Instrument Serif', serif" }}>
                Global Leaderboard
              </h1>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', flexWrap:'wrap', fontSize:'0.9rem', color:T.muted, fontWeight:500 }}>
              Ranked by real AI interview performance, call streaks &amp; GitHub projects.
              <span style={{ background:'rgba(26,58,95,0.08)', color:T.navy, fontSize:'0.7rem', fontWeight:800, padding:'0.2rem 0.65rem', borderRadius:20, border:'1px solid rgba(26,58,95,0.18)' }}>
                Top 5% shared with recruiters
              </span>
            </div>
          </div>

          {/* Main tab switcher */}
          <div style={{ display:'flex', gap:0, borderBottom:'2px solid transparent' }}>
            {[['leaderboard', Trophy, 'Rankings'], ['recruiter', Building2, 'Recruiter Portal']].map(([key, Icon, label]) => {
              const active = activeTab === key;
              return (
                <button key={key} onClick={() => setActiveTab(key)} style={{
                  display:'flex', alignItems:'center', gap:'0.4rem',
                  padding:'0.85rem 1.25rem', fontSize:'0.875rem', fontWeight: active ? 800 : 600,
                  color: active ? T.navy : T.light,
                  background:'none', border:'none', borderBottom: active ? `2px solid ${T.gold}` : '2px solid transparent',
                  cursor:'pointer', whiteSpace:'nowrap', transition:'all 0.2s', marginBottom:'-2px',
                }}>
                  <Icon style={{ width:15, height:15, color: active ? T.gold : 'currentColor' }} />
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {activeTab === 'recruiter' ? (
        <div style={{ maxWidth:960, margin:'0 auto', padding:'0 1.5rem 3rem' }}>
          <RecruiterSignup />
        </div>
      ) : renderBody()}
    </div>
  );
};

export default NinjaLeaderboard;
