const fs = require('fs');
let code = fs.readFileSync('src/components/board/canvas.tsx', 'utf8');

// Enhance agent node styling
code = code.replace(
  /w-full h-full rounded-xl border-2 flex flex-col overflow-hidden bg-card shadow-xl/g,
  'w-full h-full rounded-2xl border flex flex-col overflow-hidden bg-white/95 backdrop-blur-xl shadow-xl transition-all duration-300'
);

code = code.replace(
  /isSelected \? 'border-indigo-500 shadow-indigo-500\/20' : 'border-border'/g,
  "isSelected ? 'border-indigo-500 ring-4 ring-indigo-500/10 shadow-indigo-500/20 scale-[1.02] z-50' : 'border-slate-200 shadow-slate-200/50 hover:shadow-slate-300/50 hover:border-slate-300'"
);

code = code.replace(
  /bg-muted px-3 py-2 border-b border-border flex items-center justify-between/g,
  'bg-slate-50/80 backdrop-blur-md px-4 py-3 border-b border-slate-100 flex items-center justify-between'
);

code = code.replace(
  /font-semibold text-sm text-foreground capitalize/g,
  'font-bold text-[13px] text-slate-700 capitalize tracking-tight'
);

code = code.replace(
  /flex-1 p-3 flex flex-col justify-between bg-card/g,
  'flex-1 p-4 flex flex-col justify-between bg-white'
);

code = code.replace(
  /font-bold text-foreground text-lg mb-1/g,
  'font-extrabold text-slate-900 text-[17px] mb-1 leading-tight'
);

code = code.replace(
  /px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-600 disabled:bg-green-50\/50 disabled:text-green-600\/50 text-sm font-semibold rounded transition-colors flex items-center gap-1/g,
  'px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 disabled:bg-emerald-50/50 disabled:text-emerald-600/50 text-[13px] font-bold rounded-lg transition-colors flex items-center gap-1.5'
);

code = code.replace(
  /w-full h-full rounded-xl border-2 border-indigo-500 shadow-xl flex flex-col items-center justify-center p-4 bg-card gap-4/g,
  'w-full h-full rounded-2xl border-2 border-indigo-500 shadow-2xl flex flex-col items-center justify-center p-6 bg-white gap-4'
);

fs.writeFileSync('src/components/board/canvas.tsx', code);
console.log('Updated canvas.tsx styling');
