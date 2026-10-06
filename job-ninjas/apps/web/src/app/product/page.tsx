import { MarketingNav, MarketingFooter } from '@/components/marketing-layout';
import { Bot, CheckCircle2, Workflow, Database, Share2, LayoutTemplate } from 'lucide-react';
import Link from 'next/link';

export default function ProductPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100">
      <MarketingNav />
      
      <main className="pt-24 pb-16 sm:pt-32 sm:pb-24 lg:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-6">
              The Spatial Recruiting OS
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed mb-8">
              Move beyond linear spreadsheets and static applicant tracking systems. Visualize your entire hiring pipeline, deploy AI agents on the fly, and collaborate in real-time.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/dashboard" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold transition-colors shadow-lg shadow-blue-500/30">
                Get Started
              </Link>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:shadow-xl hover:border-blue-100 transition-all">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                <LayoutTemplate className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Infinite Canvas</h3>
              <p className="text-slate-600 leading-relaxed">
                Map out complex hiring workflows on an infinite visual board. Drop in candidates, connect them to roles, and see the big picture.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:shadow-xl hover:border-purple-100 transition-all">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Autonomous Agents</h3>
              <p className="text-slate-600 leading-relaxed">
                Deploy specialized AI agents to handle sourcing, resume screening, scheduling, and onboarding automatically.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:shadow-xl hover:border-emerald-100 transition-all">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
                <Workflow className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Seamless Integrations</h3>
              <p className="text-slate-600 leading-relaxed">
                Connect directly with Workday, LinkedIn, Gmail, Excel, and your existing HR stack via custom API connectors.
              </p>
            </div>
          </div>
          
          <div className="mt-32">
            <div className="bg-blue-600 rounded-3xl p-12 text-center text-white shadow-2xl relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-3xl font-bold mb-4">Ready to transform your hiring?</h2>
                <p className="text-blue-100 mb-8 max-w-2xl mx-auto text-lg">
                  Join forward-thinking talent teams who are already building the future of recruiting on Job Ninjas.
                </p>
                <Link href="/dashboard" className="inline-block bg-white text-blue-600 px-8 py-3 rounded-full font-bold hover:bg-blue-50 transition-colors shadow-lg">
                  Start Your Free Trial
                </Link>
              </div>
              
              {/* Decorative background elements */}
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-blue-500 opacity-50 blur-3xl"></div>
              <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-indigo-500 opacity-50 blur-3xl"></div>
            </div>
          </div>
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}
