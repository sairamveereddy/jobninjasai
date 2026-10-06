import Link from "next/link";
import { ArrowLeft, Beaker } from "lucide-react";

export default function GenericPage({ params }: { params: { slug: string[] } }) {
  const pageName = params.slug.join(" ").replace(/-/g, " ");
  
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-600 mb-6 shadow-inner">
          <Beaker className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-black text-slate-900 mb-4 capitalize">{pageName}</h1>
        <p className="text-lg text-slate-500 mb-8">
          This is a placeholder page for the <span className="font-bold text-slate-700 capitalize">{pageName}</span> section. Our team is actively building out these detailed product and solution pages.
        </p>
        <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </div>
    </div>
  );
}
