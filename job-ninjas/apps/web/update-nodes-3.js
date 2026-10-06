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

        addNode('a1', 'sourcing-agent', 100, 300, 'LinkedIn Sourcer', 250, 120, { 
            instructions: 'Search LinkedIn for candidates with 5+ years of React and Python experience. Prefer candidates in NY or remote.',
            jobDescription: 'Found 22 potential candidates matching criteria:\\n1. Sarah Chen (Atlanta, GA) - Resume: [PDF]\\n2. David Kim (Seattle, WA) - Resume: [PDF]\\n3. Michael Ross (Austin, TX) - Resume: [PDF]\\n4. Elena Rodriguez (Miami, FL) - Resume: [PDF]\\n[... 18 more candidates]'
        });
        
        addNode('a2', 'sourcing-agent', 100, 550, 'GitHub Sourcer', 250, 120, { 
            instructions: 'Search GitHub for contributors to popular open source Next.js or Python projects.',
            jobDescription: 'Analyzed 500+ GitHub profiles. Top matches:\\n- @sarahc (1.2k commits in Next.js)\\n- @dkim_dev (Maintainer of python-ai-utils)\\n- @erodriguez (Active in langchain)'
        });
        
        addNode('a3', 'resume-verifier', 450, 425, 'Resume Verifier', 250, 120, { 
            instructions: 'Verify resume dates, skills, and past employment history. Flag any gaps > 6 months.',
            jobDescription: 'Verified 22 candidates. 15 passed employment verification. 7 flagged for discrepancies.'
        });

        // 3 Shared Rounds
        addNode('r1', 'culture-fit-interviewer', 800, 100, 'Round 1: Culture Fit', 250, 120, { instructions: 'Assess communication and values for all candidates.' });
        addNode('t1', 'entry-node', 1100, 100, 'Transcript Analyzer (R1)', 250, 120, { instructions: 'Analyze R1 transcript for red flags.', jobDescription: 'David and Sarah showed strong communication and empathy.' });
        
        addNode('r2', 'tech-assessor', 800, 425, 'Round 2: Technical', 250, 120, { instructions: 'Live coding in Python and React for all candidates.' });
        addNode('t2', 'entry-node', 1100, 425, 'Transcript Analyzer (R2)', 250, 120, { instructions: 'Analyze code quality from R2.', jobDescription: 'David passed Python algorithm check. Sarah had flawless execution.' });
        
        addNode('r3', 'tech-assessor', 800, 750, 'Round 3: System Design', 250, 120, { instructions: 'Whiteboard a scalable AI backend for all candidates.' });
        addNode('t3', 'entry-node', 1100, 750, 'Transcript Analyzer (R3)', 250, 120, { instructions: 'Evaluate system design viability.', jobDescription: 'Both candidates demonstrated great distributed systems knowledge.' });
        
        // Finalists
        addNode('c1', 'candidate-node', 1500, 250, 'David Kim', 250, 120, { candidateName: 'David Kim', fromLocation: 'Seattle, WA', toLocation: 'New York, NY', role: 'AI Engineer' });
        addNode('c2', 'candidate-node', 1500, 600, 'Sarah Chen', 250, 120, { candidateName: 'Sarah Chen', fromLocation: 'Atlanta, GA', toLocation: 'New York, NY', role: 'AI Engineer' });
        
        // Ophelia Concierges
        addNode('o1', 'candidate-concierge', 1850, 100, 'Candidate Concierge (David)', 960, 560, { candidateName: 'David Kim', fromLocation: 'Seattle, WA', toLocation: 'New York, NY', date: 'Oct 14', budget: '1200' });
        addNode('o2', 'candidate-concierge', 1850, 700, 'Candidate Concierge (Sarah)', 960, 560, { candidateName: 'Sarah Chen', fromLocation: 'Atlanta, GA', toLocation: 'New York, NY', date: 'Oct 14', budget: '800' });

        // Final Interview
        addNode('a6', 'entry-node', 2900, 425, 'Final Interview Panel', 250, 120, { instructions: 'Conduct 4-hour onsite interview loop. Record feedback from 4 interviewers.' });
        
        // Decision
        addNode('a7', 'offer-negotiator', 3250, 425, 'Decision Engine', 250, 120, { instructions: 'Synthesize feedback. Prepare offer for selected candidate. Negotiate up to 10% above base if pushed.' });
        
        // Selected Candidate
        addNode('c3', 'candidate-node', 3600, 425, 'Sarah Chen (Selected)', 250, 120, { candidateName: 'Sarah Chen', fromLocation: 'Atlanta, GA', toLocation: 'New York, NY', role: 'AI Engineer', status: 'Offer Accepted' });
        
        // Onboarding
        addNode('a9', 'entry-node', 3950, 425, 'Onboarding Coordinator', 250, 120, { instructions: 'Trigger all post-acceptance onboarding tasks across departments.' });
        
        addNode('a10', 'word-doc', 4300, 200, 'Employee Handbook', 250, 120);
        addNode('a11', 'sourcing-agent', 4300, 425, 'IT Equipment Provisioning', 250, 120, { instructions: 'Order 16-inch MacBook Pro M3 Max and 27-inch 4K Monitor. Ship to candidate home address.' });
        addNode('a12', 'entry-node', 4300, 650, 'Background Check Agent', 250, 120, { instructions: 'Initiate standard background and reference check via API.' });

        // Edges
        addEdge('e1', 'a1', 'a3');
        addEdge('e2', 'a2', 'a3');
        
        // From Verifier to Rounds
        addEdge('e3', 'a3', 'r1');
        addEdge('e4', 'a3', 'r2');
        addEdge('e5', 'a3', 'r3');

        // Rounds to Transcripts
        addEdge('e_d1', 'r1', 't1');
        addEdge('e_d2', 'r2', 't2');
        addEdge('e_d3', 'r3', 't3');

        // Transcripts to Candidates
        addEdge('e_c1a', 't1', 'c1');
        addEdge('e_c1b', 't2', 'c1');
        addEdge('e_c1c', 't3', 'c1');
        
        addEdge('e_c2a', 't1', 'c2');
        addEdge('e_c2b', 't2', 'c2');
        addEdge('e_c2c', 't3', 'c2');
        
        // Candidates to Concierge
        addEdge('e_c1', 'c1', 'o1');
        addEdge('e_c2', 'c2', 'o2');
        
        // Concierge to Final Interview
        addEdge('e_o1', 'o1', 'a6');
        addEdge('e_o2', 'o2', 'a6');
        
        // Final to End
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
