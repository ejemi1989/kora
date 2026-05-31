let client: any = null

export function getPrisma() {
  if (!client) {
    try {
      const { PrismaClient } = require("./generated/prisma/client")
      client = new PrismaClient()
    } catch {
      return null
    }
  }
  return client
}

export const prisma = new Proxy({} as any, {
  get(_, prop: string | symbol) {
    const p = getPrisma()
    if (!p) return undefined
    return p[prop]
  },
})
