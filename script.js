const fs = require('fs');
const file = 'job-ninjas/apps/web/src/app/api/boards/[roleId]/route.ts';
let content = fs.readFileSync(file, 'utf8');

const demoBoardLogic = `
      if (roleId === 'role-ophelia-demo') {
        const LayerType = { Agent: 5 };
        const layers = {};
        const layerIds = [];
        const edges = {};
        const edgeIds = [];

        function addNode(id, role, x, y, value, width=250, height=120) {
          layers[id] = { type: LayerType.Agent, x, y, width, height, fill: { r: 255, g: 255, b: 255 }, agentRole: role, value };
          layerIds.push(id);
        }

        function addEdge(id, from, to) {
          edges[id] = { id, fromNodeId: from, toNodeId: to };
          edgeIds.push(id);
        }

        addNode('a1', 'sourcing-agent', 100, 300, 'LinkedIn Sourcer');
        addNode('a2', 'sourcing-agent', 100, 450, 'GitHub Sourcer');
        addNode('a3', 'resume-verifier', 450, 375, 'Resume Verifier');
        addNode('a4', 'culture-fit-interviewer', 800, 375, 'Phone Screen Agent');
        addNode('a5', 'tech-assessor', 1150, 375, 'Technical Assessor');
        addNode('a6', 'entry-node', 1500, 375, 'Final Interview Panel');
        
        addNode('c1', 'candidate-node', 1500, 150, 'Demo Candidate 1 (Finalist)');
        addNode('c2', 'candidate-node', 1500, 600, 'Sarah Chen (Finalist)');
        
        addNode('a7', 'offer-negotiator', 1900, 375, 'Decision Engine');
        
        addNode('c3', 'candidate-node', 2250, 375, 'Sarah Chen (Selected)');
        
        addNode('a8', 'candidate-concierge', 2600, 150, 'Candidate Concierge (Ophelia)', 960, 560);
        
        addNode('a9', 'entry-node', 3700, 200, 'Onboarding Tasks Generator');
        addNode('a10', 'word-doc', 4050, 200, 'Employee Handbook');
        addNode('a11', 'sourcing-agent', 3700, 400, 'IT Equipment Provisioning');
        addNode('a12', 'entry-node', 4050, 400, 'Background Check Agent');

        addEdge('e1', 'a1', 'a3');
        addEdge('e2', 'a2', 'a3');
        addEdge('e3', 'a3', 'a4');
        addEdge('e4', 'a4', 'a5');
        addEdge('e5', 'a5', 'a6');
        
        addEdge('e6', 'c1', 'a6');
        addEdge('e7', 'c2', 'a6');
        
        addEdge('e8', 'a6', 'a7');
        addEdge('e9', 'a7', 'c3');
        
        addEdge('e10', 'c3', 'a8');
        
        addEdge('e11', 'a8', 'a9');
        addEdge('e12', 'a9', 'a10');
        addEdge('e13', 'a8', 'a11');
        addEdge('e14', 'a11', 'a12');

        const boardData = {
          id: 'demo-ophelia',
          roleId: 'role-ophelia-demo',
          layers,
          layerIds,
          edges,
          edgeIds,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        try {
          board = await prisma.board.create({
            data: {
              roleId: 'role-ophelia-demo',
              layers: JSON.stringify(layers),
              layerIds: JSON.stringify(layerIds),
              edges: JSON.stringify(edges),
              edgeIds: JSON.stringify(edgeIds)
            }
          });
          return NextResponse.json(boardData);
        } catch (dbError) {
          return NextResponse.json(boardData);
        }
      }
`;

content = content.replace(
  "if ((await params).roleId === 'role-fde') {",
  "const roleId = (await params).roleId;\n\n" + demoBoardLogic + "\n\n      if (roleId === 'role-fde') {"
);

content = content.replace(
  "if (request.url.includes('role-fde')) {",
  "if (request.url.includes('role-ophelia-demo')) {\n        const roleId = 'role-ophelia-demo';\n" + demoBoardLogic.replace(/return NextResponse\.json\(boardData\);/g, 'return NextResponse.json(boardData);').replace(/board = await prisma\.board\.create/g, '// no db') + "\n      }\n\n      if (request.url.includes('role-fde')) {"
);

fs.writeFileSync(file, content);
console.log('Successfully added role-ophelia-demo board generation logic.');
