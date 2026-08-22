/**
 * 时间约定: 对外 / DTO 统一毫秒级 Unix 时间戳 (number), DB 存 BigInt (ms).
 *
 * DTO 选 number 而非 bigint 的理由:
 * - 前端 `new Date(ms)` 直接按本地时区展示, 不涉 UTC 转换
 * - bigint 无法被 JSON 序列化 (trpc 走默认 JSON, 无 superjson)
 * - 毫秒量级远小于 number 安全上限 2^53, 精度无损
 * 因此 Prisma 实体返回的 bigint 在 mapper 层 `Number()` 转回, 见 utils/mappers.
 */

/**
 * 当前毫秒级时间戳
 */
export function nowTs(): number {
  return Date.now()
}
