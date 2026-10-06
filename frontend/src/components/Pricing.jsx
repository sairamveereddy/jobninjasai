import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Check, Bot, UserCheck, ArrowRight, Zap, Briefcase, Database, Server, CheckCheck } from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { BRAND, PRICING } from '../config/branding';
// BookCallModal removed
import { TimelineContent } from "./ui/timeline-animation";
import { VerticalCutReveal } from "./ui/vertical-cut-reveal";
import NumberFlow from "@number-flow/react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { API_URL, apiCall } from '../config/api';



const Pricing = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, refreshUser } = useAuth();
  const pricingRef = useRef(null);

  const revealVariants = {
    visible: (i) => ({
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
    hidden: {
      filter: "blur(10px)",
      y: -10,
      opacity: 0,
    },
  };

  const aiNinjaPlans = [
    {
      ...PRICING.NINJA_STARTER,
      popular: false,
      isSubscribed: user?.subscription_tier === 'ninja-starter' && user?.subscription_status === 'active',
    },
    {
      ...PRICING.NINJA_PRO,
      popular: true,
      isSubscribed: user?.subscription_tier === 'ninja-pro' && user?.subscription_status === 'active',
    },
    {
      ...PRICING.NINJA_ELITE,
      popular: false,
      isSubscribed: user?.subscription_tier === 'ninja-elite' && user?.subscription_status === 'active',
    },
  ];

  const handleCheckout = async (planId) => {
    if (!isAuthenticated) {
      navigate('/signup');
      return;
    }

    try {
      const token = localStorage.getItem('auth_token');
      const data = await apiCall('/api/dodo-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': token
        },
        body: JSON.stringify({ 
          plan_id: planId
        })
      });

      if (data && data.url) {
        window.location.href = data.url;
      } else {
        const email = user?.email;
        const checkoutUrl = `https://buy.dodopayments.com/${planId}?customer_email=${encodeURIComponent(email || '')}`;
        window.location.href = checkoutUrl;
      }
    } catch (error) {
      console.error("Checkout error:", error);
      const email = user?.email;
      const checkoutUrl = `https://buy.dodopayments.com/${planId}?customer_email=${encodeURIComponent(email || '')}`;
      window.location.href = checkoutUrl;
    }
  };

  return (
    <div className="bg-[#f5f3ff] min-h-screen text-[var(--text-main)] pt-20 pb-32 overflow-hidden relative">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-[radial-gradient(circle_at_50%_0%,rgba(94,106,210,0.06)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10" ref={pricingRef}>
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#faf9ff] border border-black/10 text-[10px] font-medium uppercase tracking-[0.2em] mb-6 text-[#5c5c7a]"
          >
            <Zap size={12} className="text-[var(--jobninjas-accent)]" />
            Transparent Institutional Pricing
          </motion.div>
          
          <h1 className="text-4xl md:text-6xl font-medium tracking-tight mb-6">
            Land your dream job with <span className="text-[var(--jobninjas-accent)] italic">AI precision.</span>
          </h1>
          
          <p className="text-[#5c5c7a] text-lg font-light leading-relaxed">
            Choose the protocol that fits your career trajectory. Trusted by candidates globally to automate mastery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-24">
          {aiNinjaPlans.map((plan, index) => (
            <TimelineContent
              key={plan.id}
              as="div"
              animationNum={index}
              timelineRef={pricingRef}
              customVariants={revealVariants}
            >
              <div
                className={cn(
                  "relative flex flex-col h-full rounded-2xl border transition-all duration-500 overflow-hidden group",
                  plan.popular 
                    ? "bg-[#faf9ff] border-[var(--jobninjas-accent)]/30 shadow-[0_0_50px_rgba(94,106,210,0.06)]" 
                    : "bg-[#eeeafc] border-black/5"
                )}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--jobninjas-accent)] to-transparent opacity-50" />
                )}

                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-2xl font-medium text-[var(--text-main)] mb-1">{plan.name.replace('AI Ninja ', '')}</h3>
                      <p className="text-sm text-[#5c5c7a] font-light">{plan.description}</p>
                    </div>
                    {plan.popular && (
                      <span className="bg-[var(--jobninjas-accent)]/10 text-[var(--jobninjas-accent)] border border-[var(--jobninjas-accent)]/20 px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-widest">
                        Popular
                      </span>
                    )}
                  </div>

                  <div className="mb-8">
                    {plan.originalPrice && (
                      <div className="text-sm text-[#5c5c7a] line-through mb-1 opacity-50">${plan.originalPrice}</div>
                    )}
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-medium text-[var(--text-main)]">${plan.price}</span>
                      <span className="text-[#5c5c7a] text-sm font-light">/ {plan.period}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCheckout(plan.id)}
                    className={cn(
                      "w-full h-11 rounded-lg text-xs font-medium uppercase tracking-widest transition-all mb-8",
                      plan.popular
                        ? "bg-[var(--jobninjas-accent)] hover:bg-[#4c57b5] text-white shadow-lg shadow-[var(--jobninjas-accent)]/20"
                        : "bg-[#eeeafc] hover:bg-[#e8e3f8] text-[var(--text-main)] border border-black/10"
                    )}
                  >
                    {plan.isSubscribed ? 'Active Protocol' : `Initialize ${plan.name.replace('AI Ninja ', '')}`}
                  </button>

                  <div className="space-y-4 pt-8 border-t border-black/5">
                    <div className="text-[10px] uppercase tracking-[0.2em] text-[#5c5c7a] font-medium">Protocol Specifications</div>
                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-3">
                          <div className="w-4 h-4 rounded-full bg-[var(--jobninjas-accent)]/10 border border-[var(--jobninjas-accent)]/20 flex items-center justify-center shrink-0 mt-0.5">
                            <Check size={10} className="text-[var(--jobninjas-accent)]" />
                          </div>
                          <span className="text-sm text-[#5c5c7a] font-light">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </TimelineContent>
          ))}
        </div>

        {/* A LA CARTE SECTION */}
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative p-1 bg-gradient-to-b from-white/10 to-transparent rounded-[32px]"
          >
            <div className="bg-[#eeeafc] rounded-[31px] p-8 md:p-12 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--jobninjas-accent)]/5 rounded-full blur-3xl -mr-48 -mt-48" />
              
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                <div className="space-y-6 max-w-xl text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--jobninjas-accent)]/10 border border-[var(--jobninjas-accent)]/20 text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--jobninjas-accent)]">
                    Single Burst Mode
                  </div>
                  <h3 className="text-3xl font-medium tracking-tight">Need a single session?</h3>
                  <p className="text-[#5c5c7a] font-light text-lg">
                    No commitment required. Purchase 1 AI Ninja Call Credit for just $5. Credits never expire and can be used on any protocol day.
                  </p>
                  
                  <div className="flex flex-wrap justify-center md:justify-start items-center gap-6 pt-2">
                    <div className="flex items-center gap-2">
                      <CheckCheck size={16} className="text-[var(--jobninjas-accent)]" />
                      <span className="text-sm text-[#5c5c7a] font-medium">1 AI Ninja Call</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCheck size={16} className="text-[var(--jobninjas-accent)]" />
                      <span className="text-sm text-[#5c5c7a] font-medium">Neural Insights Report</span>
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-64 bg-[#faf9ff] border border-black/10 p-8 rounded-2xl text-center">
                  <div className="text-[10px] font-medium uppercase tracking-widest text-[#5c5c7a] mb-2">Pay Per Use</div>
                  <div className="flex items-baseline justify-center gap-1 mb-6">
                    <span className="text-5xl font-medium text-[var(--text-main)]">$5</span>
                    <span className="text-[#5c5c7a] text-sm">/ credit</span>
                  </div>
                  <button
                    onClick={() => handleCheckout('ninja-credit')}
                    className="btn-premium-primary w-full h-11 text-xs uppercase tracking-widest"
                  >
                    Buy 1 Credit
                  </button>
                  <p className="text-[10px] text-[#5c5c7a] mt-4 font-light italic">Secure Transaction via Dodo</p>
                </div>
              </div>
            </div>
          </motion.div>
          
          <div className="mt-8 text-center">
            <p className="text-xs text-[#5c5c7a] font-light italic">
              * Subscriptions are billed monthly. Protocol termination available anytime via dashboard control.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
