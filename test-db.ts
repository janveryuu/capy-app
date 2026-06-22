import { PrismaClient } from "@prisma/client"
import { Pool } from "pg"
import { PrismaPg } from "@prisma/adapter-pg"
import * as dotenv from "dotenv"

dotenv.config({ path: ".env.local" })

async function main() {
  console.log("DATABASE_URL:", process.env.DATABASE_URL)
  
  const connectionString = `${process.env.DATABASE_URL}`
  const pool = new Pool({ connectionString })
  const adapter = new PrismaPg(pool)
  const prisma = new PrismaClient({ adapter })

  console.log("Checking user...")
  const user = await prisma.user.findUnique({
    where: { email: "24-01096@g.batstate-u.edu.ph" }
  })
  console.log("Found user:", user)
}

main().catch(console.error)
