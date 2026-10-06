import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  X,
  Home,
  Briefcase,
  Bot,
  ClipboardList,
  Mic,
  CreditCard,
  User,
  LogOut,
  FileText,
  ScanLine,
  Sparkles,
  MousePointerClick,
  Lock
} from 'lucide-react';
import { BRAND } from '../config/branding';
import BrandLogo from './BrandLogo';

const SideMenu = ({ isOpen, onClose, isStatic = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout, user } = useAuth();

  const handleNavigation = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
    onClose();
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    onClose();
  };

  const menuItems = [
    { icon: ScanLine, label: 'Resume Scanner', path: '/scanner', highlight: true },
    { icon: Briefcase, label: 'Jobs / Job Search', path: '/jobs' },
    { icon: Bot, label: 'AI Ninja', path: '/ai-ninja' },
    { icon: ClipboardList, label: 'Application Tracker', path: '/dashboard', requiresAuth: true },
    { icon: FileText, label: 'My Resumes', path: '/resumes', requiresAuth: true },
    { icon: Mic, label: 'Interview Prep', path: '/interview-prep' },
    { icon: MousePointerClick, label: 'Auto-Fill Applications', path: '/dashboard?tab=profile', requiresAuth: true, locked: true },
    { icon: CreditCard, label: 'Pricing', path: '/pricing' },
  ];

  const accountItems = [
    { icon: User, label: 'My Profile', path: '/dashboard?tab=profile', requiresAuth: true },
  ];

  return (
    <>
      {/* Overlay - only if not static */}
      {!isStatic && (
        <div
          className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[999] transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
          onClick={onClose}
        />
      )}

      {/* Side Menu */}
      <div className={`fixed top-0 left-0 h-full bg-background z-[1000] flex flex-col transition-transform duration-300 ease-in-out border-r border-border/40 shadow-[1px_0_0_0_rgba(0,0,0,0.08)] dark:shadow-[1px_0_0_0_rgba(255,255,255,0.1)] ${isStatic ? 'w-64 relative translate-x-0' : `w-72 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}`}>
        {/* Header - Only show if NOT static */}
        {!isStatic && (
          <div className="h-16 flex shrink-0 items-center justify-between px-6 border-b border-border/40">
            <button onClick={() => handleNavigation('/')} className="flex items-center">
              <BrandLogo className="scale-90 origin-left" />
            </button>
            <button onClick={onClose} className="p-2 -mr-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-secondary transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 flex flex-col gap-6">
          <div className="flex flex-col">
            <span className="block px-6 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/50">Navigation</span>
            {menuItems.map((item) => {
              if (item.requiresAuth && !isAuthenticated) return null;
              const isActive = location.pathname === item.path || (item.path.includes('?tab=') && location.search.includes(item.path.split('?')[1]));
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    if (item.locked) return;
                    handleNavigation(item.path);
                  }}
                  className={`flex items-center gap-3 px-6 py-2.5 text-sm font-medium transition-colors w-full text-left
                    ${isActive ? 'text-foreground bg-secondary font-semibold' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'}
                    ${item.locked ? 'opacity-70 cursor-not-allowed' : ''}
                  `}
                >
                  <div className="relative shrink-0">
                    {typeof item.icon === 'string' ? (
                      <img src={item.icon} alt={item.label} className="object-contain w-5 h-5" />
                    ) : (
                      <item.icon className="w-5 h-5" />
                    )}
                    {item.locked && (
                      <div className="absolute -top-1 -right-1 bg-background rounded-full p-[1px] border border-border">
                        <Lock className="w-2.5 h-2.5 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <span className="truncate">{item.label}</span>
                  {item.locked && <span className="ml-auto text-[10px] uppercase font-bold bg-secondary text-muted-foreground px-1.5 py-0.5 rounded border border-border">Soon</span>}
                </button>
              );
            })}
          </div>

          {isAuthenticated && (
            <div className="flex flex-col">
              <span className="block px-6 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/50">Account</span>
              {accountItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className="flex items-center gap-3 px-6 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors w-full text-left"
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
              <button 
                onClick={handleLogout} 
                className="flex items-center gap-3 px-6 py-2.5 text-sm font-medium text-red-600/80 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors w-full text-left mt-2"
              >
                <LogOut className="w-5 h-5 shrink-0" />
                <span className="truncate">Logout</span>
              </button>
            </div>
          )}

          {!isAuthenticated && (
            <div className="flex flex-col mt-auto pb-4">
              <span className="block px-6 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/50">Account</span>
              <button
                onClick={() => handleNavigation('/login')}
                className="flex items-center gap-3 px-6 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors w-full text-left"
              >
                <User className="w-5 h-5 shrink-0" />
                <span className="truncate">Login</span>
              </button>
              <div className="px-6 mt-4">
                <button
                  onClick={() => handleNavigation('/signup')}
                  className="vercel-button w-full"
                >
                  Start now for free
                </button>
              </div>
            </div>
          )}
        </nav>

        {/* Footer */}
        <div className="shrink-0 p-6 border-t border-border/40 mt-auto">
          <button
            onClick={() => handleNavigation('/refund-policy')}
            className="text-xs text-muted-foreground hover:text-foreground mb-2 transition-colors block"
          >
            Refund Policy
          </button>
          <p className="text-xs text-muted-foreground/70">{BRAND.tagline}</p>
        </div>
      </div>
    </>
  );
};

export default SideMenu;

