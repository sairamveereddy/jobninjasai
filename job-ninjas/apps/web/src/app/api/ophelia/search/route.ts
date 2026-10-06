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
      const origin = isSea ? 'SEA' : 'ATL';
      const results = isSea ? [
        { airline: 'Alaska Airlines', flight: 'AS 234', logo: '✈️', origin: 'SEA', dest: 'JFK', time: '06:00 AM → 02:15 PM', price: '$389', type: 'Direct', duration: '5h 15m', cabin: 'Economy', aircraft: 'Boeing 737-900', gate: 'B12', terminal: 'N', id: 'f1' },
        { airline: 'Delta Air Lines', flight: 'DL 1782', logo: '✈️', origin: 'SEA', dest: 'JFK', time: '08:30 AM → 04:55 PM', price: '$485', type: 'Direct', duration: '5h 25m', cabin: 'Comfort+', aircraft: 'Airbus A321neo', gate: 'A6', terminal: 'S', id: 'f2' },
        { airline: 'JetBlue Airways', flight: 'B6 416', logo: '✈️', origin: 'SEA', dest: 'JFK', time: '11:15 AM → 08:00 PM', price: '$342', type: '1 Stop (SLC)', duration: '7h 45m', cabin: 'Economy', aircraft: 'Airbus A320', gate: 'C3', terminal: 'N', id: 'f3' },
        { airline: 'United Airlines', flight: 'UA 652', logo: '✈️', origin: 'SEA', dest: 'EWR', time: '01:45 PM → 10:10 PM', price: '$410', type: 'Direct', duration: '5h 25m', cabin: 'Economy', aircraft: 'Boeing 787-9', gate: 'D8', terminal: 'S', id: 'f4' }
      ] : [
        { airline: 'Delta Air Lines', flight: 'DL 904', logo: '✈️', origin: 'ATL', dest: 'JFK', time: '07:00 AM → 09:22 AM', price: '$198', type: 'Direct', duration: '2h 22m', cabin: 'Economy', aircraft: 'Boeing 737-800', gate: 'T3-A14', terminal: 'T', id: 'f1' },
        { airline: 'Delta Air Lines', flight: 'DL 1244', logo: '✈️', origin: 'ATL', dest: 'LGA', time: '09:15 AM → 11:30 AM', price: '$245', type: 'Direct', duration: '2h 15m', cabin: 'Comfort+', aircraft: 'Airbus A321neo', gate: 'T3-B6', terminal: 'T', id: 'f2' },
        { airline: 'American Airlines', flight: 'AA 1192', logo: '✈️', origin: 'ATL', dest: 'JFK', time: '10:30 AM → 12:50 PM', price: '$210', type: 'Direct', duration: '2h 20m', cabin: 'Economy', aircraft: 'Airbus A319', gate: 'C22', terminal: 'C', id: 'f3' },
        { airline: 'Spirit Airlines', flight: 'NK 325', logo: '✈️', origin: 'ATL', dest: 'LGA', time: '02:00 PM → 04:35 PM', price: '$89', type: '1 Stop (FLL)', duration: '4h 35m', cabin: 'Economy', aircraft: 'Airbus A320neo', gate: 'B9', terminal: 'B', id: 'f4' }
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
        { name: 'Le Bernardin', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80', type: 'French Seafood • $$$$', cuisine: 'French', rating: '4.9', reviews: '2,847', dist: '0.3 mi from office', address: '155 W 51st St, New York, NY', hours: '5:00 PM – 10:30 PM', id: 'd1' },
        { name: 'Keens Steakhouse', image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&q=80', type: 'Steakhouse • $$$', cuisine: 'American', rating: '4.7', reviews: '3,214', dist: '0.5 mi from office', address: '72 W 36th St, New York, NY', hours: '5:00 PM – 11:00 PM', id: 'd2' },
        { name: 'The Modern', image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=400&q=80', type: 'New American • $$$$', cuisine: 'New American', rating: '4.8', reviews: '1,956', dist: '0.4 mi from office', address: '9 W 53rd St, New York, NY', hours: '5:30 PM – 10:00 PM', id: 'd3' },
        { name: 'Gramercy Tavern', image: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?w=400&q=80', type: 'American • $$$', cuisine: 'Farm-to-Table', rating: '4.7', reviews: '4,102', dist: '0.8 mi from office', address: '42 E 20th St, New York, NY', hours: '5:00 PM – 10:00 PM', id: 'd4' }
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

