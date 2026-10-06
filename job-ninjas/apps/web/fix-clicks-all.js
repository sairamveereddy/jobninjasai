const fs = require('fs');
let code = fs.readFileSync('src/components/board/candidate-concierge-node.tsx', 'utf8');

code = code.replace(/onClick=\{onSelect\}/g, "onPointerDown={(e) => { e.stopPropagation(); if (onSelect) onSelect(); }}");
code = code.replace(/onClick=\{\(\) => startConcierge\(\)\}/g, "onPointerDown={(e) => { e.stopPropagation(); startConcierge(); }}");
code = code.replace(/onClick=\{approveBooking\}/g, "onPointerDown={(e) => { e.stopPropagation(); approveBooking(); }}");
code = code.replace(/onClick=\{\(\) => \{ setConciergeState\('RESULTS_READY'\); setSelectedHotelId\(null\); \}\}/g, "onPointerDown={(e) => { e.stopPropagation(); setConciergeState('RESULTS_READY'); setSelectedHotelId(null); }}");
code = code.replace(/onClick=\{continueAfterPayment\}/g, "onPointerDown={(e) => { e.stopPropagation(); continueAfterPayment(); }}");
code = code.replace(/onClick=\{\(\) => setShowApiDrawer\(true\)\}/g, "onPointerDown={(e) => { e.stopPropagation(); setShowApiDrawer(true); }}");
code = code.replace(/onClick=\{\(\) => setShowApiDrawer\(false\)\}/g, "onPointerDown={(e) => { e.stopPropagation(); setShowApiDrawer(false); }}");

fs.writeFileSync('src/components/board/candidate-concierge-node.tsx', code);
console.log('Fixed remaining onClicks');
