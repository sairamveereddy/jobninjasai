import { PrismaClient } from './job-ninjas/apps/web/node_modules/@prisma/client/index.js';
const prisma = new PrismaClient();

async function main() {
  const LayerType = {
    Rectangle: 0,
    Ellipse: 1,
    Path: 2,
    Text: 3,
    Note: 4,
    Agent: 5,
    Image: 6,
    Slide: 7,
  };

  const layers = {};
  const layerIds = [];
  const edges = {};
  const edgeIds = [];

  function addNode(id, role, x, y, value) {
    layers[id] = {
      type: LayerType.Agent,
      x, y,
      width: 250, height: 120,
      fill: { r: 255, g: 255, b: 255 },
      agentRole: role,
      value
    };
    layerIds.push(id);
  }

  function addEdge(id, from, to) {
    edges[id] = { id, fromNodeId: from, toNodeId: to };
    edgeIds.push(id);
  }

  // Define nodes
  addNode('node1', 'entry-node', 100, 300, 'Job Requirements');
  addNode('node2', 'sourcing-agent', 450, 300, 'Sourcing Agent');
  addNode('node3', 'resume-verifier', 800, 300, 'Resume Verifier');
  addNode('node4', 'tech-assessor', 1150, 150, 'Tech Assessor');
  addNode('node5', 'culture-fit-interviewer', 1150, 450, 'Culture Fit');
  addNode('node6', 'offer-negotiator', 1550, 300, 'Offer Negotiator');
  addNode('node7', 'ophelia-agent', 1950, 300, 'Ophelia Automations');
  
  // Candidates attached
  addNode('cand1', 'candidate-node', 800, 500, 'Sarah Chen');
  addNode('cand2', 'candidate-node', 800, 650, 'Demo Candidate 1');
  
  // Connections
  addEdge('e1', 'node1', 'node2');
  addEdge('e2', 'node2', 'node3');
  addEdge('e3', 'node3', 'node4');
  addEdge('e4', 'node3', 'node5');
  addEdge('e5', 'node4', 'node6');
  addEdge('e6', 'node5', 'node6');
  addEdge('e7', 'node6', 'node7');

  addEdge('e8', 'cand1', 'node3'); // Sarah going into Resume Verifier
  addEdge('e9', 'cand2', 'node3');

  await prisma.board.upsert({
    where: { roleId: 'role-fde' },
    update: {
      layers: JSON.stringify(layers),
      layerIds: JSON.stringify(layerIds),
      edges: JSON.stringify(edges),
      edgeIds: JSON.stringify(edgeIds)
    },
    create: {
      roleId: 'role-fde',
      layers: JSON.stringify(layers),
      layerIds: JSON.stringify(layerIds),
      edges: JSON.stringify(edges),
      edgeIds: JSON.stringify(edgeIds)
    }
  });

  console.log("FDE board created!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
