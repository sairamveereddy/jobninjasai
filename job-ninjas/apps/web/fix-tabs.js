const fs = require('fs');
let code = fs.readFileSync('src/components/board/candidate-concierge-node.tsx', 'utf8');

code = code.replace(/onClick=\{\(\) => setActiveTab\(tab\)\}/g, "onPointerDown={(e) => { e.stopPropagation(); setActiveTab(tab); }}");
code = code.replace(/onClick=\{\(\) => setActiveTab\('stay'\)\}/g, "onPointerDown={(e) => { e.stopPropagation(); setActiveTab('stay'); }}");

fs.writeFileSync('src/components/board/candidate-concierge-node.tsx', code);
console.log('Fixed tabs onClick');
