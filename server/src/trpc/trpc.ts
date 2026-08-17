import type { Context } from "./context"
import { initTRPC, TRPCError } from "@trpc/server"
import { adminRepo } from "@/repos/admin"

const t = initTRPC.context<Context>().create()

export const router = t.router
export const publicProcedure = t.procedure

/**
 * 登录守卫: 要求已携带有效 token. 下游 ctx.userID 收窄为 number
 */
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (ctx.userID == null)
    throw new TRPCError({ code: "UNAUTHORIZED", message: "需要登录" })
  return next({ ctx: { userID: ctx.userID } })
})

/**
 * admin 守卫: 在登录基础上每次查库判定 admin 身份 (可撤销, 实时)
 */
export const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  const isAdmin = await adminRepo.isAdmin(ctx.userID)
  if (!isAdmin)
    throw new TRPCError({ code: "FORBIDDEN", message: "需要管理员权限" })
  return next({ ctx: { userID: ctx.userID, isAdmin: true } })
})
