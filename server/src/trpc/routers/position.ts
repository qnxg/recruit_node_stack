import { positionListInputSchema, positionUpsertInputSchema } from "@qnxg-recruit/shared"
import { z } from "zod"
import { positionService } from "@/services/position"
import { adminProcedure, publicProcedure, router } from "../trpc"

const idInput = z.object({ id: z.number().int() })

export const positionRouter = router({
  // 公开: 岗位列表 / 详情
  list: publicProcedure
    .input(positionListInputSchema)
    .query(({ input }) => positionService.list(input)),

  byId: publicProcedure
    .input(idInput)
    .query(({ input }) => positionService.getById(input.id)),

  // admin: 增删改
  create: adminProcedure
    .input(positionUpsertInputSchema)
    .mutation(({ input }) => positionService.create(input)),

  update: adminProcedure
    .input(idInput.extend(positionUpsertInputSchema.shape))
    .mutation(({ input }) => positionService.update(input.id, input)),

  remove: adminProcedure
    .input(idInput)
    .mutation(({ input }) => positionService.remove(input.id)),
})
