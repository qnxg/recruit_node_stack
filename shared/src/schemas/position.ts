import { z } from "zod"
import { POSITION_STATUS } from "../enums"
import { paginationInputSchema, timestampSchema } from "./common"

export const positionStatusSchema = z.enum(POSITION_STATUS)

/**
 * Position DTO (对外). 时间统一为毫秒级 Unix 时间戳
 */
export const positionDtoSchema = z.object({
  id: z.number().int(),
  title: z.string(),
  description: z.string(),
  createdAt: timestampSchema,
  deadline: timestampSchema,
  hot: z.boolean(),
  status: positionStatusSchema,
})

export type PositionDto = z.infer<typeof positionDtoSchema>

/**
 * 岗位列表查询入参: 分页 + 可选筛选
 */
export const positionListInputSchema = paginationInputSchema.extend({
  status: positionStatusSchema.optional(),
  hot: z.boolean().optional(),
})

export type PositionListInput = z.infer<typeof positionListInputSchema>

/**
 * 岗位创建 / 编辑入参 (admin)
 */
export const positionUpsertInputSchema = z.object({
  title: z.string().min(1, "标题不能为空"),
  description: z.string().min(1, "描述不能为空"),
  deadline: timestampSchema,
  hot: z.boolean().default(false),
  status: positionStatusSchema.default("recruiting"),
})

export type PositionUpsertInput = z.infer<typeof positionUpsertInputSchema>
