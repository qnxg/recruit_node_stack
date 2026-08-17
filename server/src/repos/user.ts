import type { Prisma, User } from "@prisma/client"
import { prisma } from "../db/client"
import { nowTs } from "../utils/time"

/**
 * User 数据访问. 封装 Prisma 调用, service 不裸调
 */
export const userRepo = {
  findById(id: number): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } })
  },

  findByStuID(stuID: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { stuID } })
  },

  update(id: number, data: Prisma.UserUpdateInput): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: { ...data, updatedAt: nowTs() },
    })
  },
}
