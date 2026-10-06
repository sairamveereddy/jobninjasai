import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Mail, Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import BrandLogo from './BrandLogo';

const Signup = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signup, isAuthenticated, loading: authLoading } = useAuth();
  const referralCode = searchParams.get('ref');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Turnstile State
  const turnstileRef = React.useRef(null);
  const [turnstileToken, setTurnstileToken] = useState(null);

  // Render Turnstile
  useEffect(() => {
    const renderTurnstile = () => {
      const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      if (window.turnstile && turnstileRef.current && !isLocal) {
        try {
          window.turnstile.render(turnstileRef.current, {
            sitekey: '0x4AAAAAAACeyHCDFw5HGsmjQ',
            callback: function (token) {
              setTurnstileToken(token);
              setError('');
            },
            'error-callback': function() {
              console.warn('Turnstile failed to load, falling back to permissive mode.');
              if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                setTurnstileToken('local-dev-token');
              }
            }
          });
        } catch (e) {
          console.error('Turnstile render error:', e);
        }
      }
    };

    if (window.turnstile) {
      renderTurnstile();
    } else {
      const interval = setInterval(() => {
        if (window.turnstile) {
          clearInterval(interval);
          renderTurnstile();
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, authLoading, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (!turnstileToken && !isLocal) {
      setError('Please complete the security check.');
      return;
    }

    setSubmitting(true);

    try {
      const result = await signup(formData.email, formData.password, formData.name, referralCode, turnstileToken || 'local-bypass');
      if (result.success) {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#f5f3ff] min-h-screen text-[var(--text-main)] flex flex-col relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-[radial-gradient(circle_at_50%_0%,rgba(94,106,210,0.06)_0%,transparent_70%)] pointer-events-none" />

      <nav className="w-full max-w-7xl mx-auto flex justify-between items-center py-8 px-6 relative z-10">
        <Link to="/" className="flex items-center">
          <BrandLogo className="!text-xl" />
        </Link>
        <Link to="/login" className="text-xs font-medium uppercase tracking-widest text-[#5c5c7a] hover:text-[var(--text-main)] transition-colors">
          Sign In
        </Link>
      </nav>

      <div className="flex-grow flex items-center justify-center px-6 relative z-10 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[480px]"
        >
          <div className="bg-[#eeeafc] border border-black/5 rounded-2xl p-8 md:p-10 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--jobninjas-accent)] to-transparent opacity-30" />
            
            <div className="text-center mb-10">
              <h1 className="text-3xl font-medium tracking-tight mb-3">Create profile</h1>
              <p className="text-[#5c5c7a] text-sm font-light">
                Initialize your professional AI career gateway.
              </p>
            </div>

            {error && (
              <div className="mb-8 p-4 bg-red-500/5 border border-red-500/10 text-red-600 text-xs rounded-lg flex items-center gap-3">
                <div className="w-1 h-1 rounded-full bg-red-500 shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-1 ml-0.5">
                  <User size={12} className="text-[#8e8ea8]" />
                  <Label className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#5c5c7a]">
                    Full Name
                  </Label>
                </div>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="h-12 bg-[#faf9ff] border-black/10 text-[var(--text-main)] placeholder:text-black/20 rounded-lg focus:border-[var(--jobninjas-accent)]/50 transition-all text-sm"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-1 ml-0.5">
                  <Mail size={12} className="text-[#8e8ea8]" />
                  <Label className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#5c5c7a]">
                    Email Address
                  </Label>
                </div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="h-12 bg-[#faf9ff] border-black/10 text-[var(--text-main)] placeholder:text-black/20 rounded-lg focus:border-[var(--jobninjas-accent)]/50 transition-all text-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-1 ml-0.5">
                    <Lock size={12} className="text-[#8e8ea8]" />
                    <Label className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#5c5c7a]">
                      Password
                    </Label>
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="h-12 bg-[#faf9ff] border-black/10 text-[var(--text-main)] placeholder:text-black/20 rounded-lg focus:border-[var(--jobninjas-accent)]/50 transition-all text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-1 ml-0.5">
                    <Lock size={12} className="text-[#8e8ea8]" />
                    <Label className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#5c5c7a]">
                      Confirm
                    </Label>
                  </div>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="h-12 bg-[#faf9ff] border-black/10 text-[var(--text-main)] placeholder:text-black/20 rounded-lg focus:border-[var(--jobninjas-accent)]/50 transition-all text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-center py-2">
                <div ref={turnstileRef} className="opacity-50 scale-90"></div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full h-12 bg-[var(--jobninjas-accent)] hover:bg-[#4c57b5] text-[var(--text-main)] font-medium rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 active:scale-[0.98] text-xs uppercase tracking-widest shadow-lg shadow-[var(--jobninjas-accent)]/20"
              >
                {submitting ? 'Initializing...' : 'Create Account'}
                {!submitting && <ArrowRight size={14} />}
              </button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-[10px] text-[#8e8ea8] font-light leading-relaxed">
                By creating an account, you agree to our{' '}
                <Link to="/terms" className="text-[#5c5c7a] hover:text-[var(--text-main)] underline underline-offset-4">Legal Protocol</Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-[#5c5c7a] hover:text-[var(--text-main)] underline underline-offset-4">Privacy Framework</Link>.
              </p>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 opacity-40 text-[10px] uppercase tracking-[0.2em] text-[#8e8ea8] font-medium">
            <ShieldCheck size={12} className="text-[var(--jobninjas-accent)]" />
            <span>Encrypted Registration Protocol</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
