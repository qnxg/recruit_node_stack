import type { PositionDto, PositionListInput, PositionUpsertInput } from "@qnxg-recruit/shared"
import { TRPCError } from "@trpc/server"
import { positionRepo } from "../repos/position"
import { toPositionDto } from "../utils/mappers"
import { buildMeta } from "../utils/pagination"

/**
 * 岗位业务. 唯一写业务的地方, 通过 repo 访问数据
 */
export const positionService = {
  async list(input: PositionListInput) {
    const { items, total } = await positionRepo.list(input)
    return { items: items.map(toPositionDto), meta: buildMeta(input, total) }
  },

  async getById(id: number): Promise<PositionDto> {
    const position = await positionRepo.findById(id)
    if (!position)
      throw new TRPCError({ code: "NOT_FOUND", message: "岗位不存在" })
    return toPositionDto(position)
  },

  async create(input: PositionUpsertInput): Promise<PositionDto> {
    const created = await positionRepo.create(input)
    return toPositionDto(created)
  },

  async update(id: number, input: PositionUpsertInput): Promise<PositionDto> {
    await positionService.getById(id)
    const updated = await positionRepo.update(id, input)
    return toPositionDto(updated)
  },

  async remove(id: number): Promise<void> {
    await positionService.getById(id)
    await positionRepo.softDelete(id)
  },
}
