import { loginInputSchema } from "@qnxg-recruit/shared"
import { authService } from "../../services/auth"
import { protectedProcedure, publicProcedure, router } from "../trpc"

export const authRouter = router({
  login: publicProcedure
    .input(loginInputSchema)
    .mutation(({ input }) => authService.login(input)),

  me: protectedProcedure
    .query(({ ctx }) => authService.me(ctx.userID)),
})
