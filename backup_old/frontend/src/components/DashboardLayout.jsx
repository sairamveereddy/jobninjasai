import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BRAND } from '../config/branding';
import { Bell, Flame, Briefcase, FileText, Bot, BarChart2, Star, Zap, Trophy, TrendingUp } from 'lucide-react';
import BrandLogo from './BrandLogo';
import './DashboardLayout.css';

const TABS = [
  { label: 'AI Ninja',      path: '/ai-ninja',             icon: Bot        },
  { label: 'Leaderboard',   path: '/dashboard',            icon: Trophy     },
  { label: 'Reports',       path: '/ai-ninja/reports',     icon: TrendingUp },
];

const DashboardLayout = () => {
  const navigate    = useNavigate();
  const location    = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const tabRefs     = useRef([]);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  const activeIndex = TABS.findIndex(t => location.pathname.startsWith(t.path));

  useEffect(() => {
    const idx = activeIndex >= 0 ? activeIndex : 0;
    const el  = tabRefs.current[idx];
    if (el) {
      setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
    }
  }, [activeIndex, location.pathname]);

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : (user?.email?.[0]?.toUpperCase() || '?');

  return (
    <div className="dbl-wrapper">
      {/* ── Top navigation bar ── */}
      <header className="dbl-header">
        <div className="dbl-header-inner">

          {/* Logo */}
          <button onClick={() => navigate('/')} className="dbl-logo">
            <div className="dbl-logo-icon-wrap !bg-transparent !shadow-none !border-0 p-0">
              <img src={BRAND.logoPath} alt={BRAND.logoAlt} className="w-8 h-8 object-contain" />
            </div>
            <BrandLogo />
          </button>

          {/* Tab bar */}
          <nav className="dbl-tabs" aria-label="Main navigation">
            <div className="dbl-tabs-track">
              {TABS.map((tab, i) => {
                const Icon    = tab.icon;
                const isActive = location.pathname.startsWith(tab.path);
                return (
                  <button
                    key={tab.path}
                    ref={el => (tabRefs.current[i] = el)}
                    onClick={() => navigate(tab.path)}
                    className={`dbl-tab${isActive ? ' dbl-tab--active' : ''}`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <Icon className="dbl-tab-icon" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
              {/* Sliding underline indicator */}
              <div
                className="dbl-tab-indicator"
                style={{ left: indicator.left, width: indicator.width }}
                aria-hidden
              />
            </div>
          </nav>

          {/* Right-side actions */}
          <div className="dbl-right">
            {isAuthenticated ? (
              <>
                <div className="dbl-streak-pill" title="Current streak">
                  <Flame className="dbl-streak-icon" fill="currentColor" />
                  <span className="dbl-streak-num">{user?.streak_current ?? 0}</span>
                </div>
                
                <button className="dbl-icon-btn" aria-label="Notifications">
                  <Bell size={18} />
                  <span className="dbl-notif-dot" />
                </button>
                
                <div className="dbl-user-group">
                   <div className="text-right mr-3 hidden sm:block">
                     <p style={{fontSize:'0.8rem', fontWeight:700, color:'#1a3a5f', lineHeight:1.2}}>{user?.name || 'Ninja'}</p>
                     <p style={{fontSize:'0.65rem', fontWeight:700, color:'#c5a059', textTransform:'uppercase', letterSpacing:'0.1em', opacity:1}}>Pro Member</p>
                   </div>
                   <button
                    className="dbl-avatar-wrap"
                    title={user?.name || user?.email}
                    onClick={() => navigate('/profile')}
                  >
                    <div className="dbl-avatar-inner" style={{ background: '#f5f4ed' }}>{initials}</div>
                  </button>
                </div>
              </>
            ) : (
              <button className="btn-premium-primary !py-2 !px-5 !text-sm" onClick={() => navigate('/login')}>
                Sign in
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="dbl-main">
        <div className="dbl-content-container">
          <Outlet />
        </div>
      </main>

      {/* ── Mobile bottom tab bar ── */}
      <nav className="dbl-mobile-bar" aria-label="Mobile navigation">
        {TABS.map(tab => {
          const Icon    = tab.icon;
          const isActive = location.pathname.startsWith(tab.path);
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`dbl-mobile-tab${isActive ? ' dbl-mobile-tab--active' : ''}`}
            >
              <Icon size={20} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default DashboardLayout;
