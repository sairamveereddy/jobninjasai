import { Candidate } from '@/../../shared/types';
import { X, ExternalLink, ShieldCheck, AlertTriangle } from 'lucide-react';

interface InspectorPanelProps {
  candidate: Candidate | null;
  onClose: () => void;
}

export default function InspectorPanel({ candidate, onClose }: InspectorPanelProps) {
  if (!candidate) return null;

  return (
    <div className="w-96 h-full bg-card border-l border-gray-200 shadow-xl flex flex-col absolute right-0 top-0 z-10">
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 bg-gray-50">
        <h3 className="text-sm font-semibold text-gray-900">Candidate Inspector</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">{candidate.name}</h2>
          <p className="text-sm text-gray-500">{candidate.email}</p>
          <span className="mt-2 inline-flex items-center rounded-full bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-600/20">
            {candidate.status}
          </span>
        </div>

        {/* Tabs placeholder */}
        <div className="border-b border-gray-200 mb-4">
          <nav className="-mb-px flex space-x-4">
            <button className="border-indigo-500 text-indigo-600 whitespace-nowrap border-b-2 py-2 px-1 text-sm font-medium">
              Overview
            </button>
            <button className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 whitespace-nowrap border-b-2 py-2 px-1 text-sm font-medium">
              Evidence
            </button>
            <button className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 whitespace-nowrap border-b-2 py-2 px-1 text-sm font-medium">
              Interviews
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">JD Alignment Matrix</h4>
            <div className="rounded-md border border-gray-200 bg-gray-50 p-3 text-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">TypeScript / React</span>
                <span className="text-green-600 flex items-center gap-1"><ShieldCheck size={14}/> Verified</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">System Architecture</span>
                <span className="text-amber-600 flex items-center gap-1"><AlertTriangle size={14}/> Needs Probe</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">AI Observations</h4>
            <div className="rounded-md bg-indigo-50 p-3 border border-indigo-100 text-sm">
              <p className="text-indigo-900 mb-2">
                <strong>Strong Match:</strong> The candidate demonstrates 5+ years of relevant frontend experience in their parsed resume.
              </p>
              <p className="text-xs text-indigo-700 mt-2">Source: Resume • Confidence: 95%</p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">External Links</h4>
            <div className="space-y-2">
              <a href="#" className="flex items-center gap-2 text-sm text-indigo-600 hover:underline">
                <ExternalLink size={14} /> GitHub Profile (Analyzed)
              </a>
              <a href="#" className="flex items-center gap-2 text-sm text-indigo-600 hover:underline">
                <ExternalLink size={14} /> LinkedIn (Provided)
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
