'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@/auth'
import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

const connectionString = `${process.env.DATABASE_URL}`
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)

const prisma = globalForPrisma.prisma || new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

import { MOODS, type MoodEntry } from '@/lib/capy-data'

/**
 * Mood Entries
 */
export async function createMoodEntry(moodId: number, tags: string[], note?: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  await prisma.moodEntry.create({
    data: {
      userId: session.user.id,
      moodId,
      tags,
      note,
    }
  })

  revalidatePath('/dashboard')
}

function formatRelativeTime(date: Date) {
  const diff = Date.now() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 60) return `${minutes || 1} min ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hours ago`
  return `${Math.floor(hours / 24)} days ago`
}

export async function getMoodEntries(): Promise<MoodEntry[]> {
  const session = await auth()
  if (!session?.user?.id) return []

  const dbEntries = await prisma.moodEntry.findMany({
    where: { userId: session.user.id },
    orderBy: { timestamp: 'desc' },
  })
  
  return dbEntries.map(db => ({
    id: db.id,
    mood: MOODS.find(m => m.id === db.moodId) || MOODS[2],
    tags: db.tags,
    note: db.note || '',
    timestamp: formatRelativeTime(db.timestamp)
  }))
}

/**
 * Planned Trips
 */
export async function createPlannedTrip(data: {
  destination: string
  country: string
  dateRange: string
  emoji: string
  days: number
  note?: string
}) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  await prisma.plannedTrip.create({
    data: {
      userId: session.user.id,
      ...data,
      status: 'planned'
    }
  })

  revalidatePath('/travel')
}

export async function getPlannedTrips() {
  const session = await auth()
  if (!session?.user?.id) return []

  const trips = await prisma.plannedTrip.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  })
  
  return trips.map(t => ({
    id: t.id,
    destination: t.destination,
    country: t.country,
    dateRange: t.dateRange,
    emoji: t.emoji,
    days: t.days,
    note: t.note || '',
    status: t.status as 'planned' | 'completed',
  }))
}

/**
 * Memories
 */
export async function createMemory(data: {
  src: string
  caption: string
  location: string
  rotate: number
}) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  await prisma.memory.create({
    data: {
      userId: session.user.id,
      ...data,
    }
  })

  revalidatePath('/travel')
}

export async function getMemories() {
  const session = await auth()
  if (!session?.user?.id) return []

  const memories = await prisma.memory.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  })

  return memories.map(m => ({
    ...m,
    createdAt: m.createdAt.toISOString()
  }))
}
