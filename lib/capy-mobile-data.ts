import type { LucideIcon } from 'lucide-react'
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
  Heart,
  Sun,
} from 'lucide-react'

/**
 * Shared Capy Mobile data + types.
 * Kept separate from the desktop `capy-data.ts` so neither data model conflicts.
 * Structured so it can be swapped for a real backend/database API in the future.
 */

// ─── Mood Types (Desktop-style with scores + Tailwind classes) ───

export type MoodId = 'amazing' | 'good' | 'okay' | 'low' | 'stressed'

export interface Mood {
  id: MoodId
  label: string
  /** Short caption shown after selecting */
  caption: string
  icon: LucideIcon
  /** Tailwind BG class for the mood bubble */
  bg: string
  /** Tailwind ring class */
  ring: string
  /** Tailwind text-color class for the icon */
  iconColor: string
  /** 1 (low) – 5 (great) for charts */
  score: number
}

/** 5 mood options matching the website's aesthetic. */
export const MOODS: Mood[] = [
  {
    id: 'amazing',
    label: 'Amazing',
    caption: 'Floating on a sunbeam',
    icon: Laugh,
    bg: 'bg-matcha',
    ring: 'ring-matcha-foreground/30',
    iconColor: 'text-matcha-foreground',
    score: 5,
  },
  {
    id: 'good',
    label: 'Good',
    caption: 'Warm and easy',
    icon: Smile,
    bg: 'bg-honey',
    ring: 'ring-honey-foreground/30',
    iconColor: 'text-honey-foreground',
    score: 4,
  },
  {
    id: 'okay',
    label: 'Okay',
    caption: 'Just drifting along',
    icon: Meh,
    bg: 'bg-secondary',
    ring: 'ring-secondary-foreground/20',
    iconColor: 'text-secondary-foreground',
    score: 3,
  },
  {
    id: 'low',
    label: 'Low',
    caption: 'A little heavy today',
    icon: Frown,
    bg: 'bg-caramel/25',
    ring: 'ring-caramel/40',
    iconColor: 'text-caramel',
    score: 2,
  },
  {
    id: 'stressed',
    label: 'Stressed',
    caption: 'Need a cozy nap',
    icon: CloudRain,
    bg: 'bg-destructive/15',
    ring: 'ring-destructive/30',
    iconColor: 'text-destructive',
    score: 1,
  },
]

export const moodById = (id: MoodId): Mood =>
  MOODS.find((m) => m.id === id) ?? MOODS[2]

// ─── Mood Tags (Influence factors) ──────────────────────────────

export interface MoodTag {
  id: string
  label: string
  icon: LucideIcon
}

export const MOOD_TAGS: MoodTag[] = [
  { id: 'sleep', label: 'Sleep', icon: Moon },
  { id: 'work', label: 'Work', icon: Briefcase },
  { id: 'friends', label: 'Friends', icon: Users },
  { id: 'exercise', label: 'Exercise', icon: Dumbbell },
  { id: 'weather', label: 'Weather', icon: Cloud },
  { id: 'food', label: 'Food', icon: UtensilsCrossed },
]

// ─── Mood Journal Entry ─────────────────────────────────────────

export interface MoodJournalEntry {
  id: string
  mood: Mood
  tags: string[]
  note: string
  timestamp: string
}

// ─── Mood History (for the timeline) ─────────────────────────────

export interface MoodEntry {
  /** Human label for the day */
  day: string
  date: string
  mood: MoodId
}

/** A soft timeline of recent check-ins. */
export const MOOD_HISTORY: MoodEntry[] = [
  { day: 'Today', date: 'Jun 30', mood: 'good' },
  { day: 'Yesterday', date: 'Jun 29', mood: 'amazing' },
  { day: 'Saturday', date: 'Jun 28', mood: 'okay' },
  { day: 'Friday', date: 'Jun 27', mood: 'low' },
  { day: 'Thursday', date: 'Jun 26', mood: 'good' },
  { day: 'Wednesday', date: 'Jun 25', mood: 'stressed' },
  { day: 'Tuesday', date: 'Jun 24', mood: 'okay' },
]

/** Weekly average mood for the area chart (last 7 days). */
export const WEEK_TREND = [
  { day: 'Mon', score: 3.2 },
  { day: 'Tue', score: 4.1 },
  { day: 'Wed', score: 2.8 },
  { day: 'Thu', score: 3.6 },
  { day: 'Fri', score: 4.4 },
  { day: 'Sat', score: 4.8 },
  { day: 'Sun', score: 4.2 },
]

// ─── Trip Types ──────────────────────────────────────────────────

export interface Trip {
  id: string
  destination: string
  blurb: string
  dates: string
  image: string
  /** Packing / planning checklist */
  checklist: { label: string; done: boolean }[]
}

export const TRIPS: Trip[] = [
  {
    id: 'misty-peaks',
    destination: 'Misty Peaks Retreat',
    blurb: 'A slow weekend of foggy trails and warm tea.',
    dates: 'Jul 12 – Jul 14',
    image: '/trip-mountains.png',
    checklist: [
      { label: 'Book the little cabin', done: true },
      { label: 'Pack the softest sweater', done: true },
      { label: 'Download a comfort playlist', done: false },
      { label: 'Find a sunrise spot', done: false },
    ],
  },
  {
    id: 'sleepy-coast',
    destination: 'Sleepy Coast Town',
    blurb: 'Sunset walks and seashell collecting, no rush.',
    dates: 'Aug 3 – Aug 7',
    image: '/trip-coast.png',
    checklist: [
      { label: 'Reserve the seaside room', done: true },
      { label: 'Pack a sketchbook', done: false },
      { label: 'Plan one quiet beach picnic', done: false },
    ],
  },
  {
    id: 'pine-hollow',
    destination: 'Pine Hollow Cabin',
    blurb: 'A cozy hideaway tucked among tall, kind trees.',
    dates: 'Sep 20 – Sep 22',
    image: '/trip-forest.png',
    checklist: [
      { label: 'Bring marshmallows', done: true },
      { label: 'Pack a good book', done: true },
      { label: 'Charge the camera', done: true },
      { label: 'Write a little intention', done: false },
    ],
  },
]

export const tripProgress = (trip: Trip) => {
  const done = trip.checklist.filter((c) => c.done).length
  return { done, total: trip.checklist.length }
}
