const fs = require('fs');
let code = fs.readFileSync('src/app/(dashboard)/roles/[roleId]/board/page.tsx', 'utf8');

const logoMarkup = `
      <div className="absolute top-6 left-6 z-50 flex items-center gap-3 bg-white/80 backdrop-blur-md px-4 py-2 rounded-2xl shadow-sm border border-slate-200/50 cursor-pointer hover:bg-white transition-colors" onClick={() => window.location.href='/roles'}>
        <img src="/logo.png" alt="JobNinjas" className="w-8 h-8 object-contain" />
        <span className="font-extrabold text-slate-800 tracking-tight">JobNinjas</span>
      </div>
`;

code = code.replace(
  /<div className="w-full h-full relative">/,
  '<div className="w-full h-full relative">\n' + logoMarkup
);

fs.writeFileSync('src/app/(dashboard)/roles/[roleId]/board/page.tsx', code);
console.log('Added logo to board!');
