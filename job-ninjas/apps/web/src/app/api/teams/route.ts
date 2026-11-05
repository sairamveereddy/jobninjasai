import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { slugifyRole } from '@/lib/slug';

export interface TeamMember {
  id: string;
  email: string;
  name: string;
  role: 'owner' | 'admin' | 'hiring_manager' | 'recruiter' | 'interviewer';
  avatar?: string;
  joinedAt: string;
  status: 'active' | 'invited';
}

export interface TeamBoardRef {
  roleId: string;
  title: string;
  slug: string;
  department: string;
  accessRule: 'all_team' | 'selected_only';
  allowedMembers: string[]; // member emails
  editors: string[]; // member emails who can edit
  createdAt: string;
}

export interface Team {
  id: string;
  name: string;
  slug: string;
  domain: string;
  description: string;
  createdAt: string;
  createdById: string;
  members: TeamMember[];
  boards: TeamBoardRef[];
}

// In-memory persistent store with defaults for demo
let teamsStore: Team[] = [
  {
    id: 'team-engineering-1',
    name: 'AI & Engineering Hiring Squad',
    slug: 'ai-engineering-squad',
    domain: 'jobninjas.ai',
    description: 'Autonomous multi-agent pipelines for ML, backend infrastructure, and full-stack engineering roles.',
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
    createdById: 'demo@jobninjas.ai',
    members: [
      {
        id: 'member-1',
        email: 'demo@jobninjas.ai',
        name: 'Alex Mercer (Hiring Lead)',
        role: 'owner',
        joinedAt: new Date(Date.now() - 86400000 * 14).toISOString(),
        status: 'active',
      },
      {
        id: 'member-2',
        email: 'sarah.lin@company.com',
        name: 'Sarah Lin',
        role: 'recruiter',
        joinedAt: new Date(Date.now() - 86400000 * 10).toISOString(),
        status: 'active',
      },
      {
        id: 'member-3',
        email: 'rad.vance@linear.app',
        name: 'Rad Vance',
        role: 'hiring_manager',
        joinedAt: new Date(Date.now() - 86400000 * 8).toISOString(),
        status: 'active',
      },
      {
        id: 'member-4',
        email: 'marcus.eng@jobninjas.ai',
        name: 'Marcus Vance',
        role: 'interviewer',
        joinedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
        status: 'active',
      },
    ],
    boards: [
      {
        roleId: '170a8b7d-e515-46be-841f-b1d3a67567a0',
        title: 'ai agentic developer',
        slug: 'ai-agentic-developer',
        department: 'Engineering',
        accessRule: 'all_team',
        allowedMembers: ['demo@jobninjas.ai', 'sarah.lin@company.com', 'rad.vance@linear.app', 'marcus.eng@jobninjas.ai'],
        editors: ['demo@jobninjas.ai', 'sarah.lin@company.com', 'rad.vance@linear.app'],
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      },
      {
        roleId: '5fad4588-b080-47af-9702-95f7e1bc1764',
        title: 'AI Engineer',
        slug: 'ai-engineer',
        department: 'Engineering',
        accessRule: 'all_team',
        allowedMembers: ['demo@jobninjas.ai', 'sarah.lin@company.com', 'rad.vance@linear.app'],
        editors: ['demo@jobninjas.ai', 'sarah.lin@company.com'],
        createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
      },
    ],
  },
  {
    id: 'team-executive-2',
    name: 'Executive & Staff Hiring Ops',
    slug: 'executive-staff-ops',
    domain: 'linear.app',
    description: 'High-conviction executive search and cross-functional leadership evaluation.',
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    createdById: 'demo@jobninjas.ai',
    members: [
      {
        id: 'm-exec-1',
        email: 'demo@jobninjas.ai',
        name: 'Demo Lead',
        role: 'owner',
        joinedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
        status: 'active',
      },
      {
        id: 'm-exec-2',
        email: 'rad.vance@linear.app',
        name: 'Rad Vance (VP Engineering)',
        role: 'admin',
        joinedAt: new Date(Date.now() - 86400000 * 6).toISOString(),
        status: 'active',
      },
    ],
    boards: [
      {
        roleId: '4bb7b085-b0de-4ec6-b68f-f0efca029ee1',
        title: 'Lead Full-Stack Engineer',
        slug: 'lead-full-stack-engineer',
        department: 'Product Engineering',
        accessRule: 'selected_only',
        allowedMembers: ['demo@jobninjas.ai', 'rad.vance@linear.app'],
        editors: ['demo@jobninjas.ai', 'rad.vance@linear.app'],
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      },
    ],
  },
];

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      teams: teamsStore,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action } = body;

    // 1. Create a board under a team with custom member access
    if (action === 'create_board') {
      const { 
        teamId, 
        title, 
        department = 'Engineering', 
        location = 'Remote', 
        hiringManager = 'Hiring Manager',
        jobDescription = '',
        accessRule = 'all_team',
        allowedMembers = [],
        editors = []
      } = body;

      if (!title || !teamId) {
        return NextResponse.json({ success: false, error: 'Title and Team ID required' }, { status: 400 });
      }

      const team = teamsStore.find((t) => t.id === teamId);
      if (!team) {
        return NextResponse.json({ success: false, error: 'Team not found' }, { status: 404 });
      }

      // 1. Resolve default organization
      let organization = await prisma.organization.findFirst();
      if (!organization) {
        organization = await prisma.organization.create({
          data: {
            name: team.name,
            domain: team.domain,
          },
        });
      }

      // 2. Create Role in DB
      const role = await prisma.role.create({
        data: {
          organizationId: organization.id,
          title,
          department,
          location,
          hiringManager,
          jobDescription,
          status: 'open',
        },
      });

      // 3. Setup Collaborator list for this board based on access selections
      const boardCollaborators = team.members.map((m) => {
        const canAccess = accessRule === 'all_team' || allowedMembers.includes(m.email);
        const canEdit = accessRule === 'all_team' ? true : editors.includes(m.email);
        return {
          id: `collab-${m.id}`,
          email: m.email,
          name: m.name,
          role: canEdit ? ('editor' as const) : ('viewer' as const),
          invitedAt: new Date().toISOString(),
          status: canAccess ? ('active' as const) : ('pending' as const),
        };
      });

      // 4. Create Board in DB
      await prisma.board.create({
        data: {
          organizationId: organization.id,
          roleId: role.id,
          layers: JSON.stringify({
            __collaborators: boardCollaborators,
          }),
          layerIds: JSON.stringify([]),
          edges: JSON.stringify({}),
          edgeIds: JSON.stringify([]),
        },
      });

      const slug = slugifyRole(role.title);
      const newBoardRef: TeamBoardRef = {
        roleId: role.id,
        title: role.title,
        slug,
        department,
        accessRule,
        allowedMembers: accessRule === 'all_team' ? team.members.map((m) => m.email) : allowedMembers,
        editors: accessRule === 'all_team' ? team.members.map((m) => m.email) : editors,
        createdAt: new Date().toISOString(),
      };

      team.boards.unshift(newBoardRef);

      return NextResponse.json({
        success: true,
        role: {
          ...role,
          slug,
        },
        boardRef: newBoardRef,
        boardUrl: `/roles/${slug}/board`,
      });
    }

    // 2. Create a new Team
    const { name, domain = 'jobninjas.ai', description = '', initialEmails = [] } = body;
    if (!name) {
      return NextResponse.json({ success: false, error: 'Team name is required' }, { status: 400 });
    }

    const teamId = `team-${Date.now()}`;
    const slug = slugifyRole(name);

    const members: TeamMember[] = [
      {
        id: `mem-${Date.now()}-1`,
        email: 'demo@jobninjas.ai',
        name: 'Demo Lead',
        role: 'owner',
        joinedAt: new Date().toISOString(),
        status: 'active',
      },
    ];

    if (Array.isArray(initialEmails)) {
      initialEmails.forEach((emailStr: string, idx: number) => {
        const clean = emailStr.trim().toLowerCase();
        if (clean && clean.includes('@') && clean !== 'demo@jobninjas.ai') {
          members.push({
            id: `mem-${Date.now()}-${idx + 2}`,
            email: clean,
            name: clean.split('@')[0],
            role: 'recruiter',
            joinedAt: new Date().toISOString(),
            status: 'active',
          });
        }
      });
    }

    const newTeam: Team = {
      id: teamId,
      name,
      slug,
      domain,
      description,
      createdAt: new Date().toISOString(),
      createdById: 'demo@jobninjas.ai',
      members,
      boards: [],
    };

    teamsStore.unshift(newTeam);

    return NextResponse.json({
      success: true,
      team: newTeam,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { action, teamId } = body;

    const team = teamsStore.find((t) => t.id === teamId);
    if (!team) {
      return NextResponse.json({ success: false, error: 'Team not found' }, { status: 404 });
    }

    // Add Member
    if (action === 'add_member') {
      const { email, role = 'recruiter', name } = body;
      if (!email || !email.includes('@')) {
        return NextResponse.json({ success: false, error: 'Valid email required' }, { status: 400 });
      }

      const cleanEmail = email.trim().toLowerCase();
      const existing = team.members.find((m) => m.email.toLowerCase() === cleanEmail);
      if (existing) {
        existing.role = role;
        return NextResponse.json({ success: true, member: existing, team });
      }

      const newMember: TeamMember = {
        id: `mem-${Date.now()}`,
        email: cleanEmail,
        name: name || cleanEmail.split('@')[0],
        role,
        joinedAt: new Date().toISOString(),
        status: 'active',
      };

      team.members.push(newMember);
      return NextResponse.json({ success: true, member: newMember, team });
    }

    // Remove Member
    if (action === 'remove_member') {
      const { email } = body;
      team.members = team.members.filter((m) => m.email.toLowerCase() !== email.toLowerCase());
      return NextResponse.json({ success: true, team });
    }

    // Update Board Access Rule
    if (action === 'update_board_access') {
      const { roleId, accessRule, allowedMembers, editors } = body;
      const bRef = team.boards.find((b) => b.roleId === roleId);
      if (bRef) {
        if (accessRule) bRef.accessRule = accessRule;
        if (allowedMembers) bRef.allowedMembers = allowedMembers;
        if (editors) bRef.editors = editors;

        // Also sync with Board Collaborators in DB
        const board = await prisma.board.findUnique({ where: { roleId } });
        if (board && board.layers) {
          const currentLayers = typeof board.layers === 'string' ? JSON.parse(board.layers) : board.layers;
          const updatedCollabs = team.members
            .filter((m) => (accessRule === 'all_team' ? true : allowedMembers.includes(m.email)))
            .map((m) => ({
              id: `collab-${m.id}`,
              email: m.email,
              name: m.name,
              role: (accessRule === 'all_team' || editors.includes(m.email) ? 'editor' : 'viewer') as 'editor' | 'viewer',
              invitedAt: new Date().toISOString(),
              status: 'active' as const,
            }));
          currentLayers.__collaborators = updatedCollabs;
          await prisma.board.update({
            where: { roleId },
            data: { layers: currentLayers },
          });
        }
      }
      return NextResponse.json({ success: true, team });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}
