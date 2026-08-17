import { prisma } from "../db/client"

/**
 * Admin 数据访问. admin 即某个 User 的关联记录
 */
export const adminRepo = {
  /**
   * 判定某 user 是否为 admin
   */
  async isAdmin(userID: number): Promise<boolean> {
    const found = await prisma.admin.findUnique({ where: { userID } })
    return found !== null
  },
}
