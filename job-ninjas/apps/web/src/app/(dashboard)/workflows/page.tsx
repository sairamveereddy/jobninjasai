"use client";

import { useState } from 'react';
import { Play, CheckCircle, Clock, Workflow, ArrowRight, Settings, Plus, TerminalSquare } from 'lucide-react';
import Link from 'next/link';

const MOCK_WORKFLOWS = [
  { 
    id: 'wf-1', 
    name: 'Candidate Intake & Evidence', 
    description: 'Automatically parses incoming resumes from email, extracts key skills, and creates a candidate profile in the ATS.',
    status: 'active', 
    lastRun: '10 mins ago',
    steps: ['Email Parser', 'Resume Analyzer', 'Greenhouse Sync']
  },
  { 
    id: 'wf-2', 
    name: 'Interview Transcript Analysis', 
    description: 'Reads raw interview transcripts, generates a summarized scorecard, and flags potential red flags.',
    status: 'active', 
    lastRun: '2 hours ago',
    steps: ['Zoom Transcripts', 'Scorecard Generator', 'Slack Alert']
  },
];

export default function WorkflowsPage() {
  const [running, setRunning] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const runWorkflow = (id: string) => {
    setRunning(id);
    setLogs(['[SYSTEM] Initializing workflow execution...', '[SYSTEM] Connecting to agent network...']);
    
    setTimeout(() => setLogs(l => [...l, '[NODE: Step 1] Fetching input data...']), 1000);
    setTimeout(() => setLogs(l => [...l, '[NODE: Step 1] Success. Data passed to next agent.']), 2500);
    setTimeout(() => setLogs(l => [...l, '[NODE: Step 2] AI Analysis running...']), 3000);
    setTimeout(() => setLogs(l => [...l, '[NODE: Step 2] Success. Generated insights.']), 5000);
    setTimeout(() => setLogs(l => [...l, '[NODE: Step 3] Syncing output to integrations...']), 5500);
    setTimeout(() => {
      setLogs(l => [...l, '[SYSTEM] Workflow execution completed successfully.']);
      setRunning(null);
    }, 7000);
  };

  return (
    <div className="p-8 h-full flex flex-col gap-8 relative overflow-y-auto">
      {/* Header & Onboarding Context */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden flex-shrink-0">
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-card/20 rounded-lg backdrop-blur-sm">
              <Workflow className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold">Automated Workflows</h2>
          </div>
          <p className="text-indigo-100 text-lg leading-relaxed mb-6">
            Workflows are automated sequences of AI agents that run in the background. 
            Instead of manually reviewing every resume or interview, you can string together multiple agents 
            on the canvas to process candidates from end-to-end automatically.
          </p>
          <Link href="/workflows/new" className="bg-card text-indigo-600 px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 hover:bg-indigo-50 transition-colors shadow-sm">
            <Plus className="w-5 h-5" />
            Create New Workflow
          </Link>
        </div>
        {/* Decorative background shapes */}
        <div className="absolute right-0 top-0 w-64 h-64 bg-card/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      </div>

      <div className="flex gap-8 flex-1 min-h-0">
        {/* Workflows List */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900">Your Active Workflows</h3>
          </div>

          {MOCK_WORKFLOWS.map(wf => (
            <div key={wf.id} className="bg-card p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{wf.name}</h3>
                  <p className="text-gray-500 text-sm mt-1 mb-3 max-w-lg">{wf.description}</p>
                  
                  <div className="flex items-center gap-4 text-xs font-medium">
                    <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">
                      <CheckCircle size={14}/> {wf.status}
                    </span>
                    <span className="flex items-center gap-1 text-gray-500 bg-gray-50 px-2 py-1 rounded-full border border-gray-200">
                      <Clock size={14}/> Last run: {wf.lastRun}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="Edit Workflow Canvas">
                    <Settings className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => runWorkflow(wf.id)}
                    disabled={running !== null}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all shadow-sm ${
                      running === wf.id 
                        ? 'bg-indigo-100 text-indigo-700 cursor-wait' 
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow disabled:opacity-50 disabled:cursor-not-allowed'
                    }`}
                  >
                    {running === wf.id ? (
                      <>Running Sequence...</>
                    ) : (
                      <><Play size={16} fill="currentColor" /> Run Manually</>
                    )}
                  </button>
                </div>
              </div>

              {/* Workflow Steps Visualization */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Agent Sequence</p>
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {wf.steps.map((step, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-md text-sm font-medium text-gray-700 whitespace-nowrap shadow-sm">
                        {step}
                      </div>
                      {index < wf.steps.length - 1 && (
                        <ArrowRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Execution Logs Panel */}
        <div className="w-[400px] flex flex-col flex-shrink-0 bg-[#0f172a] rounded-2xl shadow-xl border border-slate-700 overflow-hidden">
          <div className="bg-slate-800/80 backdrop-blur-md px-4 py-3 border-b border-slate-700 flex justify-between items-center shadow-sm">
            <div className="flex items-center gap-2">
              <TerminalSquare className="w-4 h-4 text-muted-foreground" />
              <h3 className="text-xs font-bold text-slate-300 tracking-widest uppercase">Live Terminal</h3>
            </div>
            {running && (
              <span className="flex items-center gap-2">
                <span className="text-[10px] text-emerald-400 font-mono font-medium animate-pulse">EXECUTING</span>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </span>
            )}
          </div>
          <div className="p-5 flex-1 overflow-y-auto font-mono text-sm leading-relaxed text-emerald-400/90 space-y-3 custom-scrollbar">
            {logs.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-3 opacity-50">
                <TerminalSquare className="w-8 h-8" />
                <p>Waiting for manual execution trigger...</p>
              </div>
            ) : (
              logs.map((log, i) => (
                <div key={i} className="animate-in fade-in slide-in-from-bottom-1 duration-300">
                  <span className="text-muted-foreground mr-3">[{new Date().toLocaleTimeString([], {hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit'})}]</span>
                  <span className={log.includes('Success') ? 'text-emerald-300 font-semibold' : log.includes('SYSTEM') ? 'text-blue-300' : 'text-emerald-400'}>
                    {log}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
