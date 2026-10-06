import React from 'react';
import { cn } from '../../lib/utils';

/**
 * Reusable skeleton loader with shimmer animation.
 * @param {{ lines?: number, className?: string }} props
 */
const SkeletonCard = ({ lines = 3, className = '' }) => (
  <div className={cn('p-6 rounded-3xl border border-slate-100 bg-[#faf9ff] space-y-4 animate-pulse', className)}>
    {/* Title skeleton */}
    <div className="h-5 w-2/5 bg-slate-200 rounded-xl" />
    {/* Line skeletons */}
    {Array.from({ length: lines }).map((_, i) => (
      <div
        key={i}
        className="h-3 bg-slate-100 rounded-lg"
        style={{ width: `${85 - i * 12}%` }}
      />
    ))}
  </div>
);

/**
 * Inline skeleton for stat values.
 */
export const SkeletonValue = ({ width = '60px', height = '28px', className = '' }) => (
  <div
    className={cn('bg-slate-200 rounded-lg animate-pulse', className)}
    style={{ width, height }}
  />
);

/**
 * Skeleton for table rows.
 * @param {{ rows?: number }} props
 */
export const SkeletonTable = ({ rows = 5 }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex items-center gap-4 p-4 animate-pulse">
        <div className="w-8 h-8 bg-slate-200 rounded-xl" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-1/3 bg-slate-200 rounded-lg" />
          <div className="h-3 w-1/5 bg-slate-100 rounded-lg" />
        </div>
        <div className="h-5 w-12 bg-slate-200 rounded-lg" />
      </div>
    ))}
  </div>
);

export default SkeletonCard;
