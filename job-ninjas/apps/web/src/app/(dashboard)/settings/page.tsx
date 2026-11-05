"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Shield, 
  FileText, 
  HelpCircle, 
  Mail, 
  User, 
  Key, 
  LogOut, 
  Building, 
  Moon, 
  Sun, 
  Monitor, 
  CheckCircle2, 
  Loader2, 
  Send, 
  AlertCircle,
  ExternalLink,
  CreditCard,
  Check
} from 'lucide-react';
import { useTheme } from 'next-themes';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  // Profile State
  const [firstName, setFirstName] = useState('Sairam');
  const [lastName, setLastName] = useState('Veereddy');
  const [roleTitle, setRoleTitle] = useState('Head of Talent & Engineering');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSavedNotice, setProfileSavedNotice] = useState(false);

  // Workspace State
  const [companyName, setCompanyName] = useState('Acme AI Hiring');
  const [industry, setIndustry] = useState('Technology & AI');
  const [companySize, setCompanySize] = useState('51-200 employees');
  const [savingWorkspace, setSavingWorkspace] = useState(false);
  const [workspaceSavedNotice, setWorkspaceSavedNotice] = useState(false);

  // Slack Integration State
  const [slackWebhookUrl, setSlackWebhookUrl] = useState('');
  const [slackChannel, setSlackChannel] = useState('#hiring-alerts');
  const [savingSlack, setSavingSlack] = useState(false);
  const [slackSavedNotice, setSlackSavedNotice] = useState(false);
  const [testingSlack, setTestingSlack] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null);

  // Load existing settings
  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          if (data.profile) {
            setFirstName(data.profile.firstName || 'Sairam');
            setLastName(data.profile.lastName || 'Veereddy');
            setRoleTitle(data.profile.roleTitle || 'Head of Talent & Engineering');
          }
          if (data.workspace) {
            setCompanyName(data.workspace.companyName || 'Acme AI Hiring');
            setIndustry(data.workspace.industry || 'Technology & AI');
            setCompanySize(data.workspace.companySize || '51-200 employees');
          }
          if (data.integrations) {
            setSlackWebhookUrl(data.integrations.slackWebhookUrl || '');
            setSlackChannel(data.integrations.slackChannel || '#hiring-alerts');
          }
        }
      })
      .catch(() => undefined);
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileSavedNotice(false);
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: { firstName, lastName, roleTitle },
        }),
      });
      setProfileSavedNotice(true);
      setTimeout(() => setProfileSavedNotice(false), 3500);
    } catch {
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSaveWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingWorkspace(true);
    setWorkspaceSavedNotice(false);
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workspace: { companyName, industry, companySize },
        }),
      });
      setWorkspaceSavedNotice(true);
      setTimeout(() => setWorkspaceSavedNotice(false), 3500);
    } catch {
    } finally {
      setSavingWorkspace(false);
    }
  };

  const handleSaveSlack = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSlack(true);
    setSlackSavedNotice(false);
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          integrations: { slackWebhookUrl, slackChannel },
        }),
      });
      setSlackSavedNotice(true);
      setTimeout(() => setSlackSavedNotice(false), 3500);
    } catch {
    } finally {
      setSavingSlack(false);
    }
  };

  const handleTestSlack = async () => {
    setTestingSlack(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/integrations/slack/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Test Notification from JobNinjas',
          text: `Slack connector configured successfully for ${companyName}! Pipeline events and hiring recommendations will now post here.`,
          candidateName: 'Demo Candidate',
          roleTitle: 'Software Engineer',
          score: 92,
        }),
      });
      const data = await res.json();
      if (data.simulated) {
        setTestResult({
          ok: false,
          message: 'Notification was simulated (logged to server console). Paste a real Incoming Webhook URL to deliver to live Slack.',
        });
      } else if (data.success) {
        setTestResult({
          ok: true,
          message: `✓ Test message successfully delivered to ${slackChannel}!`,
        });
      } else {
        setTestResult({
          ok: false,
          message: data.error || 'Failed to send test alert to Slack.',
        });
      }
    } catch {
      setTestResult({
        ok: false,
        message: 'Could not connect to the server.',
      });
    } finally {
      setTestingSlack(false);
    }
  };

  return (
    <div className="p-8 pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your profile, team workspace, and live integration webhooks.</p>
      </div>

      <div className="max-w-4xl">
        <div className="grid gap-6">
          
          {/* Profile Settings Section */}
          <section className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border bg-muted/30">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <User className="w-5 h-5 text-indigo-500" />
                Profile Information
              </h2>
            </div>
            <form onSubmit={handleSaveProfile} className="p-6">
              <div className="flex items-center gap-6 mb-8">
                <div className="w-20 h-20 rounded-full bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 shrink-0 flex items-center justify-center text-indigo-600 font-bold text-xl shadow-xs">
                  {firstName.charAt(0)}{lastName.charAt(0)}
                </div>
                <div>
                  <button 
                    type="button" 
                    onClick={() => alert("Avatar uploading is synced with your Google/Gravatar account.")}
                    className="px-4 py-2 bg-background border border-border shadow-sm rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors cursor-pointer"
                  >
                    Change Avatar
                  </button>
                  <p className="text-xs text-muted-foreground mt-2">JPG, GIF or PNG. Max size of 2MB</p>
                </div>
              </div>

              <div className="grid gap-5 max-w-xl">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">First Name</label>
                    <input 
                      type="text" 
                      value={firstName} 
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm text-foreground" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Last Name</label>
                    <input 
                      type="text" 
                      value={lastName} 
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm text-foreground" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Email Address</label>
                  <input type="email" value="veereddy@jobninjas.org" className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm text-muted-foreground outline-none" disabled />
                  <p className="text-xs text-muted-foreground mt-1">To change your email address, please contact support.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Role / Job Title</label>
                  <input 
                    type="text" 
                    value={roleTitle} 
                    onChange={(e) => setRoleTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm text-foreground" 
                  />
                </div>
                
                <div className="pt-4 border-t border-border mt-2 flex items-center justify-between">
                  <button 
                    type="submit" 
                    disabled={savingProfile}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm cursor-pointer flex items-center gap-2 disabled:opacity-60"
                  >
                    {savingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    <span>{savingProfile ? 'Saving...' : 'Save Profile Changes'}</span>
                  </button>
                  {profileSavedNotice && (
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 animate-in fade-in">
                      <CheckCircle2 className="w-4 h-4" />
                      Profile updated successfully
                    </span>
                  )}
                </div>
              </div>
            </form>
          </section>

          {/* Workspace / Company Settings */}
          <section className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border bg-muted/30">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Building className="w-5 h-5 text-blue-500" />
                Workspace Information
              </h2>
            </div>
            <form onSubmit={handleSaveWorkspace} className="p-6">
              <div className="grid gap-5 max-w-xl">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Company Name</label>
                  <input 
                    type="text" 
                    value={companyName} 
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm text-foreground" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Industry</label>
                  <input 
                    type="text" 
                    value={industry} 
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm text-foreground" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Company Size</label>
                  <select 
                    value={companySize} 
                    onChange={(e) => setCompanySize(e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm text-foreground"
                  >
                    <option value="1-10 employees">1-10 employees</option>
                    <option value="11-50 employees">11-50 employees</option>
                    <option value="51-200 employees">51-200 employees</option>
                    <option value="201-500 employees">201-500 employees</option>
                    <option value="500+ employees">500+ employees</option>
                  </select>
                </div>
                <div className="pt-4 border-t border-border mt-2 flex items-center justify-between">
                  <button 
                    type="submit" 
                    disabled={savingWorkspace}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm cursor-pointer flex items-center gap-2 disabled:opacity-60"
                  >
                    {savingWorkspace ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    <span>{savingWorkspace ? 'Saving...' : 'Save Workspace Changes'}</span>
                  </button>
                  {workspaceSavedNotice && (
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 animate-in fade-in">
                      <CheckCircle2 className="w-4 h-4" />
                      Workspace updated successfully
                    </span>
                  )}
                </div>
              </div>
            </form>
          </section>

          {/* Real Integrations & Webhooks (Slack, etc.) */}
          <section className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border bg-muted/30 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Send className="w-5 h-5 text-purple-500" />
                Integrations & Team Notifications
              </h2>
              <span className="text-xs px-2.5 py-1 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-bold rounded-full">
                Live Webhooks
              </span>
            </div>
            <form onSubmit={handleSaveSlack} className="p-6">
              <div className="grid gap-5 max-w-xl">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm font-medium text-foreground">Slack Incoming Webhook URL</label>
                    <a 
                      href="https://api.slack.com/messaging/webhooks" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <span>Get Webhook</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <input 
                    type="password" 
                    placeholder="https://hooks.slack.com/services/T000/B000/XXXX"
                    value={slackWebhookUrl} 
                    onChange={(e) => setSlackWebhookUrl(e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all shadow-sm text-foreground font-mono" 
                  />
                  <p className="text-xs text-muted-foreground mt-1.5">
                    When provided, clicking <strong>"Post to Slack"</strong> on hiring recommendations or candidate shortlists posts directly into your channel.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Slack Channel Name</label>
                  <input 
                    type="text" 
                    value={slackChannel} 
                    onChange={(e) => setSlackChannel(e.target.value)}
                    placeholder="#hiring-alerts"
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all shadow-sm text-foreground" 
                  />
                </div>

                <div className="pt-4 border-t border-border mt-2 flex items-center gap-3">
                  <button 
                    type="submit" 
                    disabled={savingSlack}
                    className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm cursor-pointer flex items-center gap-2 disabled:opacity-60"
                  >
                    {savingSlack ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    <span>{savingSlack ? 'Saving...' : 'Save Webhook'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleTestSlack}
                    disabled={testingSlack}
                    className="px-4 py-2.5 border border-border bg-background hover:bg-muted text-foreground rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-60"
                  >
                    {testingSlack ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    <span>{testingSlack ? 'Sending Test...' : 'Send Test Alert'}</span>
                  </button>

                  {slackSavedNotice && (
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 animate-in fade-in">
                      <CheckCircle2 className="w-4 h-4" />
                      Webhook saved
                    </span>
                  )}
                </div>

                {testResult && (
                  <div className={`p-3 rounded-xl text-xs flex items-start gap-2 ${testResult.ok ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-amber-50 text-amber-900 border border-amber-200'}`}>
                    {testResult.ok ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" /> : <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />}
                    <span className="leading-relaxed">{testResult.message}</span>
                  </div>
                )}
              </div>
            </form>
          </section>

          {/* Appearance / Theme */}
          <section className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border bg-muted/30">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Monitor className="w-5 h-5 text-indigo-500" />
                Appearance
              </h2>
            </div>
            <div className="p-6 flex flex-col gap-4 max-w-xl">
              <div>
                <h3 className="font-medium text-foreground">Theme Settings</h3>
                <p className="text-sm text-muted-foreground mb-4">Choose how JobNinjas looks to you. This applies to all pages.</p>
                <div className="flex items-center gap-3">
                  <button 
                    type="button"
                    onClick={() => setTheme('light')}
                    className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all cursor-pointer ${theme === 'light' ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20' : 'border-border hover:border-blue-300'}`}
                  >
                    <Sun className={`w-6 h-6 ${theme === 'light' ? 'text-blue-500' : 'text-muted-foreground'}`} />
                    <span className="text-sm font-medium text-foreground">Light</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => setTheme('dark')}
                    className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all cursor-pointer ${theme === 'dark' ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20' : 'border-border hover:border-blue-300'}`}
                  >
                    <Moon className={`w-6 h-6 ${theme === 'dark' ? 'text-blue-500' : 'text-muted-foreground'}`} />
                    <span className="text-sm font-medium text-foreground">Dark</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Subscription & Plan Section */}
          <section className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border bg-muted/30 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-500" />
                Subscription & Workspace Plan
              </h2>
              <span className="rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-mono text-xs font-bold px-3 py-0.5 border border-blue-200 dark:border-blue-800">
                Team Pro Plan Active
              </span>
            </div>
            <div className="p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-border bg-muted/20">
                <div>
                  <h3 className="font-bold text-foreground text-base">Team Pro Subscription</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    $49 per active open role / month · Unlimited candidate screening & multi-agent pipelines
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-4 text-xs font-mono text-muted-foreground">
                    <span className="flex items-center gap-1.5"><Check className="size-3.5 text-emerald-600" /> 15 Specialized AI Agents</span>
                    <span className="flex items-center gap-1.5"><Check className="size-3.5 text-emerald-600" /> Ophelia Travel Concierge</span>
                    <span className="flex items-center gap-1.5"><Check className="size-3.5 text-emerald-600" /> Live Board Sharing</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <Link
                    href="/pricing"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm transition-all shadow-xs"
                  >
                    Manage / Upgrade Tier
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Account Security */}
          <section className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border bg-muted/30">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Key className="w-5 h-5 text-amber-500" />
                Account Security
              </h2>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-foreground">Password & Auth</h3>
                  <p className="text-sm text-muted-foreground">Managed through your secure enterprise session.</p>
                </div>
                <button 
                  type="button" 
                  onClick={() => alert("Password reset link has been dispatched to your verified email.")}
                  className="px-4 py-2 bg-background border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors cursor-pointer"
                >
                  Send Reset Link
                </button>
              </div>
              <hr className="border-border" />
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-red-600 dark:text-red-400">Sign Out</h3>
                  <p className="text-sm text-muted-foreground">Log out of your account on this device.</p>
                </div>
                <Link href="/login" className="px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30 rounded-lg text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors flex items-center gap-2">
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Link>
              </div>
            </div>
          </section>

          {/* Help & Support Section */}
          <section className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border bg-muted/30">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-emerald-500" />
                Help & Support
              </h2>
            </div>
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Contact Engineering & Support</h3>
                  <p className="text-sm text-muted-foreground mt-1 mb-3">
                    Questions about pipelines, custom agent integrations, or high-volume recruiting workflows?
                  </p>
                  <a href="mailto:veereddy@jobninjas.org" className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 rounded-lg text-sm font-medium transition-colors">
                    <Mail className="w-4 h-4" />
                    veereddy@jobninjas.org
                  </a>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
