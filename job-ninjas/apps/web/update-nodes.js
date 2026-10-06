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

        // 3 Rounds for David Kim
        addNode('d_r1', 'culture-fit-interviewer', 800, 100, 'Round 1: Culture Fit (David)', 250, 120, { instructions: 'Assess communication and values.' });
        addNode('d_t1', 'entry-node', 1100, 100, 'Transcript Analyzer (R1)', 250, 120, { instructions: 'Analyze R1 transcript for red flags.', jobDescription: 'Candidate shows strong communication and empathy.' });
        
        addNode('d_r2', 'tech-assessor', 800, 250, 'Round 2: Technical (David)', 250, 120, { instructions: 'Live coding in Python and React.' });
        addNode('d_t2', 'entry-node', 1100, 250, 'Transcript Analyzer (R2)', 250, 120, { instructions: 'Analyze code quality from R2.', jobDescription: 'Passed Python algorithm check. React hooks knowledge was average.' });
        
        addNode('d_r3', 'tech-assessor', 800, 400, 'Round 3: System Design (David)', 250, 120, { instructions: 'Whiteboard a scalable AI backend.' });
        addNode('d_t3', 'entry-node', 1100, 400, 'Transcript Analyzer (R3)', 250, 120, { instructions: 'Evaluate system design viability.', jobDescription: 'Solid architecture but missed some edge cases with rate limiting.' });
        
        addNode('c1', 'candidate-node', 1400, 250, 'David Kim', 250, 120, { candidateName: 'David Kim', fromLocation: 'Seattle, WA', toLocation: 'New York, NY', role: 'AI Engineer' });

        // 3 Rounds for Sarah Chen
        addNode('s_r1', 'culture-fit-interviewer', 800, 600, 'Round 1: Culture Fit (Sarah)', 250, 120, { instructions: 'Assess communication and values.' });
        addNode('s_t1', 'entry-node', 1100, 600, 'Transcript Analyzer (R1)', 250, 120, { instructions: 'Analyze R1 transcript for red flags.', jobDescription: 'Exceptional answers regarding team conflict resolution.' });
        
        addNode('s_r2', 'tech-assessor', 800, 750, 'Round 2: Technical (Sarah)', 250, 120, { instructions: 'Live coding in Python and React.' });
        addNode('s_t2', 'entry-node', 1100, 750, 'Transcript Analyzer (R2)', 250, 120, { instructions: 'Analyze code quality from R2.', jobDescription: 'Flawless execution. Wrote custom React hooks seamlessly.' });
        
        addNode('s_r3', 'tech-assessor', 800, 900, 'Round 3: System Design (Sarah)', 250, 120, { instructions: 'Whiteboard a scalable AI backend.' });
        addNode('s_t3', 'entry-node', 1100, 900, 'Transcript Analyzer (R3)', 250, 120, { instructions: 'Evaluate system design viability.', jobDescription: 'Great distributed systems knowledge.' });

        addNode('c2', 'candidate-node', 1400, 750, 'Sarah Chen', 250, 120, { candidateName: 'Sarah Chen', fromLocation: 'Atlanta, GA', toLocation: 'New York, NY', role: 'AI Engineer' });
        
        // Ophelia Concierges
        addNode('o1', 'candidate-concierge', 1750, 100, 'Candidate Concierge (David)', 960, 560, { candidateName: 'David Kim', fromLocation: 'Seattle, WA', toLocation: 'New York, NY', date: 'Oct 14', budget: '1200' });
        addNode('o2', 'candidate-concierge', 1750, 700, 'Candidate Concierge (Sarah)', 960, 560, { candidateName: 'Sarah Chen', fromLocation: 'Atlanta, GA', toLocation: 'New York, NY', date: 'Oct 14', budget: '800' });

        // Final Interview
        addNode('a6', 'entry-node', 2800, 425, 'Final Interview Panel', 250, 120, { instructions: 'Conduct 4-hour onsite interview loop. Record feedback from 4 interviewers.' });
        
        // Decision
        addNode('a7', 'offer-negotiator', 3150, 425, 'Decision Engine', 250, 120, { instructions: 'Synthesize feedback. Prepare offer for selected candidate. Negotiate up to 10% above base if pushed.' });
        
        // Selected Candidate
        addNode('c3', 'candidate-node', 3500, 425, 'Sarah Chen (Selected)', 250, 120, { candidateName: 'Sarah Chen', fromLocation: 'Atlanta, GA', toLocation: 'New York, NY', role: 'AI Engineer', status: 'Offer Accepted' });
        
        // Onboarding
        addNode('a9', 'entry-node', 3850, 425, 'Onboarding Coordinator', 250, 120, { instructions: 'Trigger all post-acceptance onboarding tasks across departments.' });
        
        addNode('a10', 'word-doc', 4200, 200, 'Employee Handbook', 250, 120);
        addNode('a11', 'sourcing-agent', 4200, 425, 'IT Equipment Provisioning', 250, 120, { instructions: 'Order 16-inch MacBook Pro M3 Max and 27-inch 4K Monitor. Ship to candidate home address.' });
        addNode('a12', 'entry-node', 4200, 650, 'Background Check Agent', 250, 120, { instructions: 'Initiate standard background and reference check via API.' });

        // Edges
        addEdge('e1', 'a1', 'a3');
        addEdge('e2', 'a2', 'a3');
        
        // From Verifier to Rounds
        addEdge('e3', 'a3', 'd_r1');
        addEdge('e4', 'a3', 'd_r2');
        addEdge('e5', 'a3', 'd_r3');
        
        addEdge('e6', 'a3', 's_r1');
        addEdge('e7', 'a3', 's_r2');
        addEdge('e8', 'a3', 's_r3');

        // Rounds to Transcripts
        addEdge('e_d1', 'd_r1', 'd_t1');
        addEdge('e_d2', 'd_r2', 'd_t2');
        addEdge('e_d3', 'd_r3', 'd_t3');

        addEdge('e_s1', 's_r1', 's_t1');
        addEdge('e_s2', 's_r2', 's_t2');
        addEdge('e_s3', 's_r3', 's_t3');

        // Transcripts to Candidate
        addEdge('e_d4', 'd_t1', 'c1');
        addEdge('e_d5', 'd_t2', 'c1');
        addEdge('e_d6', 'd_t3', 'c1');

        addEdge('e_s4', 's_t1', 'c2');
        addEdge('e_s5', 's_t2', 'c2');
        addEdge('e_s6', 's_t3', 'c2');
        
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
