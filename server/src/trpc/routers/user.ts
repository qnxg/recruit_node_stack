import { userUpdateInputSchema } from "@qnxg-recruit/shared"
import { userService } from "../../services/user"
import { protectedProcedure, router } from "../trpc"

export const userRouter = router({
  me: protectedProcedure
    .query(({ ctx }) => userService.getById(ctx.userID)),

  update: protectedProcedure
    .input(userUpdateInputSchema)
    .mutation(({ ctx, input }) => userService.update(ctx.userID, input)),
})
