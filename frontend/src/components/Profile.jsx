import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  ShieldCheck, 
  CreditCard, 
  FileText, 
  LogOut, 
  ChevronRight, 
  Lock,
  Mail,
  UserCircle,
  Calendar,
  Clock,
  Zap,
  CheckCircle2,
  AlertCircle,
  Settings as SettingsIcon,
  Crown,
  History,
  HelpCircle,
  ExternalLink,
  Save,
  ArrowRight
} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import './Profile.css';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('settings');

  const tabs = [
    { id: 'settings', label: 'Security & Profile', icon: User },
    { id: 'billing', label: 'Billing & Credits', icon: Zap },
    { id: 'legal', label: 'Resources & Legal', icon: FileText },
  ];

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : (user?.email?.[0]?.toUpperCase() || '?');

  const renderContent = () => {
    switch (activeTab) {
      case 'settings':
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Personal Info */}
              <Card className="p-8 bg-[#eeeafc] border border-black/5 rounded-2xl space-y-6 shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[var(--jobninjas-accent)]/10 border border-[var(--jobninjas-accent)]/20 rounded-xl flex items-center justify-center text-[var(--jobninjas-accent)]">
                    <UserCircle size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-[var(--text-main)] tracking-tight">Identity Details</h3>
                    <p className="text-[10px] font-medium text-[#5c5c7a] uppercase tracking-wider">Public Profile Data</p>
                  </div>
                </div>
                
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-medium text-[#5c5c7a] uppercase tracking-widest ml-1">Full Name</label>
                    <input 
                      type="text" 
                      defaultValue={user?.name || ''} 
                      className="w-full bg-[#faf9ff] border border-black/5 rounded-xl px-5 py-3 text-sm font-light text-[var(--text-main)] focus:outline-none focus:ring-1 focus:ring-[var(--jobninjas-accent)]/40 focus:bg-[#eeeafc] transition-all" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-medium text-[#5c5c7a] uppercase tracking-widest ml-1">Verified Email</label>
                    <div className="relative group">
                      <input 
                        type="email" 
                        value={user?.email || ''} 
                        disabled 
                        className="w-full bg-[#eeeafc]/80 border border-black/5 rounded-xl px-5 py-3 text-sm font-light text-[#5c5c7a] cursor-not-allowed" 
                      />
                      <Lock size={14} className="absolute right-5 top-1/2 -translate-y-1/2 text-[var(--text-main)]/10" />
                    </div>
                  </div>
                </div>
                
                <Button className="w-full btn-premium-primary h-12 rounded-xl text-xs font-medium uppercase tracking-wider gap-2">
                   <Save size={16} /> Update Identity
                </Button>
              </Card>

              {/* Security */}
              <Card className="p-8 bg-[#eeeafc] border border-black/5 rounded-2xl space-y-6 shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-500">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-[var(--text-main)] tracking-tight">Access Control</h3>
                    <p className="text-[10px] font-medium text-[#5c5c7a] uppercase tracking-wider">Security & Verification</p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-medium text-[#5c5c7a] uppercase tracking-widest ml-1">New Password</label>
                    <input 
                      type="password" 
                      placeholder="••••••••" 
                      className="w-full bg-[#faf9ff] border border-black/5 rounded-xl px-5 py-3 text-sm font-light text-[var(--text-main)] focus:outline-none focus:ring-1 focus:ring-emerald-500/40 focus:bg-[#eeeafc] transition-all" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-medium text-[#5c5c7a] uppercase tracking-widest ml-1">Confirm Password</label>
                    <input 
                      type="password" 
                      placeholder="••••••••" 
                      className="w-full bg-[#faf9ff] border border-black/5 rounded-xl px-5 py-3 text-sm font-light text-[var(--text-main)] focus:outline-none focus:ring-1 focus:ring-emerald-500/40 focus:bg-[#eeeafc] transition-all" 
                    />
                  </div>
                </div>

                <Button variant="outline" className="w-full h-12 border border-emerald-500/20 rounded-xl text-xs font-medium uppercase tracking-wider gap-2 text-emerald-500 hover:bg-emerald-500/5 transition-all">
                   Change Password
                </Button>
              </Card>
            </div>
          </div>
        );
      case 'billing':
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Current Plan */}
              <Card className="p-8 bg-gradient-to-br from-[#eeeafc] to-white border border-black/5 rounded-2xl space-y-8 text-[var(--text-main)] relative overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--jobninjas-accent)]/5 rounded-full blur-[80px]" />
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-10">
                    <div className="space-y-2">
                      <Badge className="bg-[var(--jobninjas-accent)]/10 text-[var(--jobninjas-accent)] border border-[var(--jobninjas-accent)]/20 font-medium text-[9px] px-2 py-0.5 uppercase tracking-wider">
                        ACTIVE PLAN
                      </Badge>
                      <h3 className="text-3xl font-medium tracking-tight">
                        {user?.subscription_tier ? user.subscription_tier.replace('ninja-', '').toUpperCase() : 'FREE CADET'}
                      </h3>
                    </div>
                    <div className="w-12 h-12 bg-[#e8e3f8] rounded-xl flex items-center justify-center border border-black/10">
                        <Crown className="text-[var(--jobninjas-accent)]" size={24} />
                    </div>
                  </div>

                  <div className="space-y-4 mb-10">
                    <div className="flex items-center gap-3 text-[#5c5c7a]">
                      <CheckCircle2 size={16} className="text-emerald-500" />
                      <span className="text-sm font-light">
                        {user?.subscription_tier === 'ninja-starter' && "Weekly Combat Session"}
                        {user?.subscription_tier === 'ninja-pro' && "Bi-Daily Combat Support"}
                        {user?.subscription_tier === 'ninja-elite' && "Unlimited Daily Protocol"}
                        {!user?.subscription_tier && "Pay-per-Session Protocol"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[#5c5c7a]">
                      <CheckCircle2 size={16} className="text-emerald-500" />
                      <span className="text-sm font-light">AI Tactical Reports</span>
                    </div>
                  </div>

                  <Button onClick={() => navigate('/pricing')} className="w-full btn-premium-primary h-12 rounded-xl text-xs font-medium uppercase tracking-wider gap-2">
                     Manage Subscription
                  </Button>
                </div>
              </Card>

              {/* Credits */}
              <Card className="p-8 bg-[#eeeafc] border border-black/5 rounded-2xl flex flex-col justify-between items-center text-center space-y-6 shadow-xl">
                <div className="space-y-2">
                    <Badge className="bg-[#e8e3f8] text-[#5c5c7a] border border-black/5 font-medium text-[9px] px-2 py-0.5 uppercase tracking-wider">
                        RESERVE CREDITS
                    </Badge>
                    <h3 className="text-lg font-medium text-[var(--text-main)]">Combat Balance</h3>
                </div>

                <div className="space-y-1">
                    <div className="text-6xl font-medium text-[var(--text-main)] tracking-tighter">{user?.credits_balance ?? 0}</div>
                    <p className="text-[10px] font-medium text-[#5c5c7a] uppercase tracking-widest">SESSIONS AVAILABLE</p>
                </div>

                <p className="text-sm text-[#5c5c7a] font-light leading-relaxed max-w-[240px]">
                    Non-recurring units for on-demand tactical sessions.
                </p>

                <Button onClick={() => navigate('/pricing')} variant="outline" className="w-full h-12 border border-black/10 rounded-xl text-xs font-medium uppercase tracking-wider gap-2 text-[#5c5c7a] hover:bg-[#e8e3f8] hover:text-[var(--text-main)] transition-all">
                   Acquire Reserves
                </Button>
              </Card>
            </div>
          </div>
        );

      case 'legal':
        return (
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { 
                title: 'Terms of Engagement', 
                desc: 'Strategic agreements regarding AI-generated content and professional ethics.',
                link: '/terms',
                icon: FileText,
                color: 'text-[#5c5c7a]',
                bg: 'bg-[#e8e3f8]'
              },
              { 
                title: 'Refund Policy', 
                desc: 'Standard protocol for subscription modifications and resource cancellations.',
                link: '/refund-policy',
                icon: ShieldCheck,
                color: 'text-[var(--jobninjas-accent)]',
                bg: 'bg-[var(--jobninjas-accent)]/10'
              },
              { 
                title: 'Privacy Protocol', 
                desc: 'How we secure your tactical data and session transcripts.',
                link: '/privacy-policy',
                icon: Lock,
                color: 'text-emerald-500',
                bg: 'bg-emerald-500/10'
              },
              { 
                title: 'Help Center', 
                desc: 'Direct support line for technical anomalies or strategy clarification.',
                link: '/contact',
                icon: HelpCircle,
                color: 'text-[#8b5cf6]',
                bg: 'bg-[#8b5cf6]/10'
              },
            ].map((item, i) => (
              <Card key={i} className="p-8 bg-[#eeeafc] border border-black/5 rounded-2xl space-y-6 hover:border-[var(--jobninjas-accent)]/20 transition-all group cursor-pointer shadow-xl" onClick={() => navigate(item.link)}>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${item.bg} ${item.color} rounded-xl flex items-center justify-center border border-black/5`}>
                    <item.icon size={22} />
                  </div>
                  <div>
                    <h3 className="font-medium text-[var(--text-main)] tracking-tight">{item.title}</h3>
                    <p className="text-[10px] font-medium text-[#5c5c7a] uppercase tracking-wider">Legal Document</p>
                  </div>
                </div>
                <p className="text-sm text-[#5c5c7a] font-light leading-relaxed">{item.desc}</p>
                <div className="flex items-center gap-2 text-[var(--jobninjas-accent)] font-medium text-[10px] uppercase tracking-wider group-hover:gap-4 transition-all">
                  Access Document <ArrowRight size={14} />
                </div>
              </Card>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-12 space-y-12 bg-[#faf9ff]">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="flex items-center gap-8">
            <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--jobninjas-accent)] to-[#8b5cf6] p-[1px] shadow-xl">
                    <div className="w-full h-full bg-[#eeeafc] rounded-[15px] flex items-center justify-center text-2xl font-medium text-[var(--text-main)]">
                        {initials}
                    </div>
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 border-[3px] border-white rounded-xl flex items-center justify-center text-white">
                    <ShieldCheck size={14} strokeWidth={3} />
                </div>
            </div>
            <div className="space-y-1.5">
                <h1 className="text-3xl font-medium text-[var(--text-main)] tracking-tight">{user?.name || 'Ninja Participant'}</h1>
                <div className="flex items-center gap-4">
                    <Badge className="bg-[var(--jobninjas-accent)]/10 text-[var(--jobninjas-accent)] border-none font-medium text-[9px] px-2 py-0.5 uppercase tracking-wider">
                        TIER 1 ARCHITECT
                    </Badge>
                    <span className="text-[#5c5c7a] text-xs font-light flex items-center gap-2">
                        <Calendar size={12} /> Member since 2024
                    </span>
                </div>
            </div>
        </div>

        <Button onClick={logout} variant="outline" className="rounded-xl border border-rose-500/20 text-rose-500 font-medium text-[10px] uppercase tracking-wider gap-2 h-10 px-6 hover:bg-rose-500/10 hover:border-rose-500/40 transition-all">
            <LogOut size={16} /> Disconnect
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center">
        <div className="bg-[#eeeafc] p-1 rounded-xl flex items-center gap-1 border border-black/5">
            {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
                <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 px-6 py-2.5 rounded-lg transition-all duration-300 relative ${isActive ? 'text-[var(--text-main)]' : 'text-[#5c5c7a] hover:text-[#5c5c7a]'}`}
                >
                {isActive && (
                    <motion.div
                    layoutId="activeTabProfile"
                    className="absolute inset-0 bg-[#e8e3f8] border border-black/10 rounded-lg shadow-xl"
                    transition={{ type: 'spring', bounce: 0.1, duration: 0.6 }}
                    />
                )}
                <Icon size={16} className="relative z-10" />
                <span className="relative z-10 text-[11px] font-medium uppercase tracking-wider">{tab.label}</span>
                </button>
            );
            })}
        </div>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {renderContent()}
      </motion.div>
    </div>
  );
};

export default Profile;

