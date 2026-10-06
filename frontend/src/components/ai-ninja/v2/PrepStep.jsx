import React from 'react';
import { motion } from 'framer-motion';
import { Target, BookOpen, Search, Youtube, ChevronRight, ChevronLeft } from 'lucide-react';
import { cn } from '../../../lib/utils';

const modes = [
  { id: 'interview', label: 'Interview Mastery', icon: <Target className="w-6 h-6" />, desc: 'Simulate high-stakes technical & behavioral loops.' },
  { id: 'course', label: 'Course Analysis', icon: <Youtube className="w-6 h-6" />, desc: 'Drill down into concepts from a specific curriculum.' },
  { id: 'book', label: 'Knowledge Extraction', icon: <BookOpen className="w-6 h-6" />, desc: 'Master frameworks and theory from industry texts.' },
  { id: 'research', label: 'Research Drill', icon: <Search className="w-6 h-6" />, desc: 'Deep dive into specialized domains and papers.' }
];

const PrepStep = ({ selectedModes, onToggle, onBack, onNext, courseUrl, onCourseUrlChange }) => {
  return (
    <div className="space-y-12 max-w-4xl mx-auto">
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--jobninjas-accent)]/10 text-[var(--jobninjas-accent)] text-[10px] font-bold uppercase tracking-wider border border-[var(--jobninjas-accent)]/20"
        >
          Phase 2: Tactical Modes
        </motion.div>
        <h2 className="text-4xl md:text-5xl font-medium text-[var(--text-main)] tracking-tight leading-tight">
          Select Your <span className="text-[var(--jobninjas-accent)] italic">Specialization.</span>
        </h2>
        <p className="text-[#5c5c7a] max-w-md mx-auto text-lg font-light leading-relaxed">
          Configure the specific intelligence modes for your training environment.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {modes.map((mode, idx) => (
          <motion.button
            key={mode.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => onToggle(mode.id)}
            className={cn(
              "flex items-start gap-6 p-8 rounded-3xl border transition-all duration-400 group text-left relative overflow-hidden",
              selectedModes.includes(mode.id)
                ? "border-[var(--jobninjas-accent)]/50 bg-[#eeeafc] shadow-[0_0_20px_rgba(94,106,210,0.05)]"
                : "border-black/5 bg-[#eeeafc]/50 hover:bg-[#e8e3f8] hover:border-black/10"
            )}
          >
            <div className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500",
              selectedModes.includes(mode.id) 
                ? "bg-[var(--jobninjas-accent)] text-white shadow-[0_0_15px_rgba(94,106,210,0.4)]" 
                : "bg-[#eeeafc] text-[#5c5c7a] group-hover:text-[var(--text-main)]"
            )}>
              {mode.icon}
            </div>
            <div className="space-y-1 relative z-10">
              <h3 className={cn(
                "font-medium tracking-tight transition-colors",
                selectedModes.includes(mode.id) ? "text-[var(--text-main)]" : "text-[var(--text-main)]/80"
              )}>
                {mode.label}
              </h3>
              <p className="text-xs text-[#5c5c7a] font-light leading-relaxed">{mode.desc}</p>
            </div>
            <div className={cn(
              "ml-auto w-5 h-5 rounded-full border flex items-center justify-center transition-all",
              selectedModes.includes(mode.id) 
                ? "border-[var(--jobninjas-accent)] bg-[var(--jobninjas-accent)]" 
                : "border-black/10 bg-[#faf9ff]/60"
            )}>
              {selectedModes.includes(mode.id) && <div className="w-1.5 h-1.5 rounded-full bg-[#faf9ff]" />}
            </div>

            {selectedModes.includes(mode.id) && (
              <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--jobninjas-accent)]/5 rounded-full blur-2xl -mr-12 -mt-12" />
            )}
          </motion.button>
        ))}
      </div>

      {selectedModes.includes('course') && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 rounded-3xl bg-[#eeeafc] border border-black/5 space-y-4 shadow-sm relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--jobninjas-accent)]/5 rounded-full blur-3xl -mr-16 -mt-16" />
          
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--jobninjas-accent)] flex items-center gap-2">
            <Youtube size={14} /> Intelligence Source: Course URL
          </label>
          <input
            type="url"
            value={courseUrl}
            onChange={(e) => onCourseUrlChange(e.target.value)}
            placeholder="https://youtube.com/watch?v=..."
            className="w-full h-14 px-6 rounded-2xl bg-[#faf9ff] border border-black/5 focus:border-[var(--jobninjas-accent)]/40 outline-none font-medium text-[var(--text-main)] transition-all placeholder:text-[var(--text-main)]/10"
          />
          <p className="text-[10px] text-[#5c5c7a] font-light italic tracking-wider">
            * System will ingest curriculum telemetry for precision drilling.
          </p>
        </motion.div>
      )}

      <div className="flex items-center justify-between pt-12 border-t border-black/5">
        <button 
          onClick={onBack} 
          className="flex items-center gap-2 text-[#5c5c7a] font-medium uppercase text-[10px] tracking-widest hover:text-[var(--text-main)] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Previous Protocol
        </button>
        <button
          onClick={onNext}
          disabled={selectedModes.length === 0}
          className="btn-premium-primary h-14 px-12 text-sm uppercase tracking-widest disabled:opacity-30 disabled:grayscale transition-all group"
        >
          Define Origin <ChevronRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
};

export default PrepStep;
