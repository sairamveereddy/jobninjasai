import { Handle, Position } from '@xyflow/react';

export default function StageNode({ data }: { data: any }) {
  return (
    <div className="h-full w-full rounded-xl border-2 border-dashed border-gray-300 bg-gray-50/50 p-4 transition-colors hover:border-indigo-300">
      <div className="absolute -top-3 left-4 bg-card px-2">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
          {data.label || 'Stage Frame'}
        </h3>
      </div>
      {/* Target for dropping things */}
    </div>
  );
}
