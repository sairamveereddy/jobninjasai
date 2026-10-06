import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  Sparkles, ExternalLink, ChevronRight,
  LayoutDashboard, UserCircle, Trophy,
  PhoneCall, ShieldCheck, TrendingUp
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNinjaRoadmap, useResetNinja } from '../hooks/useN8n';
import { useQueryClient } from '@tanstack/react-query';
import { Badge } from './ui/badge';
import { cn } from '../lib/utils';
import { toast } from 'sonner';

// Sub-components
import OnboardingWizard from './ai-ninja/OnboardingWizard';
import NinjaDashboard from './ai-ninja/dashboard/NinjaDashboard';
import NinjaLeaderboard from './ai-ninja/NinjaLeaderboard';
import NinjaReports from './ai-ninja/NinjaReports';

const AINinja = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { data: roadmapData } = useNinjaRoadmap();
  const resetMutation = useResetNinja();

  const path = location.pathname;

  // Persistence: Fast-forward to dashboard if active roadmap exists
  React.useEffect(() => {
    const hasActiveRoadmap = roadmapData?.roadmap?.id && roadmapData?.roadmap?.status === 'active';
    // If user has a roadmap, lock them into dashboard (not landing/onboard)
    if (hasActiveRoadmap && (path === '/ai-ninja' || path === '/ai-ninja/onboard')) {
      navigate('/ai-ninja/dashboard');
    }
  }, [path, roadmapData, navigate]);

  const handleReset = async () => {
    if (!window.confirm("CRITICAL PROTOCOL: Are you sure you want to reset your neural pathways? Your roadmap and session history will be permanently cleared from the tactical grid.")) return;
    
    try {
      const identifier = user?.email || user?.id;
      await resetMutation.mutateAsync(identifier);
      toast.success("Memory purged. Re-orientation protocol active.");
      navigate('/ai-ninja/onboard');
    } catch (err) {
      console.error("Reset failed", err);
      toast.error("Protocol failure. Manual reset required.");
    }
  };


  const navItems = [
    { label: 'Dashboard',   path: '/ai-ninja/dashboard',   icon: <LayoutDashboard size={18} /> },
    { label: 'Leaderboard', path: '/ai-ninja/leaderboard', icon: <Trophy size={18} /> },
    { label: 'Report',      path: '/ai-ninja/reports',     icon: <TrendingUp size={18} /> },
  ];

  const renderView = () => {
    if (path.includes('/dashboard')) return <NinjaDashboard onReset={handleReset} />;
    if (path.includes('/leaderboard')) return <NinjaLeaderboard />;
    if (path.includes('/reports')) return <NinjaReports />;
    if (path.includes('/onboard')) return <OnboardingWizard />;
    return (
      <NinjaLandingPage
        onStart={() => navigate(isAuthenticated ? '/ai-ninja/onboard' : '/login?redirect=/ai-ninja/onboard')}
      />
    );
  };

  return (
    <div className="min-h-screen font-sans" style={{ background: '#f5f4ed' }}>



      <main>
        {renderView()}
      </main>
    </div>
  );
};

const NinjaLandingPage = ({ onStart }) => {
    return (
        <div style={{ color: '#111111' }}>
            {/* HERO SECTION */}
            <section style={{ background: '#f5f4ed', position: 'relative', paddingTop: '5rem', paddingBottom: '5rem', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', height: '600px', background: 'radial-gradient(circle at 50% 0%, rgba(197,160,89,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

                <div className="max-w-5xl mx-auto px-6 text-center relative" style={{ zIndex: 1 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-8"
                        style={{ background: 'rgba(26,58,95,0.07)', border: '1px solid rgba(26,58,95,0.12)', color: '#1a3a5f' }}
                    >
                        <Sparkles size={12} style={{ color: '#c5a059' }} />
                        The Elite Standard of Interview Mastery
                    </motion.div>

                    <h1 className="font-black tracking-tight leading-tight mb-6" style={{ fontFamily: "'Instrument Serif', serif", fontSize: 'clamp(2.5rem, 6vw, 4rem)', color: '#1a3a5f', fontWeight: 400 }}>
                        Master the{' '}
                        <span style={{ color: '#c5a059', fontStyle: 'italic' }}>Conversation.</span>
                    </h1>

                    <p className="max-w-xl mx-auto mb-10 leading-relaxed" style={{ fontSize: '1.1rem', color: '#3a3530', fontWeight: 500 }}>
                        AI Ninja transforms your resume into a strategic advantage, calling you daily to simulate high-stakes interviews with institutional precision.
                    </p>

                    <div className="flex flex-wrap justify-center gap-4">
                        <button
                            onClick={onStart}
                            className="flex items-center gap-3 font-black transition-all hover:-translate-y-1 group"
                            style={{ height: '52px', padding: '0 2rem', fontSize: '1rem', background: '#1a3a5f', color: '#ffffff', borderRadius: '12px', border: 'none', cursor: 'pointer', boxShadow: '0 8px 20px rgba(26,58,95,0.20)' }}
                        >
                            Initialize Protocol <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
                        </button>
                        <button
                            className="flex items-center gap-3 font-black transition-all hover:-translate-y-1"
                            style={{ height: '52px', padding: '0 2rem', fontSize: '1rem', background: '#ffffff', color: '#1a3a5f', borderRadius: '12px', border: '1.5px solid rgba(0,0,0,0.12)', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
                        >
                            View Global Rankings <ExternalLink size={16} style={{ color: '#c5a059' }} />
                        </button>
                    </div>

                    <div className="flex flex-wrap justify-center items-center gap-8 mt-16" style={{ opacity: 0.5 }}>
                        {['Twilio Enterprise', 'Neural Engines', 'Global Leaderboards'].map(label => (
                          <div key={label} className="flex items-center gap-2">
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#c5a059' }} />
                            <span className="font-black tracking-widest text-xs uppercase" style={{ color: '#2a2520' }}>{label}</span>
                          </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* METHODOLOGY SECTION */}
            <section style={{ background: '#f5f4ed', padding: '5rem 0', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="font-black tracking-tight mb-3" style={{ fontFamily: "'Instrument Serif', serif", fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', color: '#1a3a5f', fontWeight: 400 }}>
                            The Elite Performance Loop
                        </h2>
                        <p style={{ color: '#4a4540', fontSize: '1.1rem', fontWeight: 500, opacity: 0.8 }}>
                            Systematic preparation for the world's most competitive roles.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { icon: <ShieldCheck size={28} />, title: "Neural Extraction", desc: "Our AI dissects your profile to map your depth in system design, behavior, and leadership." },
                            { icon: <PhoneCall size={28} />, title: "Daily Simulations", desc: "No scripts. No prompts. Real voice interactions that challenge your ability to think under pressure.", gold: true },
                            { icon: <TrendingUp size={28} />, title: "Progressive Mastery", desc: "Receive immediate, actionable feedback after every call and track your climb on the global leaderboard." },
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(0,0,0,0.06)' }}
                                style={{
                                  padding: '2.5rem',
                                  borderRadius: '2rem',
                                  background: feature.gold ? '#c5a059' : '#ffffff',
                                  border: feature.gold ? '1px solid #c5a059' : '1px solid rgba(0,0,0,0.08)',
                                  boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                                  transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)'
                                }}
                            >
                                <div className="mb-6 flex items-center justify-center w-14 h-14 rounded-2xl" style={{ 
                                    background: feature.gold ? 'rgba(255,255,255,0.2)' : 'rgba(26,58,95,0.05)', 
                                    color: feature.gold ? '#ffffff' : '#1a3a5f' 
                                }}>
                                    {feature.icon}
                                </div>
                                <h3 className="font-black mb-3" style={{ fontSize: '1.25rem', color: feature.gold ? '#ffffff' : '#1a3a5f', fontFamily: "'Instrument Serif', serif", fontWeight: 400 }}>{feature.title}</h3>
                                <p style={{ fontSize: '0.95rem', color: feature.gold ? 'rgba(255,255,255,0.95)' : '#6b6560', lineHeight: 1.6, fontWeight: 500 }}>{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AINinja;
