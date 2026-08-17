import type { ApplicationStatus, PositionStatus } from "@qnxg-recruit/shared"

/**
 * 岗位状态中文文案
 */
export const POSITION_STATUS_LABEL: Record<PositionStatus, string> = {
  recruiting: "招聘中",
  paused: "暂停",
  closed: "已关闭",
  expired: "已过期",
  cancelled: "已取消",
}

/**
 * 投递状态中文文案
 */
export const APPLICATION_STATUS_LABEL: Record<ApplicationStatus, string> = {
  draft: "草稿",
  screening: "初筛",
  interview: "面试",
  passed: "通过",
  rejected: "拒绝",
  withdrawn: "已撤回",
  invalidated: "已失效",
}
