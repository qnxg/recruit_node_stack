import type { Application, Position, Prisma, User } from "@prisma/client"
import type { ApplicationListInput } from "@qnxg-recruit/shared"
import { prisma } from "@/db/client"
import { nowTs } from "@/utils/time"

/**
 * 带关联的 Application (供 DTO 嵌套 user / position)
 */
export type ApplicationWithRelations = Application & { user: User, position: Position }

const withRelations = { user: true, position: true } satisfies Prisma.ApplicationInclude

/**
 * 判定关联 position 是否已失效: 已关闭 / 已取消 / 已过截止
 */
function isPositionInvalid(position: Position, now: number): boolean {
  return position.status === "closed"
    || position.status === "cancelled"
    || position.deadline < now
}

/**
 * 就地把投递记录更新为失效并返回. 仅在活跃业务态下触发
 */
async function invalidate(app: ApplicationWithRelations, now: number): Promise<ApplicationWithRelations> {
  const updated = await prisma.application.update({
    where: { id: app.id },
    data: { status: "invalidated", updatedAt: now },
    include: withRelations,
  })
  return updated
}

/**
 * 对一条记录做失效检测: 若其 position 失效且当前处于活跃态, 就地更新为 invalidated.
 * 终态 (passed/rejected/withdrawn/invalidated) 与草稿不触发
 */
async function detectInvalidation(app: ApplicationWithRelations): Promise<ApplicationWithRelations> {
  const now = nowTs()
  const active = app.status === "screening" || app.status === "interview"
  if (active && isPositionInvalid(app.position, now))
    return invalidate(app, now)
  return app
}

/**
 * Application 数据访问. 每次 get 顺带做失效检测并更新 (见 server-design §3),
 * 把状态一致性收敛到 repo 单点. 默认过滤软删除记录
 */
export const applicationRepo = {
  /**
   * 单条读取. 顺带失效检测
   */
  async findById(id: number): Promise<ApplicationWithRelations | null> {
    const app = await prisma.application.findFirst({
      where: { id, disabled: false },
      include: withRelations,
    })
    if (!app)
      return null
    return detectInvalidation(app)
  },

  /**
   * 按用户列出投递. 每条顺带失效检测
   */
  async listByUser(
    userID: number,
    input: ApplicationListInput,
  ): Promise<{ items: ApplicationWithRelations[], total: number }> {
    const where: Prisma.ApplicationWhereInput = {
      userID,
      disabled: false,
      ...(input.status ? { status: input.status } : {}),
    }
    const [rows, total] = await Promise.all([
      prisma.application.findMany({
        where,
        include: withRelations,
        orderBy: { createdAt: "desc" },
        skip: (input.page - 1) * input.size,
        take: input.size,
      }),
      prisma.application.count({ where }),
    ])
    const items = await Promise.all(rows.map(detectInvalidation))
    return { items, total }
  },

  /**
   * admin 全量列出投递 (不限 user)
   */
  async listAll(input: ApplicationListInput): Promise<{ items: ApplicationWithRelations[], total: number }> {
    const where: Prisma.ApplicationWhereInput = {
      disabled: false,
      ...(input.status ? { status: input.status } : {}),
    }
    const [rows, total] = await Promise.all([
      prisma.application.findMany({
        where,
        include: withRelations,
        orderBy: { createdAt: "desc" },
        skip: (input.page - 1) * input.size,
        take: input.size,
      }),
      prisma.application.count({ where }),
    ])
    const items = await Promise.all(rows.map(detectInvalidation))
    return { items, total }
  },

  /**
   * 查同一 user 对同一 position 的有效记录 (未软删)
   */
  findActive(userID: number, positionID: number): Promise<Application | null> {
    return prisma.application.findFirst({ where: { userID, positionID, disabled: false } })
  },

  create(userID: number, positionID: number): Promise<ApplicationWithRelations> {
    const ts = nowTs()
    return prisma.application.create({
      data: { userID, positionID, status: "draft", createdAt: ts, updatedAt: ts },
      include: withRelations,
    })
  },

  updateStatus(id: number, status: Application["status"]): Promise<ApplicationWithRelations> {
    return prisma.application.update({
      where: { id },
      data: { status, updatedAt: nowTs() },
      include: withRelations,
    })
  },
}
