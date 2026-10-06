export interface OpheliaSearchRequest {
  destination: string;
  checkIn: string;
  checkOut: string;
  budget?: number;
  purpose?: string;
}

export interface OpheliaHotelOption {
  id: string;
  name: string;
  price: number;
  currency: string;
  location: string;
  distanceFromInterview: string;
  image: string;
  availability: boolean;
  providerData?: any;
}

export interface OpheliaBookingConfirmation {
  status: 'confirmed' | 'failed' | 'pending';
  confirmationId?: string;
  provider?: string;
  itemName?: string;
  checkIn?: string;
  checkOut?: string;
  amount?: number;
  currency?: string;
  error?: string;
}
