import {
  Laugh,
  Smile,
  Meh,
  Frown,
  CloudRain,
  Moon,
  Briefcase,
  Users,
  Dumbbell,
  Cloud,
  UtensilsCrossed,
  type LucideIcon,
} from 'lucide-react'

export type Mood = {
  id: number
  label: string
  caption: string
  icon: LucideIcon
  /** tailwind classes for the bubble */
  bg: string
  ring: string
  iconColor: string
  /** 1 (low) - 5 (great) for analytics */
  score: number
}

export const MOODS: Mood[] = [
  {
    id: 5,
    label: 'Amazing',
    caption: 'Floating on a sunbeam',
    icon: Laugh,
    bg: 'bg-matcha',
    ring: 'ring-matcha-foreground/30',
    iconColor: 'text-matcha-foreground',
    score: 5,
  },
  {
    id: 4,
    label: 'Good',
    caption: 'Warm and easy',
    icon: Smile,
    bg: 'bg-honey',
    ring: 'ring-honey-foreground/30',
    iconColor: 'text-honey-foreground',
    score: 4,
  },
  {
    id: 3,
    label: 'Okay',
    caption: 'Just drifting along',
    icon: Meh,
    bg: 'bg-secondary',
    ring: 'ring-secondary-foreground/20',
    iconColor: 'text-secondary-foreground',
    score: 3,
  },
  {
    id: 2,
    label: 'Low',
    caption: 'A little heavy today',
    icon: Frown,
    bg: 'bg-caramel/25',
    ring: 'ring-caramel/40',
    iconColor: 'text-caramel',
    score: 2,
  },
  {
    id: 1,
    label: 'Stressed',
    caption: 'Need a cozy nap',
    icon: CloudRain,
    bg: 'bg-destructive/15',
    ring: 'ring-destructive/30',
    iconColor: 'text-destructive',
    score: 1,
  },
]

/** Maps a mood score (1-5) to a token color for the heatmap. */
export function scoreColor(score: number | null): string {
  switch (score) {
    case 5:
      return 'bg-matcha'
    case 4:
      return 'bg-honey'
    case 3:
      return 'bg-secondary'
    case 2:
      return 'bg-caramel/40'
    case 1:
      return 'bg-destructive/30'
    default:
      return 'bg-muted/60'
  }
}

export const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

/** Simple seeded pseudo-random for deterministic heatmap (avoids hydration mismatch) */
function seededRandom(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

/** 12 weeks of deterministic gentle mood history for the heatmap. */
export function buildHeatmap(weeks = 12): (number | null)[][] {
  const rng = seededRandom(42)
  const grid: (number | null)[][] = []
  let prev = 4
  for (let w = 0; w < weeks; w++) {
    const week: (number | null)[] = []
    for (let d = 0; d < 7; d++) {
      // gentle random walk, bounded 1..5
      const drift = Math.round((Math.sin(w * 1.3 + d * 0.9) + rng() - 0.5) * 1.2)
      let v = Math.max(1, Math.min(5, prev + drift))
      // leave the last couple days of the final week empty (future)
      if (w === weeks - 1 && d > 4) v = NaN
      week.push(Number.isNaN(v) ? null : v)
      if (!Number.isNaN(v)) prev = v
    }
    grid.push(week)
  }
  return grid
}

/** Weekly average mood for the soft area chart (last 7 days). */
export const WEEK_TREND = [
  { day: 'Mon', score: 3.2 },
  { day: 'Tue', score: 4.1 },
  { day: 'Wed', score: 2.8 },
  { day: 'Thu', score: 3.6 },
  { day: 'Fri', score: 4.4 },
  { day: 'Sat', score: 4.8 },
  { day: 'Sun', score: 4.2 },
]

export type TripStop = {
  time: string
  title: string
  detail: string
  done: boolean
}

export type Trip = {
  id: string
  destination: string
  country: string
  dateRange: string
  daysAway: number
  emoji: string
  itinerary: TripStop[]
}

export const UPCOMING_TRIP: Trip = {
  id: 'kyoto',
  destination: 'Kyoto',
  country: 'Japan',
  dateRange: 'Apr 14 – Apr 21',
  daysAway: 12,
  emoji: '🍃',
  itinerary: [
    {
      time: 'Day 1',
      title: 'Arrival & onsen soak',
      detail: 'Check in, then a long warm yuzu bath to wash off the flight.',
      done: true,
    },
    {
      time: 'Day 2',
      title: 'Arashiyama bamboo grove',
      detail: 'Slow morning stroll, matcha soft-serve, river boat at noon.',
      done: true,
    },
    {
      time: 'Day 3',
      title: 'Fushimi Inari trail',
      detail: 'Sunrise climb through the orange gates before the crowds.',
      done: false,
    },
    {
      time: 'Day 4',
      title: 'Tea house & garden day',
      detail: 'A gentle, unscheduled day to journal and just breathe.',
      done: false,
    },
  ],
}

/** Curated explore destinations for the Explore tab. */
export type Destination = {
  id: string
  name: string
  country: string
  src: string
  note: string
  tag: 'Cozy' | 'Adventure' | 'Tropical' | 'Zen' | 'Sunny' | 'Romantic' | 'Cultural' | 'Nature'
  temp: string
}

/**
 * Large curated pool of world-famous destinations.
 * Images use permanent Unsplash photo IDs — always high quality, never broken.
 * w=800 keeps load fast; fit=crop ensures consistent framing.
 */
export const DESTINATION_POOL: Destination[] = [
  {
    id: 'santorini',
    name: 'Santorini',
    country: 'Aegean Sea, Greece',
    src: '/destinations/santorini.jpg',
    note: 'Whitewashed cliffs, deep blue domes, and endless golden-hour sunsets.',
    tag: 'Romantic',
    temp: '24°',
  },
  {
    id: 'kyoto',
    name: 'Kyoto',
    country: 'Japan',
    src: '/destinations/kyoto.jpg',
    note: 'Ancient temples, soft maple light, and the hush of bamboo forests.',
    tag: 'Zen',
    temp: '18°',
  },
  {
    id: 'maldives',
    name: 'Maldives',
    country: 'Indian Ocean',
    src: '/destinations/maldives.jpg',
    note: 'Crystalline lagoons and overwater bungalows where time stands still.',
    tag: 'Tropical',
    temp: '29°',
  },
  {
    id: 'paris',
    name: 'Paris',
    country: 'France',
    src: '/destinations/paris.jpg',
    note: 'Romantic city lights, warm croissants, and slow walks along the Seine.',
    tag: 'Romantic',
    temp: '16°',
  },
  {
    id: 'bali',
    name: 'Ubud, Bali',
    country: 'Indonesia',
    src: '/destinations/bali.jpg',
    note: 'Lush rice terraces, jungle temples, and the sweetest morning mist.',
    tag: 'Nature',
    temp: '27°',
  },
  {
    id: 'cappadocia',
    name: 'Cappadocia',
    country: 'Türkiye',
    src: '/destinations/cappadocia.jpg',
    note: 'Drift over fairy chimneys in a hot-air balloon as the sun rises.',
    tag: 'Adventure',
    temp: '14°',
  },
  {
    id: 'amalfi',
    name: 'Amalfi Coast',
    country: 'Italy',
    src: '/destinations/amalfi.jpg',
    note: 'Dramatic sea cliffs, lemon groves, and pastel fishing villages.',
    tag: 'Sunny',
    temp: '22°',
  },
  {
    id: 'fuji',
    name: 'Mount Fuji',
    country: 'Honshu, Japan',
    src: '/destinations/fuji.jpg',
    note: 'Crisp mountain air, mirror-still lakes, and breathtaking mindful mornings.',
    tag: 'Zen',
    temp: '12°',
  },
  {
    id: 'swiss-alps',
    name: 'Swiss Alps',
    country: 'Switzerland',
    src: '/destinations/swissalps.jpg',
    note: 'Snow-capped peaks, cozy chalets, and the cleanest air on earth.',
    tag: 'Adventure',
    temp: '5°',
  },
  {
    id: 'banff',
    name: 'Banff',
    country: 'Alberta, Canada',
    src: '/destinations/banff.jpg',
    note: 'Turquoise glacial lakes framed by dramatic Rocky Mountain peaks.',
    tag: 'Nature',
    temp: '8°',
  },
  {
    id: 'prague',
    name: 'Prague',
    country: 'Czech Republic',
    src: '/destinations/prague.jpg',
    note: 'Medieval cobblestones, gothic spires, and warm amber street lamps.',
    tag: 'Cultural',
    temp: '13°',
  },
  {
    id: 'machu-picchu',
    name: 'Machu Picchu',
    country: 'Cusco, Peru',
    src: '/destinations/machu-picchu.jpg',
    note: 'The lost city in the clouds — mystical, misty, and unforgettable.',
    tag: 'Adventure',
    temp: '17°',
  },
  {
    id: 'iceland',
    name: 'Northern Lights',
    country: 'Iceland',
    src: '/destinations/iceland.jpg',
    note: 'Aurora-lit skies, volcanic hot springs, and wild untouched lava fields.',
    tag: 'Nature',
    temp: '-2°',
  },
  {
    id: 'queenstown',
    name: 'Queenstown',
    country: 'New Zealand',
    src: '/destinations/queenstown.jpg',
    note: 'Fjord-framed mountains and the adventure capital of the southern world.',
    tag: 'Adventure',
    temp: '14°',
  },
  {
    id: 'lisbon',
    name: 'Lisbon',
    country: 'Portugal',
    src: '/destinations/lisbon.jpg',
    note: 'Sunny tiled hills, electric trams, and melancholic fado evenings.',
    tag: 'Cultural',
    temp: '21°',
  },
  {
    id: 'cinque-terre',
    name: 'Cinque Terre',
    country: 'Liguria, Italy',
    src: '/destinations/cinque-terre.jpg',
    note: 'Five technicolor villages clinging to cliffsides above the blue sea.',
    tag: 'Sunny',
    temp: '20°',
  },
  {
    id: 'tuscany',
    name: 'Tuscany',
    country: 'Italy',
    src: '/destinations/tuscany.jpg',
    note: 'Rolling golden hills, cypress lanes, and wine that warms the soul.',
    tag: 'Cozy',
    temp: '19°',
  },
  {
    id: 'tokyo',
    name: 'Tokyo',
    country: 'Japan',
    src: '/destinations/tokyo.jpg',
    note: 'Neon-lit crossings, cherry blossom alleys, and ramen at midnight.',
    tag: 'Cultural',
    temp: '20°',
  },
  {
    id: 'boracay',
    name: 'Boracay',
    country: 'Aklan, Philippines',
    src: '/destinations/boracay.jpg',
    note: 'Powder-white sand and calm crystal waters to wash all stress away.',
    tag: 'Tropical',
    temp: '30°',
  },
  {
    id: 'nyc',
    name: 'New York City',
    country: 'United States',
    src: '/destinations/nyc.jpg',
    note: 'The city that never sleeps — iconic skylines and endless energy.',
    tag: 'Cultural',
    temp: '15°',
  },
  {
    id: 'barcelona',
    name: 'Barcelona',
    country: 'Spain',
    src: '/destinations/barcelona.jpg',
    note: "Gaudí's dreamy spires, tapas by the sea, and vibrant late nights.",
    tag: 'Sunny',
    temp: '23°',
  },
  {
    id: 'dubai',
    name: 'Dubai',
    country: 'UAE',
    src: '/destinations/dubai.jpg',
    note: 'Futuristic towers rising from the desert beside a turquoise gulf.',
    tag: 'Adventure',
    temp: '32°',
  },
  {
    id: 'hoian',
    name: 'Hội An',
    country: 'Vietnam',
    src: '/destinations/hoian.jpg',
    note: 'Lantern-lit ancient streets, riverside cafés, and tailor-made silk.',
    tag: 'Cultural',
    temp: '26°',
  },
  {
    id: 'phuket',
    name: 'Phuket',
    country: 'Thailand',
    src: '/destinations/phuket.jpg',
    note: 'Emerald bays, limestone karsts, and warm Thai sunsets on the beach.',
    tag: 'Tropical',
    temp: '31°',
  },
  {
    id: 'matterhorn',
    name: 'The Matterhorn',
    country: 'Zermatt, Switzerland',
    src: '/destinations/matterhorn.jpg',
    note: 'Stunning 4K view of The Matterhorn, an iconic must-see.',
    tag: 'Adventure',
    temp: '2°',
  },
  {
    id: 'forbidden-city',
    name: 'Forbidden City',
    country: 'Beijing, China',
    src: '/destinations/forbidden-city.jpg',
    note: 'Stunning 4K view of Forbidden City, an iconic must-see.',
    tag: 'Cultural',
    temp: '18°',
  },
  {
    id: 'disney-world',
    name: 'Walt Disney World',
    country: 'Orlando, Florida',
    src: '/destinations/disney-world.jpg',
    note: 'Stunning 4K view of Walt Disney World, an iconic must-see.',
    tag: 'Sunny',
    temp: '28°',
  },
  {
    id: 'great-wall',
    name: 'Great Wall of China',
    country: 'China',
    src: '/destinations/greatwall.jpg',
    note: 'Stunning 4K view of Great Wall of China, an iconic must-see.',
    tag: 'Cultural',
    temp: '15°',
  },
  {
    id: 'golden-gate',
    name: 'Golden Gate Bridge',
    country: 'San Francisco, CA',
    src: '/destinations/golden-gate.jpg',
    note: 'Stunning 4K view of Golden Gate Bridge, an iconic must-see.',
    tag: 'Nearby',
    temp: '16°',
  },
  {
    id: 'taj-mahal',
    name: 'Taj Mahal',
    country: 'Agra, India',
    src: '/destinations/taj-mahal.jpg',
    note: 'Stunning 4K view of Taj Mahal, an iconic must-see.',
    tag: 'Romantic',
    temp: '32°',
  },
  {
    id: 'colosseum',
    name: 'The Colosseum',
    country: 'Rome, Italy',
    src: '/destinations/colosseum.jpg',
    note: 'Stunning 4K view of The Colosseum, an iconic must-see.',
    tag: 'Cultural',
    temp: '22°',
  },
  {
    id: 'giza',
    name: 'Pyramids of Giza',
    country: 'Egypt',
    src: '/destinations/giza.jpg',
    note: 'Stunning 4K view of Pyramids of Giza, an iconic must-see.',
    tag: 'Adventure',
    temp: '35°',
  },
  {
    id: 'angkor-wat',
    name: 'Angkor Wat',
    country: 'Cambodia',
    src: '/destinations/angkor-wat.jpg',
    note: 'Stunning 4K view of Angkor Wat, an iconic must-see.',
    tag: 'Zen',
    temp: '31°',
  },
  {
    id: 'petra',
    name: 'Petra',
    country: 'Jordan',
    src: '/destinations/petra.jpg',
    note: 'Stunning 4K view of Petra, an iconic must-see.',
    tag: 'Adventure',
    temp: '25°',
  },
  {
    id: 'sydney-opera',
    name: 'Sydney Opera House',
    country: 'Australia',
    src: '/destinations/sydney-opera.jpg',
    note: 'Stunning 4K view of Sydney Opera House, an iconic must-see.',
    tag: 'Cultural',
    temp: '21°',
  },
  {
    id: 'statue-liberty',
    name: 'Statue of Liberty',
    country: 'New York',
    src: '/destinations/statue-liberty.jpg',
    note: 'Stunning 4K view of Statue of Liberty, an iconic must-see.',
    tag: 'Cultural',
    temp: '18°',
  },
  {
    id: 'louvre',
    name: 'Louvre Museum',
    country: 'Paris, France',
    src: '/destinations/louvre.jpg',
    note: 'Stunning 4K view of Louvre Museum, an iconic must-see.',
    tag: 'Romantic',
    temp: '16°',
  },
  {
    id: 'everest',
    name: 'Mount Everest',
    country: 'Nepal',
    src: '/destinations/everest.jpg',
    note: 'Stunning 4K view of Mount Everest, an iconic must-see.',
    tag: 'Adventure',
    temp: '-10°',
  },
  {
    id: 'victoria-falls',
    name: 'Victoria Falls',
    country: 'Zambia / Zimbabwe',
    src: '/destinations/victoria-falls.jpg',
    note: 'Stunning 4K view of Victoria Falls, an iconic must-see.',
    tag: 'Nature',
    temp: '24°',
  },
  {
    id: 'grand-canyon',
    name: 'Grand Canyon',
    country: 'Arizona, USA',
    src: '/destinations/grand-canyon.jpg',
    note: 'Stunning 4K view of Grand Canyon, an iconic must-see.',
    tag: 'Nature',
    temp: '30°',
  },
  {
    id: 'niagara',
    name: 'Niagara Falls',
    country: 'Canada / USA',
    src: '/destinations/niagara.jpg',
    note: 'Stunning 4K view of Niagara Falls, an iconic must-see.',
    tag: 'Nature',
    temp: '19°',
  },
  {
    id: 'stonehenge',
    name: 'Stonehenge',
    country: 'United Kingdom',
    src: '/destinations/stonehenge.jpg',
    note: 'Stunning 4K view of Stonehenge, an iconic must-see.',
    tag: 'Cultural',
    temp: '12°',
  },
  {
    id: 'sagrada',
    name: 'Sagrada Familia',
    country: 'Barcelona, Spain',
    src: '/destinations/sagrada.jpg',
    note: 'Stunning 4K view of Sagrada Familia, an iconic must-see.',
    tag: 'Cultural',
    temp: '23°',
  },
  {
    id: 'burj',
    name: 'Burj Khalifa',
    country: 'Dubai, UAE',
    src: '/destinations/burj.jpg',
    note: 'Stunning 4K view of Burj Khalifa, an iconic must-see.',
    tag: 'Adventure',
    temp: '33°',
  },
  {
    id: 'christ-redeemer',
    name: 'Christ the Redeemer',
    country: 'Rio, Brazil',
    src: '/destinations/christ-redeemer.jpg',
    note: 'Stunning 4K view of Christ the Redeemer, an iconic must-see.',
    tag: 'Sunny',
    temp: '27°',
  },
  {
    id: 'venice',
    name: 'Venice Canals',
    country: 'Italy',
    src: '/destinations/venice.jpg',
    note: 'Stunning 4K view of Venice Canals, an iconic must-see.',
    tag: 'Romantic',
    temp: '21°',
  },
  {
    id: 'acropolis',
    name: 'Acropolis of Athens',
    country: 'Greece',
    src: '/destinations/acropolis.jpg',
    note: 'Stunning 4K view of Acropolis of Athens, an iconic must-see.',
    tag: 'Cultural',
    temp: '25°',
  },
]

/**
 * Date-seeded shuffle — same day always returns the same order (no hydration mismatch).
 * Uses the date string as a seed for a simple LCG shuffle.
 */
function seededShuffle<T>(arr: T[], seed: number): T[] {
  const result = [...arr]
  let s = seed
  const rng = () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    return (s >>> 0) / 0x100000000
  }
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

/** Hash a date string to a stable integer seed. */
function dateSeed(date: Date): number {
  const str = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (Math.imul(31, hash) + str.charCodeAt(i)) | 0
  }
  return Math.abs(hash)
}

/**
 * Returns today's 4 grid destinations + 1 spotlight, rotating every day.
 * Pass a date or seedOffset to override (useful for testing or manual refresh).
 */
export function getDailyDestinations(date: Date = new Date(), seedOffset: number = 0): {
  grid: Destination[]
  spotlight: Destination
} {
  const shuffled = seededShuffle(DESTINATION_POOL, dateSeed(date) + seedOffset)
  // spotlight is always a different entry from the 4 grid picks
  const grid = shuffled.slice(0, 4)
  const spotlight = shuffled[4] // 5th entry — always distinct from grid
  return { grid, spotlight }
}

// Keep DESTINATIONS as an alias for search fallback (all destinations)
export const DESTINATIONS = DESTINATION_POOL

/** Vibe tag → token color classes for the explore pills. */
export function tagColor(tag: Destination['tag']): string {
  switch (tag) {
    case 'Cozy':
      return 'bg-honey text-honey-foreground'
    case 'Adventure':
      return 'bg-matcha text-matcha-foreground'
    case 'Tropical':
      return 'bg-sky-400/80 text-white'
    case 'Zen':
      return 'bg-emerald-600/80 text-white'
    case 'Sunny':
      return 'bg-amber-400/90 text-amber-950'
    case 'Romantic':
      return 'bg-rose-400/80 text-white'
    case 'Cultural':
      return 'bg-caramel text-caramel-foreground'
    case 'Nature':
      return 'bg-green-600/80 text-white'
    default:
      return 'bg-secondary text-secondary-foreground'
  }
}

/** A saved/planned trip for the My Trips tab. */
export type PlannedTrip = {
  id: string
  destination: string
  country: string
  dateRange: string
  emoji: string
  days: number
  note: string
  status: 'planned' | 'completed'
}

export const PLANNED_TRIPS: PlannedTrip[] = [
  {
    id: 'kyoto-spring',
    destination: 'Kyoto',
    country: 'Japan',
    dateRange: 'Apr 14 – Apr 21',
    emoji: '🍃',
    days: 8,
    note: 'Temples, tea houses, and a slow onsen day to recharge.',
    status: 'planned',
  },
  {
    id: 'hoian-lanterns',
    destination: 'Hoi An',
    country: 'Vietnam',
    dateRange: 'Jun 02 – Jun 07',
    emoji: '🏮',
    days: 5,
    note: 'Lantern nights, tailor shops, and riverside café mornings.',
    status: 'planned',
  },
  {
    id: 'okinawa-past',
    destination: 'Okinawa',
    country: 'Japan',
    dateRange: 'Last Aug',
    emoji: '🏝️',
    days: 6,
    note: 'Golden-hour beaches and the calmest sunset toes ever.',
    status: 'completed',
  },
  {
    id: 'gion-past',
    destination: 'Gion',
    country: 'Japan',
    dateRange: 'Last Nov',
    emoji: '🏮',
    days: 3,
    note: 'A short lantern wander through old wooden streets.',
    status: 'completed',
  },
]

export type Memory = {
  id: string
  src: string
  caption: string
  location: string
  rotate: number
}

export const MEMORIES: Memory[] = [
  {
    id: 'onsen',
    src: '/memory-onsen.png',
    caption: 'Yuzu bath bliss',
    location: 'Hakone',
    rotate: -6,
  },
  {
    id: 'beach',
    src: '/memory-beach.png',
    caption: 'Golden hour toes',
    location: 'Okinawa',
    rotate: 4,
  },
  {
    id: 'forest',
    src: '/memory-forest.png',
    caption: 'Misty fern walk',
    location: 'Yakushima',
    rotate: -3,
  },
  {
    id: 'city',
    src: '/memory-city.png',
    caption: 'Lantern wander',
    location: 'Gion',
    rotate: 7,
  },
]

/* ═══════════════════════════════════════════════
   MOOD SECTION ENHANCEMENTS — Seed Data
   ═══════════════════════════════════════════════ */



/** Influence tags for the richer check-in (Feature 1). */
export type MoodTag = {
  id: string
  label: string
  icon: LucideIcon
  color: string
}

export const MOOD_TAGS: MoodTag[] = [
  { id: 'sleep', label: 'Sleep', icon: Moon, color: 'bg-indigo-100 text-indigo-600' },
  { id: 'work', label: 'Work', icon: Briefcase, color: 'bg-amber-100 text-amber-700' },
  { id: 'friends', label: 'Friends', icon: Users, color: 'bg-pink-100 text-pink-600' },
  { id: 'exercise', label: 'Exercise', icon: Dumbbell, color: 'bg-emerald-100 text-emerald-600' },
  { id: 'weather', label: 'Weather', icon: Cloud, color: 'bg-sky-100 text-sky-600' },
  { id: 'food', label: 'Food', icon: UtensilsCrossed, color: 'bg-orange-100 text-orange-600' },
]

/** A single mood journal entry. */
export type MoodEntry = {
  id: string
  mood: Mood
  tags: string[]
  note: string
  timestamp: string
}

/** Seed journal — last 10 check-ins with realistic diversity. */
export const MOOD_JOURNAL: MoodEntry[] = [
  {
    id: 'j1',
    mood: MOODS[0],
    tags: ['friends', 'food'],
    note: 'Had brunch with Mei and tried that new matcha place. So warm.',
    timestamp: '2 hours ago',
  },
  {
    id: 'j2',
    mood: MOODS[1],
    tags: ['exercise'],
    note: 'Morning yoga in the park — the sunrise was golden.',
    timestamp: 'Yesterday, 8:15 AM',
  },
  {
    id: 'j3',
    mood: MOODS[2],
    tags: ['work'],
    note: 'Long meeting day. Survived it though.',
    timestamp: '2 days ago',
  },
  {
    id: 'j4',
    mood: MOODS[0],
    tags: ['friends', 'weather'],
    note: 'Beach picnic with the crew. Perfect cloud-spotted sky.',
    timestamp: '3 days ago',
  },
  {
    id: 'j5',
    mood: MOODS[3],
    tags: ['sleep'],
    note: 'Barely slept last night, brain wouldn\'t stop.',
    timestamp: '4 days ago',
  },
  {
    id: 'j6',
    mood: MOODS[1],
    tags: ['food', 'weather'],
    note: 'Cozy rainy afternoon with homemade soup and a book.',
    timestamp: '5 days ago',
  },
  {
    id: 'j7',
    mood: MOODS[4],
    tags: ['work', 'sleep'],
    note: 'Deadline crunch. Need a vacation.',
    timestamp: '6 days ago',
  },
  {
    id: 'j8',
    mood: MOODS[1],
    tags: ['exercise', 'friends'],
    note: 'Evening run with Leo, then ramen. Best combo.',
    timestamp: '1 week ago',
  },
  {
    id: 'j9',
    mood: MOODS[2],
    tags: ['weather'],
    note: 'Grey skies but a decent enough day.',
    timestamp: '1 week ago',
  },
  {
    id: 'j10',
    mood: MOODS[0],
    tags: ['sleep', 'food'],
    note: 'Full 9 hours of sleep and pancakes for breakfast!',
    timestamp: '9 days ago',
  },
]

/** Factor correlation data for the diverging bar chart (Feature 4). */
export type MoodFactor = {
  tag: string
  label: string
  positive: number  // 0–100 scale
  negative: number  // 0–100 scale
}

export const MOOD_FACTORS: MoodFactor[] = [
  { tag: 'friends', label: 'Friends', positive: 82, negative: 8 },
  { tag: 'exercise', label: 'Exercise', positive: 74, negative: 5 },
  { tag: 'sleep', label: 'Sleep', positive: 68, negative: 22 },
  { tag: 'food', label: 'Food', positive: 60, negative: 12 },
  { tag: 'weather', label: 'Weather', positive: 45, negative: 30 },
  { tag: 'work', label: 'Work', positive: 25, negative: 65 },
]

/** Gentle stats strip data (Feature 6). */
export type MoodStat = {
  label: string
  value: number
  suffix: string
  tone: string
}

export const MOOD_STATS: MoodStat[] = [
  { label: 'Current streak', value: 7, suffix: ' days', tone: 'bg-honey text-honey-foreground' },
  { label: 'Longest streak', value: 23, suffix: ' days', tone: 'bg-matcha text-matcha-foreground' },
  { label: 'Total check-ins', value: 142, suffix: '', tone: 'bg-caramel text-caramel-foreground' },
  { label: 'Calmest day', value: 0, suffix: 'Saturday', tone: 'bg-secondary text-secondary-foreground' },
]

/** Capy's gentle insights (Feature 3). */
export const MOOD_INSIGHTS: string[] = [
  'Your weekends sparkle ✨ — your Saturday mood is 34% higher than weekdays.',
  'Friends seem to lift your spirits the most. Maybe plan a hangout soon? 🤗',
  'Your morning check-ins tend to be sunnier than evening ones. 🌅',
]

/** Mood–Travel connection data (Feature 7). */
export type MoodTravelEntry = {
  trip: string
  emoji: string
  before: number
  after: number
  change: number
  sparkline: number[]
}

export const MOOD_TRAVEL_LINK: MoodTravelEntry[] = [
  {
    trip: 'Okinawa',
    emoji: '🏝️',
    before: 3.2,
    after: 4.5,
    change: 23,
    sparkline: [3.0, 3.1, 3.4, 3.2, 4.2, 4.6, 4.8, 4.5, 4.3, 4.0],
  },
  {
    trip: 'Gion',
    emoji: '🏮',
    before: 2.8,
    after: 4.1,
    change: 31,
    sparkline: [2.6, 2.8, 3.0, 2.8, 3.8, 4.2, 4.4, 4.1, 3.9, 3.6],
  },
]
