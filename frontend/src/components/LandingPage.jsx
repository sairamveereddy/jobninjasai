import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { ArrowRight, Phone, Smartphone, Target, ShieldCheck, Zap, Globe, MessageSquare, Mic, Sparkles, CheckCircle } from 'lucide-react';
import posthog from 'posthog-js';
import BrandLogo from './BrandLogo';
import Pricing from './Pricing';

const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, loading, navigate]);

  const handleCTA = () => {
    posthog.capture('hero_cta_clicked', { destination: '/signup' });
    navigate('/signup');
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  };

  return (
    <div className="bg-background min-h-screen text-foreground font-geist overflow-x-hidden selection:bg-foreground selection:text-background">
      
      {/* ── NAVBAR ─────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center h-16 px-6">
          <Link to="/" className="flex items-center">
            <BrandLogo />
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#interviews" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">AI Interviews</a>
            <a href="#optimize" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Optimization</a>
            <Link to="/recruiters" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Recruiters</Link>
            <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Sign In</Link>
            <button 
              className="vercel-button h-9 px-4 text-sm"
              onClick={() => navigate('/signup')}
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* ── SECTION 1: HERO ────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-6 overflow-hidden">
        {/* Hero Background */}
        <div className="absolute inset-0 z-0 bg-background">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.05)_0%,transparent_100%)] opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background" />
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary border border-border text-foreground text-[11px] uppercase tracking-wider font-semibold mb-8 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
          >
            <BrandLogo hideText={true} className="!w-4 !h-4" />
            <Zap size={10} className="text-foreground" />
            <span>Advanced AI Career Intelligence</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1]"
          >
            Stop Failing Interviews.<br />
            <span className="text-muted-foreground">You Deserve to Win.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            <span className="font-semibold text-foreground">JobNinjas</span> prepares you to think, speak, and perform under pressure.
            Our AI simulates high-stakes environments so you never freeze again.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button 
              className="vercel-button h-12 px-8 text-sm w-full sm:w-auto"
              onClick={handleCTA}
            >
              Start Training Protocol
              <ArrowRight size={16} />
            </button>
            <button 
              className="vercel-button-outline h-12 px-8 text-sm w-full sm:w-auto"
              onClick={() => document.getElementById('interviews').scrollIntoView({ behavior: 'smooth' })}
            >
              View Capabilities
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── SECTION 2: PROBLEM ─────────────────────────────────── */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            {...fadeInUp}
            className="text-3xl md:text-4xl font-bold tracking-tight mb-8"
          >
            Intelligence isn't the problem.<br />
            <span className="text-muted-foreground">Clarity under pressure is.</span>
          </motion.h2>
          <motion.p 
            {...fadeInUp}
            className="text-lg text-muted-foreground leading-relaxed"
          >
            You fail because you hesitate. You overthink. You lose composure.<br />
            Traditional courses don't train your central nervous system. We do.
          </motion.p>
        </div>
      </section>

      {/* ── SECTION 3: CORE PILLARS ────────────────────────────── */}
      <section id="interviews" className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Master Every Interaction</h2>
            <p className="text-muted-foreground text-lg">Performance-driven training protocols for the modern professional.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div {...fadeInUp} className="vercel-card p-8 group">
              <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center text-foreground mb-6 group-hover:scale-110 transition-transform shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                <Phone size={24} />
              </div>
              <h3 className="text-xl font-semibold tracking-tight mb-3">Voice Protocol</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Real-time voice simulations via phone call that mimic high-stakes screenings. Practice composure anywhere.
              </p>
            </motion.div>

            <motion.div {...fadeInUp} transition={{ delay: 0.1 }} className="vercel-card p-8 group">
              <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center text-foreground mb-6 group-hover:scale-110 transition-transform shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                <Smartphone size={24} />
              </div>
              <h3 className="text-xl font-semibold tracking-tight mb-3">In-App Interface</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Visual and text-based mock interviews. Get precise feedback on your narrative structure and professional impact.
              </p>
            </motion.div>

            <motion.div {...fadeInUp} transition={{ delay: 0.2 }} className="vercel-card p-8 group">
              <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center text-foreground mb-6 group-hover:scale-110 transition-transform shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                <MessageSquare size={24} />
              </div>
              <h3 className="text-xl font-semibold tracking-tight mb-3">Immediate Intelligence</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Instant diagnostic reports identifying every micro-hesitation, filler word, and missed opportunity in your pitch.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: PROFILE OPTIMIZATION ──────────────────────── */}
      <section id="optimize" className="py-32 px-6 bg-secondary/30 border-y border-border/40">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div {...fadeInUp}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background border border-border text-foreground text-[11px] uppercase tracking-wider font-semibold mb-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
              <span>Roadmap Generation</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-8 leading-tight">
              Profile Optimization.<br />
              <span className="text-muted-foreground">Your growth roadmap.</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-10">
              Our neural engine analyzes your resume against target roles to generate a custom guide of projects, certifications, and skills to fill the gaps in your profile.
            </p>
            <button 
              className="vercel-button h-12 px-8 text-sm"
              onClick={() => navigate('/signup')}
            >
              Analyze Your Profile
              <ArrowRight size={16} />
            </button>
          </motion.div>
          
          <motion.div 
            {...fadeInUp}
            className="vercel-card p-8 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-foreground to-transparent opacity-10" />
            <div className="space-y-8 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                  <Target size={20} />
                </div>
                <div>
                  <div className="text-sm font-semibold">Strategic Improvement</div>
                  <div className="text-xs text-muted-foreground mt-0.5">Gap Analysis #942</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-background border border-border/40 rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-foreground">Cloud Architecture</span>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground">HIGH IMPACT</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Deploy a Kubernetes-based microservices architecture to demonstrate advanced orchestration capabilities.
                  </p>
                </div>
                
                <div className="p-4 bg-background border border-border/40 rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-foreground">Certifications</span>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground">STRATEGIC</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Obtain AWS Solutions Architect Professional to validate seniority for Lead positions.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── SECTION 5: STATS ─────────────────────────────────── */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto border-y border-border/40 py-20 flex flex-col md:flex-row justify-around gap-12 text-center">
          <motion.div {...fadeInUp}>
            <div className="text-5xl font-bold tracking-tight mb-3">500+</div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Simulations Completed</div>
          </motion.div>
          <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
            <div className="text-5xl font-bold tracking-tight mb-3">92%</div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Confidence Improvement</div>
          </motion.div>
          <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
            <div className="text-5xl font-bold tracking-tight mb-3">24/7</div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">System Availability</div>
          </motion.div>
        </div>
      </section>



      {/* ── SECTION 6: PRICING ─────────────────────────────────── */}
      <section id="pricing">
        <Pricing />
      </section>

      {/* ── SECTION 7: FINAL CTA ───────────────────────────────── */}
      <section className="py-40 px-6 relative overflow-hidden bg-background">
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">
            Your next interview is already decided.
          </h2>
          <p className="text-lg text-muted-foreground mb-12">
            The only question is whether you show up prepared.<br />
            Initialize your training protocol today.
          </p>
          <button 
            className="vercel-button h-14 px-10 text-base"
            onClick={handleCTA}
          >
            Access Intelligence Protocol
            <ArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────── */}
      <footer className="border-t border-border/40 py-20 px-6 bg-secondary/30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="space-y-6">
            <Link to="/" className="flex items-center">
              <BrandLogo />
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              Professional-grade AI career intelligence for elite candidates.
            </p>
            <div className="flex items-center gap-2 text-muted-foreground">
              <ShieldCheck size={16} />
              <span className="text-[11px] uppercase tracking-wider font-semibold">Institutional Grade Security</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 md:gap-24">
            <div className="space-y-4">
              <h4 className="text-[12px] uppercase tracking-wider font-semibold text-foreground">Platform</h4>
              <nav className="flex flex-col gap-3">
                <a href="#interviews" className="text-sm text-muted-foreground hover:text-foreground transition-colors">AI Interviews</a>
                <a href="#optimize" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Optimization</a>
                <Link to="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
              </nav>
            </div>
            <div className="space-y-4">
              <h4 className="text-[12px] uppercase tracking-wider font-semibold text-foreground">Legal</h4>
              <nav className="flex flex-col gap-3">
                <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms</Link>
                <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy</Link>
              </nav>
            </div>
            <div className="space-y-4">
              <h4 className="text-[12px] uppercase tracking-wider font-semibold text-foreground">Contact</h4>
              <nav className="flex flex-col gap-3">
                <a href="mailto:hello@jobninjas.ai" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Support</a>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">X / Twitter</a>
              </nav>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-border/40 flex justify-between items-center">
          <p className="text-[11px] text-muted-foreground uppercase tracking-wider">
            © {new Date().getFullYear()} JobNinjas. All rights reserved.
          </p>
          <div className="flex gap-4 items-center opacity-60">
            <Globe size={14} className="text-muted-foreground" />
            <span className="text-[11px] text-muted-foreground uppercase tracking-wider">Global Operations</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
