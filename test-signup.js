import { PrismaClient } from "@prisma/client"
import { Pool } from "pg"
import { PrismaPg } from "@prisma/adapter-pg"

async function main() {
  const connectionString = process.env.DATABASE_URL
  const pool = new Pool({ connectionString })
  const adapter = new PrismaPg(pool)
  const prisma = new PrismaClient({ adapter })

  try {
    const user = await prisma.user.create({
      data: {
        email: "test_signup@example.com",
        password: "test_password",
        name: "Test User",
      },
    })
    console.log("Created user:", user)
  } catch (error) {
    console.error("Error:", error)
  }
}

main()
