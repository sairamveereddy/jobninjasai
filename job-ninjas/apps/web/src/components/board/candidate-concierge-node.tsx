"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  PlaneTakeoff, Hotel, Utensils, MapPin, Loader2, CheckCircle2, AlertCircle,
  Clock, Star, ChevronRight, ChevronLeft, Shield, Zap, Activity, Code2,
  Plane, Calendar, DollarSign, User, ArrowRight, RefreshCw, X, Info,
  Building2, Check, Circle, AlertTriangle, ExternalLink, ChevronDown
} from 'lucide-react';
import { useBoardStore } from '@/store/board';
import { useDemoStore } from '@/lib/store';
import { ConciergeState, OpheliaHotelOption } from '@/lib/ophelia/types';

// ── Candidate data ────────────────────────────────────────────────────────
const SARAH = {
  name: 'Sarah Chen',
  email: 'sarah.chen@example.com',
  role: 'AI Engineer',
  stage: 'Final Interview',
  from: 'Atlanta, GA',
  to: 'New York, NY',
  fromCode: 'ATL',
  toCode: 'NYC',
  checkIn: 'Oct 14',
  checkOut: 'Oct 15',
  checkInISO: '2026-10-14',
  checkOutISO: '2026-10-15',
  interviewDate: 'Oct 15 • 10:00 AM',
  budget: 800,
};

// ── Activity log entry ────────────────────────────────────────────────────
interface ActivityEntry {
  time: string;
  action: string;
  icon: React.ElementType;
  status: 'success' | 'info' | 'error' | 'pending';
  detail?: string;
}

function now() {
  return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

// ── Color map per state ───────────────────────────────────────────────────
function stateColor(state: ConciergeState) {
  if (state === 'CONFIRMED') return 'bg-emerald-500';
  if (state === 'FAILED') return 'bg-red-500';
  if (['SEARCHING', 'CHECKING_AVAILABILITY', 'CREATING_BOOKING', 'AWAITING_PAYMENT', 'AWAITING_CONFIRMATION'].includes(state)) return 'bg-blue-500 animate-pulse';
  if (state === 'AWAITING_RECRUITER_APPROVAL') return 'bg-amber-500';
  return 'bg-violet-400';
}

// ── Readiness items ───────────────────────────────────────────────────────
function ReadinessRow({ label, status }: { label: string; status: 'confirmed' | 'action' | 'optional' | 'pending' | 'done' }) {
  const colors = {
    confirmed: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    done: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    action: 'text-amber-700 bg-amber-50 border-amber-200',
    optional: 'text-slate-500 bg-slate-50 border-slate-200',
    pending: 'text-slate-400 bg-slate-50 border-slate-200'
  };
  const icons = { confirmed: <Check className="w-3 h-3" />, done: <Check className="w-3 h-3" />, action: <AlertTriangle className="w-3 h-3" />, optional: <Circle className="w-3 h-3" />, pending: <Circle className="w-3 h-3" /> };
  const labels = { confirmed: 'CONFIRMED', done: '✓', action: 'ACTION REQUIRED', optional: 'OPTIONAL', pending: 'NOT STARTED' };
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-[12px] text-slate-700 font-medium">{label}</span>
      <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${colors[status]}`}>
        {icons[status]} {labels[status]}
      </span>
    </div>
  );
}

// ── Hotel Card ────────────────────────────────────────────────────────────
function HotelCard({ hotel, recommended, selected, onSelect, onApprove, disabled }: {
  hotel: OpheliaHotelOption;
  recommended: boolean;
  selected: boolean;
  onSelect: () => void;
  onApprove: () => void;
  disabled: boolean;
}) {
  return (
    <div
      onPointerDown={(e) => { e.stopPropagation(); if (onSelect) onSelect(); }}
      className={`rounded-xl border-2 overflow-hidden cursor-pointer transition-all ${
        selected ? 'border-violet-500 shadow-lg shadow-violet-500/20' :
        recommended ? 'border-violet-300' : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      {recommended && (
        <div className="bg-violet-600 text-white text-[10px] font-bold px-3 py-1 flex items-center gap-1">
          <Zap className="w-3 h-3" /> ✨ AI RECOMMENDED
        </div>
      )}
      <div className="relative">
        <img src={hotel.image} alt={hotel.name} className="w-full h-32 object-cover" />
        {hotel.providerData?.practice && (
          <div className="absolute top-2 left-2 bg-violet-900/80 text-violet-200 text-[9px] px-2 py-0.5 rounded font-bold backdrop-blur-sm">PRACTICE MODE</div>
        )}
        {hotel.rating && (
          <div className="absolute top-2 right-2 bg-white/90 text-slate-800 text-[11px] font-bold px-2 py-1 rounded-full backdrop-blur-sm flex items-center gap-1">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {hotel.rating}
          </div>
        )}
      </div>
      <div className="p-3 bg-white">
        <div className="flex items-start justify-between mb-1">
          <div>
            <h4 className="font-bold text-[13px] text-slate-900 leading-tight">{hotel.name}</h4>
            <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3" /> {hotel.location}
            </p>
          </div>
          <div className="text-right">
            <p className="text-base font-black text-slate-900">${hotel.price}</p>
            <p className="text-[10px] text-slate-400">/ night</p>
          </div>
        </div>
        {recommended && (
          <p className="text-[10px] text-slate-600 italic mt-1 mb-2 border-l-2 border-violet-400 pl-2">
            Within candidate travel budget — selected as the strongest available option.
          </p>
        )}
        <div className="flex items-center justify-between mt-2">
          <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">AVAILABLE</span>
          {selected && (
            <button
              disabled={disabled}
              onPointerDown={(e) => { e.stopPropagation(); onApprove(); }}
              className="text-[11px] bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white px-3 py-1.5 rounded-lg font-bold transition-colors flex items-center gap-1"
            >
              {disabled ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
              Approve Selection
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Budget Bar ─────────────────────────────────────────────────────────────
function BudgetBar({ total, spent }: { total: number; spent: number }) {
  const pct = Math.min(100, (spent / total) * 100);
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[11px] text-slate-500">Candidate travel budget</span>
        <span className="text-[11px] text-slate-700 font-bold">${spent} of ${total}</span>
      </div>
      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full bg-violet-500 rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
      </div>
      <p className="text-[10px] text-slate-400 mt-0.5">${total - spent} remaining</p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export const CandidateConciergeNode = ({ layerId, layer, isSelected }: {
  layerId: string;
  layer: any;
  isSelected: boolean;
}) => {
  const updateLayer = useBoardStore(state => state.updateLayer);
  const { updateCandidate } = useDemoStore.getState();

  // ── State machine ─────────────────────────────────────────────────────────
  const [conciergeState, setConciergeState] = useState<ConciergeState>(
    layer.config?.conciergeState || 'IDLE'
  );
  const [hotels, setHotels] = useState<OpheliaHotelOption[]>(layer.config?.hotels || []);
  const [selectedHotelId, setSelectedHotelId] = useState<string | null>(layer.config?.selectedHotelId || null);
  const [availability, setAvailability] = useState<any>(layer.config?.availability || null);
  const [booking, setBooking] = useState<any>(layer.config?.booking || null);
  const [activeTab, setActiveTab] = useState<'overview' | 'stay' | 'flights' | 'dining' | 'itinerary' | 'activity'>('overview');
  const [activityLog, setActivityLog] = useState<ActivityEntry[]>(layer.config?.activityLog || []);
  const [showApiDrawer, setShowApiDrawer] = useState(false);
  const [error, setError] = useState<string>('');
  const [countdown, setCountdown] = useState<number>(900); // 15 min
  const countdownRef = useRef<any>(null);
  const [spent, setSpent] = useState(0);
  const [flightsState, setFlightsState] = useState<'IDLE'|'SEARCHING'|'FOUND'>('IDLE');
  const [diningState, setDiningState] = useState<'IDLE'|'SEARCHING'|'FOUND'>('IDLE');

  // ── Sync state to layer config ─────────────────────────────────────────
  useEffect(() => {
    updateLayer(layerId, {
      config: {
        ...layer.config,
        conciergeState,
        hotels,
        selectedHotelId,
        availability,
        booking,
        activityLog
      }
    } as any);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conciergeState, selectedHotelId, booking]);

  // ── Countdown timer for payment action ────────────────────────────────
  useEffect(() => {
    if (conciergeState === 'REQUIRES_ACTION' || conciergeState === 'AWAITING_PAYMENT') {
      countdownRef.current = setInterval(() => setCountdown(c => Math.max(0, c - 1)), 1000);
    } else {
      clearInterval(countdownRef.current);
    }
    return () => clearInterval(countdownRef.current);
  }, [conciergeState]);

  const log = useCallback((action: string, icon: React.ElementType, status: ActivityEntry['status'], detail?: string) => {
    setActivityLog(prev => [...prev, { time: now(), action, icon, status, detail }]);
  }, []);

  // ── Auto-trigger on Running ───────────────────────────────────────────
  useEffect(() => {
    if (layer.status === 'running' && conciergeState === 'IDLE') {
      startConcierge();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layer.status]);

  // ── Trigger concierge ─────────────────────────────────────────────────
  const startConcierge = useCallback(async () => {
    setConciergeState('ANALYZING_REQUIREMENTS');
    log('Candidate Concierge started', Activity, 'info');
    await new Promise(r => setTimeout(r, 600));
    log('Interview context analyzed', Check, 'success');
    await new Promise(r => setTimeout(r, 400));
    log('Travel requirement generated: Atlanta → New York', PlaneTakeoff, 'success');
    await new Promise(r => setTimeout(r, 400));

    setConciergeState('SEARCHING');
    log('Ophelia hotel search started', Building2, 'info', 'POST /v1/venues/search');
    setError('');

    try {
      const res = await fetch('/api/ophelia/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: 'New York, NY',
          checkIn: SARAH.checkInISO,
          checkOut: SARAH.checkOutISO,
          budget: SARAH.budget,
          party_size: 1,
          rooms: 1
        })
      });
      if (!res.ok) throw new Error('Search failed');
      const data = await res.json();
      const results: OpheliaHotelOption[] = data.results || [];
      setHotels(results);
      log(`${results.length} venues returned`, Hotel, 'success', 'GET 200');
      await new Promise(r => setTimeout(r, 400));
      log('Recommendation generated', Zap, 'success');
      setConciergeState('RESULTS_READY');
      setActiveTab('stay');
    } catch (err: any) {
      setError(err.message);
      setConciergeState('FAILED');
      log('Search failed', AlertCircle, 'error', err.message);
    }
  }, [log]);

  // ── Select hotel & check availability ────────────────────────────────
  const selectHotel = useCallback(async (hotelId: string) => {
    setSelectedHotelId(hotelId);
    setConciergeState('CHECKING_AVAILABILITY');
    log('Availability check started', Clock, 'info', 'POST /v1/availability/search');

    try {
      const res = await fetch('/api/ophelia/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'availability',
          venue_id: hotelId,
          check_in: SARAH.checkInISO,
          check_out: SARAH.checkOutISO,
          party_size: 1,
          rooms: 1
        })
      });
      const data = await res.json();
      const avail = data.result;
      setAvailability(avail);
      log('Availability confirmed', Check, 'success', `avail_id: ${avail?.availability_id?.slice(0, 16)}...`);
      setConciergeState('AWAITING_RECRUITER_APPROVAL');
    } catch (err: any) {
      log('Availability check failed', AlertCircle, 'error');
      setConciergeState('RESULTS_READY');
    }
  }, [log]);

  // ── Recruiter approves ────────────────────────────────────────────────
  const approveBooking = useCallback(async () => {
    if (!selectedHotelId) return;
    log('Recruiter approved selection', Shield, 'success');
    setConciergeState('CREATING_BOOKING');
    log('Booking initiated', Zap, 'info', 'POST /v1/bookings');

    try {
      const res = await fetch('/api/ophelia/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          availability_id: availability?.availability_id || `avail_${selectedHotelId}`,
          venue_id: selectedHotelId,
          party_size: 1,
          check_in: SARAH.checkInISO,
          check_out: SARAH.checkOutISO,
          customer: { name: SARAH.name, email: SARAH.email },
          idempotency_key: `jobninja_${Date.now()}`
        })
      });
      const data = await res.json();
      setBooking(data);

      if (data.status === 'requires_action') {
        log('Payment action requested', AlertTriangle, 'info', data.next_action?.message);
        setConciergeState('REQUIRES_ACTION');
      } else if (data.status === 'confirmed') {
        log('Booking confirmed', CheckCircle2, 'success', `ID: ${data.confirmation_number}`);
        finalizeBooking(data);
      } else {
        throw new Error(data.error || 'Unknown booking state');
      }
    } catch (err: any) {
      log('Booking failed', AlertCircle, 'error', err.message);
      setConciergeState('FAILED');
    }
  }, [selectedHotelId, availability, log]);

  // ── Continue after payment action ─────────────────────────────────────
  const continueAfterPayment = useCallback(async () => {
    if (!booking?.id) return;
    setConciergeState('AWAITING_PAYMENT');
    log('Payment authorization started', DollarSign, 'info');
    setConciergeState('AWAITING_CONFIRMATION');
    log('Awaiting final confirmation', Clock, 'info', 'POST /v1/bookings/{id}/continue');

    try {
      const res = await fetch('/api/ophelia/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'continue', bookingId: booking.id })
      });
      const data = await res.json();
      if (data.status === 'confirmed') {
        log('Booking confirmed', CheckCircle2, 'success', `Conf #: ${data.confirmation_number}`);
        finalizeBooking({ ...booking, ...data });
      } else {
        throw new Error('Confirmation failed');
      }
    } catch (err: any) {
      log('Confirmation failed', AlertCircle, 'error', err.message);
      setConciergeState('FAILED');
    }
  }, [booking, log]);

  // ── Finalize confirmed booking ────────────────────────────────────────
  const finalizeBooking = useCallback((confirmedBooking: any) => {
    setBooking(confirmedBooking);
    const hotel = hotels.find(h => h.id === selectedHotelId);
    setSpent(hotel?.price || confirmedBooking.amount || 0);
    setConciergeState('CONFIRMED');
    updateLayer(layerId, { status: 'success' } as any);
    if (updateCandidate) updateCandidate('candidate-sarah', { status: 'Onsite Ready' });
    setActiveTab('overview');
  }, [hotels, selectedHotelId, updateLayer, layerId, updateCandidate]);

  const selectedHotel = hotels.find(h => h.id === selectedHotelId);

  // ─────────────────────────────────────────────────────────────────────────
  // COMPACT NODE VIEW (when not showing full workspace)
  // This shows for un-triggered / idle state only if isCompact
  // We'll render full workspace always (wide node)
  // ─────────────────────────────────────────────────────────────────────────

  const tabs = ['overview', 'stay', 'flights', 'dining', 'itinerary', 'activity'] as const;

  // ── Execution steps ───────────────────────────────────────────────────
  const executionSteps = [
    { label: 'Candidate details validated', done: !['IDLE', 'ANALYZING_REQUIREMENTS'].includes(conciergeState) },
    { label: 'Hotel selected', done: !!selectedHotelId },
    { label: 'Availability confirmed', done: !!availability },
    { label: 'Recruiter approval received', done: ['CREATING_BOOKING', 'REQUIRES_ACTION', 'AWAITING_PAYMENT', 'AWAITING_CONFIRMATION', 'CONFIRMED'].includes(conciergeState) },
    { label: 'Creating booking...', active: conciergeState === 'CREATING_BOOKING', done: ['REQUIRES_ACTION', 'AWAITING_PAYMENT', 'AWAITING_CONFIRMATION', 'CONFIRMED'].includes(conciergeState) },
    { label: 'Payment authorization', active: ['REQUIRES_ACTION', 'AWAITING_PAYMENT'].includes(conciergeState), done: conciergeState === 'CONFIRMED' },
    { label: 'Final confirmation', active: conciergeState === 'AWAITING_CONFIRMATION', done: conciergeState === 'CONFIRMED' },
  ];

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className={`w-full h-full flex flex-col rounded-2xl border-2 overflow-hidden bg-white shadow-2xl font-sans
      ${isSelected ? 'border-violet-500 shadow-violet-500/25' : conciergeState === 'CONFIRMED' ? 'border-emerald-400' : 'border-slate-200'}`}
      style={{ minWidth: 960, minHeight: 560 }}
    >
      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-5 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-[10px] text-violet-300 font-bold tracking-widest uppercase">OPHELIA</p>
            <h3 className="text-white font-bold text-[13px] leading-tight">Candidate Experience Agent</h3>
            <p className="text-slate-400 text-[10px]">Travel & onsite coordination</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Candidate pill */}
          <div className="bg-slate-700 rounded-xl px-3 py-2 flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-violet-500 flex items-center justify-center text-white text-[9px] font-black">SC</div>
            <div>
              <p className="text-white text-[11px] font-bold">{SARAH.name}</p>
              <p className="text-slate-400 text-[9px]">{SARAH.role} • {SARAH.stage}</p>
            </div>
          </div>
          {/* Route */}
          <div className="bg-slate-700 rounded-xl px-3 py-2 text-center">
            <p className="text-[10px] text-slate-300 flex items-center gap-1">
              <span className="font-bold text-white">{SARAH.from}</span>
              <ArrowRight className="w-3 h-3 text-violet-400" />
              <span className="font-bold text-white">{SARAH.to}</span>
            </p>
            <p className="text-slate-400 text-[9px]">{SARAH.checkIn} — {SARAH.checkOut} • Budget: ${SARAH.budget}</p>
          </div>
          {/* Status pill */}
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${stateColor(conciergeState)}`} />
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wide">
              {conciergeState === 'CONFIRMED' ? '✓ ONSITE READY' : conciergeState === 'IDLE' ? 'READY' : conciergeState.replace(/_/g, ' ')}
            </span>
          </div>
          {/* Capability chips */}
          <div className="flex items-center gap-1">
            {[
              { icon: Hotel, label: 'HOTELS' },
              { icon: Plane, label: 'FLIGHTS' },
              { icon: Utensils, label: 'DINING' },
              { icon: MapPin, label: 'ACTIVITIES' },
            ].map(c => (
              <div key={c.label} className="bg-slate-700 text-slate-300 text-[9px] font-bold px-2 py-1 rounded-md flex items-center gap-1">
                <c.icon className="w-2.5 h-2.5" /> {c.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── PRACTICE BADGE ───────────────────────────────────────────────── */}
      <div className="bg-violet-50 border-b border-violet-100 px-5 py-1 flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
        <span className="text-[10px] text-violet-700 font-bold">PRACTICE MODE</span>
        <span className="text-[10px] text-violet-500">— Running against Ophelia's practice environment. No real purchases made.</span>
        <div className="ml-auto flex items-center gap-1 text-[10px] text-violet-400">
          <Shield className="w-3 h-3" /> Ophelia Connected
        </div>
      </div>

      {/* ── TABS ─────────────────────────────────────────────────────────── */}
      <div className="border-b border-slate-100 px-5 flex items-center gap-0 shrink-0 bg-white">
        {tabs.map(tab => (
          <button
            key={tab}
            onPointerDown={(e) => { e.stopPropagation(); setActiveTab(tab); }}
            className={`px-4 py-2.5 text-[11px] font-bold uppercase tracking-wide border-b-2 transition-colors ${
              activeTab === tab
                ? 'border-violet-600 text-violet-700'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── TAB CONTENT ──────────────────────────────────────────────────── */}
      <div 
        className="flex-1 overflow-y-auto pointer-events-auto" 
        style={{ scrollbarWidth: 'thin' }}
        onPointerDown={(e) => e.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
      >

        {/* ── IDLE STATE ─────────────────────────────────────────────────── */}
        {conciergeState === 'IDLE' && (
          <div className="flex flex-col items-center justify-center h-full gap-4 p-8">
            <div className="w-16 h-16 rounded-2xl bg-violet-50 border border-violet-100 flex items-center justify-center">
              <Zap className="w-8 h-8 text-violet-400" />
            </div>
            <div className="text-center">
              <h4 className="text-slate-700 font-bold text-base mb-1">Candidate Concierge</h4>
              <p className="text-slate-400 text-sm">Waiting for a candidate to reach<br />Final Interview / Onsite Interview.</p>
            </div>
            <button
              onPointerDown={(e) => { e.stopPropagation(); updateLayer(layerId, { status: 'running' } as any); startConcierge(); }}
              className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-bold px-6 py-2.5 rounded-xl transition-colors shadow-lg shadow-violet-500/25"
            >
              <Zap className="w-4 h-4" /> ✨ Arrange Onsite
            </button>
          </div>
        )}

        {/* ── OVERVIEW TAB ────────────────────────────────────────────────── */}
        {activeTab === 'overview' && conciergeState !== 'IDLE' && (
          <div className="p-5 grid grid-cols-2 gap-5">
            {/* Left: Readiness + AI Next Action */}
            <div className="space-y-4">
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">ONSITE READINESS</p>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-violet-500 rounded-full" style={{ width: conciergeState === 'CONFIRMED' ? '100%' : conciergeState === 'AWAITING_RECRUITER_APPROVAL' ? '60%' : conciergeState === 'RESULTS_READY' ? '50%' : '30%' }} />
                    </div>
                    <span className="text-[11px] font-bold text-violet-600">
                      {conciergeState === 'CONFIRMED' ? '100%' : conciergeState === 'AWAITING_RECRUITER_APPROVAL' ? '60%' : '40%'}
                    </span>
                  </div>
                </div>
                <div className="divide-y divide-slate-100">
                  <ReadinessRow label="Interview" status="done" />
                  <ReadinessRow label="Travel Plan" status={conciergeState !== 'IDLE' && conciergeState !== 'ANALYZING_REQUIREMENTS' ? 'done' : 'pending'} />
                  <ReadinessRow label="Hotel" status={conciergeState === 'CONFIRMED' ? 'confirmed' : conciergeState === 'AWAITING_RECRUITER_APPROVAL' ? 'action' : conciergeState === 'RESULTS_READY' || conciergeState === 'CHECKING_AVAILABILITY' ? 'action' : 'pending'} />
                  <ReadinessRow label="Flight" status="optional" />
                  <ReadinessRow label="Dinner" status="pending" />
                  <ReadinessRow label="Itinerary" status={conciergeState !== 'IDLE' ? 'action' : 'pending'} />
                </div>
              </div>

              {/* AI Next Action */}
              <div className="bg-violet-50 rounded-xl border border-violet-200 p-4">
                <p className="text-[11px] font-bold text-violet-600 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Zap className="w-3 h-3" /> AI NEXT ACTION
                </p>
                <p className="text-[12px] text-slate-700 leading-relaxed mb-3">
                  {conciergeState === 'CONFIRMED'
                    ? `Sarah's onsite trip to New York is fully arranged. Employment at the offer stage pending final decision.`
                    : conciergeState === 'AWAITING_RECRUITER_APPROVAL'
                    ? `Sarah's hotel selection is ready for approval. The recommended option fits within the $${SARAH.budget} travel policy.`
                    : conciergeState === 'RESULTS_READY'
                    ? `Sarah needs accommodation for the night before her 10:00 AM interview. I found ${hotels.length} available options within the travel policy.`
                    : `Analyzing Sarah's interview requirements and searching Ophelia for suitable accommodations...`}
                </p>
                {conciergeState === 'RESULTS_READY' && (
                  <button onPointerDown={(e) => { e.stopPropagation(); setActiveTab('stay'); }} className="text-[11px] bg-violet-600 text-white px-3 py-1.5 rounded-lg font-bold flex items-center gap-1">
                    Review Hotels <ChevronRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Right: Trip Summary + Confirmed booking card */}
            <div className="space-y-4">
              {conciergeState === 'CONFIRMED' && selectedHotel && (
                <div className="rounded-xl border-2 border-emerald-400 bg-emerald-50 overflow-hidden">
                  <img src={selectedHotel.image} alt={selectedHotel.name} className="w-full h-28 object-cover" />
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <p className="text-[11px] font-black text-emerald-700 uppercase tracking-wider">✓ STAY CONFIRMED</p>
                    </div>
                    <h4 className="font-bold text-slate-900 text-[14px]">{selectedHotel.name}</h4>
                    <p className="text-[11px] text-slate-500">{SARAH.to}</p>
                    <div className="flex gap-4 mt-2">
                      <div><p className="text-[9px] text-slate-400 font-bold">CHECK-IN</p><p className="text-[11px] font-bold text-slate-700">{SARAH.checkIn}</p></div>
                      <div><p className="text-[9px] text-slate-400 font-bold">CHECK-OUT</p><p className="text-[11px] font-bold text-slate-700">{SARAH.checkOut}</p></div>
                      <div><p className="text-[9px] text-slate-400 font-bold">TOTAL</p><p className="text-[11px] font-bold text-slate-700">${selectedHotel.price}</p></div>
                    </div>
                    {booking?.confirmation_number && (
                      <p className="text-[10px] text-slate-400 mt-2">Conf: {booking.confirmation_number}</p>
                    )}
                  </div>
                </div>
              )}

              <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">TRIP SUMMARY</p>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  {[
                    { label: 'FROM', val: SARAH.from },
                    { label: 'TO', val: SARAH.to },
                    { label: 'ARRIVAL', val: SARAH.checkIn },
                    { label: 'INTERVIEW', val: SARAH.interviewDate },
                    { label: 'DEPARTURE', val: SARAH.checkOut },
                    { label: 'BUDGET', val: `$${SARAH.budget}` },
                    { label: 'SPENT', val: `$${spent}` },
                    { label: 'REMAINING', val: `$${SARAH.budget - spent}` },
                  ].map(item => (
                    <div key={item.label}>
                      <p className="text-[9px] font-bold text-slate-400">{item.label}</p>
                      <p className="font-bold text-slate-700">{item.val}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-3">
                  <BudgetBar total={SARAH.budget} spent={spent} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── STAY TAB ─────────────────────────────────────────────────────── */}
        {activeTab === 'stay' && conciergeState !== 'IDLE' && (
          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-bold text-slate-900 text-[15px]">Stay in New York</h4>
                <p className="text-[12px] text-slate-500">{SARAH.checkIn} → {SARAH.checkOut} • 1 guest • 1 room</p>
              </div>
              {conciergeState === 'RESULTS_READY' && (
                <button onPointerDown={(e) => { e.stopPropagation(); startConcierge(); }} className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300">
                  <RefreshCw className="w-3 h-3" /> Refresh
                </button>
              )}
            </div>

            {/* Searching state */}
            {['ANALYZING_REQUIREMENTS', 'SEARCHING'].includes(conciergeState) && (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin text-violet-500" />
                  <span className="text-[13px] font-bold text-slate-700">Searching Ophelia...</span>
                </div>
                <p className="text-[11px] text-slate-400">Candidate Concierge analyzing requirements</p>
              </div>
            )}

            {/* Results */}
            {['RESULTS_READY', 'CHECKING_AVAILABILITY', 'AWAITING_RECRUITER_APPROVAL', 'CREATING_BOOKING', 'REQUIRES_ACTION', 'AWAITING_PAYMENT', 'AWAITING_CONFIRMATION', 'CONFIRMED'].includes(conciergeState) && hotels.length > 0 && (
              <div>
                {conciergeState === 'CHECKING_AVAILABILITY' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                    <span className="text-[12px] text-blue-700 font-medium">Checking availability with Ophelia...</span>
                  </div>
                )}

                {/* Budget summary */}
                {selectedHotel && conciergeState !== 'RESULTS_READY' && (
                  <div className="bg-slate-50 rounded-xl border border-slate-200 p-3 mb-4 flex items-center gap-6">
                    <div><p className="text-[9px] font-bold text-slate-400">TRAVEL BUDGET</p><p className="text-[13px] font-black text-slate-800">${SARAH.budget}</p></div>
                    <div><p className="text-[9px] font-bold text-slate-400">HOTEL TOTAL</p><p className="text-[13px] font-black text-violet-700">${selectedHotel.price}</p></div>
                    <div><p className="text-[9px] font-bold text-slate-400">REMAINING</p><p className="text-[13px] font-black text-emerald-600">${SARAH.budget - selectedHotel.price}</p></div>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-3">
                  {hotels.map((hotel, idx) => (
                    <HotelCard
                      key={hotel.id}
                      hotel={hotel}
                      recommended={idx === 0}
                      selected={selectedHotelId === hotel.id}
                      onSelect={() => {
                        if (conciergeState === 'RESULTS_READY') selectHotel(hotel.id);
                      }}
                      onApprove={approveBooking}
                      disabled={['CREATING_BOOKING', 'AWAITING_PAYMENT', 'AWAITING_CONFIRMATION'].includes(conciergeState)}
                    />
                  ))}
                </div>

                {/* Recruiter approval gate */}
                {conciergeState === 'AWAITING_RECRUITER_APPROVAL' && selectedHotel && (
                  <div className="mt-4 bg-amber-50 border-2 border-amber-300 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-bold text-amber-800 text-[13px]">RECRUITER APPROVAL REQUIRED</p>
                        <p className="text-[11px] text-amber-700 mt-1">
                          JobNinjas agents can prepare transactions, but a recruiter must approve purchases.
                        </p>
                        <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
                          <div><p className="text-slate-500">Candidate</p><p className="font-bold text-slate-800">{SARAH.name}</p></div>
                          <div><p className="text-slate-500">Hotel</p><p className="font-bold text-slate-800">{selectedHotel.name}</p></div>
                          <div><p className="text-slate-500">Dates</p><p className="font-bold text-slate-800">{SARAH.checkIn} → {SARAH.checkOut}</p></div>
                          <div><p className="text-slate-500">Total</p><p className="font-bold text-violet-700">${selectedHotel.price}</p></div>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <button onPointerDown={(e) => { e.stopPropagation(); approveBooking(); }} className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-bold text-[12px] py-2 rounded-lg flex items-center justify-center gap-1">
                            <Check className="w-4 h-4" /> Approve & Continue
                          </button>
                          <button onPointerDown={(e) => { e.stopPropagation(); setConciergeState('RESULTS_READY'); setSelectedHotelId(null); }} className="px-4 py-2 border border-amber-300 text-amber-700 font-bold text-[12px] rounded-lg hover:bg-amber-100">
                            Choose Another
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Execution timeline */}
                {['CREATING_BOOKING', 'REQUIRES_ACTION', 'AWAITING_PAYMENT', 'AWAITING_CONFIRMATION', 'CONFIRMED'].includes(conciergeState) && (
                  <div className="mt-4 bg-slate-900 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">OPHELIA EXECUTION</p>
                      <div className="flex items-center gap-1 text-[10px] text-slate-400">
                        <Shield className="w-3 h-3" /> Secure transaction • Powered by Ophelia
                      </div>
                    </div>
                    <div className="space-y-2">
                      {executionSteps.map((step, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                            step.done ? 'bg-emerald-500 border-emerald-500' :
                            step.active ? 'border-blue-400 bg-blue-500/20' :
                            'border-slate-600 bg-transparent'
                          }`}>
                            {step.done ? <Check className="w-2.5 h-2.5 text-white" /> :
                             step.active ? <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" /> : null}
                          </div>
                          <span className={`text-[11px] ${step.done ? 'text-emerald-400' : step.active ? 'text-blue-300 font-bold' : 'text-slate-500'}`}>
                            {step.label}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Requires action / payment */}
                    {conciergeState === 'REQUIRES_ACTION' && booking?.next_action && (
                      <div className="mt-4 border border-amber-500/30 rounded-lg p-3 bg-amber-500/10">
                        <p className="text-amber-300 font-bold text-[11px] mb-1">⚡ ACTION REQUIRED</p>
                        <p className="text-amber-200 text-[11px] mb-1">{booking.next_action.message}</p>
                        <p className="text-slate-400 text-[10px] mb-3">
                          Session expires in {Math.floor(countdown / 60)}:{String(countdown % 60).padStart(2, '0')}
                        </p>
                        {selectedHotel && (
                          <div className="flex gap-4 text-[11px] mb-3">
                            <div><p className="text-slate-500">Hotel</p><p className="text-white font-bold">{selectedHotel.name}</p></div>
                            <div><p className="text-slate-500">Total</p><p className="text-white font-bold">${selectedHotel.price}</p></div>
                          </div>
                        )}
                        <button onPointerDown={(e) => { e.stopPropagation(); continueAfterPayment(); }} className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold text-[12px] py-2 rounded-lg flex items-center justify-center gap-1">
                          <DollarSign className="w-4 h-4" /> Continue to Payment
                        </button>
                      </div>
                    )}

                    {/* Confirmed */}
                    {conciergeState === 'CONFIRMED' && (
                      <div className="mt-4 border border-emerald-500/30 rounded-lg p-3 bg-emerald-500/10 text-center">
                        <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                        <p className="text-emerald-300 font-black text-[13px] uppercase">✓ STAY CONFIRMED</p>
                        {booking?.confirmation_number && (
                          <p className="text-slate-400 text-[10px] mt-1">Conf #: {booking.confirmation_number}</p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── FLIGHTS TAB ──────────────────────────────────────────────────── */}
        {activeTab === 'flights' && (
          <div className="p-5 flex flex-col items-center justify-center h-full">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center max-w-sm">
              <Plane className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h4 className="font-bold text-slate-700 mb-1">Flights</h4>
              <div className="flex items-center justify-center gap-3 text-slate-600 font-bold text-[13px] mb-4">
                <span>{SARAH.fromCode}</span> <ArrowRight className="w-4 h-4 text-slate-400" /> <span>{SARAH.toCode}</span>
              </div>
              <p className="text-[11px] text-slate-500 mb-1">{SARAH.checkIn}</p>
              <div className="mt-4 inline-block bg-slate-200 text-slate-500 text-[10px] font-bold px-3 py-1 rounded-full">AVAILABLE TO SEARCH</div>
              <button className="mt-4 w-full bg-violet-600 hover:bg-violet-700 text-white font-bold text-[12px] py-2.5 rounded-xl flex items-center justify-center gap-2">
                <Plane className="w-4 h-4" /> Search Flights with Ophelia
              </button>
            </div>
          </div>
        )}

        {/* ── DINING TAB ──────────────────────────────────────────────────── */}
        {activeTab === 'dining' && (
          <div className="p-5 flex flex-col items-center justify-center h-full">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center max-w-sm">
              <Utensils className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h4 className="font-bold text-slate-700 mb-1">Candidate Dinner</h4>
              <p className="text-[11px] text-slate-500 mb-4">New York • Oct 14 • 7:00 PM • Party of 2</p>
              <button className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold text-[12px] py-2.5 rounded-xl flex items-center justify-center gap-2">
                <Utensils className="w-4 h-4" /> Find Dinner Options
              </button>
            </div>
          </div>
        )}

        {/* ── ITINERARY TAB ────────────────────────────────────────────────── */}
        {activeTab === 'itinerary' && (
          <div className="p-5">
            <h4 className="font-bold text-slate-900 text-[14px] mb-4">Full Itinerary</h4>
            <div className="space-y-0">
              {[
                { date: 'OCT 14', time: '4:00 PM', label: 'Arrival in NYC', sub: 'Flight not arranged', status: 'optional' as const },
                { date: null, time: '6:00 PM', label: 'Hotel Check-in', sub: conciergeState === 'CONFIRMED' && selectedHotel ? selectedHotel.name : 'Pending confirmation', status: (conciergeState === 'CONFIRMED' ? 'confirmed' : 'pending') as any },
                { date: null, time: '7:00 PM', label: 'Candidate Dinner', sub: 'Optional — not arranged', status: 'optional' as const },
                { date: 'OCT 15', time: '8:30 AM', label: 'Leave hotel', sub: 'Head to interview location', status: 'pending' as const },
                { date: null, time: '9:15 AM', label: 'Arrive at interview location', sub: '150 Fifth Ave, New York, NY', status: 'pending' as const },
                { date: null, time: '10:00 AM', label: 'Final Interview', sub: 'AI Engineer role — scheduled', status: 'confirmed' as const },
                { date: null, time: '12:00 PM', label: 'Interview complete', sub: 'Decision expected within 48 hours', status: 'pending' as const },
              ].map((item, i) => {
                const colors = {
                  confirmed: 'text-emerald-600 border-emerald-300 bg-emerald-50',
                  pending: 'text-slate-400 border-slate-200 bg-white',
                  optional: 'text-slate-400 border-dashed border-slate-200 bg-white',
                };
                const dotColors = { confirmed: 'bg-emerald-500', pending: 'bg-slate-300', optional: 'bg-slate-200' };
                return (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full mt-1 shrink-0 ${dotColors[item.status]}`} />
                      {i < 6 && <div className="w-px flex-1 bg-slate-200 my-1" />}
                    </div>
                    <div className="pb-4">
                      {item.date && <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase mb-1">{item.date}</p>}
                      <p className="text-[10px] text-slate-400">{item.time}</p>
                      <p className="font-bold text-slate-800 text-[12px]">{item.label}</p>
                      <p className="text-[11px] text-slate-400">{item.sub}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── ACTIVITY TAB ─────────────────────────────────────────────────── */}
        {activeTab === 'activity' && (
          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-slate-900 text-[14px]">Activity Log</h4>
              <button onPointerDown={(e) => { e.stopPropagation(); setShowApiDrawer(true); }} className="flex items-center gap-1 text-[11px] text-violet-600 hover:text-violet-700 font-bold px-3 py-1.5 rounded-lg border border-violet-200 hover:border-violet-300">
                <Code2 className="w-3 h-3" /> View API Details
              </button>
            </div>
            {activityLog.length === 0 ? (
              <p className="text-[12px] text-slate-400 text-center py-8">No activity yet. Start the concierge to begin.</p>
            ) : (
              <div className="space-y-2">
                {activityLog.map((entry, i) => (
                  <div key={i} className="flex items-start gap-3 py-2 border-b border-slate-100">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                      entry.status === 'success' ? 'bg-emerald-100 text-emerald-600' :
                      entry.status === 'error' ? 'bg-red-100 text-red-500' :
                      entry.status === 'info' ? 'bg-blue-100 text-blue-500' :
                      'bg-slate-100 text-slate-400'
                    }`}>
                      <entry.icon className="w-3 h-3" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline justify-between">
                        <p className="text-[12px] text-slate-800 font-medium">{entry.action}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{entry.time}</p>
                      </div>
                      {entry.detail && <p className="text-[10px] text-slate-400 font-mono mt-0.5">{entry.detail}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── API DETAILS DRAWER ────────────────────────────────────────────── */}
      {showApiDrawer && (
        <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-sm rounded-2xl z-50 flex flex-col overflow-hidden pointer-events-auto">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-violet-400" />
              <span className="text-white font-bold text-[13px]">OPHELIA API</span>
              <span className="bg-violet-900 text-violet-300 text-[10px] font-bold px-2 py-0.5 rounded">TEST / PRACTICE</span>
            </div>
            <button onPointerDown={(e) => { e.stopPropagation(); setShowApiDrawer(false); }} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {[
              { method: 'POST', path: '/v1/venues/search', status: hotels.length > 0 ? 200 : null, label: 'Hotel Search' },
              { method: 'POST', path: '/v1/availability/search', status: availability ? 200 : null, label: 'Availability Check', data: availability ? `avail_id: ${availability.availability_id?.slice(0, 20)}...` : null },
              { method: 'POST', path: '/v1/bookings', status: booking ? (booking.status === 'requires_action' ? 'requires_action' : 200) : null, label: 'Create Booking', data: booking?.id ? `booking_id: ${booking.id}` : null },
              { method: 'POST', path: `/v1/bookings/{id}/continue`, status: conciergeState === 'CONFIRMED' ? 200 : null, label: 'Continue Booking', data: booking?.confirmation_number ? `conf: ${booking.confirmation_number}` : null },
            ].map((call, i) => (
              <div key={i} className="bg-slate-800 rounded-lg p-3 border border-slate-700">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-violet-300 text-[10px] font-bold">{call.label}</span>
                  {call.status && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${call.status === 200 ? 'bg-emerald-900 text-emerald-300' : 'bg-amber-900 text-amber-300'}`}>
                      {call.status === 200 ? '✓ 200' : call.status}
                    </span>
                  )}
                </div>
                <p className="text-slate-300 font-mono text-[11px]"><span className="text-blue-400">{call.method}</span> {call.path}</p>
                {call.data && <p className="text-slate-500 font-mono text-[10px] mt-1">{call.data}</p>}
              </div>
            ))}
            <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
              <p className="text-[10px] text-slate-500 font-bold mb-2">ENVIRONMENT</p>
              <p className="text-[11px] text-slate-300 font-mono">Base URL: api.opheliaos.com/v1</p>
              <p className="text-[11px] text-slate-300 font-mono">Key: oph_test_••••••••c9a180c5...</p>
              <p className="text-[11px] text-amber-300 font-mono mt-1">⚡ Practice Mode — No real purchases</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
