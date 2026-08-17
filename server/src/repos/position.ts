import type { Position, Prisma } from "@prisma/client"
import type { PositionListInput, PositionUpsertInput } from "@qnxg-recruit/shared"
import { prisma } from "@/db/client"
import { nowTs } from "@/utils/time"

/**
 * Position 数据访问. 默认过滤软删除记录
 */
export const positionRepo = {
  async list(input: PositionListInput): Promise<{ items: Position[], total: number }> {
    const where: Prisma.PositionWhereInput = {
      disabled: false,
      ...(input.status ? { status: input.status } : {}),
      ...(input.hot !== undefined ? { hot: input.hot } : {}),
    }
    const [items, total] = await Promise.all([
      prisma.position.findMany({
        where,
        orderBy: [{ hot: "desc" }, { createdAt: "desc" }],
        skip: (input.page - 1) * input.size,
        take: input.size,
      }),
      prisma.position.count({ where }),
    ])
    return { items, total }
  },

  findById(id: number): Promise<Position | null> {
    return prisma.position.findFirst({ where: { id, disabled: false } })
  },

  create(data: PositionUpsertInput): Promise<Position> {
    const ts = nowTs()
    return prisma.position.create({ data: { ...data, createdAt: ts, updatedAt: ts } })
  },

  update(id: number, data: PositionUpsertInput): Promise<Position> {
    return prisma.position.update({ where: { id }, data: { ...data, updatedAt: nowTs() } })
  },

  /**
   * 软删除
   */
  softDelete(id: number): Promise<Position> {
    return prisma.position.update({ where: { id }, data: { disabled: true, updatedAt: nowTs() } })
  },
}
