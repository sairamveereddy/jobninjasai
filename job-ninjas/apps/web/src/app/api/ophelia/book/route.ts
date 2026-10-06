import { NextResponse } from 'next/server';
import { ophelia } from '../../../../lib/ophelia/client';

export async function POST(request: Request) {
  try {
    const { hotelId, candidateDetails } = await request.json();
    const result = await ophelia.bookHotel(hotelId, candidateDetails);
    
    if (result.status === 'failed') {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Ophelia booking error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
