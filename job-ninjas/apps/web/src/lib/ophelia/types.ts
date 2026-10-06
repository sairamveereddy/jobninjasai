// Ophelia API Types - Full hotel lifecycle

export interface OpheliaVenueSearchRequest {
  vertical: 'travel';
  providers: string[];
  term?: string;
  location: string;
  check_in: string;
  check_out: string;
  party_size: number;
  rooms: number;
  budget?: number;
}

export interface OpheliaVenueResult {
  id: string;
  name: string;
  location: string;
  price_per_night?: number;
  total_price?: number;
  currency?: string;
  rating?: number;
  image_url?: string;
  provider?: string;
  availability?: boolean;
  description?: string;
}

export interface OpheliaAvailabilityRequest {
  venue_id: string;
  check_in: string;
  check_out: string;
  party_size: number;
  rooms: number;
}

export interface OpheliaAvailabilityResult {
  availability_id: string;
  venue_id: string;
  room_name?: string;
  price_per_night?: number;
  total_price?: number;
  currency?: string;
  cancellation_policy?: string;
  card_required?: boolean;
  available: boolean;
}

export interface OpheliaBookingRequest {
  availability_id: string;
  venue_id: string;
  party_size: number;
  check_in: string;
  check_out: string;
  customer: {
    name: string;
    email: string;
  };
  idempotency_key: string;
}

export interface OpheliaBookingResponse {
  id: string;
  status: 'confirmed' | 'requires_action' | 'failed' | 'pending';
  booking_id?: string;
  confirmation_number?: string;
  next_action?: {
    type: string;
    message?: string;
    expires_at?: string;
    payment_url?: string;
  };
  venue_id?: string;
  amount?: number;
  currency?: string;
  provider?: string;
  error?: string;
}

// Legacy types preserved for backward compatibility
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
  rating?: number;
  providerData?: any;
}

export interface OpheliaBookingConfirmation {
  status: 'confirmed' | 'failed' | 'pending' | 'requires_action';
  confirmationId?: string;
  bookingId?: string;
  provider?: string;
  itemName?: string;
  checkIn?: string;
  checkOut?: string;
  amount?: number;
  currency?: string;
  error?: string;
  nextAction?: {
    type: string;
    message?: string;
    expiresAt?: string;
  };
}

// Agent Decision structure 
export interface AgentDecision {
  objective: string;
  candidate: string;
  requirements: {
    destination: string;
    checkIn: string;
    checkOut: string;
    guests: number;
    rooms: number;
    budget: number;
  };
  recommendation?: {
    type: 'hotel';
    venueId: string;
    venueName: string;
    availabilityId?: string;
    reason: string;
    estimatedTotal: number;
  };
  budget: {
    total: number;
    committed: number;
    proposed: number;
    remainingAfterApproval: number;
  };
  nextAction: 'SEARCHING' | 'RECRUITER_APPROVAL' | 'BOOKING' | 'CONFIRMED' | 'IDLE';
}

// State machine states
export type ConciergeState =
  | 'IDLE'
  | 'ANALYZING_REQUIREMENTS'
  | 'SEARCHING'
  | 'RESULTS_READY'
  | 'CHECKING_AVAILABILITY'
  | 'AWAITING_SELECTION'
  | 'AWAITING_RECRUITER_APPROVAL'
  | 'CREATING_BOOKING'
  | 'REQUIRES_ACTION'
  | 'AWAITING_PAYMENT'
  | 'AWAITING_CONFIRMATION'
  | 'CONFIRMED'
  | 'FAILED'
  | 'CANCELLED';
