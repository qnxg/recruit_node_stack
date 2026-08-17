# recruit-web 生产镜像: 在 monorepo 上下文 Vite 构建静态产物, 由 nginx 托管
# 构建上下文为仓库根目录 (见 docker-compose build.context)

FROM node:22-alpine AS base
RUN corepack enable
WORKDIR /app

FROM base AS deps
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY shared/package.json ./shared/
COPY server/package.json ./server/
COPY web/package.json ./web/
# 装全 workspace: web 编译期 typecheck 需 server 源码及其 devDep (prisma CLI).
# runner 阶段仅 copy dist, 构建镜像体积不影响产物
RUN pnpm install --frozen-lockfile

FROM deps AS build
COPY shared ./shared
COPY server ./server
COPY web ./web
COPY tsconfig.base.json ./
# web 编译期 typecheck 会引用 server 源码 (推导 AppRouter), 后者 import
# @prisma/client 生成类型, 故构建前先生成 Prisma client
RUN pnpm --filter @qnxg-recruit/server run db:generate
WORKDIR /app/web
RUN pnpm run build

# nginx 托管静态产物 + 同域反代 /trpc 到 server
FROM nginx:1.27-alpine AS runner
COPY web/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/web/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
