import type { UserDto, UserUpdateInput } from "@qnxg-recruit/shared"
import { TRPCError } from "@trpc/server"
import { userRepo } from "@/repos/user"
import { toUserDto } from "@/utils/mappers"

/**
 * 用户业务
 */
export const userService = {
  async getById(id: number): Promise<UserDto> {
    const user = await userRepo.findById(id)
    if (!user)
      throw new TRPCError({ code: "NOT_FOUND", message: "用户不存在" })
    return toUserDto(user)
  },

  /**
   * 更新个人基础信息
   */
  async update(id: number, input: UserUpdateInput): Promise<UserDto> {
    const updated = await userRepo.update(id, input)
    return toUserDto(updated)
  },
}
