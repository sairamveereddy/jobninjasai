import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { roleId: string } }
) {
  try {
    let board = await prisma.board.findUnique({
      where: {
        roleId: (await params).roleId,
      },
    });

    if (!board) {
      const roleId = (await params).roleId;


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


      if (roleId === 'role-fde') {
        const LayerType = { Agent: 5 };
        const layers: Record<string, any> = {};
        const layerIds: string[] = [];
        const edges: Record<string, any> = {};
        const edgeIds: string[] = [];

        function addNode(id: string, role: string, x: number, y: number, value: string) {
          layers[id] = { type: LayerType.Agent, x, y, width: 250, height: 120, fill: { r: 255, g: 255, b: 255 }, agentRole: role, value };
          layerIds.push(id);
        }

        function addEdge(id: string, from: string, to: string) {
          edges[id] = { id, fromNodeId: from, toNodeId: to };
          edgeIds.push(id);
        }

        addNode('node1', 'entry-node', 100, 300, 'Job Requirements');
        addNode('node2', 'sourcing-agent', 450, 300, 'Sourcing Agent');
        addNode('node3', 'resume-verifier', 800, 300, 'Resume Verifier');
        addNode('node4', 'tech-assessor', 1150, 150, 'Tech Assessor');
        addNode('node5', 'culture-fit-interviewer', 1150, 450, 'Culture Fit');
        addNode('node6', 'offer-negotiator', 1550, 300, 'Offer Negotiator');
        addNode('node7', 'ophelia-agent', 1950, 300, 'Ophelia Automations');
        
        addNode('cand1', 'candidate-node', 800, 500, 'Sarah Chen');
        addNode('cand2', 'candidate-node', 800, 650, 'Demo Candidate 1');
        
        addEdge('e1', 'node1', 'node2');
        addEdge('e2', 'node2', 'node3');
        addEdge('e3', 'node3', 'node4');
        addEdge('e4', 'node3', 'node5');
        addEdge('e5', 'node4', 'node6');
        addEdge('e6', 'node5', 'node6');
        addEdge('e7', 'node6', 'node7');
        addEdge('e8', 'cand1', 'node3');
        addEdge('e9', 'cand2', 'node3');

        try {
          board = await prisma.board.create({
            data: {
              roleId: 'role-fde',
              layers: JSON.stringify(layers),
              layerIds: JSON.stringify(layerIds),
              edges: JSON.stringify(edges),
              edgeIds: JSON.stringify(edgeIds)
            }
          });
        } catch (dbError) {
          // If database fails (e.g. no tables pushed on Vercel), just return the JSON directly so the frontend demo works!
          return NextResponse.json({
            id: 'demo-fde',
            roleId: 'role-fde',
            layers,
            layerIds,
            edges,
            edgeIds,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        }
      } else {
        return NextResponse.json({ error: 'Board not found' }, { status: 404 });
      }
    }

    return NextResponse.json({
      ...board,
      layers: typeof board.layers === 'string' ? JSON.parse(board.layers) : board.layers,
      layerIds: typeof board.layerIds === 'string' ? JSON.parse(board.layerIds) : board.layerIds,
      edges: typeof board.edges === 'string' ? JSON.parse(board.edges || "{}") : (board.edges || {}),
      edgeIds: typeof board.edgeIds === 'string' ? JSON.parse(board.edgeIds || "[]") : (board.edgeIds || []),
    });
  } catch (error) {
    console.error('Error fetching board:', error);
    
    // Ultimate fallback for Demo Board if Database throws on findUnique
    if (request.url.includes('role-ophelia-demo')) {
        const roleId = 'role-ophelia-demo';

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
          
          return NextResponse.json(boardData);
        } catch (dbError) {
          return NextResponse.json(boardData);
        }
      }

      if (request.url.includes('role-fde')) {
        const LayerType = { Agent: 5 };
        const layers: Record<string, any> = {};
        const layerIds: string[] = [];
        const edges: Record<string, any> = {};
        const edgeIds: string[] = [];

        function addNode(id: string, role: string, x: number, y: number, value: string) {
          layers[id] = { type: LayerType.Agent, x, y, width: 250, height: 120, fill: { r: 255, g: 255, b: 255 }, agentRole: role, value };
          layerIds.push(id);
        }

        function addEdge(id: string, from: string, to: string) {
          edges[id] = { id, fromNodeId: from, toNodeId: to };
          edgeIds.push(id);
        }

        addNode('node1', 'entry-node', 100, 300, 'Job Requirements');
        addNode('node2', 'sourcing-agent', 450, 300, 'Sourcing Agent');
        addNode('node3', 'resume-verifier', 800, 300, 'Resume Verifier');
        addNode('node4', 'tech-assessor', 1150, 150, 'Tech Assessor');
        addNode('node5', 'culture-fit-interviewer', 1150, 450, 'Culture Fit');
        addNode('node6', 'offer-negotiator', 1550, 300, 'Offer Negotiator');
        addNode('node7', 'ophelia-agent', 1950, 300, 'Ophelia Automations');
        
        addNode('cand1', 'candidate-node', 800, 500, 'Sarah Chen');
        addNode('cand2', 'candidate-node', 800, 650, 'Demo Candidate 1');
        
        addEdge('e1', 'node1', 'node2');
        addEdge('e2', 'node2', 'node3');
        addEdge('e3', 'node3', 'node4');
        addEdge('e4', 'node3', 'node5');
        addEdge('e5', 'node4', 'node6');
        addEdge('e6', 'node5', 'node6');
        addEdge('e7', 'node6', 'node7');
        addEdge('e8', 'cand1', 'node3');
        addEdge('e9', 'cand2', 'node3');
        
        return NextResponse.json({
            id: 'demo-fde',
            roleId: 'role-fde',
            layers,
            layerIds,
            edges,
            edgeIds,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });
    }

    return NextResponse.json(
      { error: 'Failed to fetch board' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { roleId: string } }
) {
  try {
    const body = await request.json();
    const { layers, layerIds, edges, edgeIds } = body;

    const board = await prisma.board.upsert({
      where: {
        roleId: (await params).roleId,
      },
      update: {
        layers: JSON.stringify(layers),
        layerIds: JSON.stringify(layerIds),
        edges: JSON.stringify(edges || {}),
        edgeIds: JSON.stringify(edgeIds || []),
      },
      create: {
        roleId: (await params).roleId,
        layers: JSON.stringify(layers),
        layerIds: JSON.stringify(layerIds),
        edges: JSON.stringify(edges || {}),
        edgeIds: JSON.stringify(edgeIds || []),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving board:', error);
    return NextResponse.json(
      { error: 'Failed to save board' },
      { status: 500 }
    );
  }
}

