const fs = require('fs');
let code = fs.readFileSync('src/components/board/candidate-concierge-node.tsx', 'utf8');

// The issue was:
// budget: '
// 
// // ── Activity log entry
// We need to fix that literal string issue.
code = code.replace(/budget:\s*'\n/g, "budget: '$' + (layer.config?.budget || '800'),\n");

// Also, the previous script might have failed the replacement of SARAH. Let's explicitly fix the SARAH object:
code = code.replace(/const SARAH = \{[\s\S]*?budget:[\s\S]*?\n\s*\};/, `const SARAH = {
    name: layer.config?.candidateName || 'Sarah Chen',
    role: layer.config?.role || 'AI Engineer • Final Interview',
    fromCity: layer.config?.fromLocation || 'Atlanta, GA',
    toCity: layer.config?.toLocation || 'New York, NY',
    fromCode: (layer.config?.fromLocation || 'Atlanta').substring(0, 3).toUpperCase(),
    toCode: (layer.config?.toLocation || 'New York').substring(0, 3).toUpperCase(),
    checkIn: layer.config?.date || 'Oct 14',
    checkOut: 'Oct 15',
    budget: '$' + (layer.config?.budget || '800'),
  };`);

fs.writeFileSync('src/components/board/candidate-concierge-node.tsx', code);
