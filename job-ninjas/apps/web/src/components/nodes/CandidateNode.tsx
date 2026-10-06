import { Handle, Position } from '@xyflow/react';
import { User, FileText, CheckCircle, Clock } from 'lucide-react';

export default function CandidateNode({ data }: { data: any }) {
  // Semantic zoom placeholder: in a real app, you might receive zoom level 
  // via a custom hook to render less detail at < 0.5 zoom.
  
  return (
    <div className="w-[280px] rounded-lg border border-gray-200 bg-card p-4 shadow-sm hover:border-indigo-400 hover:shadow-md transition-all">
      <Handle type="target" position={Position.Left} className="w-2 h-8 rounded-sm bg-indigo-200" />
      
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
            <User size={20} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">{data.label || 'Candidate'}</h3>
            <p className="text-xs text-gray-500">{data.status || 'Applied'}</p>
          </div>
        </div>
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-1 text-gray-600">
          <FileText size={14} /> <span>Resume parsed</span>
        </div>
        <div className="flex items-center gap-1 text-green-600">
          <CheckCircle size={14} /> <span>JD Match: High</span>
        </div>
        <div className="flex items-center gap-1 text-amber-600">
          <Clock size={14} /> <span>Awaiting Review</span>
        </div>
      </div>

      <Handle type="source" position={Position.Right} className="w-2 h-8 rounded-sm bg-indigo-200" />
    </div>
  );
}
