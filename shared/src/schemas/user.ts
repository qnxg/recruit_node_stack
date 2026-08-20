import { z } from "zod"
import { timestampSchema } from "@/schemas/common"

/**
 * 学号: qnxg 跨系统关联键, 非空
 */
export const stuIDSchema = z.string().min(1, "学号不能为空")

/**
 * User DTO (对外), 简历 / 个人描述字段待业务补充
 */
export const userDtoSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  stuID: stuIDSchema,
})

export type UserDto = z.infer<typeof userDtoSchema>

/**
 * 个人基础信息编辑入参 (待业务补充简历字段)
 */
export const userUpdateInputSchema = z.object({
  name: z.string().min(1, "姓名不能为空"),
})

export type UserUpdateInput = z.infer<typeof userUpdateInputSchema>

/**
 * 登录后返回的当前用户态 (含 admin 判定, 由后端出)
 */
export const authUserSchema = userDtoSchema.extend({
  isAdmin: z.boolean(),
  createdAt: timestampSchema.optional(),
})

export type AuthUser = z.infer<typeof authUserSchema>
