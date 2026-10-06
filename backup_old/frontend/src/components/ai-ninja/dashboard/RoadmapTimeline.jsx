import React, { useState } from 'react';
import { 
  Lock, CheckCircle2, PlayCircle, ExternalLink, 
  Youtube, GraduationCap, FileText, ChevronRight,
  Trophy, Star, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';

const RoadmapTimeline = ({ steps = [], currentDay = 1, todaysStatus = 'not_scheduled', onStartSession, isStarting }) => {
  const [expandedDay, setExpandedDay] = useState(null);

  if (!steps || steps.length === 0) {
    return (
      <Card className="p-12 text-center border-dashed border-2 border-slate-200 rounded-[32px]">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="text-slate-400" size={32} />
        </div>
        <h3 className="text-xl font-bold text-slate-800">No Roadmap Found</h3>
        <p className="text-slate-500 mt-2">Complete the orientation survey to generate your elite path.</p>
      </Card>
    );
  }

  return (
    <div className="relative pb-20">
      {/* Central Path Line */}
      <div className="absolute left-[39px] top-0 bottom-0 w-[2px] bg-slate-200 z-0" />

      <div className="space-y-12 relative z-10">
        {steps.map((step, index) => {
          const isLocked = step.day_number > currentDay && step.status !== 'unlocked';
          const isCompleted = step.day_number < currentDay;
          const isActive = step.day_number === currentDay;
          const isExpanded = expandedDay === step.day_number;

          return (
            <div key={step.id} className="flex gap-8 group">
              {/* Day Marker / Progress Indicator */}
              <div className="relative flex-shrink-0">
                <motion.div 
                  initial={false}
                  animate={{ 
                    scale: isActive ? 1.2 : 1,
                    backgroundColor: isCompleted ? '#10b981' : (isLocked ? '#f1f5f9' : '#0f172a')
                  }}
                  className={`w-20 h-20 rounded-[24px] flex flex-col items-center justify-center border-4 ${
                    isCompleted ? 'border-emerald-100' : (isLocked ? 'border-slate-50' : 'border-slate-800 shadow-xl shadow-slate-200')
                  }`}
                >
                  <span className={`text-[10px] font-black uppercase tracking-tighter ${
                    isCompleted || !isLocked ? 'text-white/70' : 'text-slate-400'
                  }`}>
                    Day
                  </span>
                  <span className={`text-2xl font-black leading-none ${
                    isCompleted || !isLocked ? 'text-white' : 'text-slate-500'
                  }`}>
                    {step.day_number}
                  </span>
                  
                  {isCompleted && (
                    <div className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                      <CheckCircle2 size={16} className="text-emerald-500 fill-emerald-50" />
                    </div>
                  )}
                  {isLocked && (
                    <div className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                      <Lock size={14} className="text-slate-400" />
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Content Card */}
              <div className="flex-grow">
                <Card 
                  className={`p-6 md:p-8 rounded-[32px] transition-all duration-300 ${
                    isLocked 
                      ? 'bg-slate-50/50 border-slate-100 opacity-60 grayscale-[0.5]' 
                      : 'hover:border-slate-900 border-slate-100 group-hover:shadow-xl group-hover:shadow-slate-100 group-hover:-translate-y-1'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className={`uppercase font-black text-[10px] px-2 py-0.5 ${
                          isCompleted ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {step.topic_category || 'Core Focus'}
                        </Badge>
                        <Badge variant="outline" className={`text-[10px] px-2 py-0.5 border-slate-200 ${
                          step.difficulty === 'Advanced' ? 'text-red-500 bg-red-50' : 
                          step.difficulty === 'Medium' ? 'text-amber-500 bg-amber-50' : 'text-blue-500 bg-blue-50'
                        }`}>
                          {step.difficulty || 'Fundamental'}
                        </Badge>
                        <Badge variant="ghost" className="text-[10px] text-slate-400 font-medium">
                          {step.estimated_minutes || 60} min
                        </Badge>
                      </div>
                      <h3 className={`text-xl font-bold ${isLocked ? 'text-slate-500' : 'text-slate-900'}`}>
                        {step.topic}
                      </h3>
                    </div>
                    
                    {!isLocked && (
                      <Button 
                        onClick={() => setExpandedDay(isExpanded ? null : step.day_number)}
                        variant="ghost" 
                        size="sm" 
                        className="rounded-xl font-bold flex items-center gap-2"
                      >
                        {isExpanded ? 'Show Less' : 'Protocols & Resources'}
                        <ChevronRight className={`transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} size={16} />
                      </Button>
                    )}
                  </div>

                  <p className={`text-sm leading-relaxed ${isLocked ? 'text-slate-400' : 'text-slate-600'}`}>
                    {step.description || step.notes || "Mastery of core concepts and project application."}
                  </p>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-6 mt-6 border-t border-slate-100 space-y-6">
                          {/* AI Notes */}
                          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                            <h4 className="flex items-center gap-2 text-xs font-black uppercase text-slate-400 mb-3 tracking-widest">
                              <FileText size={14} /> Intelligence Brief
                            </h4>
                            <p className="text-sm text-slate-700 leading-relaxed font-medium">
                              {step.notes || "No additional notes provided for this target."}
                            </p>
                          </div>

                          {/* Resources Grid */}
                          <div className="grid md:grid-cols-2 gap-4">
                            {/* Tutorials */}
                            <div className="space-y-3">
                              <h4 className="flex items-center gap-2 text-xs font-black uppercase text-slate-400 tracking-widest">
                                <Youtube size={14} /> Tactical Videos
                              </h4>
                              {step.youtube_links?.length > 0 ? (
                                step.youtube_links.map((link, i) => (
                                  <a 
                                    key={i} 
                                    href={link.url} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl hover:border-slate-300 transition-colors group/link"
                                  >
                                    <span className="text-xs font-bold text-slate-600 truncate mr-2">{link.title}</span>
                                    <ExternalLink size={12} className="text-slate-300 group-hover/link:text-slate-900" />
                                  </a>
                                ))
                              ) : (
                                <p className="text-[10px] text-slate-400 font-bold italic">Curating tactical feeds...</p>
                              )}
                            </div>

                            {/* Certifications */}
                            <div className="space-y-3">
                              <h4 className="flex items-center gap-2 text-xs font-black uppercase text-slate-400 tracking-widest">
                                <GraduationCap size={14} /> Merit Badges
                              </h4>
                              {step.resource_url ? (
                                <a 
                                  href={step.resource_url} 
                                  target="_blank" 
                                  rel="noreferrer"
                                  className="flex items-center justify-between p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl hover:border-indigo-300 transition-colors group/study"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center">
                                      <GraduationCap size={12} className="text-indigo-600" />
                                    </div>
                                    <span className="text-xs font-bold text-indigo-900">Recommended Course</span>
                                  </div>
                                  <ExternalLink size={12} className="text-indigo-300 group-hover/study:text-indigo-900" />
                                </a>
                              ) : step.certifications?.length > 0 ? (
                                step.certifications.map((cert, i) => (
                                  <div key={i} className="flex items-center gap-3 p-3 bg-emerald-50/30 border border-emerald-100/50 rounded-xl">
                                    <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                                      <Trophy size={12} className="text-emerald-600" />
                                    </div>
                                    <span className="text-xs font-bold text-emerald-800">{cert.title || cert}</span>
                                  </div>
                                ))
                              ) : (
                                <p className="text-[10px] text-slate-400 font-bold italic">No badges for this mission.</p>
                              )}
                            </div>
                          </div>


                          <Button 
                            className={`w-full rounded-2xl h-12 font-black tracking-tight flex items-center gap-2 transition-all ${
                              todaysStatus !== 'not_scheduled' ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-slate-900 hover:bg-slate-800 text-white'
                            }`}
                            onClick={onStartSession}
                            disabled={isStarting || (isActive && todaysStatus !== 'not_scheduled')}
                          >
                            <PlayCircle size={20} /> 
                            {isStarting ? "Initiating Call..." : 
                             (isActive && todaysStatus === 'called') ? "Call Initiated" :
                             (isActive && todaysStatus === 'completed') ? "Call Completed" :
                             (isActive ? "Start Today's Call" : "Prepare for Call")}
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RoadmapTimeline;
