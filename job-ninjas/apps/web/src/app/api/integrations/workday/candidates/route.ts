import { NextResponse } from 'next/server';
import { getConnectorConfig } from '@/lib/integrations/connector-service';
import { getWorkdayCandidates, getWorkdayRequisitions } from '@/lib/integrations/workday';

export async function POST(req: Request) {
  try {
    const { requisitionId } = await req.json().catch(() => ({}));
    const connector = await getConnectorConfig('', 'WORKDAY');

    const config = {
      tenantUrl: connector.settings?.tenantUrl || 'demo',
      isDemo: connector.settings?.isDemo ?? true,
    };

    const requisitions = await getWorkdayRequisitions(config);
    const candidates = await getWorkdayCandidates(config, requisitionId);

    return NextResponse.json({
      success: true,
      requisitions,
      candidates,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
