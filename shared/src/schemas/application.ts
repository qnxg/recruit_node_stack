import { z } from "zod"
import { APPLICATION_STATUS } from "@/enums"
import { paginationInputSchema, timestampSchema } from "@/schemas/common"
import { positionDtoSchema } from "@/schemas/position"
import { userDtoSchema } from "@/schemas/user"

export const applicationStatusSchema = z.enum(APPLICATION_STATUS)

/**
 * Application DTO (对外). 移除外键, 按需嵌套关联对象;
 * 时间统一为毫秒级 Unix 时间戳
 */
export const applicationDtoSchema = z.object({
  id: z.number().int(),
  status: applicationStatusSchema,
  createdAt: timestampSchema,
  updatedAt: timestampSchema,
  user: userDtoSchema.optional(),
  position: positionDtoSchema.optional(),
})

export type ApplicationDto = z.infer<typeof applicationDtoSchema>

/**
 * 投递列表查询入参: 分页 + 可选按状态筛
 */
export const applicationListInputSchema = paginationInputSchema.extend({
  status: applicationStatusSchema.optional(),
})

export type ApplicationListInput = z.infer<typeof applicationListInputSchema>

/**
 * 投递入参: 目标岗位 id
 */
export const applicationCreateInputSchema = z.object({
  positionID: z.number().int(),
})

export type ApplicationCreateInput = z.infer<typeof applicationCreateInputSchema>

/**
 * admin 推进投递状态入参
 */
export const applicationStatusUpdateInputSchema = z.object({
  id: z.number().int(),
  status: applicationStatusSchema,
})

export type ApplicationStatusUpdateInput = z.infer<typeof applicationStatusUpdateInputSchema>
