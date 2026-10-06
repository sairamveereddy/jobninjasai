import { MarketingNav, MarketingFooter } from '@/components/marketing-layout';
import { Check } from 'lucide-react';
import Link from 'next/link';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100">
      <MarketingNav />
      
      <main className="pt-24 pb-16 sm:pt-32 sm:pb-24 lg:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-6">
              Simple, transparent pricing
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed mb-8">
              Start for free, upgrade when you need advanced AI agents and enterprise integrations.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-12 max-w-5xl mx-auto">
            {/* Free Tier */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col">
              <h3 className="text-xl font-bold mb-2">Starter</h3>
              <p className="text-slate-500 text-sm mb-6">Perfect for small teams exploring spatial recruiting.</p>
              <div className="mb-6">
                <span className="text-4xl font-extrabold">$0</span>
                <span className="text-slate-500">/mo</span>
              </div>
              <Link href="/dashboard" className="w-full text-center bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold py-3 rounded-xl transition-colors mb-8">
                Get Started
              </Link>
              <ul className="space-y-4 flex-1">
                <li className="flex items-start gap-3 text-sm text-slate-700">
                  <Check className="w-5 h-5 text-emerald-500 shrink-0" /> Up to 3 active boards
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-700">
                  <Check className="w-5 h-5 text-emerald-500 shrink-0" /> Basic workflow agents
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-700">
                  <Check className="w-5 h-5 text-emerald-500 shrink-0" /> Standard integrations (Gmail, Excel)
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-700">
                  <Check className="w-5 h-5 text-emerald-500 shrink-0" /> 100 AI actions per month
                </li>
              </ul>
            </div>

            {/* Pro Tier */}
            <div className="bg-blue-600 rounded-3xl p-8 border border-blue-500 shadow-2xl flex flex-col relative transform md:-translate-y-4">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-400 to-indigo-400 text-white text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full">
                Most Popular
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Professional</h3>
              <p className="text-blue-100 text-sm mb-6">For growing teams building automated pipelines.</p>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-white">$49</span>
                <span className="text-blue-200">/user/mo</span>
              </div>
              <Link href="/dashboard" className="w-full text-center bg-white hover:bg-slate-50 text-blue-600 font-bold py-3 rounded-xl transition-colors mb-8 shadow-lg">
                Start 14-Day Free Trial
              </Link>
              <ul className="space-y-4 flex-1">
                <li className="flex items-start gap-3 text-sm text-blue-50">
                  <Check className="w-5 h-5 text-blue-300 shrink-0" /> Unlimited boards
                </li>
                <li className="flex items-start gap-3 text-sm text-blue-50">
                  <Check className="w-5 h-5 text-blue-300 shrink-0" /> All premium AI agents (Resume, Sourcing)
                </li>
                <li className="flex items-start gap-3 text-sm text-blue-50">
                  <Check className="w-5 h-5 text-blue-300 shrink-0" /> LinkedIn & ATS integrations
                </li>
                <li className="flex items-start gap-3 text-sm text-blue-50">
                  <Check className="w-5 h-5 text-blue-300 shrink-0" /> 5,000 AI actions per month
                </li>
              </ul>
            </div>

            {/* Enterprise Tier */}
            <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-xl flex flex-col text-white">
              <h3 className="text-xl font-bold mb-2">Enterprise</h3>
              <p className="text-slate-400 text-sm mb-6">Custom constraints, compliance, and dedicated support.</p>
              <div className="mb-6">
                <span className="text-4xl font-extrabold">Custom</span>
              </div>
              <Link href="#" className="w-full text-center bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 rounded-xl transition-colors mb-8 border border-slate-700">
                Contact Sales
              </Link>
              <ul className="space-y-4 flex-1">
                <li className="flex items-start gap-3 text-sm text-slate-300">
                  <Check className="w-5 h-5 text-slate-500 shrink-0" /> Custom MCP API Connectors
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-300">
                  <Check className="w-5 h-5 text-slate-500 shrink-0" /> Dedicated success manager
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-300">
                  <Check className="w-5 h-5 text-slate-500 shrink-0" /> SOC2 Compliance & SSO
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-300">
                  <Check className="w-5 h-5 text-slate-500 shrink-0" /> Unlimited AI actions
                </li>
              </ul>
            </div>
          </div>
          
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}
