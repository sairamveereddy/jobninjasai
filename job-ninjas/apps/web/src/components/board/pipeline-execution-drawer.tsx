"use client";

import { useState, useEffect } from "react";
import { Play, Square, CheckCircle2, AlertCircle, Clock, ChevronDown, ChevronUp, Sparkles, User, ArrowRight, ShieldCheck, FileText } from "lucide-react";

export interface PipelineStep {
  id: string;
  name: string;
  role: string;
  status: "pending" | "running" | "completed" | "failed" | "gate";
  outputSnippet?: string;
  error?: string;
}

interface PipelineExecutionDrawerProps {
  isOpen: boolean;
  isRunning: boolean;
  activeCandidateName: string;
  steps: PipelineStep[];
  logs: string[];
  onStop: () => void;
  onClose: () => void;
  onOpenArtifact?: (kind: string, data: any) => void;
}

export function PipelineExecutionDrawer({
  isOpen,
  isRunning,
  activeCandidateName,
  steps,
  logs,
  onStop,
  onClose,
  onOpenArtifact,
}: PipelineExecutionDrawerProps) {
  const [minimized, setMinimized] = useState(false);

  if (!isOpen) return null;

  const completedCount = steps.filter((s) => s.status === "completed").length;
  const progressPercent = steps.length > 0 ? Math.round((completedCount / steps.length) * 100) : 0;

  return (
    <div
      className={`fixed bottom-6 right-6 z-40 w-[min(480px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white/95 backdrop-blur-md shadow-2xl transition-all ${
        minimized ? "h-14" : "max-h-[min(80vh,600px)]"
      }`}
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-4 py-3">
        <div className="flex items-center gap-2.5 truncate">
          <div className="relative flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-[#5e6ad2]">
            {isRunning ? (
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#5e6ad2] opacity-75"></span>
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#5e6ad2]"></span>
              </span>
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
          </div>
          <div className="truncate">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-900">
                {isRunning ? "Pipeline Running" : "Pipeline Summary"}
              </span>
              <span className="text-[10px] text-slate-400">({progressPercent}%)</span>
            </div>
            <p className="truncate text-[11px] text-slate-500">
              Candidate: <span className="font-medium text-slate-800">{activeCandidateName || "Selected Person"}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {isRunning && (
            <button
              type="button"
              onClick={onStop}
              className="flex items-center gap-1 rounded-lg bg-slate-800 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-slate-900 transition-colors cursor-pointer"
            >
              <Square className="h-3 w-3 fill-current" /> Stop
            </button>
          )}
          <button
            type="button"
            onClick={() => setMinimized(!minimized)}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-200/50 hover:text-slate-600 cursor-pointer"
          >
            {minimized ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-200/50 hover:text-slate-600 text-xs font-medium cursor-pointer"
          >
            ✕
          </button>
        </div>
      </div>

      {!minimized && (
        <div className="flex flex-col max-h-[500px]">
          {/* Progress bar */}
          <div className="h-1 w-full bg-slate-100">
            <div
              className="h-1 bg-[#5e6ad2] transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Steps List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Autonomous Pipeline Execution
            </div>
            {steps.map((step, idx) => {
              const isStepRunning = step.status === "running";
              const isCompleted = step.status === "completed";
              const isFailed = step.status === "failed";
              const isGate = step.status === "gate";

              return (
                <div
                  key={step.id || idx}
                  className={`flex items-start justify-between rounded-xl border p-2.5 transition-colors ${
                    isStepRunning
                      ? "border-indigo-200 bg-indigo-50/50"
                      : isCompleted
                      ? "border-slate-100 bg-white"
                      : isGate
                      ? "border-amber-200 bg-amber-50/40"
                      : isFailed
                      ? "border-rose-200 bg-rose-50/40"
                      : "border-slate-100 bg-slate-50/40 opacity-70"
                  }`}
                >
                  <div className="flex items-start gap-2.5 truncate">
                    <div className="mt-0.5 shrink-0">
                      {isStepRunning && (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
                      )}
                      {isCompleted && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                      {isGate && <Clock className="h-4 w-4 text-amber-500" />}
                      {isFailed && <AlertCircle className="h-4 w-4 text-rose-500" />}
                      {step.status === "pending" && <div className="h-4 w-4 rounded-full border-2 border-slate-300" />}
                    </div>
                    <div className="truncate">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-800 truncate">{step.name}</span>
                        <span className="rounded bg-slate-100 px-1.5 py-0.2 text-[9px] font-medium text-slate-500 uppercase">
                          {step.role}
                        </span>
                      </div>
                      {step.outputSnippet && (
                        <p className="mt-0.5 text-[11px] text-slate-600 truncate">{step.outputSnippet}</p>
                      )}
                      {step.error && (
                        <p className="mt-0.5 text-[11px] text-rose-600 font-medium truncate">{step.error}</p>
                      )}
                    </div>
                  </div>

                  <span
                    className={`ml-2 shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                      isStepRunning
                        ? "bg-indigo-100 text-indigo-700"
                        : isCompleted
                        ? "bg-emerald-50 text-emerald-700"
                        : isGate
                        ? "bg-amber-100 text-amber-800"
                        : isFailed
                        ? "bg-rose-100 text-rose-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {step.status}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Audit Logs Console */}
          {logs.length > 0 && (
            <div className="border-t border-slate-100 bg-slate-900 p-3 text-[11px] font-mono text-slate-300 max-h-32 overflow-y-auto">
              <div className="text-[10px] font-bold text-slate-400 mb-1 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span> Live Agent Stream
              </div>
              <div className="space-y-1">
                {logs.slice(-6).map((log, i) => (
                  <div key={i} className="leading-tight opacity-90 truncate">
                    › {log}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
