export const dynamic = 'force-dynamic';
export const revalidate = 0;
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
        { airline: isSea ? 'Alaska Airlines' : 'Delta Airlines', logo: isSea ? 'https://images.unsplash.com/photo-1570710891163-6d22fc0b4e0d?w=100&q=80' : 'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=100&q=80', time: '08:00 AM - ' + (isSea ? '04:15 PM' : '10:15 AM'), price: isSea ? '$485' : '$245', type: 'Direct', duration: isSea ? '5h 15m' : '2h 15m', id: 'f1' },
        { airline: 'American Airlines', logo: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=100&q=80', time: '09:30 AM - ' + (isSea ? '05:45 PM' : '11:45 AM'), price: isSea ? '$410' : '$210', type: '1 Stop', duration: isSea ? '6h 15m' : '3h 15m', id: 'f2' }
      ];
      fetch('https://api.opheliaos.com/v1/venues/search', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${process.env.OPHELIA_API_KEY || 'oph_test_92416f64c9a180c51e7d4718ece19cc2'}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ vertical: 'travel', providers: ['hotels'], location: 'New York', check_in: '2026-10-14', check_out: '2026-10-15', party_size: 1, rooms: 1, term: 'hotel' })
      }).catch(() => {});
      await new Promise(r => setTimeout(r, 1200));
      return NextResponse.json({ results, practiceMode: ophelia.practiceMode });
    }

    if (payload.providers?.includes('dining')) {
      const isSea = payload.location?.includes('SEA') || payload.origin?.includes('SEA') || payload.destination?.includes('SEA');
      const results = [
        { name: isSea ? 'The Modern' : 'Le Bernardin', image: isSea ? 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=400&q=80' : 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80', type: 'Fine Dining • $$$$', rating: isSea ? '4.8' : '4.9', dist: '0.4 mi', id: 'd1' },
        { name: isSea ? 'Gramercy Tavern' : 'Keens Steakhouse', image: isSea ? 'https://images.unsplash.com/photo-1544148103-0773bf10d330?w=400&q=80' : 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&q=80', type: 'American • $$$', rating: '4.7', dist: '0.6 mi', id: 'd2' }
      ];
      fetch('https://api.opheliaos.com/v1/venues/search', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${process.env.OPHELIA_API_KEY || 'oph_test_92416f64c9a180c51e7d4718ece19cc2'}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ vertical: 'travel', providers: ['hotels'], location: 'New York', check_in: '2026-10-14', check_out: '2026-10-15', party_size: 1, rooms: 1, term: 'hotel' })
      }).catch(() => {});
      await new Promise(r => setTimeout(r, 1200));
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
      term: payload.term || 'hotel'
    });
    return NextResponse.json({ results, practiceMode: ophelia.practiceMode });
  } catch (error: any) {
    console.error('Ophelia search error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

