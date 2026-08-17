import process from "node:process"
import { z } from "zod"

/**
 * 环境变量 schema. 启动时校验, 缺失即 fail-fast
 */
const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL 不能为空"),
  JWT_SECRET: z.string().min(1, "JWT_SECRET 不能为空"),
  JWT_EXPIRES_IN: z.string().default("1d"),
  PORT: z.coerce.number().int().positive().default(3000),
  WEB_ORIGIN: z.string().default("http://localhost:5173"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  // 此处尚未初始化 logger, 直接抛出让进程退出
  const issues = parsed.error.issues.map(i => `  - ${i.path.join(".")}: ${i.message}`).join("\n")
  throw new Error(`环境变量校验失败:\n${issues}`)
}

/**
 * 已校验的环境变量, 全应用唯一入口
 */
export const env = parsed.data
