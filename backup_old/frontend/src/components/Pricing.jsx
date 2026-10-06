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
        delay: i * 0.2,
        duration: 0.5,
      },
    }),
    hidden: {
      filter: "blur(10px)",
      y: -20,
      opacity: 0,
    },
  };

  const aiNinjaPlans = [
    {
      ...PRICING.NINJA_STARTER,
      popular: false,
      buttonVariant: 'outline',
      isSubscribed: user?.subscription_tier === 'ninja-starter' && user?.subscription_status === 'active',
    },
    {
      ...PRICING.NINJA_PRO,
      popular: true,
      buttonVariant: 'default',
      isSubscribed: user?.subscription_tier === 'ninja-pro' && user?.subscription_status === 'active',
    },
    {
      ...PRICING.NINJA_ELITE,
      popular: false,
      buttonVariant: 'outline',
      isSubscribed: user?.subscription_tier === 'ninja-elite' && user?.subscription_status === 'active',
    },
  ];

  const currentPlans = aiNinjaPlans;
  const planType = 'ai';


  const handleCheckout = async (planId) => {
    if (!isAuthenticated) {
      navigate('/signup');
      return;
    }

    try {
      const token = localStorage.getItem('auth_token');
      // Using the backend API for all checkouts as it is more robust
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
        // Fallback to direct Dodo link if API fails or is not ready
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
    <div className="pricing-page">
      <div className="max-w-7xl mx-auto px-6 py-10 relative" ref={pricingRef}>
        <article className="text-left mb-6 space-y-4 max-w-2xl">
          <h2 className="md:text-6xl text-4xl capitalize font-medium text-gray-900 mb-4">
            <VerticalCutReveal
              splitBy="words"
              staggerDuration={0.15}
              staggerFrom="first"
              reverse={true}
              containerClassName="justify-start"
              transition={{
                type: "spring",
                stiffness: 250,
                damping: 40,
                delay: 0,
              }}
            >
              We've got a plan that's perfect for you
            </VerticalCutReveal>
          </h2>

          <TimelineContent
            as="p"
            animationNum={0}
            timelineRef={pricingRef}
            customVariants={revealVariants}
            className="md:text-base text-sm text-gray-600 w-[80%]"
          >
            Trusted by candidates worldwide. Automate your search with AI. Land your dream job with personalized guidance and practice sessions. Choose the plan that fits your pace.
          </TimelineContent>
        </article>

        <div className={`grid gap-4 py-6 ${planType === 'ai' ? 'md:grid-cols-3 max-w-6xl mx-auto' : 'md:grid-cols-2 lg:grid-cols-4'}`}>
          {currentPlans.map((plan, index) => (
            <TimelineContent
              key={plan.id}
              as="div"
              animationNum={2 + index}
              timelineRef={pricingRef}
              customVariants={revealVariants}
            >
              <Card
                className={`relative border h-full flex flex-col transition-all duration-300 ${plan.popular
                  ? "border-neutral-200 ring-2 ring-blue-500 bg-blue-50 shadow-xl"
                  : "border-neutral-200 bg-white shadow-sm"
                  }`}
              >
                <CardHeader className="text-left">
                  <div className="flex justify-between items-start">
                    <h3 className="xl:text-3xl md:text-2xl text-2xl font-semibold text-gray-900 mb-2">
                      {plan.name}
                    </h3>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {plan.popular && (
                        <span className="bg-blue-50 text-blue-600 border border-blue-200 px-2 py-0.5 rounded text-[11px] font-medium tracking-wide">
                          popular
                        </span>
                      )}
                      {plan.discountPercent && (
                        <span className="bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded text-[11px] font-medium">
                          {plan.discountPercent}% off
                        </span>
                      )}
                      {plan.isBeta && (
                        <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded text-[11px] font-medium">
                          beta
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="xl:text-sm md:text-xs text-sm text-gray-600 mb-4">
                    {plan.description}
                  </p>



                  {plan.originalPrice && (
                    <div className="mb-2">
                      <span className="text-lg text-gray-400 line-through">
                        ${plan.originalPrice}
                      </span>
                    </div>
                  )}
                  <div className="flex items-baseline gap-2">
                    <>
                      <span className="text-4xl font-semibold text-gray-900">
                        {plan.price !== null ? (
                          <>
                            $
                            <NumberFlow
                              format={{ minimumFractionDigits: plan.price % 1 === 0 ? 0 : 2 }}
                              value={plan.price}
                              className="text-4xl font-semibold"
                            />
                          </>
                        ) : (
                          "Contact Us"
                        )}
                      </span>
                      {plan.price !== null && (
                        <div className="flex flex-col">
                          <span className="text-gray-600">
                            USD {plan.period}
                          </span>
                        </div>
                      )}
                    </>
                  </div>
                </CardHeader>

                <CardContent className="pt-0 flex-1 flex flex-col">
                  <button
                    className={`w-full mb-4 p-3 text-lg font-semibold rounded-xl transition-all ${plan.popular
                      ? "bg-gradient-to-t from-blue-600 to-blue-700 shadow-lg shadow-blue-500 border border-blue-400 text-white"
                      : "bg-gradient-to-t from-neutral-900 to-neutral-700 shadow-lg shadow-neutral-900 border border-neutral-700 text-white"
                      }`}
                    onClick={() => handleCheckout(plan.id)}
                  >
                    {plan.isSubscribed ? '✅ Subscribed' : (plan.showTrial ? 'Start 7-Day Free Trial' : `Subscribe to ${plan.name.replace('AI Ninja ', '')}`)}
                  </button>



                  <div className="space-y-4 pt-4 border-t border-neutral-200">
                    <h4 className="font-semibold text-sm uppercase text-gray-400 tracking-wider">
                      Includes:
                    </h4>
                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start">
                          <span className="h-5 w-5 bg-white border border-blue-500 rounded-full flex items-center justify-center mt-0.5 mr-3 shrink-0">
                            <CheckCheck className="h-3 w-3 text-blue-600" />
                          </span>
                          <span className="text-sm text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TimelineContent>
          ))}
        </div>

        {planType === 'ai' && (
          <div className="mt-12 max-w-4xl mx-auto">
             <div className="relative p-8 rounded-[32px] bg-slate-900 text-white overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="space-y-4 max-w-xl">
                    <Badge className="bg-blue-500 hover:bg-blue-600 text-white border-none px-4 py-1 text-xs font-bold uppercase tracking-widest">A La Carte</Badge>
                    <h3 className="text-3xl font-black tracking-tight">Need a single session?</h3>
                    <p className="text-slate-400 font-medium">
                      No subscription? No problem. Buy 1 AI Ninja Call Credit for just $5. Credits never expire and can be used on any day.
                    </p>
                    <div className="flex items-center gap-6 pt-2">
                       <div className="flex items-center gap-2">
                          <CheckCheck className="text-blue-400 w-5 h-5" />
                          <span className="text-sm font-bold">1 AI Ninja Call</span>
                       </div>
                       <div className="flex items-center gap-2">
                          <CheckCheck className="text-blue-400 w-5 h-5" />
                          <span className="text-sm font-bold">Instant Report</span>
                       </div>
                    </div>
                  </div>
                  <div className="w-full md:w-auto flex flex-col items-center gap-4 bg-slate-800/50 p-8 rounded-3xl border border-slate-700">
                    <div className="text-center">
                       <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">Pay Per Use</p>
                       <div className="flex items-baseline justify-center gap-1">
                          <span className="text-5xl font-black">$5</span>
                          <span className="text-slate-500 font-bold">/ credit</span>
                       </div>
                    </div>
                    <Button 
                      className="w-full md:w-48 h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-lg shadow-xl shadow-blue-900/20"
                      onClick={() => handleCheckout('ninja-credit')}
                    >
                      Buy 1 Credit
                    </Button>
                    <p className="text-[10px] text-slate-500 font-bold">Secure Stripe Checkout</p>
                  </div>
                </div>
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -mr-32 -mt-32" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-600/10 rounded-full blur-3xl -ml-32 -mb-32" />
             </div>
             
             <p className="text-sm text-gray-500 italic text-center mt-6">
                                * Subscriptions are billed monthly. Cancel anytime from your dashboard.
             </p>
          </div>
        )}


      </div>

      {/* BookCallModal removed */}
    </div>
  );
};

export default Pricing;
