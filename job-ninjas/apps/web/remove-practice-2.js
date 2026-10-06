const fs = require('fs');
let code = fs.readFileSync('src/components/board/candidate-concierge-node.tsx', 'utf8');

// Replace the practice mode remnants
const regex = /PRACTICE MODE[\s\S]*?<span className="font-normal ml-1 text-indigo-500">.*?<\/span>[\s\S]*?<\/div>[\s\S]*?<div className="flex items-center gap-1 opacity-70">[\s\S]*?<\/div>/;

code = code.replace(regex, '');

fs.writeFileSync('src/components/board/candidate-concierge-node.tsx', code);
console.log('Fixed practice mode removal!');
