import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, FileText, CheckCircle2, ChevronRight, 
  BrainCircuit, Target, Sparkles, Loader2, X, Phone, Zap,
  Star, Award, ShieldCheck, Clock, Calendar
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useExtractSkills, useOnboard, useActivateNinja, useOnboardingSurvey, useNinjaRoadmap, useV2Onboard } from '../../hooks/useN8n';
import { parseResume, fetchSavedResumes, fetchOnboardingSurvey } from '../../lib/api';

import { API_URL } from '../../config/api';
import { cn } from '../../lib/utils';
import { toast } from 'sonner';
import './AINinja.css';
import BrandLogo from '../BrandLogo';

const OnboardingWizard = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();

  // Hooks
  const extractSkillsMutation = useExtractSkills();
  const onboardMutation = useOnboard();
  const v2OnboardMutation = useV2Onboard();
  const activateNinjaMutation = useActivateNinja();
  const { data: savedSurvey, isLoading: isLoadingSurvey } = useOnboardingSurvey();
  const { data: roadmapData } = useNinjaRoadmap();


  // Local state
  const [step, setStep] = useState(1);
  const [orientationSurvey, setOrientationSurvey] = useState({
    careerGoal: '',
    experienceLevel: '',
    commitment: '2 hours/day',
    preferredIndustry: '',
    motivation: ''
  });
  
  const [resumeText, setResumeText] = useState('');
  const [pasteText, setPasteText] = useState('');
  const [extractedSkills, setExtractedSkills] = useState([]);
  
  // Quiz results
  const [quizResults, setQuizResults] = useState({});
  
  const [targetRole, setTargetRole] = useState(null);
  const [phone, setPhone] = useState('');
  const [callHour, setCallHour] = useState(9);
  const [callMinute, setCallMinute] = useState(0);
  const [callPeriod, setCallPeriod] = useState('AM');
  const [isParsing, setIsParsing] = useState(false);

  // V2 state
  const [prepModes, setPrepModes] = useState(['interview']);
  const [planType, setPlanType] = useState('daily');
  const [courseUrl, setCourseUrl] = useState('');

  // Resume selection
  const [savedResumes, setSavedResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState(null);
  const [isLoadingResumes, setIsLoadingResumes] = useState(false);

  const roles = [
    { title: 'Backend Developer', icon: <Target size={20} /> },
    { title: 'Frontend Developer', icon: <Sparkles size={20} /> },
    { title: 'Full Stack Developer', icon: <Award size={20} /> },
    { title: 'Data / AI Engineer', icon: <BrainCircuit size={20} /> },
  ];

  const surveyQuestions = [
    { key: 'careerGoal', label: 'Primary Career Goal', options: ['FAANG / Tier-1', 'Startup Growth', 'Freelance Dominion', 'Enterprise Stability'] },
    { key: 'experienceLevel', label: 'Current Seniority', options: ['Junior (0-2y)', 'Mid-Level (3-5y)', 'Senior (5y+)', 'Lead / Architect'] },
    { key: 'commitment', label: 'Daily Practice Commitment', options: ['1-2 hours', '3-4 hours', 'Full Immersion', 'Weekend Sprint'] },
    { key: 'preferredIndustry', label: 'Target Sector', options: ['FinTech', 'E-commerce', 'SaaS', 'AI / Web3'] },
  ];

  // Redirect if roadmap exists
  useEffect(() => {
    if (roadmapData?.roadmap?.id && roadmapData?.roadmap?.status === 'active') {
      toast.info("Active protocol detected. Redirecting to tactical dashboard.");
      navigate('/ai-ninja/dashboard');
    }
  }, [roadmapData, navigate]);

  // Load saved survey data
  useEffect(() => {
    if (savedSurvey?.survey) {
      const s = savedSurvey.survey;
      setOrientationSurvey(prev => ({
        ...prev,
        careerGoal: s.goals || prev.careerGoal,
        commitment: s.commitment_hours ? `${s.commitment_hours} hours/day` : prev.commitment
      }));
      
      if (s.skill_quiz_results) {
        setQuizResults(s.skill_quiz_results);
        setExtractedSkills(Object.keys(s.skill_quiz_results));
      }
      
      if (s.tech_stacks && Array.isArray(s.tech_stacks) && s.tech_stacks.length > 0) {
        // Find existing role if possible
        const matchedRole = roles.find(r => s.goals?.includes(r.title));
        if (matchedRole) setTargetRole(matchedRole);
      }
    }
  }, [savedSurvey]);

  useEffect(() => {
    const loadResumes = async () => {
      if (!user?.email) return;
      setIsLoadingResumes(true);
      try {
        const data = await fetchSavedResumes(user.email);
        setSavedResumes(data || []);
      } catch (err) {
        console.error("Failed to fetch resumes", err);
      } finally {
        setIsLoadingResumes(false);
      }
    };
    loadResumes();
  }, [user?.email, token]);

  const saveProgress = async (nextStep) => {
    const userId = user?.id || user?.email || 'guest';
    try {
      await onboardMutation.mutateAsync({
        userId,
        name: user?.name || '',
        email: user?.email || '',
        phone,
        targetRole: targetRole?.title || '',
        skillConfidences: quizResults,
        commitment: orientationSurvey.commitment,
        resume_text: resumeText || pasteText
      });
      if (nextStep) setStep(nextStep);
    } catch (err) {
      console.error("Auto-save failed", err);
      if (nextStep) setStep(nextStep); // Proceed anyway to not block user
    }
  };


  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsParsing(true);
    try {
      const result = await parseResume(file);
      const text = result.text || result.resumeText || '';
      setResumeText(text);
      setSelectedResumeId('uploaded');
      toast.success('Resume footprint analyzed.');
    } catch (err) {
      console.error('Parsing failure:', err);
      const msg = err.message || 'Parsing failed';
      toast.error(`${msg} — please retry or paste text.`);
    } finally { setIsParsing(false); }
  };

  const handleAnalyzeSkills = async () => {
    const text = resumeText || pasteText;
    if (!text.trim()) {
      toast.error('Please provide a resume source.');
      return;
    }
    
    try {
      const skillsData = await extractSkillsMutation.mutateAsync(text);
      
      // Flatten skills for the quiz with safer extraction
      const top = Array.isArray(skillsData?.topSkills) ? skillsData.topSkills : [];
      const soft = Array.isArray(skillsData?.softSkills) ? skillsData.softSkills : [];
      
      const allSkills = [...top, ...soft].slice(0, 15);
      
      if (allSkills.length === 0) {
        toast.warning("No specific skills identified. Using common technical skills for assessment.");
        // Fallback set in case AI returns valid JSON but with empty lists
        setExtractedSkills(["Communication", "Problem Solving", "Adaptability", "Fast Learning", "Teamwork"]);
      } else {
        setExtractedSkills(allSkills);
      }
      
      setStep(3); // Skip to Quiz
    } catch (err) { 
      toast.error('Skill extraction failed. Please try again or skip.');
    }
  };

  const handleActivate = async () => {
    const callTime = `${callHour}:${String(callMinute).padStart(2, '0')} ${callPeriod}`;
    const userId = user?.id || user?.email || 'guest';

    try {
      const fullResumeText = resumeText || pasteText;

      // 1. Legacy Onboard Data
      await onboardMutation.mutateAsync({
        userId,
        name: user?.name || user?.email?.split('@')[0] || 'Ninja',
        email: user?.email || '',
        phone,
        targetRole: targetRole?.title || '',
        skillConfidences: quizResults,
        commitment: orientationSurvey.commitment,
        callTime,
        resume_text: fullResumeText
      });

      // 2. V2 Onboard — populate user_profiles with prep modes + plan type
      const courseUrls = courseUrl.trim() ? [courseUrl.trim()] : [];
      await v2OnboardMutation.mutateAsync({
        email: user?.email || '',
        name: user?.name || user?.email?.split('@')[0] || 'Ninja',
        phone,
        target_role: targetRole?.title || '',
        plan_type: planType,
        prep_modes: prepModes,
        skill_confidences: quizResults,
        career_goal: orientationSurvey.careerGoal,
        experience_level: orientationSurvey.experienceLevel,
        commitment: orientationSurvey.commitment,
        preferred_industry: orientationSurvey.preferredIndustry,
        call_hour: callPeriod === 'PM' && callHour !== 12 ? callHour + 12 : callHour,
        call_minute: callMinute,
        resume_text: fullResumeText,
        course_urls: courseUrls,
      });

      // 3. Activate Roadmap
      const skillsPayload = (extractedSkills || []).map(s => 
        typeof s === 'string' ? s : (s.title || s.name || JSON.stringify(s))
      );

      await activateNinjaMutation.mutateAsync({
        userId,
        email: user?.email || '',
        targetRole: targetRole?.title || '',
        skills: skillsPayload,
        resume_text: fullResumeText
      });

      toast.success('AI Ninja Protocol Initialized.');
      navigate('/ai-ninja/dashboard');
    } catch (err) {
      console.error("Activation sequence failure:", err);
      const errorMessage = err.response?.data?.message || err.message || "System error during activation.";
      toast.error(`Activation Error: ${errorMessage}`);
    }
  };

  const steps = [
    { id: 1, label: 'Goal', desc: 'Elite Orientation' },
    { id: 2, label: 'Origin', desc: 'Resume Protocol' },
    { id: 3, label: 'Asses', desc: 'Neural Assessment' },
    { id: 4, label: 'Tactics', desc: 'Activation' },
  ];

  return (
    <div className="min-h-screen bg-[#f5f4ed] py-10 px-6 font-sans">
      <div className="max-w-3xl mx-auto">
        <header className="text-center mb-8 space-y-2">
          <div className="flex justify-center mb-6">
            <BrandLogo />
          </div>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 text-[#c5a059] font-black tracking-widest text-[10px] uppercase"
          >
            <ShieldCheck size={14} /> Elite Onboarding
          </motion.div>
          <h1 className="text-3xl font-black text-[#1a3a5f] tracking-tight font-serif italic">
            Initialize AI Ninja <span className="text-[#c5a059]">Protocol.</span>
          </h1>
          <p className="text-[#64748b] text-base font-medium max-w-lg mx-auto">
            Forge your personalized 34-day roadmap to career dominion.
          </p>
        </header>

        {/* Premium Step Indicator */}
        <div className="flex items-center justify-between mb-12 relative">
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-[#f1f5f9] -translate-y-1/2 z-0" />
          <motion.div 
            className="absolute top-1/2 left-0 h-[1px] bg-[#1a3a5f] -translate-y-1/2 z-0 transition-all duration-700" 
            style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
          />
          
          {steps.map((s) => (
            <div key={s.id} className="relative z-10 flex flex-col items-center gap-2">
              <div 
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black transition-all duration-500 border-2",
                  step > s.id ? "bg-[#1a3a5f] border-[#1a3a5f] text-[var(--text-main)]" :
                  step === s.id ? "bg-[#faf9ff] border-[#1a3a5f] text-[#1a3a5f] shadow-lg shadow-[#1a3a5f]/10" :
                  "bg-[#faf9ff] border-[#f1f5f9] text-[#cbd5e1]"
                )}
              >
                {step > s.id ? <CheckCircle2 size={16} /> : s.id}
              </div>
              <div className="text-center">
                <div className={cn("text-[9px] font-black uppercase tracking-wider", step >= s.id ? "text-[#1a3a5f]" : "text-[#cbd5e1]")}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* STEP 1: ELITE ORIENTATION (SURVEY) */}
          {step === 1 && (
            <motion.div 
              key="st1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10"
            >
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-black text-[#1a3a5f] font-serif italic">Operational Capability Survey</h2>
                <p className="text-[#64748b] font-medium text-sm">Fine-tune the weights of your mastery track.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {surveyQuestions.map((q) => (
                  <div key={q.key} className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-[#1a3a5f] tracking-widest pl-1">{q.label}</label>
                    <div className="grid grid-cols-1 gap-2">
                      {q.options.map(opt => (
                        <button
                          key={opt}
                          onClick={() => setOrientationSurvey(prev => ({ ...prev, [q.key]: opt }))}
                          className={cn(
                            "text-left p-4 rounded-xl border-2 transition-all font-bold text-sm",
                            orientationSurvey[q.key] === opt
                              ? "bg-[#1a3a5f] border-[#1a3a5f] text-[var(--text-main)] shadow-md"
                              : "bg-[#faf9ff] border-[#f1f5f9] text-[#64748b] hover:border-[#c5a059]/30"
                          )}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center pt-10">
                <button
                  onClick={() => saveProgress(2)}
                  disabled={!orientationSurvey.careerGoal || !orientationSurvey.experienceLevel}
                  className="h-16 px-12 bg-[#1a3a5f] text-[var(--text-main)] rounded-xl font-black shadow-xl hover:bg-[#0f2942] transition-all flex items-center gap-3 disabled:opacity-50 group"
                >
                  Confirm Orientation <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

            </motion.div>
          )}

          {/* STEP 2: ORIGIN (RESUME) */}
          {step === 2 && (
            <motion.div 
              key="st2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10"
            >
              <div className="grid md:grid-cols-2 gap-8">
                {/* SAVED RESUME VAULT */}
                <div 
                  className={cn(
                    "col-span-full p-6 rounded-[2rem] border-2 transition-all cursor-pointer group relative overflow-hidden",
                    selectedResumeId && selectedResumeId !== 'uploaded' && selectedResumeId !== 'paste'
                      ? "border-[#1a3a5f] bg-[#1a3a5f]/5 shadow-lg shadow-[#1a3a5f]/5" 
                      : "border-[#f1f5f9] bg-[#faf9ff] hover:border-[#c5a059]/30 hover:shadow-md"
                  )}
                >
                  <div className="flex items-start gap-6 relative z-10">
                    <div className="w-16 h-16 bg-[#1a3a5f] text-[var(--text-main)] rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform">
                        <Award size={32} />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                          <h3 className="text-xl font-black text-[#1a3a5f] font-serif italic">Deploy Saved Resume</h3>
                          <span className="bg-[#c5a059] text-[var(--text-main)] font-bold px-2 py-0.5 rounded text-[8px] tracking-widest">ECOSYSTEM</span>
                      </div>
                      <p className="text-slate-600 font-bold text-sm">Select from your high-impact vault.</p>
                      
                      {isLoadingResumes ? (
                        <div className="flex items-center gap-3 text-[#64748b] mt-6 font-bold text-sm">
                          <Loader2 className="animate-spin" size={20} /> Scanning Archive...
                        </div>
                      ) : savedResumes.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                          {savedResumes.map(res => (
                            <button
                              key={res.id}
                              onClick={() => {
                                setSelectedResumeId(res.id);
                                setResumeText(res.content);
                                setPasteText('');
                              }}
                              className={cn(
                                "text-left p-5 rounded-2xl border-2 transition-all flex items-center justify-between",
                                selectedResumeId === res.id 
                                  ? "bg-[#1a3a5f] border-[#1a3a5f] text-[var(--text-main)] shadow-lg" 
                                  : "bg-[#fcfdfe] border-[#f1f5f9] text-[#1a3a5f] hover:bg-[#faf9ff] hover:border-[#c5a059]/30"
                              )}
                            >
                              <span className="font-bold truncate text-sm">
                                  {res.filename || `Elite Resume ${res.id.slice(0,4)}`}
                              </span>
                              {selectedResumeId === res.id && <CheckCircle2 size={18} className="text-[#c5a059]" />}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="p-6 rounded-2xl bg-[#f8fafc] border border-dashed border-[#cbd5e1] mt-6 text-center text-sm text-[#64748b]">
                            No Saved Resumes found. Use an alternative protocol below.
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* UPLOAD & PASTE */}
                <div 
                    onClick={() => document.getElementById('onboard-upload').click()}
                    className={cn(
                        "p-6 rounded-[2rem] border-2 bg-[#faf9ff] transition-all cursor-pointer group flex flex-col items-center text-center space-y-4",
                        selectedResumeId === 'uploaded' ? "border-[#1a3a5f] shadow-lg bg-[#1a3a5f]/5" : "border-[#f1f5f9] hover:border-[#c5a059]/30 hover:shadow-md"
                    )}
                >
                    <input id="onboard-upload" type="file" className="hidden" onChange={handleFileUpload} accept=".pdf,.doc,.docx" />
                    <div className="w-14 h-14 bg-[#f8fafc] text-[#1a3a5f] rounded-2xl flex items-center justify-center border border-[#f1f5f9] group-hover:scale-110 transition-transform">
                        {isParsing ? <Loader2 className="animate-spin" size={24} /> : <Upload size={24} />}
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-lg font-black text-[#1a3a5f]">Manual Uplink</h3>
                        <p className="text-xs text-slate-700 font-bold">PDF or Word documents.</p>
                    </div>
                </div>

                <div 
                    onClick={() => setSelectedResumeId('paste')}
                    className={cn(
                        "p-6 rounded-[2rem] border-2 bg-[#faf9ff] transition-all cursor-pointer group flex flex-col items-center text-center space-y-4",
                        selectedResumeId === 'paste' ? "border-[#1a3a5f] shadow-lg bg-[#1a3a5f]/5" : "border-[#f1f5f9] hover:border-[#c5a059]/30 hover:shadow-md"
                    )}
                >
                    <div className="w-14 h-14 bg-[#f8fafc] text-[#1a3a5f] rounded-2xl flex items-center justify-center border border-[#f1f5f9] group-hover:scale-110 transition-transform">
                        <FileText size={24} />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-lg font-black text-[#1a3a5f]">Raw Protocol</h3>
                        <p className="text-xs text-slate-700 font-bold">Neural buffer injection.</p>
                    </div>
                </div>
              </div>

              {selectedResumeId === 'paste' && (
                <motion.textarea
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="w-full h-48 p-8 rounded-[2.5rem] border-2 border-[#f1f5f9] focus:border-[#1a3a5f] outline-none text-[#1a3a5f] font-medium bg-[#faf9ff]"
                  placeholder="Paste text here..."
                  value={pasteText}
                  onChange={(e) => { setPasteText(e.target.value); setResumeText(''); }}
                />
              )}

              <div className="flex items-center justify-between pt-6 border-t border-[#f1f5f9]">
                <button onClick={() => setStep(1)} className="text-[#64748b] font-black uppercase text-xs tracking-widest">Back</button>
                <button
                  onClick={async () => {
                    await saveProgress();
                    handleAnalyzeSkills();
                  }}
                  disabled={extractSkillsMutation.isPending || (!resumeText && !pasteText)}
                  className="h-16 px-12 bg-[#1a3a5f] text-[var(--text-main)] rounded-xl font-black shadow-xl flex items-center gap-3 disabled:opacity-50 group"
                >
                  {extractSkillsMutation.isPending ? <>Scanning Pathways <Loader2 className="animate-spin" size={20} /></> : <>Initialize Assessment <ChevronRight size={20} /></>}
                </button>
              </div>

            </motion.div>
          )}

          {/* STEP 3: NEURAL ASSESSMENT (QUIZ) */}
          {step === 3 && (
            <motion.div 
              key="st3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-12"
            >
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-black text-[#1a3a5f] font-serif italic">Skill Assessment Matrix</h2>
                <p className="text-[#64748b] font-medium text-sm">Rate your specialized competence for your roadmap.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
                {extractedSkills.length > 0 ? (
                  extractedSkills.map((skill, i) => (
                    <div key={skill} className="p-6 bg-[#faf9ff] rounded-3xl border-2 border-[#f1f5f9] space-y-4">
                      <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-[#1a3a5f]/5 rounded-lg flex items-center justify-center text-[#1a3a5f]">
                              <BrainCircuit size={16} />
                          </div>
                          <span className="text-base font-black text-[#1a3a5f] truncate">{skill}</span>
                      </div>
                      <div className="flex gap-2">
                        {['Novice', 'Proficient', 'Expert'].map(level => (
                          <button
                            key={level}
                            onClick={() => setQuizResults(prev => ({ ...prev, [skill]: level }))}
                            className={cn(
                              "flex-1 py-2 rounded-lg text-[8px] font-black uppercase tracking-tighter transition-all border-2",
                              quizResults[skill] === level
                                ? "bg-[#1a3a5f] border-[#1a3a5f] text-[var(--text-main)] shadow-md"
                                : "bg-[#fcfdfe] border-[#f1f5f9] text-[#64748b]"
                            )}
                          >
                            {level}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-12 text-center space-y-4 opacity-50">
                    <BrainCircuit size={48} className="mx-auto text-[#64748b]" />
                    <p className="font-medium text-[#64748b]">No skills detected for assessment.</p>
                    <button 
                       onClick={() => setExtractedSkills(["Communication", "Problem Solving", "Teamwork"])}
                       className="text-[#1a3a5f] font-black text-xs uppercase"
                    >
                      Load Common Skills
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-8 border-t border-[#f1f5f9]">
                <button onClick={() => setStep(2)} className="text-[#64748b] font-black uppercase text-xs tracking-widest text-[#64748b]">Back</button>
                <button
                  onClick={() => saveProgress(4)}
                  disabled={Object.keys(quizResults).length < Math.min(extractedSkills.length, 1)}
                  className="h-16 px-12 bg-[#1a3a5f] text-[var(--text-main)] rounded-xl font-black shadow-lg hover:bg-[#0f2942] transition-all flex items-center gap-2 group"
                >
                  Operational Schedule <ChevronRight size={20} className="group-hover:translate-x-1" />
                </button>
              </div>

            </motion.div>
          )}

          {/* STEP 4: TACTICS & ACTIVATION */}
          {step === 4 && (
            <motion.div 
              key="st4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10"
            >
              <div className="grid md:grid-cols-2 gap-8">
                {/* ROLE SELECTION (MINI) */}
                <div className="col-span-full space-y-4">
                  <h3 className="text-lg font-black text-[#1a3a5f] font-serif italic pl-1">Tactical Specialization</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {roles.map(r => (
                      <button 
                        key={r.title}
                        onClick={() => setTargetRole(r)}
                        className={cn(
                          "p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2",
                          targetRole?.title === r.title ? "bg-[#1a3a5f] border-[#1a3a5f] text-[var(--text-main)] shadow-lg" : "bg-[#faf9ff] border-[#f1f5f9] text-[#1a3a5f]"
                        )}
                      >
                        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", targetRole?.title === r.title ? "bg-[#faf9ff]/10" : "bg-black/5")}>{r.icon}</div>
                        <span className="font-bold text-[10px] text-center leading-tight">{r.title}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* PREP MODE SELECTION */}
                <div className="col-span-full space-y-4">
                  <h3 className="text-lg font-black text-[#1a3a5f] font-serif italic pl-1">Prep Modes <span className="text-[10px] font-bold text-[#c5a059] uppercase tracking-widest">(Select one or more)</span></h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { key: 'interview', label: 'Interview Prep', emoji: '🎯' },
                      { key: 'course', label: 'Course Prep', emoji: '📚' },
                      { key: 'book', label: 'Book Prep', emoji: '📖' },
                      { key: 'research', label: 'Research Prep', emoji: '🔬' },
                    ].map(m => (
                      <button
                        key={m.key}
                        onClick={() => {
                          setPrepModes(prev =>
                            prev.includes(m.key)
                              ? prev.filter(x => x !== m.key).length > 0 ? prev.filter(x => x !== m.key) : prev
                              : [...prev, m.key]
                          );
                        }}
                        className={cn(
                          "p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 text-center",
                          prepModes.includes(m.key) ? "bg-[#1a3a5f] border-[#1a3a5f] text-[var(--text-main)] shadow-lg" : "bg-[#faf9ff] border-[#f1f5f9] text-[#1a3a5f] hover:border-[#c5a059]/30"
                        )}
                      >
                        <span className="text-2xl">{m.emoji}</span>
                        <span className="font-bold text-[10px] leading-tight">{m.label}</span>
                      </button>
                    ))}
                  </div>

                  {prepModes.includes('course') && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4">
                      <label className="text-[10px] font-black uppercase text-[#1a3a5f] tracking-widest pl-1 block mb-2">YouTube / Course URL</label>
                      <input
                        type="url"
                        className="w-full text-sm font-bold text-[#1a3a5f] border-2 border-[#f1f5f9] p-3 rounded-xl outline-none focus:border-[#c5a059]"
                        placeholder="https://youtube.com/watch?v=..."
                        value={courseUrl}
                        onChange={e => setCourseUrl(e.target.value)}
                      />
                      <p className="text-[10px] text-[#64748b] mt-1 pl-1 font-medium">We'll extract the transcript to personalize your practice calls.</p>
                    </motion.div>
                  )}
                </div>

                {/* PLAN TYPE SELECTION */}
                <div className="col-span-full space-y-4">
                  <h3 className="text-lg font-black text-[#1a3a5f] font-serif italic pl-1">Call Frequency</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { key: 'daily', label: 'Daily', desc: 'Call every day', badge: 'MAX GROWTH' },
                      { key: 'alternate', label: 'Alternate', desc: 'Every other day', badge: 'BALANCED' },
                      { key: 'weekly', label: 'Weekly', desc: 'Once per week', badge: 'LIGHT' },
                    ].map(p => (
                      <button
                        key={p.key}
                        onClick={() => setPlanType(p.key)}
                        className={cn(
                          "p-5 rounded-xl border-2 transition-all text-center space-y-2",
                          planType === p.key ? "bg-[#1a3a5f] border-[#1a3a5f] text-[var(--text-main)] shadow-lg" : "bg-[#faf9ff] border-[#f1f5f9] text-[#1a3a5f] hover:border-[#c5a059]/30"
                        )}
                      >
                        <span className={cn("text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded",
                          planType === p.key ? "bg-[#c5a059] text-[var(--text-main)]" : "bg-[#f1f5f9] text-[#64748b]"
                        )}>{p.badge}</span>
                        <div className="font-black text-sm">{p.label}</div>
                        <div className={cn("text-[10px] font-bold", planType === p.key ? "text-[var(--text-main)]/70" : "text-[#64748b]")}>{p.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-6 rounded-3xl border-2 border-[#1a3a5f]/20 bg-[#faf9ff] space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#1a3a5f] text-[var(--text-main)] rounded-xl flex items-center justify-center"><Phone size={20} /></div>
                        <h3 className="text-lg font-black text-[#1a3a5f] font-serif">Secure Uplink</h3>
                    </div>
                    <input 
                      type="tel" className="w-full text-lg font-black text-[#1a3a5f] border-2 border-[#f1f5f9] p-3 rounded-xl outline-none"
                      placeholder="+1 (555) 000-0000" value={phone} onChange={e => setPhone(e.target.value)}
                    />
                </div>

                <div className="p-6 rounded-3xl border-2 border-[#c5a059]/20 bg-[#faf9ff] space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#c5a059] text-[var(--text-main)] rounded-xl flex items-center justify-center"><Clock size={20} /></div>
                        <h3 className="text-lg font-black text-[#1a3a5f] font-serif">Call Window</h3>
                    </div>
                    <div className="flex items-center gap-4">
                      <input 
                        type="number" className="w-16 text-2xl font-black text-[#1a3a5f] border-2 border-[#f1f5f9] p-2 text-center rounded-xl"
                        value={callHour} onChange={e => setCallHour(Number(e.target.value))}
                      />
                      <div className="flex flex-col gap-1">
                        {['AM', 'PM'].map(p => (
                          <button key={p} onClick={() => setCallPeriod(p)} className={cn("px-2 py-0.5 rounded font-black text-[9px]", callPeriod === p ? "bg-[#1a3a5f] text-[var(--text-main)]" : "bg-[#f1f5f9] text-[#64748b]")}>{p}</button>
                        ))}
                      </div>
                    </div>
                </div>
              </div>

              <div className="pt-10 border-t border-[#f1f5f9] space-y-4 text-center">
                <button
                  onClick={handleActivate}
                  disabled={!targetRole || !phone || onboardMutation.isPending}
                  className="w-full h-20 bg-[#1a3a5f] text-[#c5a059] rounded-2xl font-black text-xl shadow-xl flex items-center justify-center gap-4 group"
                >
                  {onboardMutation.isPending ? <>IGNITING <Loader2 className="animate-spin" /></> : <>INITIALIZE PROTOCOL <ShieldCheck size={24} /></>}
                </button>
                <button onClick={() => setStep(3)} className="text-[#64748b] font-black text-[10px] uppercase tracking-widest">Revoke Previous Command</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default OnboardingWizard;
