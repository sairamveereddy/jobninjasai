import { NextResponse } from 'next/server';
import { validateWorkdayCredentials } from '@/lib/integrations/workday';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await validateWorkdayCredentials({
      tenantUrl: body.tenantUrl,
      clientId: body.clientId,
      clientSecret: body.clientSecret,
      isDemo: body.isDemo || body.tenantUrl === 'demo',
    });

    if (result.valid) {
      return NextResponse.json({
        success: true,
        tenantName: result.tenantName,
      });
    }

    return NextResponse.json({
      success: false,
      error: result.error || 'Failed to authenticate with Workday',
    }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
