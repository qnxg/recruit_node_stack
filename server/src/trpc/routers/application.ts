import {
  applicationCreateInputSchema,
  applicationListInputSchema,
  applicationStatusUpdateInputSchema,
} from "@qnxg-recruit/shared"
import { z } from "zod"
import { applicationService } from "@/services/application"
import { adminProcedure, protectedProcedure, router } from "../trpc"

const idInput = z.object({ id: z.number().int() })

export const applicationRouter = router({
  // 当前用户的投递列表
  list: protectedProcedure
    .input(applicationListInputSchema)
    .query(({ ctx, input }) => applicationService.listByUser(ctx.userID, input)),

  byId: protectedProcedure
    .input(idInput)
    .query(({ ctx, input }) => applicationService.getById(input.id, ctx.userID, false)),

  create: protectedProcedure
    .input(applicationCreateInputSchema)
    .mutation(({ ctx, input }) => applicationService.create(ctx.userID, input)),

  withdraw: protectedProcedure
    .input(idInput)
    .mutation(({ ctx, input }) => applicationService.withdraw(ctx.userID, input.id)),

  // admin: 全量列表 / 详情 / 推进状态
  listAll: adminProcedure
    .input(applicationListInputSchema)
    .query(({ input }) => applicationService.listAll(input)),

  adminById: adminProcedure
    .input(idInput)
    .query(({ ctx, input }) => applicationService.getById(input.id, ctx.userID, true)),

  updateStatus: adminProcedure
    .input(applicationStatusUpdateInputSchema)
    .mutation(({ input }) => applicationService.updateStatus(input.id, input.status)),
})
