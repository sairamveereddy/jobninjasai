import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, Phone, ShieldCheck, ChevronRight, ChevronLeft, Loader2, FileText, CheckCircle2 } from 'lucide-react';
import { cn } from '../../../lib/utils';

const ProfileStep = ({ 
  resumeText, 
  onUpload, 
  phone, 
  onPhoneChange, 
  isParsing, 
  onBack, 
  onNext,
  savedResumes = [],
  selectedResumeId,
  onSelectSaved
}) => {
  const fileInputRef = useRef(null);

  return (
    <div className="space-y-12 max-w-5xl mx-auto">
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--jobninjas-accent)]/10 text-[var(--jobninjas-accent)] text-[10px] font-bold uppercase tracking-wider border border-[var(--jobninjas-accent)]/20"
        >
          Phase 3: Neural Profile
        </motion.div>
        <h2 className="text-4xl md:text-5xl font-medium text-[var(--text-main)] tracking-tight leading-tight">
          Forge Your <span className="text-[var(--jobninjas-accent)] italic">Identity.</span>
        </h2>
        <p className="text-[#5c5c7a] max-w-md mx-auto text-lg font-light leading-relaxed">
          Upload your expertise and establish a secure uplink for tactical communication.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        <div className="space-y-8">
          <div className="flex items-center gap-3 px-1">
            <div className="w-8 h-8 rounded-lg bg-[var(--jobninjas-accent)]/10 flex items-center justify-center text-[var(--jobninjas-accent)]">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-medium text-[var(--text-main)] tracking-tight">Career Footprint</h3>
          </div>

          <div 
            onClick={() => !isParsing && fileInputRef.current?.click()}
            className={cn(
              "p-12 rounded-[2.5rem] border transition-all duration-500 cursor-pointer group text-center space-y-6 relative overflow-hidden",
              resumeText 
                ? "border-[var(--jobninjas-accent)]/50 bg-[var(--jobninjas-accent)]/5" 
                : "border-black/5 bg-[#eeeafc] hover:bg-[#e8e3f8] hover:border-black/10"
            )}
          >
            <input 
              ref={fileInputRef}
              type="file" 
              className="hidden" 
              onChange={onUpload} 
              accept=".pdf,.doc,.docx" 
            />
            
            <div className={cn(
              "w-24 h-24 rounded-3xl mx-auto flex items-center justify-center transition-all duration-500 relative z-10",
              resumeText 
                ? "bg-[var(--jobninjas-accent)] text-white shadow-[0_0_30px_rgba(94,106,210,0.3)]" 
                : "bg-[#eeeafc] text-[#5c5c7a] group-hover:scale-110 group-hover:bg-[var(--jobninjas-accent)] group-hover:text-white"
            )}>
              {isParsing ? <Loader2 className="animate-spin w-10 h-10" /> : (resumeText ? <CheckCircle2 className="w-10 h-10" /> : <Upload className="w-10 h-10" />)}
            </div>

            <div className="space-y-2 relative z-10">
              <p className="font-medium text-[var(--text-main)] tracking-tight">
                {resumeText ? "Expertise Scanning Complete" : "Analyze Resume"}
              </p>
              <p className="text-xs text-[#5c5c7a] font-light leading-relaxed">
                {resumeText ? "Your neural profile is ready for synthesis." : "PDF or Word documents accepted."}
              </p>
            </div>

            {resumeText && (
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(94,106,210,0.06),transparent_70%)]" />
            )}
          </div>

          {savedResumes.length > 0 && (
            <div className="space-y-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#5c5c7a] pl-1">Legacy Profiles</p>
              <div className="grid gap-2">
                {savedResumes.slice(0, 2).map(res => (
                  <button
                    key={res.id}
                    onClick={() => onSelectSaved(res)}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-2xl border transition-all text-left",
                      selectedResumeId === res.id 
                        ? "border-[var(--jobninjas-accent)]/50 bg-[#eeeafc] text-[var(--text-main)]" 
                        : "border-black/5 bg-[#eeeafc]/50 text-[#5c5c7a] hover:border-black/10 hover:text-[var(--text-main)]/80"
                    )}
                  >
                    <span className="text-xs font-medium truncate">{res.filename || 'Institutional Record'}</span>
                    {selectedResumeId === res.id && <CheckCircle2 className="w-4 h-4 text-[var(--jobninjas-accent)]" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-8">
          <div className="flex items-center gap-3 px-1">
            <div className="w-8 h-8 rounded-lg bg-[var(--jobninjas-accent)]/10 flex items-center justify-center text-[var(--jobninjas-accent)]">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="font-medium text-[var(--text-main)] tracking-tight">Secure Uplink</h3>
          </div>

          <div className="p-10 rounded-[2.5rem] bg-[#eeeafc] border border-black/5 space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--jobninjas-accent)]/5 rounded-full blur-3xl -mr-16 -mt-16" />
            
            <div className="space-y-4 relative z-10">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#5c5c7a] block pl-1">Operational Frequency (Phone)</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => onPhoneChange(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full h-16 px-6 rounded-2xl bg-[#faf9ff] border border-black/5 focus:border-[var(--jobninjas-accent)]/40 outline-none font-medium text-2xl text-[var(--text-main)] transition-all placeholder:text-black/20 tracking-wider"
              />
            </div>

            <div className="p-6 rounded-2xl bg-[var(--jobninjas-accent)]/5 border border-[var(--jobninjas-accent)]/10 flex gap-4 items-start relative z-10">
              <ShieldCheck className="w-6 h-6 text-[var(--jobninjas-accent)] shrink-0" />
              <p className="text-xs text-[#5c5c7a] leading-relaxed font-light">
                Secure link active. Your communication telemetry is encrypted and used exclusively for your practice loops.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-12 border-t border-black/5">
        <button 
          onClick={onBack} 
          className="flex items-center gap-2 text-[#5c5c7a] font-medium uppercase text-[10px] tracking-widest hover:text-[var(--text-main)] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Previous Protocol
        </button>
        <button
          onClick={onNext}
          disabled={!resumeText || !phone || isParsing}
          className="btn-premium-primary h-14 px-12 text-sm uppercase tracking-widest disabled:opacity-30 disabled:grayscale transition-all group"
        >
          {isParsing ? "Synchronizing..." : "Synthesize Roadmap"} <ChevronRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
};

export default ProfileStep;
