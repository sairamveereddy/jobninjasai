"use client";

import { BarChart, TrendingUp, Users, Clock } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="p-8 flex flex-col h-full relative">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-card rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Total Candidates</h3>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">1,248</p>
          <div className="flex items-center gap-1 mt-2 text-sm text-green-600 font-medium">
            <TrendingUp className="w-4 h-4" />
            <span>+12% from last month</span>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Time to Hire</h3>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">18 days</p>
          <div className="flex items-center gap-1 mt-2 text-sm text-green-600 font-medium">
            <TrendingUp className="w-4 h-4" />
            <span>-2 days from last month</span>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-gray-200 p-8 shadow-sm flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Pipeline Conversion (Last 30 Days)</h3>
        <div className="flex-1 flex items-end justify-between gap-2 mt-4 px-4 h-64">
          {[
            { stage: 'Sourced', count: 1248, h: 'h-full', color: 'bg-blue-200' },
            { stage: 'Screened', count: 843, h: 'h-4/5', color: 'bg-blue-300' },
            { stage: 'Interview', count: 324, h: 'h-3/5', color: 'bg-blue-400' },
            { stage: 'Offer', count: 52, h: 'h-1/5', color: 'bg-blue-500' },
            { stage: 'Hired', count: 41, h: 'h-[15%]', color: 'bg-blue-600' }
          ].map((bar, i) => (
            <div key={i} className="flex flex-col items-center flex-1 group">
              <span className="text-sm font-bold text-slate-700 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">{bar.count}</span>
              <div className={`w-full max-w-[80px] ${bar.h} ${bar.color} rounded-t-lg transition-all hover:brightness-95`}></div>
              <span className="text-[12px] font-medium text-slate-500 mt-3">{bar.stage}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
