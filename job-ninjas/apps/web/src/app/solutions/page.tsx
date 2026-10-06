import { MarketingNav, MarketingFooter } from '@/components/marketing-layout';
import { Building2, Rocket, Users2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function SolutionsPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100">
      <MarketingNav />
      
      <main className="pt-24 pb-16 sm:pt-32 sm:pb-24 lg:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-6">
              Solutions for Every Scale
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed mb-8">
              Whether you're a high-growth startup or a global enterprise, Job Ninjas adapts to your hiring velocity.
            </p>
          </div>

          <div className="space-y-24 mt-16">
            {/* Startup */}
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="flex-1 space-y-6">
                <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center">
                  <Rocket className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-bold">For Startups</h2>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Move fast without breaking your hiring process. Startups use Job Ninjas to quickly spin up automated sourcing pipelines and manage candidate pipelines visually without needing a massive recruiting team.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-blue-600" /> Pre-built agent templates
                  </li>
                  <li className="flex items-center gap-3 text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-blue-600" /> Rapid LinkedIn sourcing
                  </li>
                  <li className="flex items-center gap-3 text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-blue-600" /> Lightweight ATS replacement
                  </li>
                </ul>
              </div>
              <div className="flex-1 bg-slate-50 rounded-2xl p-8 border border-slate-100 shadow-xl w-full min-h-[300px] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-orange-100/50"></div>
                <div className="relative z-10 text-center space-y-4">
                  <h3 className="font-bold text-slate-800 text-xl">&quot;It feels like having 3 extra recruiters.&quot;</h3>
                  <p className="text-slate-500 font-medium">— Sarah J., Founder @ TechNova</p>
                </div>
              </div>
            </div>

            {/* Enterprise */}
            <div className="flex flex-col md:flex-row-reverse gap-12 items-center">
              <div className="flex-1 space-y-6">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-bold">For Enterprise</h2>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Connect your complex, fragmented HR systems. Job Ninjas sits on top of Workday, SuccessFactors, and greenhouse to orchestrate workflows visually while maintaining strict compliance and role-based access.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-blue-600" /> Workday &amp; Enterprise ERP integration
                  </li>
                  <li className="flex items-center gap-3 text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-blue-600" /> Advanced SSO &amp; SOC2 Compliance
                  </li>
                  <li className="flex items-center gap-3 text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-blue-600" /> Custom MCP API Connectors
                  </li>
                </ul>
              </div>
              <div className="flex-1 bg-slate-50 rounded-2xl p-8 border border-slate-100 shadow-xl w-full min-h-[300px] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100/50"></div>
                <div className="relative z-10 text-center space-y-4">
                  <h3 className="font-bold text-slate-800 text-xl">&quot;Finally, we can actually see our hiring bottlenecks.&quot;</h3>
                  <p className="text-slate-500 font-medium">— Marcus T., VP of Talent @ GlobalCorp</p>
                </div>
              </div>
            </div>

            {/* Agencies */}
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="flex-1 space-y-6">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
                  <Users2 className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-bold">For Recruiting Agencies</h2>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Differentiate your firm by giving clients visual, interactive candidate presentations instead of boring PDFs. Collaborate in real-time and automate follow-ups.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-blue-600" /> Shareable client dashboards
                  </li>
                  <li className="flex items-center gap-3 text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-blue-600" /> Automated resume formatting
                  </li>
                  <li className="flex items-center gap-3 text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-blue-600" /> High-volume parsing agents
                  </li>
                </ul>
              </div>
              <div className="flex-1 bg-slate-50 rounded-2xl p-8 border border-slate-100 shadow-xl w-full min-h-[300px] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-purple-100/50"></div>
                <div className="relative z-10 text-center space-y-4">
                  <h3 className="font-bold text-slate-800 text-xl">&quot;Our client win rate jumped 40% after switching to visual presentations.&quot;</h3>
                  <p className="text-slate-500 font-medium">— Emily R., Partner @ Elevate Search</p>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}
