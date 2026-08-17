/**
 * 岗位状态枚举
 *
 * - recruiting 招聘中
 * - paused 暂停
 * - closed 已关闭
 * - expired 已过期
 * - cancelled 已取消
 */
export const POSITION_STATUS = ["recruiting", "paused", "closed", "expired", "cancelled"] as const

export type PositionStatus = (typeof POSITION_STATUS)[number]

/**
 * 投递状态枚举
 *
 * - draft 草稿
 * - screening 初筛
 * - interview 面试
 * - passed 通过
 * - rejected 拒绝
 * - withdrawn 撤回 (user 主动, 可恢复)
 * - invalidated 失效 (position 失效或过期概括而来)
 */
export const APPLICATION_STATUS = [
  "draft",
  "screening",
  "interview",
  "passed",
  "rejected",
  "withdrawn",
  "invalidated",
] as const

export type ApplicationStatus = (typeof APPLICATION_STATUS)[number]
