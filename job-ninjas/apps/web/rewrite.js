const fs = require('fs');
let code = fs.readFileSync('src/components/board/candidate-concierge-node.tsx', 'utf8');

// 1. Make SARAH dynamic. It's currently at the top level. We can move it inside CandidateConciergeNode.
code = code.replace(
  /const SARAH = \{[\s\S]*?\};\n/,
  ''
);

// Insert SARAH inside CandidateConciergeNode
code = code.replace(
  'export const CandidateConciergeNode = ({ layerId, layer, isSelected }: { layerId: string; layer: any; isSelected: boolean }) => {',
  `export const CandidateConciergeNode = ({ layerId, layer, isSelected }: { layerId: string; layer: any; isSelected: boolean }) => {
  const SARAH = {
    name: layer.config?.candidateName || 'Sarah Chen',
    role: layer.config?.role || 'AI Engineer • Final Interview',
    fromCity: layer.config?.fromLocation || 'Atlanta, GA',
    toCity: layer.config?.toLocation || 'New York, NY',
    fromCode: (layer.config?.fromLocation || 'Atlanta').substring(0, 3).toUpperCase(),
    toCode: (layer.config?.toLocation || 'New York').substring(0, 3).toUpperCase(),
    checkIn: layer.config?.date || 'Oct 14',
    checkOut: 'Oct 15',
    budget: '$' + (layer.config?.budget || '800'),
  };\n`
);

// Inject flightsState and diningState
code = code.replace(
  'const [spent, setSpent] = useState(0);',
  `const [spent, setSpent] = useState(0);
  const [flightsState, setFlightsState] = useState<'IDLE'|'SEARCHING'|'FOUND'>('IDLE');
  const [diningState, setDiningState] = useState<'IDLE'|'SEARCHING'|'FOUND'>('IDLE');`
);

// Replace Flights Tab
const flightsRegex = /\{\/\* ───+ FLIGHTS TAB ───+ \*\/\}[\s\S]*?\{\/\* ───+ DINING TAB/;
const newFlights = `{/* ───────── FLIGHTS TAB ───────── */}
        {activeTab === 'flights' && (
            <div className="p-5 flex flex-col h-full overflow-y-auto pointer-events-auto" onPointerDown={(e) => e.stopPropagation()}>
              {flightsState === 'IDLE' && (
                <div className="flex flex-col items-center justify-center h-full my-auto pointer-events-auto">
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center max-w-sm">
                    <Plane className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <h4 className="font-bold text-slate-700 mb-1">Flights</h4>
                    <div className="flex items-center justify-center gap-3 text-slate-600 font-bold text-[13px] mb-4">
                      <span>{SARAH.fromCode}</span> <ArrowRight className="w-4 h-4 text-slate-400" /> <span>{SARAH.toCode}</span>
                    </div>
                    <button onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      setFlightsState('SEARCHING');
                      setTimeout(() => setFlightsState('FOUND'), 1500);
                    }} className="mt-4 w-full bg-violet-600 hover:bg-violet-700 text-white font-bold text-[12px] py-2.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer pointer-events-auto relative z-50">
                      <Plane className="w-4 h-4" /> Search Flights with Ophelia
                    </button>
                  </div>
                </div>
              )}
              {flightsState === 'SEARCHING' && (
                <div className="flex flex-col items-center justify-center h-full space-y-4 my-auto">
                  <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
                  <p className="text-sm font-medium text-slate-600">Searching Ophelia for Flights...</p>
                </div>
              )}
              {flightsState === 'FOUND' && (
                <div className="space-y-4 pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-bold text-slate-900 text-[16px]">Flight Options</h4>
                      <p className="text-[11px] text-slate-500">{SARAH.fromCode} to {SARAH.toCode} • {SARAH.checkIn}</p>
                    </div>
                    <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded border border-emerald-200">✓ 2 suitable flights found</span>
                  </div>
                  {[
                    { airline: 'Delta Airlines', time: '08:00 AM - 10:15 AM', price: '$245', type: 'Direct', id: 'f1' },
                    { airline: 'American Airlines', time: '09:30 AM - 11:45 AM', price: '$210', type: 'Direct', id: 'f2' }
                  ].map((f, i) => (
                    <div key={f.id} className={\`bg-white rounded-xl p-4 border transition-all \${i === 0 ? 'border-violet-500 ring-1 ring-violet-500 shadow-md relative' : 'border-slate-200 hover:border-slate-300'}\`}>
                      {i === 0 && <div className="absolute -top-2.5 right-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">✨ AI RECOMMENDED</div>}
                      <div className="flex justify-between items-start">
                        <div className="flex gap-3">
                          <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-100 shrink-0"><Plane className="w-5 h-5 text-slate-400" /></div>
                          <div>
                            <h5 className="font-bold text-slate-900 text-[13px] mb-0.5">{f.airline}</h5>
                            <p className="text-[11px] text-slate-500">{f.time} • {f.type}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-slate-900 text-[14px]">{f.price}</p>
                          <p className="text-[10px] text-slate-400">Economy</p>
                        </div>
                      </div>
                      <div className="mt-4 pt-3 border-t border-slate-100 flex gap-2 pointer-events-auto">
                        <button className={\`flex-1 py-2 rounded-lg text-[11px] font-bold transition-colors cursor-pointer pointer-events-auto relative z-50 \${i === 0 ? 'bg-violet-600 text-white hover:bg-violet-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}\`}>
                          Select Flight
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* ───────── DINING TAB`;

code = code.replace(flightsRegex, newFlights);

const diningRegex = /\{\/\* ───+ DINING TAB ───+ \*\/\}[\s\S]*?\{\/\* ───+ ITINERARY TAB/;
const newDining = `{/* ───────── DINING TAB ───────── */}
        {activeTab === 'dining' && (
            <div className="p-5 flex flex-col h-full overflow-y-auto pointer-events-auto" onPointerDown={(e) => e.stopPropagation()}>
              {diningState === 'IDLE' && (
                <div className="flex flex-col items-center justify-center h-full my-auto pointer-events-auto">
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center max-w-sm">
                    <Utensils className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <h4 className="font-bold text-slate-700 mb-1">Candidate Dinner</h4>
                    <p className="text-[11px] text-slate-500 mb-4">{SARAH.toCity} • {SARAH.checkIn} • 7:00 PM • Party of 2</p>
                    <button onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      setDiningState('SEARCHING');
                      setTimeout(() => setDiningState('FOUND'), 1500);
                    }} className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold text-[12px] py-2.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer pointer-events-auto relative z-50">
                      <Utensils className="w-4 h-4" /> Find Dinner Options
                    </button>
                  </div>
                </div>
              )}
              {diningState === 'SEARCHING' && (
                <div className="flex flex-col items-center justify-center h-full space-y-4 my-auto">
                  <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
                  <p className="text-sm font-medium text-slate-600">Searching Local Dining...</p>
                </div>
              )}
              {diningState === 'FOUND' && (
                <div className="space-y-4 pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-bold text-slate-900 text-[16px]">Dining Options</h4>
                      <p className="text-[11px] text-slate-500">Near {SARAH.toCity}</p>
                    </div>
                    <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded border border-emerald-200">✓ 2 options found</span>
                  </div>
                  {[
                    { name: 'Le Bernardin', type: 'Seafood • $$$$', rating: '4.9', dist: '0.4 mi', id: 'd1' },
                    { name: 'Keens Steakhouse', type: 'Steakhouse • $$$', rating: '4.7', dist: '0.6 mi', id: 'd2' }
                  ].map((d, i) => (
                    <div key={d.id} className={\`bg-white rounded-xl p-4 border transition-all \${i === 0 ? 'border-violet-500 ring-1 ring-violet-500 shadow-md relative' : 'border-slate-200 hover:border-slate-300'}\`}>
                      {i === 0 && <div className="absolute -top-2.5 right-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">✨ AI RECOMMENDED</div>}
                      <div className="flex justify-between items-start">
                        <div className="flex gap-3">
                          <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-100 shrink-0"><Utensils className="w-5 h-5 text-slate-400" /></div>
                          <div>
                            <h5 className="font-bold text-slate-900 text-[13px] mb-0.5">{d.name}</h5>
                            <p className="text-[11px] text-slate-500">{d.type} • ★ {d.rating}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-slate-900 text-[12px]">{d.dist}</p>
                        </div>
                      </div>
                      <div className="mt-4 pt-3 border-t border-slate-100 flex gap-2 pointer-events-auto">
                        <button className={\`flex-1 py-2 rounded-lg text-[11px] font-bold transition-colors cursor-pointer pointer-events-auto relative z-50 \${i === 0 ? 'bg-violet-600 text-white hover:bg-violet-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}\`}>
                          Reserve Table
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ───────── ITINERARY TAB`;
code = code.replace(diningRegex, newDining);

fs.writeFileSync('src/components/board/candidate-concierge-node.tsx', code);
