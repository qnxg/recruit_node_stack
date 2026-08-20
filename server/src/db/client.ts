import { PrismaClient } from "@prisma/client"
import { env } from "@/config/env"

/**
 * 全局唯一 Prisma client. 开发下挂到 globalThis, 避免 tsx watch 热重载时重复实例化
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

export const prisma
  = globalForPrisma.prisma
    ?? new PrismaClient({
      log: env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    })

if (env.NODE_ENV !== "production")
  globalForPrisma.prisma = prisma
