const fs = require('fs');
let code = fs.readFileSync('src/components/board/candidate-concierge-node.tsx', 'utf8');

let lines = code.split('\n');
let newLines = [];
let fcount = 0;
let dcount = 0;
for (let line of lines) {
    if (line.includes('const [flightsState')) {
        fcount++;
        if (fcount > 1) continue;
    }
    if (line.includes('const [diningState')) {
        dcount++;
        if (dcount > 1) continue;
    }
    newLines.push(line);
}
fs.writeFileSync('src/components/board/candidate-concierge-node.tsx', newLines.join('\n'));
