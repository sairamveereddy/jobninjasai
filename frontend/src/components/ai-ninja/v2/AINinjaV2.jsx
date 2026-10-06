import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useV2Onboard, useNinjaRoadmap, useExtractSkills, useActivateNinja } from '../../../hooks/useN8n';
import { parseResume, fetchSavedResumes } from '../../../lib/api';
import { toast } from 'sonner';

import PlanStep from './PlanStep';
import PrepStep from './PrepStep';
import ProfileStep from './ProfileStep';
import RoadmapStep from './RoadmapStep';

const AINinjaV2 = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: roadmapData } = useNinjaRoadmap();
  const v2OnboardMutation = useV2Onboard();
  const extractSkillsMutation = useExtractSkills();
  const activateNinjaMutation = useActivateNinja();

  // State
  const [step, setStep] = useState(1);
  const [planType, setPlanType] = useState('daily');
  const [prepModes, setPrepModes] = useState(['interview']);
  const [courseUrl, setCourseUrl] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [phone, setPhone] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [savedResumes, setSavedResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState(null);

  // Persistence: If already active, go to dashboard
  useEffect(() => {
    if (roadmapData?.roadmap?.id && roadmapData?.roadmap?.status === 'active') {
      navigate('/ai-ninja/dashboard');
    }
  }, [roadmapData, navigate]);

  // Load saved resumes
  useEffect(() => {
    const loadResumes = async () => {
      if (!user?.email) return;
      try {
        const data = await fetchSavedResumes(user.email);
        setSavedResumes(data || []);
      } catch (err) {
        console.error("Failed to fetch resumes", err);
      }
    };
    loadResumes();
  }, [user?.email]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsParsing(true);
    try {
      const result = await parseResume(file);
      setResumeText(result.text || result.resumeText || '');
      setSelectedResumeId('uploaded');
      toast.success('Resume footprint analyzed.');
    } catch (err) {
      toast.error('Parsing failure. Please retry or paste text.');
    } finally {
      setIsParsing(false);
    }
  };

  const handleOnboard = async () => {
    try {
      // 1. V2 Onboard (Profiles)
      await v2OnboardMutation.mutateAsync({
        email: user?.email || '',
        name: user?.name || 'Ninja',
        phone,
        plan_type: planType,
        prep_modes: prepModes,
        resume_text: resumeText,
        course_urls: courseUrl ? [courseUrl] : []
      });

      // 2. Extract Skills
      const skillsData = await extractSkillsMutation.mutateAsync(resumeText);
      const skills = [...(skillsData?.topSkills || []), ...(skillsData?.softSkills || [])].slice(0, 10);

      // 3. Activate Roadmap
      await activateNinjaMutation.mutateAsync({
        userId: user?.id || user?.email,
        email: user?.email || '',
        skills,
        resume_text: resumeText
      });

      setStep(4); // Show Roadmap Step (Animations)
    } catch (err) {
      console.error(err);
      toast.error("Protocol failure during activation.");
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9ff] pb-20 pt-10 px-6 overflow-x-hidden text-[var(--text-main)]">
      <div className="max-w-5xl mx-auto">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <PlanStep 
                selectedPlan={planType} 
                onSelect={setPlanType} 
                onNext={() => setStep(2)} 
              />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <PrepStep 
                selectedModes={prepModes} 
                onToggle={(id) => setPrepModes(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])}
                courseUrl={courseUrl}
                onCourseUrlChange={setCourseUrl}
                onBack={() => setStep(1)}
                onNext={() => setStep(3)}
              />
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <ProfileStep 
                resumeText={resumeText}
                onUpload={handleFileUpload}
                phone={phone}
                onPhoneChange={setPhone}
                isParsing={isParsing}
                savedResumes={savedResumes}
                selectedResumeId={selectedResumeId}
                onSelectSaved={(res) => {
                  setSelectedResumeId(res.id);
                  setResumeText(res.content);
                }}
                onBack={() => setStep(2)}
                onNext={handleOnboard}
              />
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <RoadmapStep onComplete={() => navigate('/ai-ninja/dashboard')} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AINinjaV2;
