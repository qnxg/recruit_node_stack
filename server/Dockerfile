# recruit-server 生产镜像: 在 monorepo 上下文构建, 产出 tsup bundle 后用 node 跑
# 构建上下文为仓库根目录 (见 docker-compose build.context)

FROM node:22-alpine AS base
RUN corepack enable
WORKDIR /app

# 依赖层: 复制 workspace 清单, 装全量依赖 (含 shared 源码依赖)
FROM base AS deps
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY shared/package.json ./shared/
COPY server/package.json ./server/
COPY web/package.json ./web/
RUN pnpm install --frozen-lockfile --filter @qnxg-recruit/server... --filter @qnxg-recruit/shared

# 构建层: 复制源码, 生成 Prisma client, tsup 打包
FROM deps AS build
COPY shared ./shared
COPY server ./server
COPY tsconfig.base.json ./
# shared 先 build 出 .d.ts (server build 要消费 shared/dist)
WORKDIR /app/shared
RUN pnpm run build
WORKDIR /app/server
RUN pnpm exec prisma generate
RUN pnpm run build

# 运行层: 只带产物 + 生产依赖 + prisma schema/引擎
FROM base AS runner
ENV NODE_ENV=production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/server/node_modules ./server/node_modules
COPY --from=build /app/server/dist ./server/dist
COPY --from=build /app/server/prisma ./server/prisma
COPY --from=build /app/server/package.json ./server/
WORKDIR /app/server
EXPOSE 3000
# 启动前跑迁移再起服务. 直接调 prisma 二进制, 绕开 pnpm 的 workspace 依赖检查
# (runner 层不含 shared 包目录, 经 pnpm 会误报 workspace 包缺失)
CMD ["sh", "-c", "./node_modules/.bin/prisma migrate deploy --schema=prisma/schema.prisma && node dist/index.js"]
