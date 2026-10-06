import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../LandingPage.css';
import posthog from 'posthog-js';

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

  return (
    <div className="lp-root">
      {/* ── NAVBAR ─────────────────────────────────────────────── */}
      <nav className="lp-nav">
        <div className="nav-inner">
          <a href="/" className="nav-logo">JobNinjas®</a>
          <div className="nav-links">
            <a href="#interviews" className="nav-link">AI Interviews</a>
            <a href="#optimize" className="nav-link">Profile Optimization</a>
            <button 
              className="liquid-glass px-6 py-2 rounded-full text-xs font-semibold tracking-wide"
              onClick={() => navigate('/login')}
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* ── SECTION 1: HERO ────────────────────────────────────── */}
      <section className="hero-wrapper">
        <img 
          src="/hero-interview.jpg" 
          alt="Cinematic Interview" 
          className="hero-bg-img"
        />
        <div className="hero-content lp-container">
          <h1 className="headline-hero animate-fade-rise">
            Stop Failing Interviews.<br />
            <span className="muted-line">You Deserve to Win.</span>
          </h1>
          <p className="hero-subtext animate-fade-rise delay-200">
            JobNinjas prepares you to think, speak, and perform under pressure — so when you're 
            sitting across from your interviewer, you don’t hesitate, freeze, or guess.
          </p>
          <div className="animate-fade-rise delay-400 mt-8">
            <button 
              className="liquid-glass px-14 py-5 rounded-full text-base font-semibold"
              onClick={handleCTA}
            >
              Start Your Interview
            </button>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: PROBLEM ─────────────────────────────────── */}
      <section className="lp-section">
        <div className="section-text-only animate-fade-rise">
          <h2 className="headline-section">
            You’re not failing interviews because you’re not smart.
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed mt-6">
            You fail because you hesitate. You overthink. You lose clarity under pressure.<br />
            And no course actually trains that.
          </p>
        </div>
      </section>

      {/* ── SECTION 3: CORE PILLARS ────────────────────────────── */}
      <section id="interviews" className="lp-section">
        <div className="lp-container">
          <h2 className="headline-section animate-fade-rise">
            Master Every Interaction.<br />
            <span className="muted-line">Performance over knowledge.</span>
          </h2>
          <div className="grid-3 animate-fade-rise delay-200">
            <div className="card-minimal">
              <h3 className="card-title">AI Interview by Call</h3>
              <p className="card-desc">Real-time voice simulations that mimic high-stakes phone screenings. Practice composure and clarity on the move.</p>
            </div>
            <div className="card-minimal">
              <h3 className="card-title">AI Interview in App</h3>
              <p className="card-desc">Comprehensive visual and text-based mock interviews. Get immediate feedback on tone, structure, and impact.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: PROFILE OPTIMIZATION ──────────────────────── */}
      <section id="optimize" className="lp-section" style={{ background: '#020c1b' }}>
        <div className="lp-container">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-rise">
              <h2 className="headline-section">
                Profile Optimization.<br />
                <span className="muted-line">Your growth roadmap.</span>
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed mt-6">
                Based on your resume, we generate a custom guide of high-impact projects, certifications, and improvements that specifically target the gaps in your profile.
              </p>
              <button 
                className="liquid-glass px-10 py-4 rounded-full mt-10 font-semibold"
                onClick={() => navigate('/profile-optimization')}
              >
                View Optimization Guide
              </button>
            </div>
            <div className="card-minimal border border-white/5 bg-white/[0.02] p-8 rounded-2xl animate-fade-rise delay-200">
              <div className="space-y-6">
                <div className="opacity-50 text-xs tracking-widest uppercase">Targeted Insights</div>
                <div className="flex gap-4 items-start">
                  <div className="w-2 h-2 rounded-full bg-white mt-2" />
                  <div>
                    <div className="text-white font-medium">Project Delta</div>
                    <div className="text-sm text-muted-foreground mt-1">Implement a distributed caching system to demonstrate high-scale architecture knowledge.</div>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-2 h-2 rounded-full bg-white mt-2" />
                  <div>
                    <div className="text-white font-medium">AWS Solutions Architect</div>
                    <div className="text-sm text-muted-foreground mt-1">Recommended certification to validate your cloud engineering expertise for Senior roles.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: HOW IT WORKS ────────────────────────────── */}
      <section id="mock-interviews" className="lp-section">
        <div className="lp-container">
          <h2 className="headline-section animate-fade-rise">Train like it's real.</h2>
          <div className="steps-container mt-12">
            {[
              "Simulate real interviews",
              "Get immediate feedback",
              "Improve weak points",
              "Repeat until natural"
            ].map((step, i) => (
              <div key={i} className="step-item animate-fade-rise" style={{ animationDelay: `${(i+1)*200}ms` }}>
                <h3 className="step-title">
                  <span className="step-num">0{i+1}</span>
                  {step}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 5: SOCIAL PROOF ────────────────────────────── */}
      <section id="resources" className="lp-section" style={{ background: '#020c1b' }}>
        <div className="lp-container text-center">
          <h2 className="headline-section animate-fade-rise">
            People don’t improve by watching.<br />
            <span className="muted-line">They improve by doing.</span>
          </h2>
          <div className="flex flex-col md:flex-row justify-center gap-16 mt-16 animate-fade-rise delay-200">
            <div>
              <div className="text-6xl font-display text-white">500+</div>
              <p className="text-muted-foreground uppercase tracking-widest text-xs mt-4">Mock Interviews Completed</p>
            </div>
            <div>
              <div className="text-6xl font-display text-white">92%</div>
              <p className="text-muted-foreground uppercase tracking-widest text-xs mt-4">Confidence Improvement</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 6: FINAL CTA ───────────────────────────────── */}
      <section className="lp-section text-center">
        <div className="lp-container animate-fade-rise">
          <h2 className="headline-section">
            Your next interview is already decided.
          </h2>
          <p className="text-xl text-muted-foreground mt-4 mb-12">
            The only question is whether you show up prepared.
          </p>
          <button 
            className="liquid-glass px-16 py-6 rounded-full text-lg font-semibold"
            onClick={handleCTA}
          >
            Start Your Interview
          </button>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────── */}
      <footer className="lp-footer">
        <div className="footer-inner">
          <div className="font-display text-2xl text-white">JobNinjas®</div>
          <div className="footer-links">
            <a href="/terms" className="hover:text-white transition-colors">Terms</a>
            <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
            <a href="/contact" className="hover:text-white transition-colors">Contact</a>
            <a href="mailto:hello@jobninjas.pro" className="hover:text-white transition-colors">hello@jobninjas.pro</a>
          </div>
          <p className="text-[10px] opacity-30 mt-8">
            © {new Date().getFullYear()} JobNinjas. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
