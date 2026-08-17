import type { CreateExpressContextOptions } from "@trpc/server/adapters/express"
import { verifyToken } from "../utils/jwt"

/**
 * 从请求头解析 Bearer token, 得到当前 userID (未登录为 null).
 * 是否 admin 不在此判定, 交由 adminProcedure 每次查库
 */
export function createContext({ req }: CreateExpressContextOptions) {
  const header = req.headers.authorization
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null
  const payload = token ? verifyToken(token) : null

  return {
    userID: payload?.userID ?? null,
  }
}

export type Context = ReturnType<typeof createContext>
