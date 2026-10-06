const fs = require('fs');
let code = fs.readFileSync('src/components/board/candidate-concierge-node.tsx', 'utf8');

code = code.replace(
    /onClick=\{\(\) => \{/g,
    "onClick={(e) => { e.stopPropagation();"
);

code = code.replace(
    /className="mt-4 w-full bg-violet-600/g,
    "onPointerDown={(e) => e.stopPropagation()} className=\"mt-4 w-full bg-violet-600"
);

// We should also replace the Select Flight / Reserve Table buttons
code = code.replace(
    /Select Flight/g,
    "Select Flight"
); // well we could just add pointer down to the whole container.

code = code.replace(
    /<div className="p-5 flex flex-col h-full overflow-y-auto pointer-events-auto">/g,
    "<div className=\"p-5 flex flex-col h-full overflow-y-auto pointer-events-auto\" onPointerDown={(e) => e.stopPropagation()}>"
);

fs.writeFileSync('src/components/board/candidate-concierge-node.tsx', code);
console.log('Added pointer events isolation');
