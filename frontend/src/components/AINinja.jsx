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
import BrandLogo from './BrandLogo';

// Sub-components
import AINinjaV2 from './ai-ninja/v2/AINinjaV2';
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
    if (path.includes('/onboard')) return <AINinjaV2 />;
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
        <div className="bg-[#f5f3ff] min-h-screen text-[var(--text-main)] overflow-hidden">
            {/* HERO SECTION */}
            <section className="relative pt-32 pb-24 overflow-hidden">
                {/* Background Ambient Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[radial-gradient(circle_at_50%_0%,rgba(94,106,210,0.06)_0%,transparent_70%)] pointer-events-none" />
                
                <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#faf9ff] border border-black/10 text-[10px] font-medium uppercase tracking-[0.2em] mb-8 text-[#5c5c7a]"
                    >
                        <Sparkles size={12} className="text-[var(--jobninjas-accent)]" />
                        The Elite Standard of Interview Mastery
                    </motion.div>

                    <BrandLogo className="justify-center mb-6" hideText={true} />

                    <h1 className="text-5xl md:text-7xl font-medium tracking-tight leading-tight mb-8 text-[var(--text-main)]">
                        Master the{' '}
                        <span className="text-[var(--jobninjas-accent)] italic">Conversation.</span>
                    </h1>

                    <p className="max-w-2xl mx-auto mb-12 text-lg md:text-xl text-[#5c5c7a] font-light leading-relaxed">
                        AI Ninja transforms your profile into a strategic advantage, simulating high-stakes interviews with institutional precision.
                    </p>

                    <div className="flex flex-wrap justify-center gap-4">
                        <button
                            onClick={onStart}
                            className="btn-premium-primary h-12 px-8 text-xs uppercase tracking-widest group"
                        >
                            Initialize Protocol <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
                        </button>
                        <button
                            onClick={() => navigate('/ai-ninja/leaderboard')}
                            className="btn-premium-outline h-12 px-8 text-xs uppercase tracking-widest group"
                        >
                            Global Rankings <ExternalLink size={14} className="ml-2 text-[#5c5c7a]" />
                        </button>
                    </div>

                    <div className="flex flex-wrap justify-center items-center gap-8 mt-20 opacity-30">
                        {['Voice Recognition', 'Neural Synthesis', 'Real-time feedback'].map(label => (
                          <div key={label} className="flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-[var(--jobninjas-accent)]" />
                            <span className="text-[10px] font-medium uppercase tracking-widest text-[#5c5c7a]">{label}</span>
                          </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* METHODOLOGY SECTION */}
            <section className="py-24 relative">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-medium tracking-tight mb-4">
                            The Elite Performance Loop
                        </h2>
                        <p className="text-[#5c5c7a] text-lg font-light">
                            Systematic preparation for the world's most competitive roles.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { 
                              icon: <ShieldCheck size={24} />, 
                              title: "Neural Extraction", 
                              desc: "Our AI dissects your profile to map your depth in system design, behavior, and leadership." 
                            },
                            { 
                              icon: <PhoneCall size={24} />, 
                              title: "Daily Simulations", 
                              desc: "No scripts. Real voice interactions that challenge your ability to think under pressure.",
                              active: true
                            },
                            { 
                              icon: <TrendingUp size={24} />, 
                              title: "Progressive Mastery", 
                              desc: "Receive immediate feedback after every call and track your climb on the global leaderboard." 
                            },
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -4 }}
                                className={cn(
                                  "p-10 rounded-2xl border transition-all duration-300",
                                  feature.active 
                                    ? "bg-[#faf9ff] border-[var(--jobninjas-accent)]/30 shadow-[0_0_40px_rgba(94,106,210,0.06)]" 
                                    : "bg-[#eeeafc] border-black/5"
                                )}
                            >
                                <div className={cn(
                                    "mb-8 flex items-center justify-center w-12 h-12 rounded-xl border transition-colors",
                                    feature.active 
                                      ? "bg-[var(--jobninjas-accent)]/10 border-[var(--jobninjas-accent)]/20 text-[var(--jobninjas-accent)]" 
                                      : "bg-[#e8e3f8] border-black/5 text-[#5c5c7a]"
                                )}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-medium mb-4 text-[var(--text-main)]">{feature.title}</h3>
                                <p className="text-sm text-[#5c5c7a] font-light leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AINinja;
