import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Zap, Target, ChevronRight } from 'lucide-react';
import { cn } from '../../../lib/utils';

const plans = [
  {
    id: 'daily',
    title: 'Daily Protocol',
    desc: 'Call every single day for maximum growth.',
    price: 25,
    originalPrice: 35,
    interval: 'week',
    icon: <Zap className="w-6 h-6" />,
    badge: 'Recommended',
    color: 'var(--jobninjas-accent)'
  },
  {
    id: 'alternate',
    title: 'Alternate Days',
    desc: 'Call every other day. Balanced pacing.',
    price: 15,
    originalPrice: 19,
    interval: 'week',
    icon: <Calendar className="w-6 h-6" />,
    color: '#b1b3b8'
  },
  {
    id: 'weekly',
    title: 'Weekly Sprint',
    desc: 'Once per week for long-term consistency.',
    price: 5,
    originalPrice: 7,
    interval: 'week',
    icon: <Target className="w-6 h-6" />,
    color: '#707277'
  }
];

const PlanStep = ({ selectedPlan, onSelect, onNext }) => {
  return (
    <div className="space-y-12 max-w-4xl mx-auto">
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--jobninjas-accent)]/10 text-[var(--jobninjas-accent)] text-[10px] font-bold uppercase tracking-wider border border-[var(--jobninjas-accent)]/20"
        >
          Phase 1: Operational Cadence
        </motion.div>
        <h2 className="text-4xl md:text-5xl font-medium text-[var(--text-main)] tracking-tight leading-tight">
          Choose Your <span className="text-[var(--jobninjas-accent)] italic">Pace.</span>
        </h2>
        <p className="text-[#5c5c7a] max-w-md mx-auto text-lg font-light leading-relaxed">
          Select how often you want the AI Ninja to initiate your practice protocols.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan, idx) => (
          <motion.button
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => onSelect(plan.id)}
            className={cn(
              "relative p-8 rounded-3xl border transition-all duration-500 group overflow-hidden text-left",
              selectedPlan === plan.id 
                ? "border-[var(--jobninjas-accent)] bg-[var(--jobninjas-accent)]/5 shadow-[0_0_40px_rgba(94,106,210,0.06)]" 
                : "border-black/5 bg-[#eeeafc] hover:bg-[#e8e3f8] hover:border-black/10"
            )}
          >
            {plan.badge && (
              <div className="absolute top-6 right-6 px-2 py-0.5 rounded-full bg-[var(--jobninjas-accent)] text-white text-[8px] font-bold uppercase tracking-widest">
                {plan.badge}
              </div>
            )}
            
            <div className={cn(
              "w-14 h-14 rounded-2xl flex items-center justify-center mb-8 transition-all duration-500",
              selectedPlan === plan.id 
                ? "bg-[var(--jobninjas-accent)] text-white shadow-[0_0_20px_rgba(94,106,210,0.4)]" 
                : "bg-[#eeeafc] text-[#5c5c7a] group-hover:text-[var(--text-main)]"
            )}>
              {plan.icon}
            </div>

            <h3 className="text-xl font-medium text-[var(--text-main)] mb-3 tracking-tight">{plan.title}</h3>
            <p className="text-sm text-[#5c5c7a] font-light leading-relaxed mb-6">{plan.desc}</p>

            <div className="space-y-1">
              {plan.originalPrice && (
                <div className="text-[10px] text-[#5c5c7a] line-through opacity-40 font-medium">
                  ${plan.originalPrice}/{plan.interval === 'week' ? 'wk' : 'mo'}
                </div>
              )}
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-[var(--text-main)]">${plan.price}</span>
                <span className="text-[10px] text-[#5c5c7a] font-medium uppercase tracking-wider">/ {plan.interval}</span>
              </div>
            </div>

            <div className={cn(
              "mt-10 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-all",
              selectedPlan === plan.id ? "text-[var(--jobninjas-accent)]" : "text-[var(--text-main)]/20 group-hover:text-[var(--text-main)]/40"
            )}>
              {selectedPlan === plan.id ? "Protocol Active" : "Select Cadence"}
              <ChevronRight className={cn("w-3 h-3 transition-transform", selectedPlan === plan.id ? "translate-x-1" : "group-hover:translate-x-1")} />
            </div>

            {selectedPlan === plan.id && (
              <motion.div
                layoutId="plan-active-indicator"
                className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--jobninjas-accent)]"
              />
            )}
          </motion.button>
        ))}
      </div>

      <div className="flex justify-center pt-12">
        <button
          onClick={onNext}
          disabled={!selectedPlan}
          className="btn-premium-primary h-14 px-12 text-sm uppercase tracking-widest disabled:opacity-30 disabled:grayscale transition-all group"
        >
          Initialize Schedule <ChevronRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
};

export default PlanStep;
