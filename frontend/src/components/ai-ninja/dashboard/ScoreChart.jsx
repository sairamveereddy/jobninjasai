import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts';

/**
 * Score performance chart that accepts live recentScores data.
 * @param {{ recentScores?: Array<{date: string, overall: number, technical: number, communication: number, confidence: number}> }} props
 */
const ScoreChart = ({ recentScores = [] }) => {
  // Map live data or use empty state
  const chartData = recentScores.length > 0
    ? recentScores.map((s) => {
        const d = new Date(s.date);
        return {
          day: d.toLocaleDateString('en-US', { weekday: 'short' }),
          score: s.overall,
          technical: s.technical,
          communication: s.communication,
        };
      })
    : [
        { day: 'Mon', score: 0 },
        { day: 'Tue', score: 0 },
        { day: 'Wed', score: 0 },
        { day: 'Thu', score: 0 },
        { day: 'Fri', score: 0 },
      ];

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="day" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fontWeight: 600, fill: '#94a3b8' }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fontWeight: 600, fill: '#94a3b8' }}
            domain={[0, 100]}
          />
          <Tooltip 
            contentStyle={{ 
              borderRadius: '16px', 
              border: 'none', 
              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
              fontSize: '12px',
              fontWeight: 'bold'
            }}
          />
          <Area 
            type="monotone" 
            dataKey="score" 
            stroke="#2563eb" 
            strokeWidth={4} 
            fillOpacity={1} 
            fill="url(#colorScore)" 
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ScoreChart;
