import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { Bot, UserCheck, Menu } from 'lucide-react';
import { BRAND } from '../config/branding';
import { useAuth } from '../contexts/AuthContext';
import BrandLogo from './BrandLogo';

const Navbar = ({ onOpenSideMenu, rightContent }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const currentPath = location.pathname;

  const isActive = (path) => currentPath === path;

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md h-16 flex items-center justify-between px-6 shadow-[0_1px_0_0_rgba(0,0,0,0.08)] dark:shadow-[0_1px_0_0_rgba(255,255,255,0.1)]">
      <div className="flex items-center gap-4">
        <button className="md:hidden p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-secondary transition-colors" onClick={onOpenSideMenu}>
          <Menu className="w-5 h-5" />
        </button>
        <button onClick={() => navigate('/')} className="flex items-center">
          <BrandLogo className="!text-lg font-bold tracking-tight" />
        </button>
      </div>
      <nav className="hidden md:flex items-center gap-6">
        <button 
          onClick={() => navigate('/ai-ninja')} 
          className={`flex items-center gap-2 text-sm font-medium transition-colors ${isActive('/ai-ninja') ? 'text-foreground font-semibold' : 'text-muted-foreground hover:text-foreground'}`}
        >
          <Bot className="w-4 h-4" />
          <span>AI Ninja</span>
        </button>
        <button 
          onClick={() => navigate('/human-ninja')} 
          className={`flex items-center gap-2 text-sm font-medium transition-colors ${isActive('/human-ninja') ? 'text-foreground font-semibold' : 'text-muted-foreground hover:text-foreground'}`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Human Ninja</span>
        </button>
        <button 
          onClick={() => navigate('/jobs')} 
          className={`text-sm font-medium transition-colors ${isActive('/jobs') ? 'text-foreground font-semibold' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Job Board
        </button>
        <button 
          onClick={() => navigate('/pricing')} 
          className={`text-sm font-medium transition-colors ${isActive('/pricing') ? 'text-foreground font-semibold' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Pricing
        </button>
      </nav>
      <div className="flex items-center gap-4">
        {rightContent ? (
          rightContent
        ) : (
          !isAuthenticated && (
            <>
              <Button variant="ghost" className="vercel-button-outline text-sm h-9" onClick={() => navigate('/login')}>
                Log in
              </Button>
              <Button className="vercel-button text-sm h-9" onClick={() => navigate('/signup')}>
                Start now for free
              </Button>
            </>
          )
        )}
        {isAuthenticated && !rightContent && (
             <Button variant="secondary" className="vercel-button-outline text-sm h-9" onClick={() => navigate('/dashboard')}>
                Dashboard
             </Button>
        )}
      </div>
    </header>
  );
};

export default Navbar;
