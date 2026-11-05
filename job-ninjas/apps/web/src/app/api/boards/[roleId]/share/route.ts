import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { resolveRole } from '@/lib/role-resolver';
import { slugifyRole } from '@/lib/slug';

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
    email: 'demo@jobninjas.ai',
    name: 'You (Demo Hiring Lead)',
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
    const resolvedRole = await resolveRole(roleId);
    const targetRoleId = resolvedRole?.id || roleId;
    const slug = resolvedRole ? slugifyRole(resolvedRole.title) : targetRoleId;

    const board = await prisma.board.findUnique({
      where: { roleId: targetRoleId },
    });

    let collaborators = DEFAULT_COLLABORATORS;

    if (board && board.layers) {
      const parsed = typeof board.layers === 'string' ? JSON.parse(board.layers) : board.layers;
      if (parsed?.__collaborators && Array.isArray(parsed.__collaborators)) {
        collaborators = parsed.__collaborators;
      }
    }

    const host = request.headers.get('host') || 'jobninjas.ai';
    const protocol = host.includes('localhost') ? 'http' : 'https';

    const baseUrl = `${protocol}://${host}/roles/${slug}/board`;

    return NextResponse.json({
      success: true,
      roleId: targetRoleId,
      roleTitle: resolvedRole?.title || '',
      slug,
      collaborators,
      shareLink: baseUrl,
      inviteTokens: {
        viewer: `${baseUrl}?role=viewer`,
        editor: `${baseUrl}?role=editor`,
        owner: `${baseUrl}?role=owner`,
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
    const resolvedRole = await resolveRole(roleId);
    const targetRoleId = resolvedRole?.id || roleId;

    const body = await request.json();
    const { email, role = 'viewer', name } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json({ success: false, error: 'Valid email required' }, { status: 400 });
    }

    const board = await prisma.board.findUnique({
      where: { roleId: targetRoleId },
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
    const cleanEmail = email.trim().toLowerCase();
    const existingIndex = collaborators.findIndex((c) => c.email.toLowerCase() === cleanEmail);
    const newCollab: BoardCollaborator = {
      id: existingIndex >= 0 ? collaborators[existingIndex].id : `collab-${Date.now()}`,
      email: cleanEmail,
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
        where: { roleId: targetRoleId },
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
    const resolvedRole = await resolveRole(roleId);
    const targetRoleId = resolvedRole?.id || roleId;

    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email parameter required' }, { status: 400 });
    }

    const board = await prisma.board.findUnique({
      where: { roleId: targetRoleId },
    });

    if (board && board.layers) {
      const currentLayers = typeof board.layers === 'string' ? JSON.parse(board.layers) : board.layers;
      if (Array.isArray(currentLayers.__collaborators)) {
        currentLayers.__collaborators = currentLayers.__collaborators.filter(
          (c: BoardCollaborator) => c.email.toLowerCase() !== email.toLowerCase()
        );

        await prisma.board.update({
          where: { roleId: targetRoleId },
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
