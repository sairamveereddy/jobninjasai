import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
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
  AlertCircle
} from 'lucide-react';
import './Profile.css';
import { apiCall } from '../config/api';
import { useNavigate } from 'react-router-dom';
import { PRICING } from '../config/branding';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('settings');

  const tabs = [
    { id: 'settings', label: 'User Settings', icon: User },
    { id: 'billing', label: 'Billing & Plans', icon: CreditCard },
    { id: 'legal', label: 'Legal & Policies', icon: FileText },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'settings':
        return (
          <div className="profile-section animate-fade-in">
            <h2 className="section-title">Account Settings</h2>
            <div className="settings-grid">
              <div className="settings-card">
                <div className="card-header">
                  <UserCircle className="w-5 h-5 text-blue-600" />
                  <h3>Personal Information</h3>
                </div>
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" defaultValue={user?.name || ''} className="profile-input" />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" value={user?.email || ''} disabled className="profile-input disabled" />
                  <p className="helper-text">Email cannot be changed.</p>
                </div>
                <button className="btn-save">Update Profile</button>
              </div>

              <div className="settings-card">
                <div className="card-header">
                  <ShieldCheck className="w-5 h-5 text-green-600" />
                  <h3>Security</h3>
                </div>
                <div className="form-group">
                  <label>Current Password</label>
                  <input type="password" placeholder="••••••••" className="profile-input" />
                </div>
                <div className="form-group">
                  <label>New Password</label>
                  <input type="password" placeholder="Min. 8 characters" className="profile-input" />
                </div>
                <button className="btn-save">Change Password</button>
              </div>
            </div>
          </div>
        );
      case 'billing':
        return (
          <div className="profile-section animate-fade-in">
            <h2 className="section-title">Billing & Subscription</h2>
            
            <div className="billing-grid">
              {/* Subscription Status Card */}
              <div className="settings-card subscription-panel">
                <div className="card-header">
                  <Zap className="w-5 h-5 text-blue-600" />
                  <h3>Current Plan</h3>
                </div>
                <div className="plan-details">
                  <div className="plan-name-row">
                    <span className="current-plan-badge">
                      {user?.subscription_tier ? user.subscription_tier.replace('ninja-', '').toUpperCase() : 'FREE'}
                    </span>
                    <span className="plan-status-active">Active</span>
                  </div>
                  <p className="plan-description">
                    {user?.subscription_tier === 'ninja-starter' && "1 Call per week + Post-call reports"}
                    {user?.subscription_tier === 'ninja-pro' && "Every other day calls + Weekly summaries"}
                    {user?.subscription_tier === 'ninja-elite' && "Daily Ninja calls + Monthly Deep Analysis"}
                    {!user?.subscription_tier && "Pay-as-you-go / Credit based access"}
                  </p>
                  <button onClick={() => navigate('/pricing')} className="btn-manage-sub">
                    {user?.subscription_tier ? 'Upgrade Plan' : 'Choose a Plan'}
                  </button>
                </div>
              </div>

              {/* Credits Card */}
              <div className="settings-card credits-panel">
                <div className="card-header">
                  <CreditCard className="w-5 h-5 text-purple-600" />
                  <h3>Call Credits</h3>
                </div>
                <div className="credits-display-v2">
                  <div className="credits-amount">
                    <span className="count">{user?.credits_balance ?? 0}</span>
                    <span className="label">Credits</span>
                  </div>
                  <p className="credits-text">
                    Use credits for individual AI Ninja calls without a subscription.
                  </p>
                  <button onClick={() => navigate('/pricing')} className="btn-buy-credits">
                    Buy Credits ($5/call)
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'legal':
        return (
          <div className="profile-section animate-fade-in">
            <h2 className="section-title">Legal & Policies</h2>
            <div className="legal-container">
              <div className="legal-item">
                <h3>Terms and Conditions</h3>
                <p>By using JobNinjas.ai, you agree to our terms of service regarding AI-generated content and professional ethical standards.</p>
                <a href="/terms" className="legal-link">Read Full Terms <ChevronRight className="w-4 h-4" /></a>
              </div>
              <div className="legal-item">
                <h3>Refund Policy</h3>
                <p>Our goal is 100% satisfaction. Read our policy on subscription refunds and one-time credit purchases.</p>
                <a href="/refund-policy" className="legal-link">Read Refund Policy <ChevronRight className="w-4 h-4" /></a>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="profile-wrapper">
      <div className="profile-header">
        <div className="user-profile-badge">
          <div className="avatar-large">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="user-meta">
            <h1>{user?.name || 'Ninja'}</h1>
            <p className="user-role">Member since 2024</p>
          </div>
        </div>
        <button onClick={logout} className="btn-logout-header">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>

      <div className="profile-body">
        <nav className="profile-navbar">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`profile-nav-item ${activeTab === tab.id ? 'active' : ''}`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="profile-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Profile;
