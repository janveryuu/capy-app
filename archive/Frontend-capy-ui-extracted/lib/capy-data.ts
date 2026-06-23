import {
  Laugh,
  Smile,
  Meh,
  Frown,
  CloudRain,
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

/** 12 weeks of pseudo-random but gentle mood history for the heatmap. */
export function buildHeatmap(weeks = 12): (number | null)[][] {
  const grid: (number | null)[][] = []
  let prev = 4
  for (let w = 0; w < weeks; w++) {
    const week: (number | null)[] = []
    for (let d = 0; d < 7; d++) {
      // gentle random walk, bounded 1..5
      const drift = Math.round((Math.sin(w * 1.3 + d * 0.9) + Math.random() - 0.5) * 1.2)
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
  /** short live-ish weather/condition note */
  note: string
  /** vibe tag shown as a pill */
  tag: 'Cozy' | 'Adventure' | 'Nearby'
  /** rough temp for the little chip */
  temp: string
}

export const DESTINATIONS: Destination[] = [
  {
    id: 'kyoto',
    name: 'Kyoto',
    country: 'Japan',
    src: '/dest-kyoto.png',
    note: 'Soft maple weather, perfect for slow temple strolls.',
    tag: 'Cozy',
    temp: '18°',
  },
  {
    id: 'hoian',
    name: 'Hoi An',
    country: 'Vietnam',
    src: '/dest-hoian.png',
    note: 'Warm lantern-lit evenings, gentle riverside breeze.',
    tag: 'Cozy',
    temp: '27°',
  },
  {
    id: 'alps',
    name: 'Swiss Alps',
    country: 'Switzerland',
    src: '/dest-alps.png',
    note: 'Crisp mountain air and quiet lakeside chalets.',
    tag: 'Adventure',
    temp: '9°',
  },
  {
    id: 'bali',
    name: 'Bali',
    country: 'Indonesia',
    src: '/dest-bali.png',
    note: 'Lush green terraces basking in golden light.',
    tag: 'Adventure',
    temp: '29°',
  },
  {
    id: 'lisbon',
    name: 'Lisbon',
    country: 'Portugal',
    src: '/dest-lisbon.png',
    note: 'Sunny tiled hills and easy tram-window views.',
    tag: 'Nearby',
    temp: '22°',
  },
  {
    id: 'santorini',
    name: 'Santorini',
    country: 'Greece',
    src: '/dest-santorini.png',
    note: 'Calm sea breeze with the softest sunsets around.',
    tag: 'Nearby',
    temp: '24°',
  },
]

/** Vibe tag -> token color classes for the explore pills. */
export function tagColor(tag: Destination['tag']): string {
  switch (tag) {
    case 'Cozy':
      return 'bg-honey text-honey-foreground'
    case 'Adventure':
      return 'bg-matcha text-matcha-foreground'
    case 'Nearby':
      return 'bg-caramel text-caramel-foreground'
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
