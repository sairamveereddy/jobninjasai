"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Maximize2, 
  ExternalLink, 
  CheckCircle2, 
  Volume2, 
  VolumeX, 
  FileText, 
  Code2, 
  Headphones, 
  Plane, 
  UserCheck, 
  Zap, 
  Sparkles, 
  Shield, 
  Check, 
  Clock, 
  ChevronRight,
  ArrowRight,
  Layers,
  MousePointer2,
  Users,
  Compass,
  UploadCloud,
  FileCheck2,
  Sliders,
  Send
} from "lucide-react";
import { TRIAL_HREF } from "@/lib/marketing/site";

interface VideoChapter {
  id: string;
  timestamp: string;
  second: number;
  title: string;
  agentLabel: string;
  summary: string;
  activeNodeId: string;
  inspectorData: {
    title: string;
    badge: string;
    metricLabel: string;
    metricValue: string;
    details: string;
    citation: string;
  };
}

const CHAPTERS: VideoChapter[] = [
  {
    id: "jd-intake",
    timestamp: "0:00",
    second: 0,
    title: "1. ATS Intake & Rubric Compiler",
    agentLabel: "Job Description Parser",
    summary: "Ingests raw job specs from Greenhouse and compiles hard skill qualification trees.",
    activeNodeId: "node-jd",
    inspectorData: {
      title: "Staff Distributed Systems Engineer (Kafka / Raft / Go)",
      badge: "Greenhouse #ENG-2489 Synced",
      metricLabel: "Hard Skill Gates",
      metricValue: "12 Requirements Extracted",
      details: "Synthesized non-negotiable rubrics: Raft consensus engines, zero-lock memory concurrency, p99 latency benchmarking.",
      citation: "ATS Job Requisition #2489 · Minimum 6 yrs production Go experience verified.",
    },
  },
  {
    id: "resume-screen",
    timestamp: "0:15",
    second: 15,
    title: "2. Candidate Resume Intelligence",
    agentLabel: "Resume Parser Agent",
    summary: "Extracts verified candidate signals, cross-referencing past roles against company rubrics.",
    activeNodeId: "node-resume",
    inspectorData: {
      title: "Applicant Dossier: Marcus Vance",
      badge: "Resume Signal 100% Grounded",
      metricLabel: "Initial Match Score",
      metricValue: "94% Role Fit",
      details: "Architected distributed log replication handling 50k writes/sec at Cockroach Labs. Exceeds concurrency requirements.",
      citation: "Resume Page 2 · Verified production Kafka partition rebalancing architecture.",
    },
  },
  {
    id: "github-audit",
    timestamp: "0:30",
    second: 30,
    title: "3. GitHub AST & Code Reviewer",
    agentLabel: "Code Auditor Agent",
    summary: "Parses candidate's public pull requests, checking AST memory safety and real commit cleanliness.",
    activeNodeId: "node-code",
    inspectorData: {
      title: "github.com/mvance/raft-consensus-engine",
      badge: "142 Commits AST Parsed",
      metricLabel: "Code Quality Rubric",
      metricValue: "9.5 / 10 Cleanliness",
      details: "Deterministic leader election heartbeats verified. Zero goroutine memory leaks or race conditions detected in test suite.",
      citation: "Pull Request #42 · raft/server.go lines 180-245 · Clean lock-free ring buffer implementation.",
    },
  },
  {
    id: "audio-interview",
    timestamp: "0:45",
    second: 45,
    title: "4. Audio Interview Transcript Scorer",
    agentLabel: "Transcript Evaluator Agent",
    summary: "Transcribes live technical interview audio and scores architecture explanations against timestamps.",
    activeNodeId: "node-audio",
    inspectorData: {
      title: "Round 2 Technical Architecture Loop",
      badge: "Audio Scored [18:42]",
      metricLabel: "System Design Rating",
      metricValue: "9.2 / 10 Rubric Score",
      details: "\"We decoupled state machine log compaction to prevent disk I/O blocking under 20k writes/sec.\" Clear, structured communication.",
      citation: "Audio recording round-2.wav [18:42 - 21:10] · Candidate verified tradeoff between throughput and crash recovery.",
    },
  },
  {
    id: "travel-offer",
    timestamp: "1:00",
    second: 60,
    title: "5. Travel Concierge & Advisory Gate",
    agentLabel: "Ophelia OS & Decision Gate",
    summary: "Discovers real flights, books onsite hotels via Ophelia API, and prepares final hiring committee consensus.",
    activeNodeId: "node-travel",
    inspectorData: {
      title: "Ophelia VIP Onsite Concierge + Offer Consensus",
      badge: "Real API Booking Live",
      metricLabel: "Hiring Consensus",
      metricValue: "Strong Yes (94% Conf.)",
      details: "Flight SFO ➔ JFK UA-821 ($465) + 3 nights at The Beekman reserved. Executive hiring dossier dispatched to #eng-hiring with 1-click offer voting.",
      citation: "Ophelia Reservation #OPH-9921 · Calendar invite dispatched to candidate and engineering leads.",
    },
  },
];

const TOTAL_DURATION = 75; // 75 seconds total demo loop

export function BoardVideoScreen() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(18); // Start at ~18s (Resume / Code review)
  const [activeChapterIndex, setActiveChapterIndex] = useState(1);
  const [isMuted, setIsMuted] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 1.5 | 2>(1);
  const [showInspector, setShowInspector] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(true);

  // Pause playback when scrolled out of view to save CPU and battery
  useEffect(() => {
    if (!containerRef.current || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Auto-play progress loop
  useEffect(() => {
    if (!isPlaying || !isInView) return;

    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        const next = prev + 1 * playbackSpeed;
        if (next >= TOTAL_DURATION) {
          return 0; // loop back
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, isInView, playbackSpeed]);

  // Sync active chapter with current time
  useEffect(() => {
    for (let i = CHAPTERS.length - 1; i >= 0; i--) {
      if (currentTime >= CHAPTERS[i].second) {
        setActiveChapterIndex(i);
        break;
      }
    }
  }, [currentTime]);

  const activeChapter = CHAPTERS[activeChapterIndex];

  const handleJumpToChapter = (index: number) => {
    setActiveChapterIndex(index);
    setCurrentTime(CHAPTERS[index].second);
    setIsPlaying(true);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const progressPercent = (currentTime / TOTAL_DURATION) * 100;

  return (
    <div className="w-full font-sans select-none" ref={containerRef}>
      
      {/* 1. Main Video Mockup Frame */}
      <div className="relative rounded-3xl border-2 border-slate-800 bg-[#0c111d] shadow-2xl shadow-blue-900/20 overflow-hidden ring-1 ring-white/10">
        
        {/* Top Window Bar (Mac / SaaS Browser Shell) */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-[#161b26] text-xs">
          
          {/* Traffic light window controls */}
          <div className="flex items-center gap-2">
            <span className="size-3 rounded-full bg-[#ff5f56] inline-block shadow-xs" />
            <span className="size-3 rounded-full bg-[#ffbd2e] inline-block shadow-xs" />
            <span className="size-3 rounded-full bg-[#27c93f] inline-block shadow-xs" />
          </div>

          {/* Centered URL & Title pill */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700/80 text-[11px] font-mono text-slate-300 shadow-inner">
            <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-400">jobninjas.ai/roles/</span>
            <span className="text-sky-400 font-semibold">ai-agentic-developer</span>
            <span className="text-slate-400">/board</span>
          </div>

          {/* Right badge */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-400/30 text-[10px] font-mono font-bold text-sky-300">
              <span className="size-1.5 rounded-full bg-sky-400 animate-ping" />
              <span>INTERACTIVE BOARD WALKTHROUGH</span>
            </div>
            <Link
              href="/roles/ai-agentic-developer/board"
              target="_blank"
              className="flex items-center gap-1 text-[11px] font-semibold text-slate-300 hover:text-white transition-colors"
            >
              <span className="hidden md:inline">Open Live Sandbox</span>
              <ExternalLink className="size-3" />
            </Link>
          </div>
        </div>

        {/* Video Screen Content (Simulated Real JobNinjas Board) */}
        <div 
          className="relative w-full aspect-[16/10] sm:aspect-[16/9] bg-[#f6f8fa] overflow-hidden cursor-pointer"
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {/* Subtle Grid Dot Canvas */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-45"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, #94a3b8 1px, transparent 0)`,
              backgroundSize: '20px 20px'
            }}
          />

          {/* Top Board Toolbar inside the screen */}
          <div className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between pointer-events-none">
            {/* Left: Brand & Candidate Selector */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs">
                <Image src="/logo.png" alt="JobNinjas" width={20} height={20} className="size-5 object-contain" unoptimized />
                <span className="text-xs font-black text-slate-900 tracking-tight">JobNinjas</span>
              </div>
              <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs text-xs">
                <div className="size-4.5 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center">
                  MV
                </div>
                <span className="font-bold text-slate-800">Marcus Vance</span>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                  94% Match
                </span>
              </div>
            </div>

            {/* Right: Board action pills */}
            <div className="hidden sm:flex items-center gap-1.5">
              <div className="bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-200 text-[11px] font-semibold text-slate-600 shadow-xs">
                ? How this board works
              </div>
              <div className="bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-200 text-[11px] font-semibold text-slate-600 shadow-xs flex items-center gap-1">
                <span>Upload resume</span>
              </div>
              <div className="bg-blue-600 text-white px-3 py-1 rounded-lg text-[11px] font-bold shadow-xs flex items-center gap-1">
                <Play className="size-2.5 fill-current" />
                <span>Run pipeline</span>
              </div>
            </div>
          </div>

          {/* Left "This Role" Panel Mockup */}
          <div className="absolute top-14 left-3 bottom-14 z-20 w-44 sm:w-56 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-lg p-3 hidden md:flex flex-col justify-between text-xs pointer-events-none">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                <div>
                  <span className="text-[9px] font-mono uppercase font-bold text-slate-400 block">This Role</span>
                  <span className="font-extrabold text-slate-900 text-xs">ai agentic developer</span>
                </div>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700">Open</span>
              </div>

              {/* Candidates list */}
              <span className="text-[9px] font-mono uppercase font-bold text-slate-400 block mb-1">
                Candidates (3)
              </span>
              <div className="space-y-1 mb-3">
                <div className="p-1.5 rounded-lg bg-blue-50/80 border border-blue-200 text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-blue-900">Marcus Vance</span>
                    <span className="font-mono text-[9px] font-bold text-blue-700">94%</span>
                  </div>
                  <span className="text-[9px] text-blue-600 font-mono block">Technical Screen · Selected</span>
                </div>
                <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-100 text-[11px] opacity-75">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-800">Amina Bello</span>
                    <span className="font-mono text-[9px] text-slate-500">88%</span>
                  </div>
                  <span className="text-[9px] text-slate-400 font-mono block">Resume Ready</span>
                </div>
              </div>

              {/* Documents list */}
              <span className="text-[9px] font-mono uppercase font-bold text-slate-400 block mb-1">
                Documents (2)
              </span>
              <div className="space-y-1 text-[10px] text-slate-600 font-mono">
                <div className="flex items-center gap-1.5 p-1 rounded bg-slate-50">
                  <FileText className="size-3 text-slate-400" />
                  <span className="truncate">ai-dev-rubric.pdf</span>
                </div>
                <div className="flex items-center gap-1.5 p-1 rounded bg-slate-50">
                  <Code2 className="size-3 text-slate-400" />
                  <span className="truncate">mvance-raft.go</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400 flex items-center justify-between">
              <span>Sync ATS (Greenhouse)</span>
              <span className="size-1.5 rounded-full bg-emerald-500" />
            </div>
          </div>

          {/* SVG Animated Bezier Connectors */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 1000 600" preserveAspectRatio="none">
            <defs>
              <linearGradient id="activeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="50%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>

            {/* Wire 1: JD -> Resume Parser */}
            <path
              d="M 330 140 C 370 140, 390 220, 430 220"
              fill="none"
              stroke={activeChapterIndex >= 1 ? "url(#activeGradient)" : "#cbd5e1"}
              strokeWidth="2.5"
              strokeDasharray={activeChapterIndex >= 1 ? "6 3" : "none"}
              className={activeChapterIndex >= 1 ? "animate-pulse" : ""}
            />

            {/* Wire 2: Resume -> Code Reviewer */}
            <path
              d="M 590 220 C 630 220, 650 140, 690 140"
              fill="none"
              stroke={activeChapterIndex >= 2 ? "url(#activeGradient)" : "#cbd5e1"}
              strokeWidth="2.5"
              strokeDasharray={activeChapterIndex >= 2 ? "6 3" : "none"}
            />

            {/* Wire 3: Resume -> Audio Scorer */}
            <path
              d="M 590 230 C 630 230, 650 320, 690 320"
              fill="none"
              stroke={activeChapterIndex >= 3 ? "url(#activeGradient)" : "#cbd5e1"}
              strokeWidth="2.5"
              strokeDasharray={activeChapterIndex >= 3 ? "6 3" : "none"}
            />

            {/* Wire 4: Code & Audio -> Travel Concierge & Advisory Gate */}
            <path
              d="M 850 140 C 880 140, 890 230, 910 230"
              fill="none"
              stroke={activeChapterIndex >= 4 ? "url(#activeGradient)" : "#cbd5e1"}
              strokeWidth="2.5"
            />
            <path
              d="M 850 320 C 880 320, 890 230, 910 230"
              fill="none"
              stroke={activeChapterIndex >= 4 ? "url(#activeGradient)" : "#cbd5e1"}
              strokeWidth="2.5"
            />
          </svg>

          {/* Canvas Nodes Layout */}
          <div className="absolute inset-0 z-20 flex items-center justify-center pl-10 md:pl-56 pr-6 pointer-events-none">
            <div className="w-full max-w-4xl grid grid-cols-3 gap-y-8 gap-x-6 sm:gap-x-12 items-center">
              
              {/* NODE 1: Job Details & Rubric */}
              <div 
                className={`rounded-2xl border bg-white p-3 sm:p-4 shadow-md transition-all duration-300 ${
                  activeChapterIndex === 0 
                    ? "border-blue-500 ring-4 ring-blue-100 scale-105 shadow-xl" 
                    : "border-slate-200/90 opacity-90"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                    INPUT
                  </span>
                  <span className="text-[9px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded">
                    ✓ Done
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 leading-tight">Job Details & Rubric</h4>
                <p className="text-[10px] text-slate-500 mt-0.5 truncate">12 non-negotiable gates compiled</p>
                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[9px] text-slate-400">
                  <span>Inspector</span>
                  <span className="text-blue-600 font-bold">Step 1</span>
                </div>
              </div>

              {/* NODE 2: Resume Parser Agent (Center) */}
              <div 
                className={`rounded-2xl border bg-white p-3 sm:p-4 shadow-md transition-all duration-300 ${
                  activeChapterIndex === 1 
                    ? "border-sky-500 ring-4 ring-sky-100 scale-105 shadow-xl" 
                    : "border-slate-200/90 opacity-90"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-sky-50 text-sky-700">
                    AGENT
                  </span>
                  <span className="text-[9px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded">
                    ✓ 94% Fit
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 leading-tight">Resume Intelligence</h4>
                <p className="text-[10px] text-slate-500 mt-0.5 truncate">M. Vance · Distributed Systems</p>
                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[9px] text-slate-400">
                  <span>Skills Parsed</span>
                  <span className="text-sky-600 font-bold">Step 2</span>
                </div>
              </div>

              {/* NODE 3: GitHub AST Code Reviewer */}
              <div 
                className={`rounded-2xl border bg-white p-3 sm:p-4 shadow-md transition-all duration-300 ${
                  activeChapterIndex === 2 
                    ? "border-indigo-500 ring-4 ring-indigo-100 scale-105 shadow-xl" 
                    : "border-slate-200/90 opacity-90"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                    AST AUDITOR
                  </span>
                  <span className="text-[9px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded">
                    ✓ 9.5 / 10
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 leading-tight">GitHub Code Auditor</h4>
                <p className="text-[10px] text-slate-500 mt-0.5 truncate">raft-consensus-engine (142 commits)</p>
                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[9px] text-slate-400">
                  <span>Zero Leaks</span>
                  <span className="text-indigo-600 font-bold">Step 3</span>
                </div>
              </div>

              {/* NODE 4: Audio Transcript Scorer */}
              <div 
                className={`rounded-2xl border bg-white p-3 sm:p-4 shadow-md transition-all duration-300 col-start-2 ${
                  activeChapterIndex === 3 
                    ? "border-purple-500 ring-4 ring-purple-100 scale-105 shadow-xl" 
                    : "border-slate-200/90 opacity-90"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-700">
                    AUDIO SCORER
                  </span>
                  <span className="text-[9px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded">
                    ✓ 9.2 / 10
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 leading-tight">Transcript Evaluator</h4>
                <p className="text-[10px] text-slate-500 mt-0.5 truncate">Audio [18:42] · System Design Q&A</p>
                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[9px] text-slate-400">
                  <span>Timestamp Cited</span>
                  <span className="text-purple-600 font-bold">Step 4</span>
                </div>
              </div>

              {/* NODE 5: Travel & Advisory Gate */}
              <div 
                className={`rounded-2xl border bg-white p-3 sm:p-4 shadow-md transition-all duration-300 col-start-3 ${
                  activeChapterIndex === 4 
                    ? "border-emerald-500 ring-4 ring-emerald-100 scale-105 shadow-xl" 
                    : "border-slate-200/90 opacity-90"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                    OPHELIA OS
                  </span>
                  <span className="text-[9px] font-bold text-white bg-emerald-600 px-1.5 py-0.2 rounded">
                    STRONG YES
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 leading-tight">Ophelia VIP Concierge</h4>
                <p className="text-[10px] text-slate-500 mt-0.5 truncate">SFO➔JFK UA-821 ($465) + Hotel booked</p>
                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[9px] text-slate-400">
                  <span>Committee Ready</span>
                  <span className="text-emerald-600 font-bold">Step 5</span>
                </div>
              </div>

            </div>
          </div>

          {/* Floating Miro-Style Collaborator Cursors moving in video */}
          <div 
            className="absolute z-30 transition-all duration-700 hidden sm:flex items-start gap-1 pointer-events-none"
            style={{
              top: activeChapterIndex % 2 === 0 ? "28%" : "55%",
              left: activeChapterIndex === 0 ? "35%" : activeChapterIndex === 1 ? "52%" : activeChapterIndex === 2 ? "74%" : activeChapterIndex === 3 ? "52%" : "75%",
            }}
          >
            <MousePointer2 className="size-4 text-blue-600 fill-blue-600 drop-shadow-md" />
            <div className="rounded-full bg-blue-600 text-white px-2.5 py-0.5 text-[10px] font-bold shadow-md whitespace-nowrap">
              Sarah (Recruiter) verifying {activeChapter.agentLabel}
            </div>
          </div>

          {/* Bottom Floating Canvas Dock */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 hidden sm:flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200 shadow-md text-slate-600 text-[11px] pointer-events-none">
            <span className="p-1 rounded-md bg-blue-50 text-blue-600"><Send className="size-3" /></span>
            <span className="p-1 rounded-md hover:bg-slate-100"><Zap className="size-3" /></span>
            <span className="p-1 rounded-md hover:bg-slate-100"><Layers className="size-3" /></span>
            <span className="p-1 rounded-md hover:bg-slate-100"><FileText className="size-3" /></span>
            <span className="p-1 rounded-md hover:bg-slate-100"><Sliders className="size-3" /></span>
            <span className="h-3 w-px bg-slate-200 mx-1" />
            <span className="text-[10px] font-mono text-slate-400 font-semibold">Active Pipeline Loop</span>
          </div>

          {/* Real-Time Live Inspector Drawer overlay (Top Right of screen) */}
          {showInspector && (
            <div className="absolute top-14 right-3 z-30 w-64 sm:w-80 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 shadow-xl p-3.5 text-xs animate-in fade-in zoom-in-95 duration-200 pointer-events-none">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-blue-600 animate-pulse" />
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Live Inspector Output
                  </span>
                </div>
                <span className="font-mono text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  {activeChapter.inspectorData.badge}
                </span>
              </div>

              <p className="font-extrabold text-slate-900 text-xs">
                {activeChapter.inspectorData.title}
              </p>
              <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                {activeChapter.inspectorData.details}
              </p>

              <div className="mt-2.5 p-2 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mb-0.5">
                  <span>{activeChapter.inspectorData.metricLabel}:</span>
                  <span className="font-bold text-blue-700 text-xs">{activeChapter.inspectorData.metricValue}</span>
                </div>
                <p className="text-[9px] font-mono text-slate-500 truncate">
                  Citation: {activeChapter.inspectorData.citation}
                </p>
              </div>
            </div>
          )}

          {/* Big Center Play Pause Overlay Icon when paused */}
          {!isPlaying && (
            <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-2xs z-40 flex items-center justify-center">
              <div className="size-16 rounded-full bg-blue-600/90 text-white flex items-center justify-center shadow-2xl pl-1 hover:scale-105 transition-transform">
                <Play className="size-8 fill-current" />
              </div>
            </div>
          )}

        </div>

        {/* 2. Video Player Bottom Scrubbing Bar */}
        <div className="px-4 py-3 bg-[#111622] border-t border-slate-800 flex flex-col gap-2">
          
          {/* Progress Timeline Scrubber */}
          <div 
            className="relative w-full h-2 bg-slate-800 rounded-full cursor-pointer group"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const newRatio = Math.max(0, Math.min(1, clickX / rect.width));
              setCurrentTime(newRatio * TOTAL_DURATION);
            }}
          >
            {/* Filled timeline */}
            <div 
              className="h-full rounded-full bg-gradient-to-r from-blue-500 via-sky-400 to-emerald-400 transition-all duration-150"
              style={{ width: `${progressPercent}%` }}
            />
            {/* Scrubber thumb */}
            <div 
              className="absolute top-1/2 -translate-y-1/2 size-3.5 rounded-full bg-white shadow-md border-2 border-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ left: `calc(${progressPercent}% - 7px)` }}
            />
          </div>

          {/* Bottom Player Controls */}
          <div className="flex items-center justify-between text-xs text-slate-300">
            
            {/* Left controls: Play/Pause, Replay, Time */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="size-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center transition-colors cursor-pointer"
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause className="size-4" /> : <Play className="size-4 fill-current ml-0.5" />}
              </button>

              <button
                type="button"
                onClick={() => { setCurrentTime(0); setIsPlaying(true); }}
                className="size-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Restart Walkthrough"
              >
                <RotateCcw className="size-3.5" />
              </button>

              <div className="font-mono text-[11px] text-slate-400">
                <span className="text-white font-semibold">{formatTime(currentTime)}</span>
                <span className="mx-1">/</span>
                <span>{formatTime(TOTAL_DURATION)}</span>
              </div>

              {/* Active Chapter Label */}
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/60 text-[11px] text-sky-300">
                <span className="size-1.5 rounded-full bg-sky-400" />
                <span className="font-medium truncate max-w-[200px]">{activeChapter.title}</span>
              </div>
            </div>

            {/* Right controls: Speed, Inspector Toggle, Fullscreen */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPlaybackSpeed(playbackSpeed === 1 ? 1.5 : playbackSpeed === 1.5 ? 2 : 1)}
                className="px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[10px] font-bold transition-colors cursor-pointer"
                title="Playback Speed"
              >
                {playbackSpeed}x
              </button>

              <button
                type="button"
                onClick={() => setShowInspector(!showInspector)}
                className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                  showInspector ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400"
                }`}
                title="Toggle Live Evidence Inspector"
              >
                Inspector
              </button>

              <Link
                href="/roles/ai-agentic-developer/board"
                target="_blank"
                className="inline-flex items-center gap-1 rounded-md bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-all"
              >
                <span>Launch Full Board</span>
                <ArrowRight className="size-3" />
              </Link>
            </div>

          </div>

        </div>

      </div>

      {/* 3. Interactive Video Chapters: Click to jump to exact product moment */}
      <div className="mt-5">
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
            Click any step to watch how the board operates:
          </span>
          <span className="text-xs text-blue-600 font-semibold font-mono">
            5 Automated Pipeline Steps
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {CHAPTERS.map((chap, idx) => {
            const isCurrent = activeChapterIndex === idx;
            return (
              <button
                key={chap.id}
                type="button"
                onClick={() => handleJumpToChapter(idx)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isCurrent 
                    ? "bg-white border-blue-500 shadow-md ring-2 ring-blue-100 scale-[1.02]" 
                    : "bg-white/80 border-slate-200 hover:bg-white hover:border-slate-300"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                      {chap.timestamp}
                    </span>
                    {isCurrent && (
                      <span className="size-2 rounded-full bg-blue-600 animate-ping" />
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 leading-snug">
                    {chap.agentLabel}
                  </h4>
                  <p className="mt-1 text-[11px] text-slate-500 leading-snug line-clamp-2">
                    {chap.summary}
                  </p>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono">
                  <span className={isCurrent ? "font-bold text-blue-600" : "text-slate-400"}>
                    {isCurrent ? "Now Playing" : "Click to view"}
                  </span>
                  <ChevronRight className="size-3 text-slate-400" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
