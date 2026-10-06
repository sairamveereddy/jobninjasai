import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    RotateCcw,
    Pencil,
    Layout,
    Minus,
    Search,
    FileText,
    MoreHorizontal,
    Loader2,
    Upload,
    Plus,
    ChevronLeft,
    ChevronDown,
    Save,
    Download,
    CheckCircle2, Users, LayoutDashboard, Send, Bell,
    X,
    ArrowRight,
    Trash2,
    Mail,
    Phone,
    MapPin,
    Globe,
    Linkedin,
    Github
} from 'lucide-react';
import DashboardLayout from './DashboardLayout';
import ResumePaper from './ResumePaper';
import NinjaIcon from './NinjaIcon';
import AIConfigPanel from './AIConfigPanel';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import { apiCall, API_URL } from '../config/api';
import './ResumeEditorPage.css';
import { useAuth } from '../contexts/AuthContext';

const ResumeEditorPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const [sideMenuOpen, setSideMenuOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('resume'); // resume, design, cover_letter, cold_mail
    const [zoom, setZoom] = useState(80);
    const [resumeName, setResumeName] = useState(
        location.state?.resumeData?.resumeName ||
        location.state?.resumeData?.resume_name ||
        'My_Resume.docx'
    );
    const [lastSaved, setLastSaved] = useState('about 4 hours');
    const [unsavedChanges, setUnsavedChanges] = useState(2);
    const [isSaving, setIsSaving] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isTailored, setIsTailored] = useState(false);

    // Initial state from location if available
    const [resumeData, setResumeData] = useState(location.state?.resumeData || null);
    const [jobDescription, setJobDescription] = useState(location.state?.jobDescription || '');
    const [tailoredResume, setTailoredResume] = useState(
        location.state?.resumeData?.resumeText ||
        location.state?.resumeData?.resume_text ||
        ''
    );
    const [coverLetter, setCoverLetter] = useState('');
    const [coverLetterA, setCoverLetterA] = useState('');
    const [coverLetterB, setCoverLetterB] = useState('');
    const [coldMail, setColdMail] = useState('');
    const [coldMailA, setColdMailA] = useState('');
    const [coldMailB, setColdMailB] = useState('');
    const [activeVariant, setActiveVariant] = useState('A');

    // AI Config State
    const [aiConfig, setAiConfig] = useState({
        intensity: 'Default',
        length: 'standard',
        metrics: 'No Quantifiables'
    });

    const [jobTitle, setJobTitle] = useState(location.state?.jobTitle || '');
    const [companyName, setCompanyName] = useState(location.state?.companyName || '');

    const [fontSize, setFontSize] = useState(11);
    const [template, setTemplate] = useState('standard');
    const [fontFamily, setFontFamily] = useState('Times New Roman');

    // Contact Information States
    const [contactEmail, setContactEmail] = useState('');
    const [contactPhone, setContactPhone] = useState('');
    const [contactLocation, setContactLocation] = useState('');
    const [contactWebsite, setContactWebsite] = useState('');
    const [contactGitHub, setContactGitHub] = useState('');
    const [contactLinkedIn, setContactLinkedIn] = useState('');
    const [showContactIcons, setShowContactIcons] = useState(true);

    // History management
    const [history, setHistory] = useState({
        past: [],
        future: []
    });

    // Inline editing for resume name
    const [isEditingName, setIsEditingName] = useState(false);
    const [editableName, setEditableName] = useState(resumeName);

    // Fetch saved resumes for empty stage
    const [savedResumes, setSavedResumes] = useState([]);
    const [isLoadingSaved, setIsLoadingSaved] = useState(false);
    const fileInputRef = useRef(null);
    const [isUploading, setIsUploading] = useState(false);
    const [showTrackerNotify, setShowTrackerNotify] = useState(false);

    useEffect(() => {
        if (user?.email) {
            fetchSavedResumes();
        }
    }, [user]);

    const fetchSavedResumes = async () => {
        setIsLoadingSaved(true);
        try {
            const data = await apiCall(`/api/resumes/${user.email}`);
            let resumes = data?.resumes || [];

            // Filter out system generated or tailored for the "Base Resume" selection
            const baseResumes = resumes.filter(r => r.isBase);

            setSavedResumes(resumes);

            // Auto-load latest BASE resume if nothing selected and not provided in location state
            if (!resumeData && baseResumes.length > 0 && !location.state?.resumeData) {
                const latest = baseResumes[0];
                setResumeData(latest);
                setResumeName(latest.resumeName || latest.resume_name || latest.file_name || 'My_Resume.docx');
                setTailoredResume(latest.resumeText || latest.resume_text || '');

                // Normalizing styling
                if (latest.fontFamily || latest.font_family) {
                    setFontFamily('FAANG Font');
                }
                const detectedSize = parseInt(latest.fontSize || latest.font_size);
                if (detectedSize) {
                    setFontSize(Math.min(Math.max(detectedSize, 9), 12));
                }
                setHistory({ past: [], future: [] });
            }
        } catch (error) {
            console.error('Failed to fetch resumes:', error);
        } finally {
            setIsLoadingSaved(false);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file || !user) return;

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);

            const token = localStorage.getItem('auth_token');
            const response = await fetch(`${API_URL}/api/resume/upload`, {
                method: 'POST',
                headers: { ...(token ? { 'token': token } : {}) },
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                // After upload, refresh and auto-select
                await fetchSavedResumes();
                if (data.userData) {
                    const profile = data.userData;
                    setResumeData(profile);

                    // Supabase profile has resume_text and latest_resume (JSON string)
                    let latestMeta = {};
                    try {
                        latestMeta = JSON.parse(profile.latest_resume || '{}');
                    } catch (e) { }

                    setResumeName(latestMeta.name || 'Uploaded_Resume.docx');
                    setTailoredResume(profile.resume_text || '');

                    // Apply detected styling with normalization
                    if (data.metadata?.font_family || profile.resume_metadata?.font_family) {
                        setFontFamily('FAANG Font');
                    }
                    const uploadSize = parseInt(profile.resume_metadata?.font_size);
                    if (uploadSize) {
                        setFontSize(Math.min(Math.max(uploadSize, 9), 12));
                    } else {
                        setFontSize(11); // Safe default
                    }
                }
            }
        } catch (error) {
            console.error('Upload failed:', error);
        } finally {
            setIsUploading(false);
        }
    };

    const addToHistory = (newContent) => {
        setHistory(prev => ({
            past: [...prev.past, tailoredResume],
            future: []
        }));
        setTailoredResume(newContent);
    };

    const undo = () => {
        if (history.past.length === 0) return;
        const previous = history.past[history.past.length - 1];
        const newPast = history.past.slice(0, history.past.length - 1);

        setHistory({
            past: newPast,
            future: [tailoredResume, ...history.future]
        });
        setTailoredResume(previous);
    };

    const redo = () => {
        if (history.future.length === 0) return;
        const next = history.future[0];
        const newFuture = history.future.slice(1);

        setHistory({
            past: [...history.past, tailoredResume],
            future: newFuture
        });
        setTailoredResume(next);
    };

    useEffect(() => {
        // Extract contact info for the sidebar when tailoredResume changes
        if (tailoredResume) {
            const lines = tailoredResume.split('\n');
            const contactLine = lines.find(l => l.includes('@') || l.match(/\d{3}/));
            if (contactLine) {
                const emailMatch = contactLine.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
                const phoneMatch = contactLine.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);

                if (emailMatch && !contactEmail) setContactEmail(emailMatch[0]);
                if (phoneMatch && !contactPhone) setContactPhone(phoneMatch[0]);
            }

            // Extract Social Links
            const githubMatch = tailoredResume.match(/github\.com\/[a-zA-Z0-9_-]+/i);
            const linkedinMatch = tailoredResume.match(/linkedin\.com\/in\/[a-zA-Z0-9_-]+/i);
            const websiteMatch = tailoredResume.match(/(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9.-]+\.[a-z]{2,})(?:\/|$)/i);

            if (githubMatch && !contactGitHub) setContactGitHub(githubMatch[0]);
            if (linkedinMatch && !contactLinkedIn) setContactLinkedIn(linkedinMatch[0]);
            // Simple heuristic to avoid matching email as website if websiteMatch matches too broadly
            if (websiteMatch && !contactWebsite && !websiteMatch[0].includes('@')) {
                setContactWebsite(websiteMatch[0]);
            }
        }
    }, [tailoredResume]);

    // Auto-save logic
    useEffect(() => {
        if (!tailoredResume || !user || isTailored) return;

        const timer = setTimeout(() => {
            handleSave();
        }, 3000); // 3 second debounce for auto-save

        return () => clearTimeout(timer);
    }, [tailoredResume, resumeName, template, fontFamily, fontSize, contactEmail, contactPhone, contactLocation, contactWebsite, contactGitHub, contactLinkedIn, showContactIcons, isTailored]);

    const [showSelector, setShowSelector] = useState(false);
    const [selectedResumeId, setSelectedResumeId] = useState(null);

    // Section Editing State
    const [editingSection, setEditingSection] = useState(null); // { key, content }
    const [isRefiningSection, setIsRefiningSection] = useState(false);

    // Custom Delete Modal State
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [resumeToDelete, setResumeToDelete] = useState(null);
    const [isDeletingResume, setIsDeletingResume] = useState(false);

    const handleEditSection = (key, content) => {
        setEditingSection({ key, content });
    };

    const handleRegenerateSection = async (key, content, action = 'refine') => {
        if (!jobDescription || !user) return;
        setIsRefiningSection(true);
        try {
            const token = localStorage.getItem('auth_token');
            const response = await fetch(`${API_URL}/api/ai/refine-section`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'token': token } : {})
                },
                body: JSON.stringify({
                    section_name: key,
                    section_content: content,
                    job_description: jobDescription,
                    resume_context: tailoredResume,
                    action: action
                })
            });

            if (response.ok) {
                const data = await response.json();
                if (data.refined_content) {
                    const newContent = data.refined_content;
                    const updatedFullText = replaceSectionInText(tailoredResume, key, newContent);
                    addToHistory(updatedFullText);
                }
            }
        } catch (error) {
            console.error('Section refinement failed:', error);
        } finally {
            setIsRefiningSection(false);
        }
    };

    const replaceSectionInText = (fullText, sectionKey, newSectionContent) => {
        const lines = fullText.split('\n');
        const sectionPatterns = {
            summary: /(PROFESSIONAL SUMMARY|SUMMARY|PROFILE|OBJECTIVE)/i,
            skills: /(SKILLS|CORE COMPETENCIES|TECHNICAL SKILLS)/i,
            experience: /(EXPERIENCE|WORK EXPERIENCE|PROFESSIONAL EXPERIENCE|EMPLOYMENT HISTORY)/i,
            projects: /(PROJECTS|KEY PROJECTS)/i,
            education: /(EDUCATION|ACADEMIC BACKGROUND)/i
        };

        const regex = sectionPatterns[sectionKey];
        if (!regex) return fullText;

        let startIndex = -1;
        let nextSectionIndex = -1;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (regex.test(line) && line.length < 50) {
                startIndex = i;
                // Find next section
                for (let j = i + 1; j < lines.length; j++) {
                    const nextLine = lines[j].trim();
                    for (const r of Object.values(sectionPatterns)) {
                        if (r.test(nextLine) && nextLine.length < 50) {
                            nextSectionIndex = j;
                            break;
                        }
                    }
                    if (nextSectionIndex !== -1) break;
                }
                break;
            }
        }

        if (startIndex === -1) return fullText + `\n\n${sectionKey.toUpperCase()}\n${newSectionContent}`;

        const before = lines.slice(0, startIndex + 1);
        const after = nextSectionIndex !== -1 ? lines.slice(nextSectionIndex) : [];

        return [...before, newSectionContent, ...after].join('\n');
    };

    const handleSaveEditedSection = (newContent) => {
        if (!editingSection) return;
        const updatedFullText = replaceSectionInText(tailoredResume, editingSection.key, newContent);
        addToHistory(updatedFullText);
        setEditingSection(null);
    };

    const handleSelectResume = (selected) => {
        if (!selected) return;
        setResumeData(selected);
        setResumeName(selected.resumeName || selected.resume_name || 'Selected_Resume.docx');
        setTailoredResume(selected.resumeText || selected.resume_text || '');

        if (selected.fontFamily || selected.font_family) {
            setFontFamily('FAANG Font');
        }
        const detectedSize = parseInt(selected.fontSize || selected.font_size);
        if (detectedSize) {
            setFontSize(Math.min(Math.max(detectedSize, 9), 12));
        }
        setHistory({ past: [], future: [] });
        setShowSelector(false);
    };

    const handleDeleteResume = (resumeId, e) => {
        e.stopPropagation();
        setResumeToDelete(resumeId);
        setDeleteModalOpen(true);
    };

    const executeDeleteResume = async () => {
        if (!resumeToDelete) return;
        setIsDeletingResume(true);
        try {
            const response = await apiCall(`/api/resumes/${resumeToDelete}`, { method: 'DELETE' });
            if (response.success) {
                setSavedResumes(prev => prev.filter(r => (r.id || r._id) !== resumeToDelete));
                if (selectedResumeId === resumeToDelete) setSelectedResumeId(null);
            }
            setDeleteModalOpen(false);
            setResumeToDelete(null);
        } catch (err) {
            console.error("Failed to delete resume:", err);
            alert("Failed to delete resume.");
        } finally {
            setIsDeletingResume(false);
        }
    };


    useEffect(() => {
        if (resumeData) {
            setSelectedResumeId(resumeData.id);
        }
    }, [resumeData]);

    const handleExport = async () => {
        const currentContent = activeTab === 'resume' ? (tailoredResume || resumeData?.resume_text) :
            activeTab === 'cover_letter' ? coverLetter :
                activeTab === 'cold_mail' ? coldMail :
                    (tailoredResume || resumeData?.resume_text);

        if (!currentContent) return;

        try {
            const response = await fetch(`${API_URL}/api/resumes/export`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: currentContent,
                    title: activeTab === 'resume' ? resumeName : `${activeTab.replace('_', ' ').toUpperCase()} - ${resumeName}`,
                    template: template,
                    font_family: fontFamily,
                    font_size: fontSize
                })
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${resumeName.split('.')[0]}_${activeTab}.docx`;
                document.body.appendChild(a);
                a.click();
                a.remove();
            }
        } catch (error) {
            console.error('Export failed:', error);
        }
    };

    const handleSave = async (forceNew = false) => {
        setIsSaving(true);
        try {
            // If it's tailored and we're not forcing a specific save, 
            // the first save should create a new document
            const shouldCreativeNew = forceNew || isTailored;
            const finalName = shouldCreativeNew && !resumeName.includes('AI Tailored')
                ? `AI Tailored: ${companyName || 'Target Company'}`
                : resumeName;

            const response = await apiCall('/api/resumes/save', {
                method: 'POST',
                body: JSON.stringify({
                    user_email: user?.email,
                    resume_name: finalName,
                    resume_text: tailoredResume,
                    font_family: fontFamily,
                    font_size: fontSize,
                    // Only send ID if we want to overwrite/update the current document
                    id: shouldCreativeNew ? undefined : resumeData?.id
                })
            });

            if (response && response.success) {
                setLastSaved('Just now');
                setUnsavedChanges(0);

                if (shouldCreativeNew || finalName !== resumeName) {
                    setResumeName(finalName);
                    setIsEditingName(false);
                    setEditableName(finalName);

                    // If we created a new one, we should now be "editing" that new one
                    if (response.id) {
                        setResumeData(prev => ({ ...prev, id: response.id, resume_name: finalName }));
                        setIsTailored(false); // No longer "unsaved tailored" state
                    }

                    await fetchSavedResumes();
                }
            }
        } catch (error) {
            console.error('Save failed:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleGenerate = async () => {
        if (!jobDescription || !user) return;
        setIsGenerating(true);
        try {
            const formData = new FormData();
            formData.append('email', user.email);
            formData.append('jobDescription', jobDescription);
            formData.append('jobTitle', jobTitle || 'Target Role');
            formData.append('company', companyName || 'Target Company');
            formData.append('intensity', aiConfig.intensity);
            formData.append('lengthTarget', aiConfig.length);

            const blob = new Blob([tailoredResume || resumeData?.resume_text || ''], { type: 'text/plain' });
            formData.append('resume', blob, 'resume.txt');

            const token = localStorage.getItem('auth_token');
            const response = await fetch(`${API_URL}/api/ai-ninja/apply`, {
                method: 'POST',
                headers: { ...(token ? { 'token': token } : {}) },
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                const newText = data.ats_resume || data.tailoredResume;
                if (newText) {
                    setIsTailored(true); // Mark as tailored to prevent auto-save overwrite
                    addToHistory(newText);
                    setUnsavedChanges(prev => prev + 1);

                    if (data.coverLetterA) setCoverLetterA(data.coverLetterA);
                    if (data.coverLetterB) setCoverLetterB(data.coverLetterB);
                    if (data.coldEmailA) setColdMailA(data.coldEmailA);
                    if (data.coldEmailB) setColdMailB(data.coldEmailB);

                    setCoverLetter(data.coverLetterA || data.tailoredCoverLetter || '');
                    setColdMail(data.coldEmailA || '');

                    // Show tracking success notification
                    setShowTrackerNotify(true);
                    setTimeout(() => setShowTrackerNotify(false), 5000);

                    // await fetchSavedResumes(); // Don't refresh yet, wait for manual save
                }
            }
        } catch (error) {
            console.error('Generation failed:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleGenerateCoverLetter = async () => {
        if (!jobDescription || !user) {
            alert("Please provide a job description in the OPTIMIZE tab first.");
            return;
        }
        setIsGenerating(true);
        try {
            const formData = new FormData();
            formData.append('email', user.email);
            formData.append('jobDescription', jobDescription);

            // Send as file like handleGenerate does
            const blob = new Blob([tailoredResume || resumeData?.resume_text || ''], { type: 'text/plain' });
            formData.append('resume', blob, 'resume.txt');

            formData.append('jobTitle', jobTitle || 'Target Role');
            formData.append('company', companyName || 'Target Company');

            const token = localStorage.getItem('auth_token');
            const response = await fetch(`${API_URL}/api/ai-ninja/apply`, {
                method: 'POST',
                headers: { ...(token ? { 'token': token } : {}) },
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                const clText = data.coverLetterA || data.cover_letter || data.tailoredCoverLetter;
                if (clText) {
                    setCoverLetterA(data.coverLetterA || clText);
                    setCoverLetterB(data.coverLetterB || '');
                    setCoverLetter(clText);
                    setActiveVariant('A');
                    setActiveTab('cover_letter');
                }
            } else {
                const err = await response.json();
                console.error('Generation Error:', err);
                alert(`Error: ${err.detail || 'Failed to generate cover letter'}`);
            }
        } catch (error) {
            console.error('Cover letter generation failed:', error);
            alert("Connection error. Please ensure the backend is running.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleGenerateColdMail = async () => {
        if (!jobDescription || !user) {
            alert("Please provide a job description in the OPTIMIZE tab first.");
            return;
        }
        setIsGenerating(true);
        try {
            const formData = new FormData();
            formData.append('email', user.email);
            formData.append('jobDescription', jobDescription);
            formData.append('resume_text', tailoredResume || resumeData?.resume_text || '');

            const token = localStorage.getItem('auth_token');
            const response = await fetch(`${API_URL}/api/ai-ninja/cold-mail`, {
                method: 'POST',
                headers: { ...(token ? { 'token': token } : {}) },
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                const cmText = data.coldEmailA || data.coldMail;
                if (cmText) {
                    setColdMailA(data.coldEmailA || cmText);
                    setColdMailB(data.coldEmailB || '');
                    setColdMail(cmText);
                    setActiveVariant('A');
                    setActiveTab('cold_mail');
                }
            } else {
                const err = await response.json();
                alert(`Error: ${err.detail || 'Failed to generate cold mail'}`);
            }
        } catch (error) {
            console.error('Cold mail generation failed:', error);
            alert("Connection error. Please ensure the backend is running.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <>
            <div className="flex flex-col h-screen bg-background overflow-hidden font-sans">

                {/* Top Navigation / Toolbar - Matching Image 3 exactly */}
                <header className="flex h-[60px] items-center justify-between border-b border-border bg-background px-5 z-50">
                    <div className="flex items-center gap-6">
                        <div className="flex flex-col gap-1 m-0">
                            <div className="flex items-center gap-2">
                                {isEditingName ? (
                                    <input
                                        className="text-base font-semibold text-foreground border border-ring rounded px-1.5 py-0.5 bg-background outline-none shadow-[0_0_0_2px_rgba(0,112,243,0.1)]"
                                        value={editableName}
                                        onChange={(e) => setEditableName(e.target.value)}
                                        onBlur={() => {
                                            setIsEditingName(false);
                                            setResumeName(editableName);
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                setIsEditingName(false);
                                                setResumeName(editableName);
                                            }
                                        }}
                                        autoFocus
                                    />
                                ) : (
                                    <>
                                        <h1 className="text-base font-semibold text-foreground m-0 cursor-pointer px-1.5 py-0.5 rounded hover:bg-muted transition-colors" onClick={() => setIsEditingName(true)}>{resumeName}</h1>
                                        <button className="bg-transparent border-none text-muted-foreground cursor-pointer p-1" onClick={() => setIsEditingName(true)}><Pencil className="w-3.5 h-3.5" /></button>
                                        {isTailored && (
                                            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-muted border border-border text-foreground text-xs font-medium">
                                                <NinjaIcon className="w-3.5 h-3.5" />
                                                <span>Tailoring Mode</span>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-5">
                        <div className="flex gap-2">
                            <button
                                className={`w-9 h-9 flex items-center justify-center rounded-md bg-secondary border border-border text-muted-foreground transition-colors hover:border-ring hover:text-ring hover:bg-background disabled:opacity-30 disabled:cursor-not-allowed`}
                                onClick={undo}
                                title="Undo (Ctrl+Z)"
                                disabled={history.past.length === 0}
                            >
                                <RotateCcw className="w-4 h-4" />
                            </button>
                            <button
                                className={`w-9 h-9 flex items-center justify-center rounded-md bg-secondary border border-border text-muted-foreground transition-colors hover:border-ring hover:text-ring hover:bg-background disabled:opacity-30 disabled:cursor-not-allowed scale-x-[-1]`}
                                onClick={redo}
                                title="Redo (Ctrl+Y)"
                                disabled={history.future.length === 0}
                            >
                                <RotateCcw className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="flex items-center bg-secondary border border-border rounded-md p-0.5">
                            <button className="w-8 h-8 flex items-center justify-center relative bg-transparent border-none text-muted-foreground cursor-pointer hover:text-foreground" onClick={() => setZoom(z => Math.max(z - 10, 50))}>
                                <Search className="w-3.5 h-3.5" />
                                <Minus className="w-2 h-2 absolute bottom-2 right-2 bg-background rounded-full" />
                            </button>
                            <div className="flex flex-col items-center px-2 min-w-[50px]">
                                <span className="text-xs font-semibold text-foreground">{zoom}%</span>
                                <span className="text-[10px] text-blue-600 font-semibold">Auto</span>
                            </div>
                            <button className="w-8 h-8 flex items-center justify-center relative bg-transparent border-none text-muted-foreground cursor-pointer hover:text-foreground" onClick={() => setZoom(z => Math.min(z + 10, 200))}>
                                <Search className="w-3.5 h-3.5" />
                                <Plus className="w-2 h-2 absolute bottom-2 right-2 bg-background rounded-full" />
                            </button>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                            <button className="vercel-button-outline text-sm h-10 px-4" onClick={handleExport}>
                                <Download className="w-4 h-4" />
                                <span>Download</span>
                            </button>

                            {isTailored && (
                                <button className="vercel-button text-sm h-10 px-4" onClick={() => handleSave(true)}>
                                    <Save className="w-4 h-4" />
                                    <span>Save as New</span>
                                </button>
                            )}

                            <button className={`vercel-button text-sm h-10 px-5`} onClick={() => handleSave(false)}>
                                <Save className="w-4 h-4" />
                                <span>{isSaving ? 'Saving...' : isTailored ? 'Update Existing' : 'Save'}</span>
                            </button>
                        </div>

                        <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-muted-foreground bg-transparent border border-border rounded-md hover:bg-muted transition-colors" onClick={() => setShowSelector(true)}>
                            <span>Select Resume</span>
                            <ChevronDown className="w-4 h-4" />
                        </button>
                    </div>

                    {showSelector && (
                        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] animate-in fade-in duration-200">
                            <div className="bg-background w-full max-w-2xl rounded-xl shadow-xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-4">
                                <div className="p-5 border-b border-border bg-muted/30 flex justify-between items-center">
                                    <div className="flex flex-col gap-1">
                                        <h3 className="text-lg font-semibold text-foreground m-0">Select Base Resume</h3>
                                        <p className="text-sm text-muted-foreground m-0">Choose which resume you want to tailor for <strong className="text-foreground">{resumeName.split('.')[0]}</strong>.</p>
                                    </div>
                                    <button className="p-2 bg-transparent border-none text-muted-foreground hover:bg-muted hover:text-foreground rounded-md transition-colors cursor-pointer" onClick={() => setShowSelector(false)}>
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="p-6 max-h-[60vh] overflow-y-auto">
                                    <div className="flex items-center gap-4 p-4 rounded-lg bg-muted border border-border mb-6">
                                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-background border border-border text-foreground">
                                            <NinjaIcon className="w-4 h-4 text-foreground" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold text-foreground">Job Match Context</span>
                                            <span className="text-xs text-muted-foreground">Based on your current tailoring session</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <h4 className="text-sm font-semibold text-muted-foreground m-0">Your Resumes</h4>
                                        <div className="flex flex-col gap-2">
                                            {savedResumes.filter(r => r.isBase).map(res => {
                                                const isActive = selectedResumeId === (res.id || res._id);
                                                return (
                                                <div
                                                    key={res.id || res._id}
                                                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${isActive ? 'border-ring bg-muted' : 'border-border hover:bg-muted/50'}`}
                                                    onClick={() => setSelectedResumeId(res.id || res._id)}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isActive ? 'border-ring' : 'border-border'}`}>
                                                            <div className={`w-2 h-2 rounded-full bg-ring transition-opacity ${isActive ? 'opacity-100' : 'opacity-0'}`} />
                                                        </div>
                                                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary text-muted-foreground">
                                                            <FileText className="w-4 h-4" />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-medium text-foreground">{res.resumeName || res.resume_name}</span>
                                                            <span className="text-xs text-muted-foreground">Updated recently</span>
                                                        </div>
                                                    </div>
                                                    <button
                                                        className="p-2 rounded-md bg-transparent border-none text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                                                        onClick={(e) => handleDeleteResume(res.id || res._id, e)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 border-t border-border bg-muted/30 flex items-center justify-between">
                                    <button className="bg-transparent border-none text-sm font-medium text-muted-foreground hover:text-foreground underline-offset-4 hover:underline cursor-pointer" onClick={() => navigate('/resumes')}>
                                        Manage Resumes
                                    </button>
                                    <div className="flex items-center gap-3">
                                        <button className="vercel-button-outline" onClick={() => { fileInputRef.current?.click(); setShowSelector(false); }}>
                                            Add Resume
                                        </button>
                                        <button
                                            className="vercel-button"
                                            disabled={!selectedResumeId}
                                            onClick={() => {
                                                const selected = savedResumes.find(r => (r.id || r._id) === selectedResumeId);
                                                if (selected) handleSelectResume(selected);
                                            }}
                                        >
                                            <span>Next</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </header>

                <div className="flex flex-1 overflow-hidden bg-muted/20">
                    {/* Hidden file input always available */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        hidden
                        accept=".pdf,.docx,.doc"
                    />

                    {/* Left Pane: Inputs & Configuration (45%) */}
                    <aside className="w-[45%] flex-shrink-0 bg-background border-r border-border flex flex-col overflow-y-auto relative z-40">
                        <div className="flex sticky top-0 bg-background/95 backdrop-blur z-50 p-3 gap-2 border-b border-border">
                            <button className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold uppercase tracking-wider rounded-md transition-all ${activeTab === 'resume' ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground border-none cursor-pointer'}`} onClick={() => setActiveTab('resume')}>
                                <NinjaIcon className="w-4 h-4" />
                                <span>OPTIMIZE</span>
                            </button>
                            <button className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold uppercase tracking-wider rounded-md transition-all ${activeTab === 'design' ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground border-none cursor-pointer'}`} onClick={() => setActiveTab('design')}>
                                <Layout className="w-4 h-4" />
                                <span>DESIGN</span>
                            </button>
                            <button className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold uppercase tracking-wider rounded-md transition-all ${activeTab === 'cover_letter' ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground border-none cursor-pointer'}`} onClick={() => setActiveTab('cover_letter')}>
                                <FileText className="w-4 h-4" />
                                <span>COVER LETTER</span>
                            </button>
                            <button className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold uppercase tracking-wider rounded-md transition-all ${activeTab === 'cold_mail' ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground border-none cursor-pointer'}`} onClick={() => setActiveTab('cold_mail')}>
                                <Mail className="w-4 h-4" />
                                <span>COLD EMAIL</span>
                            </button>
                        </div>

                        <div className="p-5 flex flex-col gap-5">
                            <div className="flex items-center gap-3 bg-muted border border-border rounded-lg p-4 text-sm font-medium text-foreground">
                                <NinjaIcon className="w-4 h-4 text-foreground" />
                                <span>Tailor your resume for any job in seconds with <strong className="font-bold">AI Ninja</strong>.</span>
                            </div>

                            {activeTab === 'resume' && (
                                <div className="ai-config-section">
                                    <AIConfigPanel
                                        jobDescription={jobDescription}
                                        setJobDescription={setJobDescription}
                                        jobTitle={jobTitle}
                                        setJobTitle={setJobTitle}
                                        companyName={companyName}
                                        setCompanyName={setCompanyName}
                                        onJobDataFetch={(data) => {
                                            if (data.jobTitle) setJobTitle(data.jobTitle);
                                            if (data.company) setCompanyName(data.company);
                                        }}
                                        onGenerate={handleGenerate}
                                        isGenerating={isGenerating}
                                        config={aiConfig}
                                        setConfig={setAiConfig}
                                    />

                                    <div className="mt-8 pt-8 border-t border-border">
                                        <div className="flex justify-between items-center mb-4">
                                            <label className="text-sm font-bold text-foreground uppercase tracking-wide">Quick Contact Edit</label>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Show Icons</span>
                                                <button
                                                    onClick={() => setShowContactIcons(!showContactIcons)}
                                                    className={`w-8 h-4 rounded-full transition-colors relative border-none cursor-pointer ${showContactIcons ? 'bg-primary' : 'bg-muted-foreground/30'}`}
                                                >
                                                    <div className={`absolute top-0.5 w-3 h-3 bg-background rounded-full transition-all ${showContactIcons ? 'left-4' : 'left-0.5'}`} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-3">
                                            <div className="relative flex items-center">
                                                <Mail className="w-4 h-4 text-muted-foreground absolute left-3" />
                                                <input
                                                    type="email"
                                                    value={contactEmail}
                                                    onChange={(e) => setContactEmail(e.target.value)}
                                                    className="w-full h-10 pl-10 pr-3 rounded-md border border-input bg-transparent text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-all"
                                                    placeholder="Email Address"
                                                />
                                            </div>
                                            <div className="relative flex items-center">
                                                <Phone className="w-4 h-4 text-muted-foreground absolute left-3" />
                                                <input
                                                    type="tel"
                                                    value={contactPhone}
                                                    onChange={(e) => setContactPhone(e.target.value)}
                                                    className="w-full h-10 pl-10 pr-3 rounded-md border border-input bg-transparent text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-all"
                                                    placeholder="Phone Number"
                                                />
                                            </div>
                                            <div className="relative flex items-center">
                                                <MapPin className="w-4 h-4 text-muted-foreground absolute left-3" />
                                                <input
                                                    type="text"
                                                    value={contactLocation}
                                                    onChange={(e) => setContactLocation(e.target.value)}
                                                    className="w-full h-10 pl-10 pr-3 rounded-md border border-input bg-transparent text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-all"
                                                    placeholder="Location"
                                                />
                                            </div>
                                            <div className="relative flex items-center">
                                                <Globe className="w-4 h-4 text-muted-foreground absolute left-3" />
                                                <input
                                                    type="text"
                                                    value={contactWebsite}
                                                    onChange={(e) => setContactWebsite(e.target.value)}
                                                    className="w-full h-10 pl-10 pr-3 rounded-md border border-input bg-transparent text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-all"
                                                    placeholder="Website URL"
                                                />
                                            </div>
                                            <div className="relative flex items-center">
                                                <Github className="w-4 h-4 text-muted-foreground absolute left-3" />
                                                <input
                                                    type="text"
                                                    value={contactGitHub}
                                                    onChange={(e) => setContactGitHub(e.target.value)}
                                                    className="w-full h-10 pl-10 pr-3 rounded-md border border-input bg-transparent text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-all"
                                                    placeholder="GitHub URL"
                                                />
                                            </div>
                                            <div className="relative flex items-center">
                                                <Linkedin className="w-4 h-4 text-muted-foreground absolute left-3" />
                                                <input
                                                    type="text"
                                                    value={contactLinkedIn}
                                                    onChange={(e) => setContactLinkedIn(e.target.value)}
                                                    className="w-full h-10 pl-10 pr-3 rounded-md border border-input bg-transparent text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-all"
                                                    placeholder="LinkedIn URL"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'design' && (
                                <div className="design-config-section">
                                    <h3 className="design-section-title">Select Template</h3>
                                    <div className="template-grid">
                                        <div className={`template-card ${template === 'standard' ? 'active' : ''}`} onClick={() => setTemplate('standard')}>
                                            <div className="template-preview standard">
                                                <div className="preview-header"></div>
                                                <div className="preview-item"></div>
                                                <div className="preview-item"></div>
                                                <div className="preview-item w-2/3"></div>
                                            </div>
                                            <span className="template-name">Classic ATS</span>
                                        </div>
                                        <div className={`template-card ${template === 'modern' ? 'active' : ''}`} onClick={() => setTemplate('modern')}>
                                            <div className="template-preview modern">
                                                <div className="preview-sidebar"></div>
                                                <div className="preview-item ml-auto"></div>
                                                <div className="preview-item ml-auto"></div>
                                                <div className="preview-item ml-auto w-1/2"></div>
                                            </div>
                                            <span className="template-name">Modern Executive</span>
                                        </div>
                                    </div>

                                    <h3 className="design-section-title mt-6">Typography</h3>
                                    <div className="font-selection-list">
                                        {['FAANG Font', 'Times New Roman', 'Arial', 'Georgia', 'Inter', 'Roboto', 'Outfit'].map(font => (
                                            <button
                                                key={font}
                                                className={`font-choice-btn ${fontFamily === font ? 'active' : ''}`}
                                                onClick={() => setFontFamily(font)}
                                                style={{ fontFamily: font === 'FAANG Font' ? 'Arial' : font }}
                                            >
                                                <span>{font}</span>
                                                {fontFamily === font && <CheckCircle2 className="w-4 h-4 text-foreground" />}
                                            </button>
                                        ))}
                                    </div>

                                    <h3 className="design-section-title mt-6">Page Settings</h3>
                                    <div className="settings-list-premium">
                                        <div className="setting-row">
                                            <span>Font Size</span>
                                            <div className="count-control">
                                                <button onClick={() => setFontSize(s => Math.max(s - 1, 8))}><Minus className="w-3 h-3" /></button>
                                                <span>{fontSize}pt</span>
                                                <button onClick={() => setFontSize(s => Math.min(s + 1, 14))}><Plus className="w-3 h-3" /></button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'cover_letter' && (
                                <div className="extra-feature-section-container">
                                    {!coverLetter && (
                                        <div className="extra-feature-section animate-in slide-in-from-bottom-5 flex flex-col items-center p-8 bg-background border border-border rounded-xl">
                                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted border border-border mb-4">
                                                <NinjaIcon className="w-6 h-6 text-foreground" />
                                            </div>
                                            <h3 className="text-lg font-bold text-foreground mb-2">Generate Cover Letter</h3>
                                            <p className="text-sm text-muted-foreground mb-6 text-center max-w-sm">JobNinjas AI will write a personalized cover letter matching your new resume to the job description.</p>
                                            <button className="vercel-button" onClick={handleGenerateCoverLetter} disabled={isGenerating}>
                                                {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <NinjaIcon className="w-4 h-4" />}
                                                <span>{isGenerating ? 'Writing...' : 'Write with AI'}</span>
                                            </button>
                                        </div>
                                    )}
                                    {coverLetter && (
                                        <div className="active-feature-controls">
                                            <div className="variant-toggle-group mb-4">
                                                <button
                                                    className={`variant-toggle-btn ${activeVariant === 'A' ? 'active' : ''}`}
                                                    onClick={() => {
                                                        setActiveVariant('A');
                                                        setCoverLetter(coverLetterA);
                                                    }}
                                                >
                                                    Variation A: High Alignment
                                                </button>
                                                <button
                                                    className={`variant-toggle-btn ${activeVariant === 'B' ? 'active' : ''}`}
                                                    onClick={() => {
                                                        setActiveVariant('B');
                                                        setCoverLetter(coverLetterB);
                                                    }}
                                                >
                                                    Variation B: Company Vision
                                                </button>
                                            </div>
                                            <button className="btn-regenerate-feature" onClick={handleGenerateCoverLetter} disabled={isGenerating}>
                                                <RotateCcw className="w-4 h-4" />
                                                <span>Regenerate</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'cold_mail' && (
                                <div className="extra-feature-section-container">
                                    {!coldMail && (
                                        <div className="extra-feature-section animate-in slide-in-from-bottom-5 flex flex-col items-center p-8 bg-background border border-border rounded-xl">
                                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted border border-border mb-4">
                                                <Mail className="w-6 h-6 text-foreground" />
                                            </div>
                                            <h3 className="text-lg font-bold text-foreground mb-2">Generate Cold Email</h3>
                                            <p className="text-sm text-muted-foreground mb-6 text-center max-w-sm">JobNinjas AI will write a punchy cold outreach message for this role.</p>
                                            <button className="vercel-button" onClick={handleGenerateColdMail} disabled={isGenerating}>
                                                {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <NinjaIcon className="w-4 h-4" />}
                                                <span>{isGenerating ? 'Generating...' : 'Generate with AI'}</span>
                                            </button>
                                        </div>
                                    )}
                                    {coldMail && (
                                        <div className="active-feature-controls">
                                            <div className="variant-toggle-group mb-4">
                                                <button
                                                    className={`variant-toggle-btn ${activeVariant === 'A' ? 'active' : ''}`}
                                                    onClick={() => {
                                                        setActiveVariant('A');
                                                        setColdMail(coldMailA);
                                                    }}
                                                >
                                                    Variant A: Solution
                                                </button>
                                                <button
                                                    className={`variant-toggle-btn ${activeVariant === 'B' ? 'active' : ''}`}
                                                    onClick={() => {
                                                        setActiveVariant('B');
                                                        setColdMail(coldMailB);
                                                    }}
                                                >
                                                    Variant B: Vision
                                                </button>
                                            </div>
                                            <button className="btn-regenerate-feature" onClick={handleGenerateColdMail} disabled={isGenerating}>
                                                <RotateCcw className="w-4 h-4" />
                                                <span>Regenerate</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </aside>

                    {/* Right Pane: Document Stage (55%) */}
                    <main className="flex-1 relative bg-muted/30 overflow-hidden flex flex-col custom-scrollbar">
                        {isGenerating && (
                            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-[60] flex flex-col items-center justify-center">
                                <div className="w-12 h-12 border-4 border-border border-t-ring rounded-full animate-spin mb-4" />
                                <div className="flex flex-col items-center gap-2">
                                    <Loader2 className="w-8 h-8 text-ring animate-spin" />
                                    <span className="text-sm font-medium text-foreground">AI is tailoring your resume...</span>
                                </div>
                            </div>
                        )}

                        {!resumeData && !tailoredResume ? (
                            <div className="h-full w-full flex items-center justify-center p-8 bg-muted/30">
                                <div className="bg-background max-w-md w-full rounded-2xl shadow-xl border border-border p-8 flex flex-col items-center text-center animate-in slide-in-from-bottom-4">
                                    <div className="w-16 h-16 bg-muted/50 rounded-2xl flex items-center justify-center mb-6">
                                        <FileText className="w-8 h-8 text-muted-foreground" />
                                    </div>
                                    <h3 className="text-xl font-bold text-foreground mb-2">Select Base Resume</h3>
                                    <p className="text-sm text-muted-foreground mb-8">Your AI Ninja Workspace is ready. Select a base resume to begin tailoring.</p>

                                    <div className="w-full flex flex-col gap-6">
                                        <button
                                            className="vercel-button w-full flex justify-center py-6 text-base"
                                            onClick={() => fileInputRef.current?.click()}
                                            disabled={isUploading}
                                        >
                                            {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                                            <span>{isUploading ? 'Uploading...' : 'Upload New Resume'}</span>
                                        </button>
                                        
                                        <div className="flex items-center gap-4 text-xs font-semibold text-muted-foreground uppercase tracking-widest w-full">
                                            <div className="flex-1 h-px bg-border" />
                                            <span>OR</span>
                                            <div className="flex-1 h-px bg-border" />
                                        </div>
                                        
                                        <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto custom-scrollbar w-full">
                                            {isLoadingSaved ? (
                                                <div className="flex justify-center p-4"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
                                            ) : savedResumes.filter(r => r.isBase).length > 0 ? (
                                                savedResumes.filter(r => r.isBase).map(res => (
                                                    <div
                                                        key={res.id || res._id}
                                                        className="flex items-center p-3 rounded-lg border border-border bg-background hover:border-ring transition-colors cursor-pointer group"
                                                        onClick={() => {
                                                            setResumeData(res);
                                                            setResumeName(res.resumeName || res.resume_name || 'Saved_Resume.docx');
                                                            setTailoredResume(res.resumeText || res.resume_text || '');
                                                            setHistory({ past: [], future: [] });
                                                        }}
                                                    >
                                                        <FileText className="w-4 h-4 text-muted-foreground group-hover:text-ring mr-3" />
                                                        <span className="flex-1 text-sm font-medium text-left truncate text-foreground">{res.resumeName || res.resume_name}</span>
                                                        <button
                                                            onClick={(e) => handleDeleteResume(res.id || res._id, e)}
                                                            className="p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-md transition-colors"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                ))
                                            ) : (
                                                <div
                                                    className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-border rounded-lg text-muted-foreground hover:bg-muted/50 transition-colors cursor-pointer"
                                                    onClick={() => fileInputRef.current?.click()}
                                                >
                                                    <Upload className="w-6 h-6 mb-2 opacity-50" />
                                                    <p className="font-medium text-sm text-foreground">Welcome to AI Ninja!</p>
                                                    <p className="text-xs">Upload your first resume to start tailoring.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full w-full overflow-y-auto p-4 sm:p-8 flex justify-center bg-muted/30 custom-scrollbar" style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}>
                                <div className="w-full max-w-[800px] bg-background shadow-xl min-h-[1056px] print:shadow-none print:m-0 print:p-0 transition-all duration-300 mx-auto">
                                <ResumePaper
                                    content={
                                        activeTab === 'resume' ? (tailoredResume || resumeData?.resumeText || resumeData?.resume_text || '') :
                                            activeTab === 'cover_letter' ? (coverLetter || 'Click "Write with AI" to generate your cover letter.') :
                                                activeTab === 'cold_mail' ? (coldMail || 'Click "Generate Mail" to create an outreach message.') :
                                                    (tailoredResume || resumeData?.resumeText || resumeData?.resume_text || '')
                                    }
                                    template={template}
                                    fontFamily={fontFamily}
                                    fontSize={fontSize}
                                    onContentChange={(newText) => {
                                        if (activeTab === 'resume') {
                                            setTailoredResume(newText);
                                        } else if (activeTab === 'cover_letter') {
                                            setCoverLetter(newText);
                                        } else if (activeTab === 'cold_mail') {
                                            setColdMail(newText);
                                        }
                                        setUnsavedChanges(prev => prev + 1);
                                    }}
                                    onEditSection={handleEditSection}
                                    onRegenerateSection={handleRegenerateSection}
                                    jobTitle={jobTitle}
                                    contactInfo={{
                                        email: contactEmail,
                                        phone: contactPhone,
                                        location: contactLocation,
                                        website: contactWebsite,
                                        github: contactGitHub,
                                        linkedin: contactLinkedIn,
                                        showIcons: showContactIcons
                                    }}
                                />
                                </div>
                                {isRefiningSection && (
                                    <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-50 backdrop-blur-sm">
                                        <div className="bg-background p-6 rounded-xl shadow-xl flex flex-col items-center gap-4 border border-border">
                                            <Loader2 className="w-10 h-10 text-ring animate-spin" />
                                            <p className="font-bold text-foreground">AI is refining this section...</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Section Edit Modal */}
                        {editingSection && (
                            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] animate-in fade-in duration-200">
                                <div className="bg-background w-full max-w-2xl rounded-2xl shadow-xl border border-border overflow-hidden flex flex-col animate-in slide-in-from-bottom-4">
                                    <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
                                        <h3 className="font-bold text-foreground text-lg uppercase">Edit {editingSection.key}</h3>
                                        <button onClick={() => setEditingSection(null)} className="p-2 hover:bg-muted text-muted-foreground hover:text-foreground rounded-full transition-colors bg-transparent border-none cursor-pointer">
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <div className="p-6">
                                        <textarea
                                            className="w-full h-96 p-4 border border-input rounded-xl focus:ring-2 focus:ring-ring focus:border-ring outline-none font-serif text-sm leading-relaxed resize-none bg-background text-foreground"
                                            value={editingSection.content}
                                            onChange={(e) => setEditingSection(prev => ({ ...prev, content: e.target.value }))}
                                        />
                                    </div>
                                    <div className="p-4 bg-muted/30 border-t border-border flex justify-end gap-3">
                                        <button
                                            onClick={() => setEditingSection(null)}
                                            className="vercel-button-outline"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => handleSaveEditedSection(editingSection.content)}
                                            className="vercel-button"
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Integrated Floating Controls */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-background/95 backdrop-blur shadow-lg border border-border rounded-full p-2 px-4 z-50">
                            <div className="flex items-center gap-3 pr-3">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Font</span>
                                <div className="flex items-center gap-1 cursor-pointer hover:text-foreground text-muted-foreground" onClick={() => setFontFamily(f => f === 'Times New Roman' ? 'Arial' : 'Times New Roman')}>
                                    <span className="text-xs font-medium" style={{ fontFamily: fontFamily === 'FAANG Font' ? 'Arial' : fontFamily }}>{fontFamily}</span>
                                    <ChevronDown className="w-3.5 h-3.5" />
                                </div>
                            </div>
                            <div className="w-px h-6 bg-border" />
                            <div className="flex items-center gap-3 px-3">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Size</span>
                                <div className="flex items-center gap-2">
                                    <button className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground border-none bg-transparent cursor-pointer" onClick={() => setFontSize(s => Math.max(s - 1, 8))}><Minus className="w-3 h-3" /></button>
                                    <span className="text-xs font-medium w-8 text-center text-foreground">{fontSize}pt</span>
                                    <button className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground border-none bg-transparent cursor-pointer" onClick={() => setFontSize(s => Math.min(s + 1, 14))}><Plus className="w-3 h-3" /></button>
                                </div>
                            </div>
                            <div className="w-px h-6 bg-border mr-2" />
                            <button className="flex items-center gap-2 px-4 py-1.5 bg-ring text-primary-foreground hover:bg-ring/90 font-medium text-xs rounded-full transition-all border-none shadow-sm cursor-pointer" onClick={handleGenerate}>
                                <NinjaIcon className="w-3.5 h-3.5" />
                                <span>AI Enhance</span>
                            </button>
                        </div>
                    </main>
                </div>
            </div >
            <ConfirmDeleteModal
                isOpen={deleteModalOpen}
                onClose={() => {
                    setDeleteModalOpen(false);
                    setResumeToDelete(null);
                }}
                onConfirm={executeDeleteResume}
                isDeleting={isDeletingResume}
            />
            {showTrackerNotify && (
                <div className="fixed bottom-6 right-6 bg-background text-foreground p-4 rounded-xl shadow-xl z-[200] animate-in slide-in-from-right-10 flex items-center gap-4 max-w-sm border border-border">
                    <div className="bg-ring/20 p-2 rounded-xl">
                        <CheckCircle2 className="w-6 h-6 text-ring" />
                    </div>
                    <div className="flex-1">
                        <p className="font-semibold text-sm text-foreground">Resumed Tailored & Tracked!</p>
                        <p className="text-xs text-muted-foreground">This application is now visible in your Application Tracker.</p>
                    </div>
                    <button
                        onClick={() => navigate('/dashboard?tab=tracker')}
                        className="bg-ring hover:bg-ring/90 text-primary-foreground text-xs font-medium px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap border-none cursor-pointer"
                    >
                        GO TO TRACKER
                    </button>
                    <button onClick={() => setShowTrackerNotify(false)} className="text-muted-foreground hover:text-foreground bg-transparent border-none cursor-pointer">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}
        </>
    );
};

export default ResumeEditorPage;
