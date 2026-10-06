const fs = require('fs');
let code = fs.readFileSync('src/components/board/candidate-concierge-node.tsx', 'utf8');

code = code.replace(/onClick=\{\(e\) => \{/g, 'onPointerDown={(e) => {');

fs.writeFileSync('src/components/board/candidate-concierge-node.tsx', code);
console.log('Changed onClick to onPointerDown');
