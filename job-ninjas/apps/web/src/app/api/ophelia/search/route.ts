import { NextResponse } from 'next/server';
import { ophelia } from '../../../../lib/ophelia/client';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const results = await ophelia.searchHotels(body);
    return NextResponse.json({ results });
  } catch (error: any) {
    console.error('Ophelia search error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
