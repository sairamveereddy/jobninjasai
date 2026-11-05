import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export interface BoardCollaborator {
  id: string;
  email: string;
  name: string;
  role: 'owner' | 'editor' | 'viewer';
  avatar?: string;
  invitedAt: string;
  status: 'active' | 'pending';
}

const DEFAULT_COLLABORATORS: BoardCollaborator[] = [
  {
    id: 'owner-1',
    email: 'hiring-manager@jobninjas.ai',
    name: 'You (Hiring Manager)',
    role: 'owner',
    invitedAt: new Date().toISOString(),
    status: 'active',
  },
  {
    id: 'collab-2',
    email: 'sarah.lin@company.com',
    name: 'Sarah Lin (Lead Recruiter)',
    role: 'editor',
    invitedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    status: 'active',
  },
  {
    id: 'collab-3',
    email: 'rad.eng@company.com',
    name: 'Rad (VP Engineering)',
    role: 'viewer',
    invitedAt: new Date(Date.now() - 86400000).toISOString(),
    status: 'active',
  },
];

export async function GET(
  request: Request,
  { params }: { params: Promise<{ roleId: string }> }
) {
  try {
    const { roleId } = await params;
    const board = await prisma.board.findUnique({
      where: { roleId },
    });

    let collaborators = DEFAULT_COLLABORATORS;

    if (board && board.layers) {
      const parsed = typeof board.layers === 'string' ? JSON.parse(board.layers) : board.layers;
      if (parsed?.__collaborators && Array.isArray(parsed.__collaborators)) {
        collaborators = parsed.__collaborators;
      }
    }

    const { searchParams } = new URL(request.url);
    const host = request.headers.get('host') || 'jobninjas.ai';
    const protocol = host.includes('localhost') ? 'http' : 'https';

    return NextResponse.json({
      success: true,
      roleId,
      collaborators,
      shareLink: `${protocol}://${host}/roles/${roleId}/board`,
      inviteTokens: {
        viewer: `${protocol}://${host}/roles/${roleId}/board?role=viewer`,
        editor: `${protocol}://${host}/roles/${roleId}/board?role=editor`,
        owner: `${protocol}://${host}/roles/${roleId}/board?role=owner`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ roleId: string }> }
) {
  try {
    const { roleId } = await params;
    const body = await request.json();
    const { email, role = 'viewer', name } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json({ success: false, error: 'Valid email required' }, { status: 400 });
    }

    const board = await prisma.board.findUnique({
      where: { roleId },
    });

    let currentLayers: Record<string, any> = {};
    let collaborators: BoardCollaborator[] = [...DEFAULT_COLLABORATORS];

    if (board && board.layers) {
      currentLayers = typeof board.layers === 'string' ? JSON.parse(board.layers) : board.layers;
      if (Array.isArray(currentLayers.__collaborators)) {
        collaborators = currentLayers.__collaborators;
      }
    }

    // Check if already invited
    const existingIndex = collaborators.findIndex((c) => c.email.toLowerCase() === email.toLowerCase());
    const newCollab: BoardCollaborator = {
      id: existingIndex >= 0 ? collaborators[existingIndex].id : `collab-${Date.now()}`,
      email,
      name: name || email.split('@')[0],
      role: role as 'owner' | 'editor' | 'viewer',
      invitedAt: new Date().toISOString(),
      status: 'active',
    };

    if (existingIndex >= 0) {
      collaborators[existingIndex] = newCollab;
    } else {
      collaborators.push(newCollab);
    }

    currentLayers.__collaborators = collaborators;

    if (board) {
      await prisma.board.update({
        where: { roleId },
        data: {
          layers: currentLayers,
        },
      });
    }

    return NextResponse.json({
      success: true,
      collaborator: newCollab,
      collaborators,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ roleId: string }> }
) {
  try {
    const { roleId } = await params;
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email parameter required' }, { status: 400 });
    }

    const board = await prisma.board.findUnique({
      where: { roleId },
    });

    if (board && board.layers) {
      const currentLayers = typeof board.layers === 'string' ? JSON.parse(board.layers) : board.layers;
      if (Array.isArray(currentLayers.__collaborators)) {
        currentLayers.__collaborators = currentLayers.__collaborators.filter(
          (c: BoardCollaborator) => c.email.toLowerCase() !== email.toLowerCase()
        );

        await prisma.board.update({
          where: { roleId },
          data: { layers: currentLayers },
        });

        return NextResponse.json({ success: true, collaborators: currentLayers.__collaborators });
      }
    }

    return NextResponse.json({ success: true, message: 'Collaborator removed' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}
