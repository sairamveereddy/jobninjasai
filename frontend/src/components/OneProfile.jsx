import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { 
  User, Briefcase, GraduationCap, Code, Globe, 
  Save, Loader2, CheckCircle, AlertCircle, Plus, Trash2, Link as LinkIcon,
  MapPin, Phone, Github, Linkedin
} from 'lucide-react';
import { apiCall, API_URL } from '../config/api';

/**
 * OneProfile Component
 * Serves as the centralized "Source of Truth" for user career data.
 */
const OneProfile = () => {
  const { user, refreshUser } = useAuth();
  const [profile, setProfile] = useState({
    person: { 
      fullName: '', 
      phone: '', 
      location: '',
      linkedinUrl: '', 
      githubUrl: '', 
      portfolioUrl: '' 
    },
    preferences: { 
      target_role: '', 
      work_mode: 'remote', 
      expected_salary: '',
      availability: 'Immediate'
    },
    skills: { 
      primary: '', 
      secondary: '',
      tools: ''
    },
    experience: [],
    education: []
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [uploading, setUploading] = useState(false);

  const fetchProfileData = async () => {
    if (!user?.email) return;
    setLoading(true);
    try {
      const data = await apiCall('/api/user/profile');
      if (data.success && data.profile) {
        const p = data.profile;
        
        // Map backend structure back to frontend state
        setProfile({
          person: {
            fullName: p.fullName || p.name || '',
            phone: p.phone || '',
            location: p.location || '',
            linkedinUrl: p.linkedin_url || p.linkedinUrl || '',
            githubUrl: p.github_url || p.githubUrl || '',
            portfolioUrl: p.portfolio_url || p.portfolioUrl || '',
          },
          preferences: {
            target_role: p.target_role || '',
            work_mode: p.preferences?.work_mode || 'remote',
            expected_salary: p.preferences?.expected_salary || '',
            availability: p.preferences?.availability || 'Immediate'
          },
          skills: {
            primary: typeof p.skills === 'string' ? p.skills : (p.skills?.primary || ''),
            secondary: p.skills?.secondary || '',
            tools: p.skills?.tools || ''
          },
          experience: Array.isArray(p.experience) ? p.experience : (Array.isArray(p.employment_history) ? p.employment_history : []),
          education: Array.isArray(p.education) ? p.education : []
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [user?.email]);

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('resume', file);

    setUploading(true);
    setMessage({ type: 'info', text: 'Analyzing your resume... please wait.' });
    
    try {
      const data = await apiCall('/api/scan/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'undefined' }, // Let fetch handle boundary
        body: formData
      });
      
      if (data.success) {
        setMessage({ type: 'success', text: 'Resume parsed! Syncing your profile data...' });
        await refreshUser();
        await fetchProfileData();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to parse resume.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Upload failed. Network error.' });
    } finally {
      setUploading(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });
    
    // Prepare payload mapping to backend columns
    const payload = {
      fullName: profile.person.fullName,
      phone: profile.person.phone,
      location: profile.person.location,
      linkedin_url: profile.person.linkedinUrl,
      github_url: profile.person.githubUrl,
      portfolio_url: profile.person.portfolioUrl,
      target_role: profile.preferences.target_role,
      skills: profile.skills,
      experience: profile.experience,
      education: profile.education,
      preferences: profile.preferences,
      full_profile: profile 
    };

    try {
      const response = await apiCall('/api/user/profile', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      if (response.success) {
        setMessage({ type: 'success', text: 'Universal Profile updated successfully!' });
      } else {
        setMessage({ type: 'error', text: response.message || 'Failed to save profile.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error occurred. Please try again.' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    }
  };

  const addItem = (field) => {
    if (field === 'experience') {
      setProfile(p => ({ 
        ...p, 
        experience: [...p.experience, { company: '', role: '', period: '', description: '', location: '' }] 
      }));
    } else if (field === 'education') {
      setProfile(p => ({ 
        ...p, 
        education: [...p.education, { school: '', degree: '', year: '', field: '' }] 
      }));
    }
  };

  const removeItem = (field, index) => {
    setProfile(p => {
      const newList = [...p[field]];
      newList.splice(index, 1);
      return { ...p, [field]: newList };
    });
  };

  const updateItem = (field, index, key, value) => {
    setProfile(p => {
      const newList = [...p[field]];
      newList[index] = { ...newList[index], [key]: value };
      return { ...p, [field]: newList };
    });
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <Loader2 className="animate-spin text-[#c5a059]" size={32} />
      <p className="text-gray-500 italic">Syncing your Ninja Profile...</p>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 animate-fade-in pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-400 text-[#1a3a5f] font-['Instrument_Serif',serif] mb-2">OneProfile</h1>
          <p className="text-gray-500 max-w-md">The master record for your career. This data fuels your AI Ninja roadmap and resume generations.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button 
            onClick={handleSave} 
            disabled={saving}
            className="bg-[#1a3a5f] hover:bg-[#0f2744] text-[var(--text-main)] flex items-center gap-2 px-8 py-6 rounded-xl shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] w-full md:w-auto"
          >
            {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            <span className="font-semibold">Save Profile</span>
          </Button>
        </div>
      </div>

      {message.text && (
        <div className={`mb-8 p-4 rounded-xl flex items-center gap-3 border ${
          message.type === 'success' 
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
            : 'bg-rose-50 text-rose-700 border-rose-200'
        }`}>
          {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span className="font-medium">{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar: Identity & Preferences */}
        <div className="lg:col-span-1 space-y-8">
          <Card className="border-none shadow-md overflow-hidden">
            <div className="h-1.5 bg-[#c5a059]" />
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#1a3a5f] text-lg">
                <User size={18} className="text-[#c5a059]" /> Identity
              </CardTitle>
              <CardDescription>Basic contact details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Quick Sync Resume */}
              <div className="p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200 mb-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Quick Sync</p>
                <div className="space-y-3">
                   <p className="text-xs text-gray-500 leading-relaxed">Automatically populate this profile from your resume.</p>
                   <input 
                      type="file" 
                      id="profile-resume-upload" 
                      className="hidden" 
                      accept=".pdf,.docx"
                      onChange={handleResumeUpload}
                      disabled={uploading}
                   />
                   <label htmlFor="profile-resume-upload">
                      <Button asChild variant="outline" className="w-full justify-start gap-2 border-[#1a3a5f]/10 text-[#1a3a5f] hover:bg-[#1a3a5f] hover:text-white cursor-pointer h-10">
                        <span>
                          {uploading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                          <span className="text-xs font-medium">{uploading ? 'Parsing...' : 'Upload Resume'}</span>
                        </span>
                      </Button>
                   </label>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase text-gray-400">Full Name</Label>
                <Input 
                  value={profile.person.fullName} 
                  className="rounded-lg border-gray-200 focus:border-[#c5a059] focus:ring-[#c5a059]/10"
                  onChange={e => setProfile({...profile, person: {...profile.person, fullName: e.target.value}})} 
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase text-gray-400">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-gray-300" size={14} />
                  <Input 
                    placeholder="City, Country"
                    className="pl-9 rounded-lg border-gray-200"
                    value={profile.person.location} 
                    onChange={e => setProfile({...profile, person: {...profile.person, location: e.target.value}})} 
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase text-gray-400">Phone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 text-gray-300" size={14} />
                  <Input 
                    type="tel"
                    className="pl-9 rounded-lg border-gray-200"
                    value={profile.person.phone} 
                    onChange={e => setProfile({...profile, person: {...profile.person, phone: e.target.value}})} 
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#1a3a5f] text-lg">
                <Globe size={18} className="text-[#c5a059]" /> Social Presence
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase text-gray-400">LinkedIn</Label>
                <div className="relative">
                  <Linkedin className="absolute left-3 top-3 text-blue-400" size={14} />
                  <Input 
                    placeholder="linkedin.com/in/username"
                    className="pl-9 rounded-lg border-gray-200"
                    value={profile.person.linkedinUrl} 
                    onChange={e => setProfile({...profile, person: {...profile.person, linkedinUrl: e.target.value}})} 
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase text-gray-400">GitHub</Label>
                <div className="relative">
                  <Code className="absolute left-3 top-3 text-gray-600" size={14} />
                  <Input 
                    placeholder="github.com/username"
                    className="pl-9 rounded-lg border-gray-200"
                    value={profile.person.githubUrl} 
                    onChange={e => setProfile({...profile, person: {...profile.person, githubUrl: e.target.value}})} 
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content: Experience & Education */}
        <div className="lg:col-span-2 space-y-8">
          {/* Target Role & Skills Summary */}
          <Card className="border-none shadow-md bg-[#1a3a5f] text-[var(--text-main)]">
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[var(--text-main)]/60 text-xs font-bold uppercase">Target Career Role</Label>
                <Input 
                  placeholder="e.g. Senior Frontend Engineer" 
                  value={profile.preferences.target_role}
                  className="bg-[#e8e3f8] border-black/10 text-[var(--text-main)] placeholder:text-[var(--text-main)]/30 rounded-lg h-12 text-lg"
                  onChange={e => setProfile({...profile, preferences: {...profile.preferences, target_role: e.target.value}})}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[var(--text-main)]/60 text-xs font-bold uppercase">Primary Tech Stack</Label>
                <Input 
                  placeholder="React, AWS, Node..." 
                  value={profile.skills.primary}
                  className="bg-[#e8e3f8] border-black/10 text-[var(--text-main)] placeholder:text-[var(--text-main)]/30 rounded-lg h-12"
                  onChange={e => setProfile({...profile, skills: {...profile.skills, primary: e.target.value}})}
                />
              </div>
            </CardContent>
          </Card>

          {/* Work Experience */}
          <Card className="border-none shadow-md">
            <CardHeader className="flex flex-row items-center justify-between border-b border-gray-50 pb-6">
              <div>
                <CardTitle className="flex items-center gap-2 text-[#1a3a5f]">
                  <Briefcase size={20} className="text-[#c5a059]" /> Experience
                </CardTitle>
                <CardDescription>Your professional history</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => addItem('experience')} className="border-[#c5a059] text-[#c5a059] hover:bg-[#c5a059] hover:text-[var(--text-main)] rounded-lg">
                <Plus size={16} className="mr-1" /> Add
              </Button>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {profile.experience.map((exp, idx) => (
                <div key={idx} className="p-5 border border-gray-100 rounded-xl relative group hover:border-[#c5a059]/30 transition-colors">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="absolute top-4 right-4 text-red-300 hover:text-red-500 hover:bg-red-50"
                        onClick={() => removeItem('experience', idx)}
                    >
                        <Trash2 size={16} />
                    </Button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-1.5">
                            <Label className="text-xs uppercase font-bold text-gray-400">Company</Label>
                            <Input value={exp.company} className="rounded-lg shadow-sm" onChange={e => updateItem('experience', idx, 'company', e.target.value)} />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs uppercase font-bold text-gray-400">Role</Label>
                            <Input value={exp.role} className="rounded-lg shadow-sm" onChange={e => updateItem('experience', idx, 'role', e.target.value)} />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs uppercase font-bold text-gray-400">Period</Label>
                            <Input placeholder="e.g. Jan 2022 - Present" value={exp.period} className="rounded-lg shadow-sm" onChange={e => updateItem('experience', idx, 'period', e.target.value)} />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs uppercase font-bold text-gray-400">Key Contributions</Label>
                        <Textarea 
                          value={exp.description} 
                          placeholder="Describe your achievements..."
                          className="min-h-[100px] rounded-lg shadow-sm resize-none" 
                          onChange={e => updateItem('experience', idx, 'description', e.target.value)} 
                        />
                    </div>
                </div>
              ))}
              {profile.experience.length === 0 && (
                <div className="text-center py-10 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-100">
                  <Briefcase className="mx-auto text-gray-200 mb-2" size={32} />
                  <p className="text-gray-400 font-medium italic">No professional history documented yet.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Education */}
          <Card className="border-none shadow-md">
            <CardHeader className="flex flex-row items-center justify-between border-b border-gray-50 pb-6">
              <div>
                <CardTitle className="flex items-center gap-2 text-[#1a3a5f]">
                  <GraduationCap size={22} className="text-[#c5a059]" /> Education
                </CardTitle>
                <CardDescription>Academic background</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => addItem('education')} className="border-[#c5a059] text-[#c5a059] hover:bg-[#c5a059] hover:text-[var(--text-main)] rounded-lg">
                <Plus size={16} className="mr-1" /> Add
              </Button>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {profile.education.map((edu, idx) => (
                <div key={idx} className="p-5 border border-gray-100 rounded-xl relative group transition-all hover:border-[#c5a059]/30">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="absolute top-4 right-4 text-red-300 hover:text-red-500 hover:bg-red-50"
                        onClick={() => removeItem('education', idx)}
                    >
                        <Trash2 size={16} />
                    </Button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label className="text-xs uppercase font-bold text-gray-400">Institution</Label>
                            <Input value={edu.school} className="rounded-lg shadow-sm" onChange={e => updateItem('education', idx, 'school', e.target.value)} />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs uppercase font-bold text-gray-400">Degree / Certificate</Label>
                            <Input value={edu.degree} className="rounded-lg shadow-sm" onChange={e => updateItem('education', idx, 'degree', e.target.value)} />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs uppercase font-bold text-gray-400">Field of Study</Label>
                            <Input value={edu.field} className="rounded-lg shadow-sm" onChange={e => updateItem('education', idx, 'field', e.target.value)} />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs uppercase font-bold text-gray-400">Year</Label>
                            <Input value={edu.year} className="rounded-lg shadow-sm" onChange={e => updateItem('education', idx, 'year', e.target.value)} />
                        </div>
                    </div>
                </div>
              ))}
              {profile.education.length === 0 && (
                <div className="text-center py-8 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-100">
                  <p className="text-gray-400 italic">No academic history added.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OneProfile;
