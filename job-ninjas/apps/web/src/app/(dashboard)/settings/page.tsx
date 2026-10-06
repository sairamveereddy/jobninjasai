"use client"

import Link from 'next/link';
import { Shield, FileText, HelpCircle, Mail, User, Key, LogOut, Building, Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from 'next-themes';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="p-8 pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your profile, account, and preferences.</p>
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
            <div className="p-6">
              <div className="flex items-center gap-6 mb-8">
                <div className="w-20 h-20 rounded-full bg-muted/50 border border-border overflow-hidden shrink-0 flex items-center justify-center text-muted-foreground">
                  <User className="w-10 h-10" />
                </div>
                <div>
                  <button className="px-4 py-2 bg-background border border-border shadow-sm rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors">
                    Change Avatar
                  </button>
                  <p className="text-xs text-muted-foreground mt-2">JPG, GIF or PNG. Max size of 2MB</p>
                </div>
              </div>

              <div className="grid gap-5 max-w-xl">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">First Name</label>
                    <input type="text" defaultValue="Admin" className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm text-foreground" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Last Name</label>
                    <input type="text" defaultValue="User" className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm text-foreground" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Email Address</label>
                  <input type="email" defaultValue="admin@jobninjas.org" className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm text-muted-foreground outline-none" disabled />
                  <p className="text-xs text-muted-foreground mt-1">To change your email address, please contact support.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Role / Job Title</label>
                  <input type="text" defaultValue="Recruitment Manager" className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm text-foreground" />
                </div>
                
                <div className="pt-4 border-t border-border mt-2 flex items-center justify-between">
                  <button className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
                    Save Profile Changes
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Workspace / Company Settings */}
          <section className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border bg-muted/30">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Building className="w-5 h-5 text-blue-500" />
                Workspace Information
              </h2>
            </div>
            <div className="p-6">
              <div className="grid gap-5 max-w-xl">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Company Name</label>
                  <input type="text" defaultValue="Acme Corp Hiring" className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm text-foreground" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Industry</label>
                  <input type="text" defaultValue="Technology" className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm text-foreground" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Company Size</label>
                  <select className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm text-foreground">
                    <option>1-10 employees</option>
                    <option>11-50 employees</option>
                    <option>51-200 employees</option>
                    <option>201-500 employees</option>
                    <option>500+ employees</option>
                  </select>
                </div>
                <div className="pt-4 border-t border-border mt-2">
                  <button className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
                    Save Workspace Changes
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Appearance / Theme */}
          <section className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border bg-muted/30">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Monitor className="w-5 h-5 text-purple-500" />
                Appearance
              </h2>
            </div>
            <div className="p-6 flex flex-col gap-4 max-w-xl">
              <div>
                <h3 className="font-medium text-foreground">Theme Settings</h3>
                <p className="text-sm text-muted-foreground mb-4">Choose how Job Ninjas looks to you. This applies to all pages.</p>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setTheme('light')}
                    className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${theme === 'light' ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20' : 'border-border hover:border-blue-300'}`}
                  >
                    <Sun className={`w-6 h-6 ${theme === 'light' ? 'text-blue-500' : 'text-muted-foreground'}`} />
                    <span className="text-sm font-medium text-foreground">Light</span>
                  </button>
                  <button 
                    onClick={() => setTheme('dark')}
                    className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${theme === 'dark' ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20' : 'border-border hover:border-blue-300'}`}
                  >
                    <Moon className={`w-6 h-6 ${theme === 'dark' ? 'text-blue-500' : 'text-muted-foreground'}`} />
                    <span className="text-sm font-medium text-foreground">Dark</span>
                  </button>
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
                  <h3 className="font-medium text-foreground">Change Password</h3>
                  <p className="text-sm text-muted-foreground">Update the password used for your Job Ninjas account.</p>
                </div>
                <button className="px-4 py-2 bg-background border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors">
                  Update Password
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

          {/* Legal & Privacy Section */}
          <section className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden mt-4">
            <div className="p-6 border-b border-border bg-muted/30">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-500" />
                Legal & Privacy
              </h2>
            </div>
            <div className="p-2">
              <Link href="/terms" className="flex items-center gap-4 p-4 hover:bg-muted rounded-xl transition-colors">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Terms and Conditions</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">Read our terms of service and usage rules.</p>
                </div>
              </Link>
              
              <Link href="/privacy" className="flex items-center gap-4 p-4 hover:bg-muted rounded-xl transition-colors">
                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Privacy Policy</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">Understand how we handle and protect your data.</p>
                </div>
              </Link>
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
                  <h3 className="font-medium text-foreground">Contact Support</h3>
                  <p className="text-sm text-muted-foreground mt-1 mb-3">
                    Need help with your account or workflows? Our support team is here to help.
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
