'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@/auth'
import { PrismaClient } from '@prisma/client'

// Use a global PrismaClient to avoid exhausting connections in dev
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
const prisma = globalForPrisma.prisma || new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

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

export async function getMoodEntries() {
  const session = await auth()
  if (!session?.user?.id) return []

  return await prisma.moodEntry.findMany({
    where: { userId: session.user.id },
    orderBy: { timestamp: 'desc' },
  })
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

  return await prisma.plannedTrip.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  })
}

/**
 * Memories
 */
export async function getMemories() {
  const session = await auth()
  if (!session?.user?.id) return []

  return await prisma.memory.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  })
}
