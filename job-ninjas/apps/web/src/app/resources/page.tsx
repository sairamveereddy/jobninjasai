import { MarketingNav, MarketingFooter } from '@/components/marketing-layout';
import { BookOpen, Video, HelpCircle, Newspaper } from 'lucide-react';
import Link from 'next/link';

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100">
      <MarketingNav />
      
      <main className="pt-24 pb-16 sm:pt-32 sm:pb-24 lg:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-6">
              Resources & Learning
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed mb-8">
              Everything you need to master spatial recruiting, build custom AI agents, and transform your talent acquisition strategy.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            <Link href="#" className="group bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-500 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2 group-hover:text-blue-600 transition-colors">Documentation</h3>
              <p className="text-sm text-slate-600">
                Detailed guides on configuring MCP connectors, setting up custom agents, and utilizing canvas shortcuts.
              </p>
            </Link>

            <Link href="#" className="group bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-500 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Video className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2 group-hover:text-blue-600 transition-colors">Video Tutorials</h3>
              <p className="text-sm text-slate-600">
                Step-by-step walkthroughs of building your first automated sourcing pipeline from scratch.
              </p>
            </Link>

            <Link href="#" className="group bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-500 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Newspaper className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2 group-hover:text-blue-600 transition-colors">Blog</h3>
              <p className="text-sm text-slate-600">
                Insights on the future of HR, AI trends in recruiting, and best practices from top talent leaders.
              </p>
            </Link>

            <Link href="#" className="group bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-500 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2 group-hover:text-blue-600 transition-colors">Help Center</h3>
              <p className="text-sm text-slate-600">
                FAQs, troubleshooting guides, and direct access to our customer success team for priority support.
              </p>
            </Link>
          </div>

          <div className="mt-24 bg-slate-50 rounded-3xl p-8 md:p-12 border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <h2 className="text-2xl font-bold mb-3">Subscribe to our newsletter</h2>
              <p className="text-slate-600">Get the latest product updates, AI recruiting templates, and industry news delivered directly to your inbox every month.</p>
            </div>
            <div className="flex w-full md:w-auto gap-3">
              <input type="email" placeholder="Enter your email" className="px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 md:w-64" />
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-colors">
                Subscribe
              </button>
            </div>
          </div>
          
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}
