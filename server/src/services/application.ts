import type {
  ApplicationCreateInput,
  ApplicationDto,
  ApplicationListInput,
  ApplicationStatus,
} from "@qnxg-recruit/shared"
import { TRPCError } from "@trpc/server"
import { applicationRepo } from "../repos/application"
import { positionRepo } from "../repos/position"
import { toApplicationDto } from "../utils/mappers"
import { buildMeta } from "../utils/pagination"

/**
 * 可被 user 主动切换的状态转移白名单 (投递 / 撤回 / 恢复)
 */
const USER_RECOVERABLE_FROM: ApplicationStatus[] = ["draft", "screening", "interview"]

/**
 * 投递业务
 */
export const applicationService = {
  async listByUser(userID: number, input: ApplicationListInput) {
    const { items, total } = await applicationRepo.listByUser(userID, input)
    return { items: items.map(toApplicationDto), meta: buildMeta(input, total) }
  },

  async listAll(input: ApplicationListInput) {
    const { items, total } = await applicationRepo.listAll(input)
    return { items: items.map(toApplicationDto), meta: buildMeta(input, total) }
  },

  async getById(id: number, requesterID: number, isAdmin: boolean): Promise<ApplicationDto> {
    const app = await applicationRepo.findById(id)
    if (!app)
      throw new TRPCError({ code: "NOT_FOUND", message: "投递记录不存在" })
    if (!isAdmin && app.userID !== requesterID)
      throw new TRPCError({ code: "FORBIDDEN", message: "无权查看该投递" })
    return toApplicationDto(app)
  },

  /**
   * 投递: 校验岗位可投, 一人一岗唯一 (有效记录). 已软删的旧记录不阻塞新投
   */
  async create(userID: number, input: ApplicationCreateInput): Promise<ApplicationDto> {
    const position = await positionRepo.findById(input.positionID)
    if (!position)
      throw new TRPCError({ code: "NOT_FOUND", message: "岗位不存在" })
    if (position.status !== "recruiting")
      throw new TRPCError({ code: "BAD_REQUEST", message: "该岗位当前不可投递" })

    const existing = await applicationRepo.findActive(userID, input.positionID)
    if (existing) {
      // 撤回态复用原记录恢复为初筛; 其余有效记录视为重复投递
      if (existing.status === "withdrawn") {
        const restored = await applicationRepo.updateStatus(existing.id, "screening")
        return toApplicationDto(restored)
      }
      throw new TRPCError({ code: "CONFLICT", message: "已投递该岗位" })
    }

    const created = await applicationRepo.create(userID, input.positionID)
    // 提交投递即进入初筛
    const submitted = await applicationRepo.updateStatus(created.id, "screening")
    return toApplicationDto(submitted)
  },

  /**
   * user 撤回自己的投递 (可恢复, 复用记录)
   */
  async withdraw(userID: number, id: number): Promise<ApplicationDto> {
    const app = await applicationRepo.findById(id)
    if (!app || app.userID !== userID)
      throw new TRPCError({ code: "NOT_FOUND", message: "投递记录不存在" })
    if (!USER_RECOVERABLE_FROM.includes(app.status))
      throw new TRPCError({ code: "BAD_REQUEST", message: "当前状态不可撤回" })
    const updated = await applicationRepo.updateStatus(id, "withdrawn")
    return toApplicationDto(updated)
  },

  /**
   * admin 推进投递状态
   */
  async updateStatus(id: number, status: ApplicationStatus): Promise<ApplicationDto> {
    const app = await applicationRepo.findById(id)
    if (!app)
      throw new TRPCError({ code: "NOT_FOUND", message: "投递记录不存在" })
    const updated = await applicationRepo.updateStatus(id, status)
    return toApplicationDto(updated)
  },
}
