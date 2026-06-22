import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import { Pool } from "pg"
import { PrismaPg } from "@prisma/adapter-pg"
import bcrypt from "bcryptjs"

const connectionString = `${process.env.DATABASE_URL}`
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

import { CredentialsSignin } from "next-auth"

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          throw new CredentialsSignin("Invalid credentials.")
        }
        
        // Find user by email
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        })
        
        // Check password
        if (user && user.password) {
          const match = await bcrypt.compare(
            credentials.password as string,
            user.password
          )
          if (match) return user
          throw new CredentialsSignin("Invalid password.")
        }

        // If user doesn't exist, create them (auto-signup)
        try {
          const hashedPassword = await bcrypt.hash(credentials.password as string, 10)
          const newUser = await prisma.user.create({
            data: {
              email: credentials.email as string,
              password: hashedPassword,
              name: (credentials.name as string) || null,
            },
          })
          return newUser
        } catch (error) {
          console.error("USER CREATION ERROR:", error)
          throw new CredentialsSignin("Failed to create user account.")
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async session({ session, token }) {
      if (token?.sub) {
        session.user.id = token.sub
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id
      }
      return token
    }
  }
})
