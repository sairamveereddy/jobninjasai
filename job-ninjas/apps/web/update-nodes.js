const fs = require('fs');
let code = fs.readFileSync('src/app/api/boards/[roleId]/route.ts', 'utf8');

const replacement = `if (roleId === 'role-ophelia-demo') {
        const LayerType = { Agent: 5 };
        const layers = {};
        const layerIds = [];
        const edges = {};
        const edgeIds = [];

        function addNode(id, role, x, y, value, width=250, height=120, config={}) {
          layers[id] = { type: LayerType.Agent, x, y, width, height, fill: { r: 255, g: 255, b: 255 }, agentRole: role, value, config };
          layerIds.push(id);
        }

        function addEdge(id, from, to) {
          edges[id] = { id, fromNodeId: from, toNodeId: to };
          edgeIds.push(id);
        }

        addNode('a1', 'sourcing-agent', 100, 300, 'LinkedIn Sourcer', 250, 120, { instructions: 'Search LinkedIn for candidates with 5+ years of React and Python experience. Prefer candidates in NY or remote.' });
        addNode('a2', 'sourcing-agent', 100, 450, 'GitHub Sourcer', 250, 120, { instructions: 'Search GitHub for contributors to popular open source Next.js or Python projects.' });
        addNode('a3', 'resume-verifier', 450, 375, 'Resume Verifier', 250, 120, { instructions: 'Verify resume dates, skills, and past employment history. Flag any gaps > 6 months.' });
        addNode('a4', 'culture-fit-interviewer', 800, 375, 'Phone Screen Agent', 250, 120, { instructions: 'Conduct a 15-minute voice screen focusing on communication and culture fit.' });
        addNode('a5', 'tech-assessor', 1150, 375, 'Technical Assessor', 250, 120, { instructions: 'Send a Take-Home test for building a full-stack Next.js feature. Grade based on code quality and performance.' });
        
        addNode('c1', 'candidate-node', 1500, 100, 'David Kim (Finalist)', 250, 120, { candidateName: 'David Kim', location: 'Seattle, WA', role: 'AI Engineer' });
        addNode('c2', 'candidate-node', 1500, 750, 'Sarah Chen (Finalist)', 250, 120, { candidateName: 'Sarah Chen', location: 'Atlanta, GA', role: 'AI Engineer' });
        
        addNode('o1', 'candidate-concierge', 1850, 100, 'Candidate Concierge (David)', 960, 560, { candidate: 'david' });
        addNode('o2', 'candidate-concierge', 1850, 750, 'Candidate Concierge (Sarah)', 960, 560, { candidate: 'sarah' });

        addNode('a6', 'entry-node', 2900, 425, 'Final Interview Panel', 250, 120, { instructions: 'Conduct 4-hour onsite interview loop. Record feedback from 4 interviewers.' });
        addNode('a7', 'offer-negotiator', 3250, 425, 'Decision Engine', 250, 120, { instructions: 'Synthesize feedback. Prepare offer for selected candidate. Negotiate up to 10% above base if pushed.' });
        addNode('c3', 'candidate-node', 3600, 425, 'Sarah Chen (Selected)', 250, 120, { candidateName: 'Sarah Chen', location: 'Atlanta, GA', role: 'AI Engineer' });
        
        addNode('a9', 'entry-node', 3950, 425, 'Onboarding Coordinator', 250, 120, { instructions: 'Trigger all post-acceptance onboarding tasks across departments.' });
        addNode('a10', 'word-doc', 4300, 200, 'Employee Handbook', 250, 120);
        addNode('a11', 'sourcing-agent', 4300, 425, 'IT Equipment Provisioning', 250, 120, { instructions: 'Order 16-inch MacBook Pro M3 Max and 27-inch 4K Monitor. Ship to candidate home address.' });
        addNode('a12', 'entry-node', 4300, 650, 'Background Check Agent', 250, 120, { instructions: 'Initiate standard background and reference check via API.' });

        addEdge('e1', 'a1', 'a3');
        addEdge('e2', 'a2', 'a3');
        addEdge('e3', 'a3', 'a4');
        addEdge('e4', 'a4', 'a5');
        
        addEdge('e5', 'a5', 'c1');
        addEdge('e6', 'a5', 'c2');
        
        addEdge('e7', 'c1', 'o1');
        addEdge('e8', 'c2', 'o2');
        
        addEdge('e9', 'o1', 'a6');
        addEdge('e10', 'o2', 'a6');
        
        addEdge('e11', 'a6', 'a7');
        addEdge('e12', 'a7', 'c3');
        
        addEdge('e14', 'c3', 'a9');
        addEdge('e15', 'a9', 'a10');
        addEdge('e16', 'a9', 'a11');
        addEdge('e17', 'a9', 'a12');

        const boardData`;

code = code.replace(/if \(roleId === 'role-ophelia-demo'\) \{([\s\S]*?)const boardData/g, replacement);

fs.writeFileSync('src/app/api/boards/[roleId]/route.ts', code);
console.log('Successfully updated route.ts');
