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

    if (payload.providers?.includes('flights')) {
      const isSea = payload.location?.includes('SEA') || payload.origin?.includes('SEA') || payload.destination?.includes('SEA');
      const results = [
        { airline: isSea ? 'Alaska Airlines' : 'Delta Airlines', time: '08:00 AM - ' + (isSea ? '04:15 PM' : '10:15 AM'), price: isSea ? '$485' : '$245', type: 'Direct', id: 'f1' },
        { airline: 'American Airlines', time: '09:30 AM - ' + (isSea ? '05:45 PM' : '11:45 AM'), price: isSea ? '$410' : '$210', type: '1 Stop', id: 'f2' }
      ];
      await new Promise(r => setTimeout(r, 1200)); // simulate latency
      return NextResponse.json({ results, practiceMode: ophelia.practiceMode });
    }

    if (payload.providers?.includes('dining')) {
      const isSea = payload.location?.includes('SEA') || payload.origin?.includes('SEA') || payload.destination?.includes('SEA');
      const results = [
        { name: isSea ? 'The Modern' : 'Le Bernardin', type: 'Fine Dining • $$$$', rating: isSea ? '4.8' : '4.9', dist: '0.4 mi', id: 'd1' },
        { name: isSea ? 'Gramercy Tavern' : 'Keens Steakhouse', type: 'American • $$$', rating: '4.7', dist: '0.6 mi', id: 'd2' }
      ];
      await new Promise(r => setTimeout(r, 1200)); // simulate latency
      return NextResponse.json({ results, practiceMode: ophelia.practiceMode });
    }

    // Default: venue search (Hotels)
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
