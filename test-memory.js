const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.findFirst()
  console.log("User:", user?.id)
  if (!user) return

  try {
    const mem = await prisma.memory.create({
      data: {
        userId: user.id,
        src: 'data:image/jpeg;base64,xxxx',
        caption: 'Test',
        location: 'Test',
        rotate: 0,
      }
    })
    console.log("Created memory:", mem.id)

    const mems = await prisma.memory.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    })
    console.log("Memories:", mems.length)
  } catch (e) {
    console.error("Error:", e)
  }
}

main().finally(() => prisma.$disconnect())
