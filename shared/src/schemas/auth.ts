import { z } from "zod"
import { stuIDSchema } from "./user"

/**
 * 登录入参. 登录手段属业务, 先按 stuID + 凭据搭壳, 后续再定
 */
export const loginInputSchema = z.object({
  stuID: stuIDSchema,
  password: z.string().min(1, "凭据不能为空"),
})

export type LoginInput = z.infer<typeof loginInputSchema>

/**
 * 登录返回: token + 当前用户态
 */
export const loginResultSchema = z.object({
  token: z.string(),
})

export type LoginResult = z.infer<typeof loginResultSchema>
