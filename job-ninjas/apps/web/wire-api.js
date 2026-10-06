const fs = require('fs');
let code = fs.readFileSync('src/components/board/candidate-concierge-node.tsx', 'utf8');

// 1. Add state for flights and dining results
code = code.replace(
  /const \[flightsState, setFlightsState\] = useState<'IDLE'\|'SEARCHING'\|'FOUND'>\('IDLE'\);/g,
  `const [flightsState, setFlightsState] = useState<'IDLE'|'SEARCHING'|'FOUND'>('IDLE');
  const [flights, setFlights] = useState<any[]>([]);`
);

code = code.replace(
  /const \[diningState, setDiningState\] = useState<'IDLE'\|'SEARCHING'\|'FOUND'>\('IDLE'\);/g,
  `const [diningState, setDiningState] = useState<'IDLE'|'SEARCHING'|'FOUND'>('IDLE');
  const [diningOptions, setDiningOptions] = useState<any[]>([]);`
);

// 2. Add API call functions inside the component
const fetchFunctions = `
  const searchFlights = async () => {
    try {
      setFlightsState('SEARCHING');
      const res = await fetch('/api/ophelia/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vertical: 'travel',
          providers: ['flights'],
          origin: SARAH.fromCode,
          destination: SARAH.toCode,
          date: SARAH.checkIn
        })
      });
      const data = await res.json();
      setFlights(data.results || []);
      setFlightsState('FOUND');
    } catch (e) {
      console.error(e);
      setFlightsState('IDLE');
    }
  };

  const searchDining = async () => {
    try {
      setDiningState('SEARCHING');
      const res = await fetch('/api/ophelia/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vertical: 'lifestyle',
          providers: ['dining'],
          location: SARAH.toCode,
          date: SARAH.checkIn
        })
      });
      const data = await res.json();
      setDiningOptions(data.results || []);
      setDiningState('FOUND');
    } catch (e) {
      console.error(e);
      setDiningState('IDLE');
    }
  };
`;

code = code.replace(
  /const searchHotels = useCallback\(async \(\) => \{/,
  fetchFunctions + '\n  const searchHotels = useCallback(async () => {'
);

// 3. Replace the onPointerDown buttons
code = code.replace(
  /onPointerDown=\{\(e\) => \{ e\.stopPropagation\(\);\s+e\.preventDefault\(\);\s+setFlightsState\('SEARCHING'\);\s+setTimeout\(\(\) => setFlightsState\('FOUND'\), 1500\);\s+\}\}/g,
  "onPointerDown={(e) => { e.stopPropagation(); e.preventDefault(); searchFlights(); }}"
);

code = code.replace(
  /onPointerDown=\{\(e\) => \{ e\.stopPropagation\(\);\s+e\.preventDefault\(\);\s+setDiningState\('SEARCHING'\);\s+setTimeout\(\(\) => setDiningState\('FOUND'\), 1500\);\s+\}\}/g,
  "onPointerDown={(e) => { e.stopPropagation(); e.preventDefault(); searchDining(); }}"
);

// 4. Use the dynamic data in rendering
code = code.replace(
  /\{\[\s*\{\s*airline:\s*SARAH\.fromCode[\s\S]*?\]\.map/g,
  '{flights.map'
);

code = code.replace(
  /\{\[\s*\{\s*name:\s*SARAH\.fromCode[\s\S]*?\]\.map/g,
  '{diningOptions.map'
);

fs.writeFileSync('src/components/board/candidate-concierge-node.tsx', code);
console.log('Done mapping API calls');
