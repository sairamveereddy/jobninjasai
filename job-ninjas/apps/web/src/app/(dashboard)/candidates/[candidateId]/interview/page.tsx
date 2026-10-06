"use client";

import { useState } from 'react';
import { useDemoStore } from '@/lib/store';
import { Upload, Check, AlertCircle, FileText } from 'lucide-react';

export default function InterviewWorkspace({ params }: { params: { candidateId: string } }) {
  const [transcript, setTranscript] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  
  const { candidates } = useDemoStore();
  const candidate = candidates.find(c => c.id === params.candidateId);

  const handleAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setAnalysisResult({
        summary: "The candidate demonstrated strong knowledge of React and TypeScript, but lacked depth in System Architecture.",
        competencies: [
          { name: "React/TypeScript", evidence: "Explained custom hooks and generic types clearly.", score: "Strong" },
          { name: "System Architecture", evidence: "Struggled with micro-frontend concepts.", score: "Weak" }
        ],
        followUps: [
          "Can you describe a time you designed a distributed system from scratch?"
        ]
      });
    }, 2000);
  };

  if (!candidate) {
    return <div className="p-8 text-center text-slate-500">Candidate not found</div>;
  }

  return (
    <div className="p-8 max-w-5xl mx-auto h-full overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Technical Interview Scorecard</h2>
        <p className="text-sm text-gray-500 mt-1">Candidate: <span className="font-medium text-slate-700">{candidate.name}</span> ({candidate.email})</p>
      </div>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-1 space-y-6">
          <div className="bg-card p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Interviewer Prep</h3>
            <ul className="space-y-4 text-sm">
              <li>
                <span className="font-medium text-gray-900 block mb-1">Q1: Explain React Flow state.</span>
                <span className="text-gray-500 text-xs">Why: Validates their frontend claim on resume.</span>
              </li>
              <li>
                <span className="font-medium text-gray-900 block mb-1">Q2: How do you handle large canvases?</span>
                <span className="text-gray-500 text-xs">Why: Performance optimization is a core JD requirement.</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="col-span-2 space-y-6">
          <div className="bg-card p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Post-Interview Transcript</h3>
            <div className="mb-4">
              <textarea 
                className="w-full h-48 p-4 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Paste the raw interview transcript here..."
                value={transcript}
                onChange={e => setTranscript(e.target.value)}
              />
            </div>
            <div className="flex justify-between items-center">
              <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
                <Upload size={16} /> Upload file
              </button>
              <button 
                onClick={handleAnalyze}
                disabled={!transcript || analyzing}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md font-medium text-sm hover:bg-indigo-700 disabled:opacity-50"
              >
                {analyzing ? 'Analyzing...' : 'Analyze Transcript'}
              </button>
            </div>
          </div>

          {analysisResult && (
            <div className="bg-card p-6 rounded-lg border border-indigo-200 shadow-sm space-y-6">
              <div>
                <h3 className="font-semibold text-indigo-900 mb-2 flex items-center gap-2">
                  <Check size={18} className="text-green-600"/> AI Analysis Complete
                </h3>
                <p className="text-sm text-gray-700">{analysisResult.summary}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Competency Breakdown</h4>
                <div className="space-y-3">
                  {analysisResult.competencies.map((comp: any, idx: number) => (
                    <div key={idx} className="bg-gray-50 p-3 rounded border border-gray-200 text-sm">
                      <div className="flex justify-between font-medium mb-1">
                        <span className="text-gray-900">{comp.name}</span>
                        <span className={comp.score === 'Strong' ? 'text-green-600' : 'text-amber-600'}>
                          {comp.score}
                        </span>
                      </div>
                      <p className="text-gray-600 text-xs mt-2"><FileText size={12} className="inline mr-1"/> Evidence: {comp.evidence}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-amber-50 p-4 rounded-md border border-amber-200 text-sm">
                <h4 className="font-medium text-amber-900 flex items-center gap-2 mb-2">
                  <AlertCircle size={16}/> Suggested Follow-ups for Next Round
                </h4>
                <ul className="list-disc pl-5 text-amber-800 space-y-1">
                  {analysisResult.followUps.map((q: string, i: number) => (
                    <li key={i}>{q}</li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
                <button className="text-gray-600 hover:text-gray-900 text-sm font-medium">Dismiss</button>
                <button className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-md font-medium text-sm hover:bg-indigo-200">
                  Save to Profile
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
