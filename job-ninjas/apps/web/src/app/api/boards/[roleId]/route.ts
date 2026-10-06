import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { roleId: string } }
) {
  try {
    const board = await prisma.board.findUnique({
      where: {
        roleId: (await params).roleId,
      },
    });

    if (!board) {
      return NextResponse.json({ error: 'Board not found' }, { status: 404 });
    }

    return NextResponse.json({
      ...board,
      layers: JSON.parse(board.layers),
      layerIds: JSON.parse(board.layerIds),
      edges: JSON.parse(board.edges || "{}"),
      edgeIds: JSON.parse(board.edgeIds || "[]"),
    });
  } catch (error) {
    console.error('Error fetching board:', error);
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

