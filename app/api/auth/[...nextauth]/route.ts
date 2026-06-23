import { handlers } from "@/auth" // Adjust the path if auth.ts is not in the root, but it is in the root. Wait, in nextjs the alias is usually @/auth

export const { GET, POST } = handlers
export const dynamic = "force-dynamic"
