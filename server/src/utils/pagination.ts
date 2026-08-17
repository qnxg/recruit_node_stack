import type { PaginationInput, PaginationMeta } from "@qnxg-recruit/shared"

/**
 * 由分页入参与总数计算分页元信息
 */
export function buildMeta(input: PaginationInput, total: number): PaginationMeta {
  return {
    page: input.page,
    size: input.size,
    total,
    totalPages: Math.ceil(total / input.size),
  }
}
