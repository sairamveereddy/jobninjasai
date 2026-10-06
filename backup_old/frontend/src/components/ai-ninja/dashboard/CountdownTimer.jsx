import React, { useState, useEffect } from 'react';
import { Timer } from 'lucide-react';
import { Badge } from '../../ui/badge';

/**
 * Countdown timer for the next AI interview call.
 * @param {{ todaysStatus?: 'not_scheduled'|'scheduled'|'called'|'completed' }} props
 */
const CountdownTimer = ({ todaysStatus }) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const target = new Date();
      
      // Set target to next 9:00 AM
      target.setHours(9, 0, 0, 0);
      
      if (now >= target) {
        target.setDate(target.getDate() + 1);
      }
      
      const diff = target - now;
      
      return {
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60)
      };
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const format = (num) => String(num).padStart(2, '0');

  const statusConfig = {
    not_scheduled: { label: 'Not Scheduled', color: 'bg-slate-100 text-slate-500' },
    scheduled:     { label: 'Scheduled', color: 'bg-blue-50 text-blue-600' },
    called:        { label: 'In Progress', color: 'bg-amber-50 text-amber-600' },
    completed:     { label: 'Completed ✓', color: 'bg-emerald-50 text-emerald-600' },
  };

  const status = statusConfig[todaysStatus] || statusConfig.scheduled;

  return (
    <div className="flex items-center gap-6 bg-white/50 backdrop-blur-md border border-white/20 p-6 rounded-3xl shadow-xl">
      <div className="w-12 h-12 bg-blue-600/10 text-blue-600 rounded-2xl flex items-center justify-center animate-pulse">
        <Timer size={24} />
      </div>
      
      <div className="flex gap-4">
        {[
          { label: 'Hrs', value: timeLeft.hours },
          { label: 'Min', value: timeLeft.minutes },
          { label: 'Sec', value: timeLeft.seconds },
        ].map((item, i) => (
          <div key={item.label} className="text-center">
            <div className="text-2xl font-black text-slate-900 tracking-tighter tabular-nums">
              {format(item.value)}
              {i < 2 && <span className="ml-2 text-slate-300">:</span>}
            </div>
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">
              {item.label}
            </div>
          </div>
        ))}
      </div>
      
      <div className="ml-auto hidden md:block">
        <div className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider text-right">Next Session</div>
        <div className="flex items-center gap-2">
          <div className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            Today @ 9:00 AM
          </div>
          {todaysStatus && (
            <Badge className={`${status.color} border-none font-bold text-[10px] uppercase px-2 py-0.5`}>
              {status.label}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;
