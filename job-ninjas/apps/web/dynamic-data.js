const fs = require('fs');
let code = fs.readFileSync('src/components/board/candidate-concierge-node.tsx', 'utf8');

const flightRegex = /\{\[\s*\{\s*airline:\s*'Delta Airlines'[\s\S]*?\]\}/;

const dynamicFlights = `[
                    { airline: SARAH.fromCode === 'SEA' ? 'Alaska Airlines' : 'Delta Airlines', time: '08:00 AM - ' + (SARAH.fromCode === 'SEA' ? '04:15 PM' : '10:15 AM'), price: SARAH.fromCode === 'SEA' ? '$485' : '$245', type: 'Direct', id: 'f1' },
                    { airline: 'American Airlines', time: '09:30 AM - ' + (SARAH.fromCode === 'SEA' ? '05:45 PM' : '11:45 AM'), price: SARAH.fromCode === 'SEA' ? '$410' : '$210', type: '1 Stop', id: 'f2' }
                  ]`;

code = code.replace(flightRegex, dynamicFlights);

const diningRegex = /\{\[\s*\{\s*name:\s*'Le Bernardin'[\s\S]*?\]\}/;

const dynamicDining = `[
                    { name: SARAH.fromCode === 'SEA' ? 'The Modern' : 'Le Bernardin', type: 'Fine Dining • $$$$', rating: SARAH.fromCode === 'SEA' ? '4.8' : '4.9', dist: '0.4 mi', id: 'd1' },
                    { name: SARAH.fromCode === 'SEA' ? 'Gramercy Tavern' : 'Keens Steakhouse', type: 'American • $$$', rating: '4.7', dist: '0.6 mi', id: 'd2' }
                  ]`;

code = code.replace(diningRegex, dynamicDining);

fs.writeFileSync('src/components/board/candidate-concierge-node.tsx', code);
console.log('Made flights and dining dynamic');
