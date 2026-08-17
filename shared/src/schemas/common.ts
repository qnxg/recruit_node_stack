import { z } from "zod"

/**
 * 毫秒级 Unix 时间戳 (对外与 DTO 的统一时间表示, 见 server-design 时间约定)
 */
export const timestampSchema = z.number().int().nonnegative()

/**
 * 分页请求参数. size 默认 10, page 从 1 起
 */
export const paginationInputSchema = z.object({
  page: z.number().int().min(1).default(1),
  size: z.number().int().min(1).max(100).default(10),
})

export type PaginationInput = z.infer<typeof paginationInputSchema>

/**
 * 分页返回的元信息
 */
export const paginationMetaSchema = z.object({
  page: z.number().int().min(1),
  size: z.number().int().min(1),
  total: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
})

export type PaginationMeta = z.infer<typeof paginationMetaSchema>

/**
 * 构造分页返回结构的 schema 工厂: `{ items, meta }`
 *
 * @param itemSchema 单条数据的 schema
 */
export function paginatedSchema<T extends z.ZodTypeAny>(itemSchema: T) {
  return z.object({
    items: z.array(itemSchema),
    meta: paginationMetaSchema,
  })
}
