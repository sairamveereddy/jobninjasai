const fs = require('fs');
let code = fs.readFileSync('src/components/board/candidate-concierge-node.tsx', 'utf8');

const start = code.indexOf('const SARAH = {');
const end = code.indexOf('const icons = {');

if (start !== -1 && end !== -1) {
    const newSarah = `const SARAH = {
    name: layer.config?.candidateName || 'Sarah Chen',
    role: layer.config?.role || 'AI Engineer • Final Interview',
    fromCity: layer.config?.fromLocation || 'Atlanta, GA',
    toCity: layer.config?.toLocation || 'New York, NY',
    fromCode: (layer.config?.fromLocation || 'Atlanta').substring(0, 3).toUpperCase(),
    toCode: (layer.config?.toLocation || 'New York').substring(0, 3).toUpperCase(),
    checkIn: layer.config?.date || 'Oct 14',
    checkOut: 'Oct 15',
    budget: '$' + (layer.config?.budget || '800'),
  };
  
  `;
    code = code.substring(0, start) + newSarah + code.substring(end);
    fs.writeFileSync('src/components/board/candidate-concierge-node.tsx', code);
    console.log('Fixed SARAH object');
} else {
    console.log('Could not find start or end', start, end);
}
