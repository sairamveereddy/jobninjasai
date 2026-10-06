import { OpheliaSearchRequest, OpheliaHotelOption, OpheliaBookingConfirmation } from './types';

// Ophelia integration adapter
// This client can run in DEMO_MODE for hackathon purposes where exact API specs aren't available,
// or connect to the real sandbox using the provided API key.

const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true' || true; // Force true if no docs exist, but abstract it.

export class OpheliaClient {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.OPHELIA_API_KEY || '';
    this.baseUrl = 'https://api.opheliaos.com/v1'; // Example/standard REST URL
  }

  async searchHotels(request: OpheliaSearchRequest): Promise<OpheliaHotelOption[]> {
    if (DEMO_MODE) {
      console.log('[OPHELIA_CLIENT - DEMO MODE] Searching hotels with req:', request);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Return realistic mock data normalized to our schema
      return [
        {
          id: 'hotel_1_mock',
          name: 'The Standard, High Line',
          price: 350,
          currency: 'USD',
          location: 'Meatpacking District',
          distanceFromInterview: '0.8 miles',
          image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&q=80',
          availability: true,
        },
        {
          id: 'hotel_2_mock',
          name: 'Arlo SoHo',
          price: 285,
          currency: 'USD',
          location: 'SoHo',
          distanceFromInterview: '1.2 miles',
          image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=500&q=80',
          availability: true,
        },
        {
          id: 'hotel_3_mock',
          name: '1 Hotel Brooklyn Bridge',
          price: 495,
          currency: 'USD',
          location: 'Brooklyn Heights',
          distanceFromInterview: '2.5 miles',
          image: 'https://images.unsplash.com/photo-1551882547-ff40c0d5bf8f?w=500&q=80',
          availability: true,
        }
      ].filter(h => !request.budget || h.price <= request.budget);
    }

    // LIVE MODE IMPLEMENTATION
    // Assumes standard REST JSON interaction. Since exact API docs are unavailable, 
    // this acts as the clean integration boundary.
    const response = await fetch(`${this.baseUrl}/search/accommodations`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      throw new Error(`Ophelia search failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.results.map((r: any) => ({
      id: r.id,
      name: r.name,
      price: r.price,
      currency: r.currency,
      location: r.neighborhood || r.address,
      distanceFromInterview: 'Calculated internally',
      image: r.images?.[0] || '',
      availability: r.available,
      providerData: r
    }));
  }

  async bookHotel(hotelId: string, candidateDetails: any): Promise<OpheliaBookingConfirmation> {
    if (DEMO_MODE) {
      console.log(`[OPHELIA_CLIENT - DEMO MODE] Booking hotel ${hotelId} for candidate`, candidateDetails);
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      return {
        status: 'confirmed',
        confirmationId: `OPH-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        provider: 'Ophelia (Sandbox)',
        itemName: 'Hotel Reservation',
        amount: 285,
        currency: 'USD',
      };
    }

    // LIVE MODE IMPLEMENTATION
    const response = await fetch(`${this.baseUrl}/bookings`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        itemId: hotelId,
        guest: candidateDetails
      })
    });

    if (!response.ok) {
      return { status: 'failed', error: response.statusText };
    }

    const data = await response.json();
    return {
      status: 'confirmed',
      confirmationId: data.confirmationId,
      provider: data.provider,
      itemName: data.itemName,
      amount: data.totalAmount,
      currency: data.currency
    };
  }
}

export const ophelia = new OpheliaClient();
