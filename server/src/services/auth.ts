import type { AuthUser, LoginInput, LoginResult } from "@qnxg-recruit/shared"
import { TRPCError } from "@trpc/server"
import { adminRepo } from "@/repos/admin"
import { userRepo } from "@/repos/user"
import { signToken } from "@/utils/jwt"
import { toUserDto } from "@/utils/mappers"

/**
 * 鉴权业务. 登录手段属业务待定, 当前先按 stuID 查用户搭壳,
 * 具体凭据校验 (密码 / 校园认证) 后续接入
 */
export const authService = {
  async login(input: LoginInput): Promise<LoginResult> {
    const user = await userRepo.findByStuID(input.stuID)
    if (!user)
      throw new TRPCError({ code: "UNAUTHORIZED", message: "学号或凭据错误" })

    // TODO: 登录手段待定, 此处接入真实凭据校验 (input.password)

    const token = signToken({ userID: user.id })
    return { token }
  },

  /**
   * 取当前登录用户态 (含 admin 判定)
   */
  async me(userID: number): Promise<AuthUser> {
    const user = await userRepo.findById(userID)
    if (!user)
      throw new TRPCError({ code: "UNAUTHORIZED", message: "用户不存在" })
    const isAdmin = await adminRepo.isAdmin(userID)
    return { ...toUserDto(user), isAdmin, createdAt: user.createdAt }
  },
}
