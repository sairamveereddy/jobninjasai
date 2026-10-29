import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getConnectorConfig } from '@/lib/integrations/connector-service';

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization') || req.headers.get('x-webhook-secret') || '';
    const config = await getConnectorConfig('', 'GENERIC_WEBHOOK');

    // Optional secret verification if configured
    if (config.settings?.inboundSecret && authHeader && !authHeader.includes(config.settings.inboundSecret)) {
      return NextResponse.json({ success: false, error: 'Unauthorized webhook secret' }, { status: 401 });
    }

    const payload = await req.json();
    const { firstName, lastName, email, roleId, resumeText, location, linkedinUrl } = payload;

    if (!firstName || !lastName || !email) {
      return NextResponse.json({
        success: false,
        error: 'Candidate firstName, lastName, and email are required.',
      }, { status: 400 });
    }

    let createdId = `cand_wh_${Date.now()}`;
    let roleAssigned = roleId;

    if (prisma && prisma.candidate) {
      // Find default role if none provided
      if (!roleAssigned) {
        const firstRole = await prisma.role.findFirst();
        roleAssigned = firstRole?.id || 'default-role';
      }

      const defaultOrg = await prisma.organization.findFirst();
      const orgId = defaultOrg ? defaultOrg.id : 'default-org';

      const candidate = await prisma.candidate.create({
        data: {
          organizationId: orgId,
          roleId: roleAssigned,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          location: location || null,
          linkedinUrl: linkedinUrl || null,
          resumeText: resumeText || null,
          stage: 'APPLIED',
        },
      });
      createdId = candidate.id;
    }

    return NextResponse.json({
      success: true,
      candidateId: createdId,
      message: `Candidate ${firstName} ${lastName} ingested via Webhook into role ${roleAssigned}.`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
