import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Menu, ArrowRight, ShieldCheck, Mail, Lock } from 'lucide-react';
import { BRAND } from '../config/branding';
import '../LandingPage.css'; // Reuse cinematic tokens

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, loading: authLoading } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, authLoading, navigate]);

  const [formData, setFormData] = useState({
    email: '',
    password: ''
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    if (!turnstileToken && !isLocal) {
      setError('Please complete the security check.');
      return;
    }

    setSubmitting(true);

    try {
      console.log('Attempting login for:', formData.email);
      const result = await login(formData.email, formData.password, turnstileToken || 'local-bypass');
      
      if (result && result.success) {
        // Redirect based on user role
        console.log('Login success, role:', result.user?.role);
        const role = result.user?.role || 'customer';
        if (role === 'admin') {
          navigate('/admin');
        } else if (role === 'employee') {
          navigate('/employee');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError('Unexpected response from server. Please try again.');
      }
    } catch (err) {
      console.error('Login error details:', err);
      setError(err.message || 'Login failed. Please check your credentials and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="lp-root relative min-h-screen overflow-hidden flex flex-col">
      {/* Background Image */}
      <img 
        src="/hero-interview.jpg"
        alt="Cinematic Background"
        className="hero-bg-img fixed inset-0 w-full h-full object-cover z-0 opacity-40 grayscale-[0.2]"
      />
      
      {/* Dark Overlay with subtle gradient */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#010813]/60 via-[#010813]/90 to-[#010813] z-5 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex-grow flex flex-col px-4">
        {/* Simple Navbar */}
        <nav className="w-full max-w-7xl mx-auto flex justify-between items-center py-8">
          <Link to="/" className="nav-logo animate-fade-rise">
            {BRAND.name}
          </Link>
          <Link to="/signup" className="nav-link text-sm animate-fade-rise opacity-70 hover:opacity-100 transition-opacity">
            Create Account
          </Link>
        </nav>

        {/* Main Card */}
        <div className="flex-grow flex items-center justify-center -mt-10">
          <div className="w-full max-w-[460px] animate-fade-rise delay-200">
            <div className="liquid-glass p-8 md:p-10 rounded-[2.5rem] border-white/5 shadow-2xl">
              <div className="text-center mb-10">
                <h1 className="text-4xl md:text-5xl font-display mb-4">Welcome back</h1>
                <p className="text-white/50 font-body text-sm tracking-wide">
                  Sign in to the AI-driven career engine
                </p>
              </div>

              {error && (
                <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-2xl flex items-center gap-3 animate-fade-rise">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-1 ml-1 opacity-40">
                    <Mail size={12} className="text-white" />
                    <Label className="text-[10px] uppercase tracking-[0.2em] font-medium text-white">
                      Email Address
                    </Label>
                  </div>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="h-14 px-6 bg-white/[0.03] border-white/10 text-white placeholder:text-white/20 rounded-2xl focus:bg-white/[0.05] focus:border-white/20 transition-all text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-1 ml-1 opacity-40">
                    <Lock size={12} className="text-white" />
                    <Label className="text-[10px] uppercase tracking-[0.2em] font-medium text-white">
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
                    className="h-14 px-6 bg-white/[0.03] border-white/10 text-white placeholder:text-white/20 rounded-2xl focus:bg-white/[0.05] focus:border-white/20 transition-all text-sm"
                  />
                </div>

                <div className="flex justify-center pt-2">
                  <div ref={turnstileRef} className="opacity-80 scale-90"></div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-15 bg-white text-black font-semibold rounded-2xl flex items-center justify-center gap-2 hover:bg-white/90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                >
                  <span className="relative z-10">
                    {submitting ? 'Authenticating...' : 'Sign In'}
                  </span>
                  {!submitting && <ArrowRight size={18} className="translate-x-0 group-hover:translate-x-1 transition-transform relative z-10" />}
                </button>
              </form>

              <div className="mt-10 text-center space-y-4">
                <p className="text-xs text-white/30 font-body">
                  By continuing, you confirm you're of legal age and agree to our{' '}
                  <Link to="/terms" className="text-white/50 hover:text-white underline">Terms</Link>
                </p>
              </div>
            </div>

            <div className="mt-8 text-center flex items-center justify-center gap-2 opacity-30 text-[11px] uppercase tracking-widest text-white">
              <ShieldCheck size={14} />
              <span>Enterprise-grade secure gateway</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
