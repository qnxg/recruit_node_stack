/**
 * 时间约定: 对外 / DTO 用毫秒级 Unix 时间戳 (number), DB 也存 Int (ms).
 * 集中在此转换, 便于日后若改回 DateTime 只动一处
 */

/**
 * 当前毫秒级时间戳
 */
export function nowTs(): number {
  return Date.now()
}
