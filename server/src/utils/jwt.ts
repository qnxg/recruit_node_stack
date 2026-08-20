import type { SignOptions } from "jsonwebtoken"
import jwt from "jsonwebtoken"
import { env } from "@/config/env"

/**
 * JWT 载荷. 只存 userID, 是否 admin 后端每次查库判定 (可撤销, 实时)
 */
export interface JwtPayload {
  userID: number
}

/**
 * 签发 token. 有效期取 env.JWT_EXPIRES_IN (默认 1 天), 不做续期 / refresh
 */
export function signToken(payload: JwtPayload): string {
  const options: SignOptions = { expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"] }
  return jwt.sign(payload, env.JWT_SECRET, options)
}

/**
 * 校验并解析 token. 失败 (无效 / 过期) 返回 null
 */
export function verifyToken(token: string): JwtPayload | null {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET)
    if (typeof decoded === "object" && decoded !== null && "userID" in decoded)
      return { userID: Number((decoded as JwtPayload).userID) }
    return null
  }
  catch {
    return null
  }
}
