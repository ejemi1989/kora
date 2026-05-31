import { PrismaClient } from "./generated/prisma/client"

let client: PrismaClient | null = null

export function getPrisma(): PrismaClient {
  if (!client) {
    client = new PrismaClient()
  }
  return client
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_, prop: string | symbol) {
    return (getPrisma() as any)[prop]
  },
})
