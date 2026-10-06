import React, { useState, useEffect } from 'react';
import { PlaneTakeoff, Loader2, CheckCircle2, MapPin, Building, AlertCircle } from 'lucide-react';
import { useBoardStore } from '@/store/board';
import { useDemoStore } from '@/lib/store';

export const CandidateConciergeNode = ({ layerId, layer, isSelected }: { layerId: string, layer: any, isSelected: boolean }) => {
  const updateLayer = useBoardStore(state => state.updateLayer);
  
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState('');

  // Auto-fetch if there's no data and it's not already loading
  useEffect(() => {
    if (layer.status === 'running' && hotels.length === 0 && !loading && !layer.config?.bookingConfirmed) {
      searchHotels();
    }
  }, [layer.status]);

  const searchHotels = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/ophelia/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: 'New York, NY',
          checkIn: '2026-10-14',
          checkOut: '2026-10-15',
          budget: 800,
          purpose: 'candidate onsite interview'
        })
      });
      if (!res.ok) throw new Error('Search failed');
      const data = await res.json();
      setHotels(data.results || []);
    } catch (err: any) {
      setError("Candidate Concierge couldn't retrieve availability. Retry search.");
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async (hotelId: string) => {
    setBooking(true);
    setError('');
    try {
      const res = await fetch('/api/ophelia/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hotelId,
          candidateDetails: { name: 'Sarah Chen' }
        })
      });
      if (!res.ok) throw new Error('Booking failed');
      const data = await res.json();
      
      // Update layer state to confirmed
      updateLayer(layerId, {
        config: {
          ...layer.config,
          bookingConfirmed: data,
        },
        status: 'completed'
      } as any);

      // Find candidate node and update it
      // For hackathon: we just update any candidate-node layer's status
      const { layers, updateLayer: up } = useBoardStore.getState();
      Object.entries(layers).forEach(([id, l]) => {
        if (l.type === 1 /* LayerType.Agent */ && l.agentRole === 'candidate-node') {
          up(id, { status: 'Onsite Ready' } as any);
        }
      });
      
      // Update global store
      const { updateCandidate } = useDemoStore.getState();
      if (updateCandidate) {
        updateCandidate('candidate-sarah', { status: 'Onsite Ready', onsiteDetails: data });
      }
    } catch (err: any) {
      setError('Booking failed. Please try again.');
    } finally {
      setBooking(false);
    }
  };

  if (layer.config?.bookingConfirmed) {
    const conf = layer.config.bookingConfirmed;
    return (
      <div className={`w-full h-full rounded-xl border-2 flex flex-col overflow-hidden bg-card shadow-xl ${isSelected ? 'border-rose-500 shadow-rose-500/20' : 'border-border'}`}>
        <div className="bg-rose-100 dark:bg-rose-900/30 px-3 py-2 border-b border-rose-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PlaneTakeoff className="w-4 h-4 text-rose-600" />
            <h3 className="font-bold text-sm text-foreground">Candidate Concierge</h3>
          </div>
        </div>
        <div className="p-4 flex flex-col items-center justify-center text-center h-full gap-2">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
          <h4 className="font-bold text-green-600 uppercase">✓ ONSITE READY</h4>
          <p className="text-xs text-slate-500">Hotel Confirmed: {conf.confirmationId}</p>
          <p className="text-xs font-bold">{conf.itemName}</p>
          <p className="text-xs text-slate-500">${conf.amount} {conf.currency}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full h-full rounded-xl border-2 flex flex-col overflow-hidden bg-card shadow-xl ${isSelected ? 'border-rose-500 shadow-rose-500/20' : 'border-border'}`}>
      <div className="bg-rose-100 dark:bg-rose-900/30 px-3 py-2 border-b border-rose-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PlaneTakeoff className="w-4 h-4 text-rose-600" />
          <h3 className="font-bold text-sm text-foreground">Candidate Concierge</h3>
        </div>
      </div>
      <div className="p-3 overflow-y-auto flex-1 bg-white dark:bg-slate-950 pointer-events-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-rose-500" />
            <p className="text-xs text-slate-500">Searching accommodation near interview...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
            <AlertCircle className="w-8 h-8 text-red-500" />
            <p className="text-xs text-red-600 font-medium">{error}</p>
            <button onClick={searchHotels} className="px-3 py-1 bg-rose-100 hover:bg-rose-200 text-rose-700 text-xs rounded font-bold">
              Retry
            </button>
          </div>
        ) : hotels.length > 0 ? (
          <div className="space-y-3">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">RECOMMENDED</p>
            {hotels.slice(0, 1).map(hotel => (
              <div key={hotel.id} className="border border-rose-200 bg-rose-50 rounded-lg p-2 flex flex-col gap-2 relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <div className="pr-16">
                    <h4 className="text-sm font-bold">{hotel.name}</h4>
                    <p className="text-xs text-slate-600 flex items-center gap-1"><MapPin className="w-3 h-3"/> {hotel.location} • {hotel.distanceFromInterview}</p>
                  </div>
                  <div className="text-right absolute top-2 right-2 bg-white/80 p-1 rounded backdrop-blur-sm">
                    <p className="text-sm font-black text-rose-600">${hotel.price}</p>
                    <p className="text-[10px] text-slate-500">/night</p>
                  </div>
                </div>
                <div className="w-full h-24 rounded bg-cover bg-center" style={{backgroundImage: `url(${hotel.image})`}} />
                <p className="text-[10px] italic text-slate-600">Closest suitable option within the candidate travel budget.</p>
                <div className="flex gap-2 mt-1">
                  <button 
                    disabled={booking}
                    onClick={() => handleBook(hotel.id)} 
                    className="flex-1 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-bold py-1.5 rounded flex justify-center items-center gap-1"
                  >
                    {booking ? <Loader2 className="w-3 h-3 animate-spin"/> : null}
                    Approve & Book
                  </button>
                  <button className="px-2 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded">
                    Other Options
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <p className="text-xs text-slate-500 mb-3">Connect to candidate to arrange onsite logistics.</p>
            {layer.status !== 'running' && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  updateLayer(layerId, { status: 'running' } as any);
                }}
                className="px-4 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-700 text-xs rounded font-bold"
              >
                Arrange Onsite
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
