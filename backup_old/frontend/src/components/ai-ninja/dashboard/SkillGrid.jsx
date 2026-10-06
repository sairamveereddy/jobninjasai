import React from 'react';
import { Badge } from '../../ui/badge';
import { BrainCircuit, AlertTriangle } from 'lucide-react';
import { cn } from '../../../lib/utils';

/**
 * Skill progression grid that shows mastered + gap skills.
 * @param {{ selectedSkills?: string[], missingSkills?: string[] }} props
 */
const SkillGrid = ({ selectedSkills = [], missingSkills = [] }) => {
  // Build display items from live data
  const mastered = selectedSkills.map(name => ({
    name,
    progress: 75 + Math.floor(Math.random() * 20), // Will be replaced by real confidence when available
    level: 'Mastered',
    type: 'mastered',
  }));

  const gaps = missingSkills.map(name => ({
    name,
    progress: 10 + Math.floor(Math.random() * 25),
    level: 'Gap',
    type: 'gap',
  }));

  const displaySkills = [...mastered, ...gaps];

  // Fallback sample data if nothing loaded yet
  const finalSkills = displaySkills.length > 0 ? displaySkills : [
    { name: 'No skills loaded', progress: 0, level: '—', type: 'mastered' },
  ];

  const getProgressColor = (val, type) => {
    if (type === 'gap') return 'bg-amber-500 shadow-amber-200';
    if (val > 80) return 'bg-emerald-500 shadow-emerald-200';
    if (val > 50) return 'bg-blue-600 shadow-blue-200';
    if (val > 30) return 'bg-amber-500 shadow-amber-200';
    return 'bg-rose-500 shadow-rose-200';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {finalSkills.map((skill, i) => (
        <div key={i} className="group p-5 bg-white border border-slate-100 rounded-3xl hover:border-blue-200 hover:shadow-xl hover:shadow-blue-50 transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
              <div className={cn(
                'w-8 h-8 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform',
                skill.type === 'gap' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
              )}>
                {skill.type === 'gap' ? <AlertTriangle size={18} /> : <BrainCircuit size={18} />}
              </div>
              <span className="font-bold text-slate-800">{skill.name}</span>
            </div>
            <Badge variant="outline" className={cn(
              "text-[10px] uppercase tracking-wider font-extrabold",
              skill.type === 'gap' ? 'border-amber-300 text-amber-600' : 'border-slate-200'
            )}>
              {skill.level}
            </Badge>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-end text-xs font-bold text-slate-400">
              <span>{skill.type === 'gap' ? 'Gap Level' : 'Progress'}</span>
              <span className="text-slate-900">{skill.progress}%</span>
            </div>
            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden p-[2px]">
              <div 
                className={cn("h-full rounded-full transition-all duration-1000", getProgressColor(skill.progress, skill.type))}
                style={{ width: `${skill.progress}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkillGrid;
