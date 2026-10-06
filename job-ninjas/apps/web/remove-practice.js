const fs = require('fs');
let code = fs.readFileSync('src/components/board/candidate-concierge-node.tsx', 'utf8');

// Remove the practice mode banner
code = code.replace(
  /<div className="bg-indigo-50 border-b border-indigo-100 px-4 py-1\.5 flex items-center justify-between text-\[10px\] font-bold text-indigo-700">[\s\S]*?<\/div>/,
  ""
);

// Also remove the PRACTICE MODE from HotelCard
code = code.replace(
  /\{hotel\.providerData\?\.practice && \([\s\S]*?<\/div>\s*\)\}/,
  ""
);

fs.writeFileSync('src/components/board/candidate-concierge-node.tsx', code);
console.log('Removed practice mode tag!');
