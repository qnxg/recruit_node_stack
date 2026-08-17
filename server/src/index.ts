import { createExpressMiddleware } from "@trpc/server/adapters/express"
import cors from "cors"
import express from "express"
import { env } from "@/config/env"
import { createContext } from "@/trpc/context"
import { appRouter } from "@/trpc/routers"
import { logger } from "@/utils/logger"

const app = express()

// CORS: 放行 web 源 (分离部署 / 直连场景兜底; 同域反代走同源不受影响)
app.use(cors({ origin: env.WEB_ORIGIN, credentials: true }))

// 健康检查
app.get("/health", (_req, res) => {
  res.json({ ok: true })
})

// trpc 挂载点
app.use(
  "/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  }),
)

app.listen(env.PORT, () => {
  logger.info(`recruit-server 已启动, 监听 http://localhost:${env.PORT}`)
})

// 复用给前端的类型契约
export type { AppRouter } from "@/trpc/routers"
