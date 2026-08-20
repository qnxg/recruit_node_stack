import { router } from "@/trpc"
import { applicationRouter } from "./application"
import { authRouter } from "./auth"
import { positionRouter } from "./position"
import { userRouter } from "./user"

/**
 * 应用根 router. 前端由此推导 AppRouter 类型契约
 */
export const appRouter = router({
  auth: authRouter,
  user: userRouter,
  position: positionRouter,
  application: applicationRouter,
})

export type AppRouter = typeof appRouter
