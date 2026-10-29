import { NextResponse } from 'next/server';
import { listAllConnectors } from '@/lib/integrations/connector-service';

export async function GET() {
  try {
    const connectors = await listAllConnectors('');
    return NextResponse.json({
      success: true,
      connectors,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
