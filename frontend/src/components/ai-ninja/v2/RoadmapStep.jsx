import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, Cpu, Network, ShieldCheck, CheckCircle2, Loader2 } from 'lucide-react';
import { cn } from '../../../lib/utils';

const tasks = [
  "Mapping neural pathways...",
  "Dissecting industry standards...",
  "Calibrating simulated stress levels...",
  "Optimizing tactical feedback loop...",
  "Finalizing operational roadmap..."
];

const RoadmapStep = ({ onComplete }) => {
  const [currentTask, setCurrentTask] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (currentTask < tasks.length - 1) {
      const timer = setTimeout(() => {
        setCurrentTask(prev => prev + 1);
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setCompleted(true);
        setTimeout(onComplete, 1500);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentTask, onComplete]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] space-y-16 max-w-2xl mx-auto text-center">
      <div className="relative">
        {/* Ambient Glow */}
        <div className="absolute inset-0 bg-[var(--jobninjas-accent)]/20 rounded-full blur-[100px] -z-10 animate-pulse" />
        
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="w-56 h-56 rounded-full border border-dashed border-black/10"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute inset-4 rounded-full border border-dashed border-[var(--jobninjas-accent)]/30"
        />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute inset-10 rounded-full border border-dashed border-black/5"
        />
        
        <div className="absolute inset-0 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {!completed ? (
              <motion.div
                key="loading"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.2, opacity: 0 }}
                className="w-28 h-28 bg-[var(--jobninjas-accent)] rounded-3xl flex items-center justify-center shadow-[0_0_50px_rgba(94,106,210,0.5)]"
              >
                <BrainCircuit className="w-14 h-14 text-[var(--text-main)] animate-pulse" />
              </motion.div>
            ) : (
              <motion.div
                key="done"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-28 h-28 bg-emerald-500 rounded-3xl flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.3)]"
              >
                <CheckCircle2 className="w-14 h-14 text-[var(--text-main)]" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="space-y-6 w-full">
        <h2 className="text-4xl font-medium text-[var(--text-main)] tracking-tight">
          {completed ? "Protocol Ready." : "Synthesizing Environment..."}
        </h2>
        
        <div className="space-y-4 max-w-xs mx-auto">
          {tasks.map((task, idx) => (
            <motion.div
              key={task}
              initial={{ opacity: 0, x: -10 }}
              animate={{ 
                opacity: idx <= currentTask ? 1 : 0.2,
                x: idx === currentTask ? 0 : 0,
                color: idx === currentTask ? 'var(--jobninjas-accent)' : (idx < currentTask ? '#10b981' : '#707277')
              }}
              className="flex items-center gap-4 font-medium text-xs tracking-widest uppercase"
            >
              {idx < currentTask ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (idx === currentTask ? (
                <Loader2 className="w-4 h-4 animate-spin shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-black/10 shrink-0" />
              ))}
              <span className="truncate">{task}</span>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="pt-12 grid grid-cols-3 gap-8 w-full border-t border-black/5 opacity-40">
        <div className="flex flex-col items-center gap-3">
          <Cpu className="w-6 h-6 text-[var(--jobninjas-accent)]" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-main)]">Neural Link</span>
        </div>
        <div className="flex flex-col items-center gap-3">
          <Network className="w-6 h-6 text-[var(--jobninjas-accent)]" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-main)]">Tactical Mesh</span>
        </div>
        <div className="flex flex-col items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-[var(--jobninjas-accent)]" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-main)]">Secure Vault</span>
        </div>
      </div>
    </div>
  );
};

export default RoadmapStep;
