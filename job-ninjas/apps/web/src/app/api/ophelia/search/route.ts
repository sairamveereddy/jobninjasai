import { NextResponse } from 'next/server';
import { ophelia } from '../../../../lib/ophelia/client';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, ...payload } = body;

    if (action === 'availability') {
      const result = await ophelia.checkAvailability(payload);
      return NextResponse.json({ result, practiceMode: ophelia.practiceMode });
    }

    // Default: venue search
    const results = await ophelia.searchVenues({
      vertical: 'travel',
      providers: ['hotels'],
      location: payload.destination || payload.location || 'New York, NY',
      check_in: payload.checkIn || payload.check_in || '2026-10-14',
      check_out: payload.checkOut || payload.check_out || '2026-10-15',
      party_size: payload.party_size || 1,
      rooms: payload.rooms || 1,
      budget: payload.budget,
      term: payload.term
    });
    return NextResponse.json({ results, practiceMode: ophelia.practiceMode });
  } catch (error: any) {
    console.error('Ophelia search error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
