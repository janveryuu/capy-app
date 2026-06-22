const fs = require('fs');

const places = [
  { id: 'matterhorn', name: 'The Matterhorn', country: 'Zermatt, Switzerland', query: 'Matterhorn Zermatt', tag: 'Adventure', temp: '2°' },
  { id: 'forbidden-city', name: 'Forbidden City', country: 'Beijing, China', query: 'Forbidden City Beijing', tag: 'Cultural', temp: '18°' },
  { id: 'disney-world', name: 'Walt Disney World', country: 'Orlando, Florida', query: 'Walt Disney World Orlando', tag: 'Sunny', temp: '28°' },
  { id: 'great-wall', name: 'Great Wall of China', country: 'China', query: 'Great Wall of China', tag: 'Cultural', temp: '15°' },
  { id: 'golden-gate', name: 'Golden Gate Bridge', country: 'San Francisco, CA', query: 'Golden Gate Bridge', tag: 'Nearby', temp: '16°' },
  { id: 'taj-mahal', name: 'Taj Mahal', country: 'Agra, India', query: 'Taj Mahal', tag: 'Romantic', temp: '32°' },
  { id: 'colosseum', name: 'The Colosseum', country: 'Rome, Italy', query: 'Colosseum Rome', tag: 'Cultural', temp: '22°' },
  { id: 'giza', name: 'Pyramids of Giza', country: 'Egypt', query: 'Pyramids of Giza', tag: 'Adventure', temp: '35°' },
  { id: 'angkor-wat', name: 'Angkor Wat', country: 'Cambodia', query: 'Angkor Wat', tag: 'Zen', temp: '31°' },
  { id: 'petra', name: 'Petra', country: 'Jordan', query: 'Petra Jordan', tag: 'Adventure', temp: '25°' },
  { id: 'sydney-opera', name: 'Sydney Opera House', country: 'Australia', query: 'Sydney Opera House sunset', tag: 'Cultural', temp: '21°' },
  { id: 'statue-liberty', name: 'Statue of Liberty', country: 'New York', query: 'Statue of Liberty', tag: 'Cultural', temp: '18°' },
  { id: 'louvre', name: 'Louvre Museum', country: 'Paris, France', query: 'Louvre pyramid night', tag: 'Romantic', temp: '16°' },
  { id: 'everest', name: 'Mount Everest', country: 'Nepal', query: 'Mount Everest peak', tag: 'Adventure', temp: '-10°' },
  { id: 'victoria-falls', name: 'Victoria Falls', country: 'Zambia / Zimbabwe', query: 'Victoria Falls', tag: 'Nature', temp: '24°' },
  { id: 'grand-canyon', name: 'Grand Canyon', country: 'Arizona, USA', query: 'Grand Canyon sunset', tag: 'Nature', temp: '30°' },
  { id: 'niagara', name: 'Niagara Falls', country: 'Canada / USA', query: 'Niagara Falls', tag: 'Nature', temp: '19°' },
  { id: 'stonehenge', name: 'Stonehenge', country: 'United Kingdom', query: 'Stonehenge', tag: 'Cultural', temp: '12°' },
  { id: 'sagrada', name: 'Sagrada Familia', country: 'Barcelona, Spain', query: 'Sagrada Familia inside', tag: 'Cultural', temp: '23°' },
  { id: 'burj', name: 'Burj Khalifa', country: 'Dubai, UAE', query: 'Burj Khalifa night', tag: 'Adventure', temp: '33°' },
  { id: 'christ-redeemer', name: 'Christ the Redeemer', country: 'Rio, Brazil', query: 'Christ the Redeemer Rio', tag: 'Sunny', temp: '27°' },
  { id: 'venice', name: 'Venice Canals', country: 'Italy', query: 'Venice canals gondola', tag: 'Romantic', temp: '21°' },
  { id: 'acropolis', name: 'Acropolis of Athens', country: 'Greece', query: 'Acropolis Athens sunset', tag: 'Cultural', temp: '25°' }
];

async function fetchIds() {
  let output = '';
  for (const place of places) {
    try {
      const res = await fetch(`https://unsplash.com/napi/search/photos?query=${encodeURIComponent(place.query)}&per_page=1`);
      const data = await res.json();
      const imgId = data.results[0].id;
      
      output += `  {
    id: '${place.id}',
    name: '${place.name}',
    country: '${place.country}',
    src: 'https://images.unsplash.com/photo-${imgId}?w=2000&q=100&fit=crop&auto=format',
    note: 'Stunning 4K view of ${place.name}, an iconic must-see.',
    tag: '${place.tag}',
    temp: '${place.temp}',
  },\n`;
      console.log(`Fetched ${place.name}`);
    } catch(e) {
      console.error(`Failed ${place.name}`, e.message);
    }
  }
  fs.writeFileSync('new-destinations.txt', output);
  console.log('Done writing new-destinations.txt');
}

fetchIds();
