const fs = require('fs');
let code = fs.readFileSync('src/app/api/boards/[roleId]/route.ts', 'utf8');

// Add the Ophelia agent node
code = code.replace(
  /addNode\('a12', 'entry-node', 4300, 650, 'Background Check Agent', 250, 120, \{ instructions: 'Initiate standard background and reference check via API.' \}\);/,
  "addNode('a12', 'entry-node', 4300, 650, 'Background Check Agent', 250, 120, { instructions: 'Initiate standard background and reference check via API.' });\n        addNode('o3', 'candidate-concierge', 4300, 875, 'Relocation Concierge (Sarah)', 960, 560, { candidateName: 'Sarah Chen', fromLocation: 'Atlanta, GA', toLocation: 'New York, NY', date: 'Oct 14', budget: '800' });"
);

// Add the edge connecting onboarding agent to ophelia agent
code = code.replace(
  /addEdge\('e17', 'a9', 'a12'\);/,
  "addEdge('e17', 'a9', 'a12');\n        addEdge('e18', 'a9', 'o3');"
);

fs.writeFileSync('src/app/api/boards/[roleId]/route.ts', code);
console.log('Added third Ophelia agent!');
