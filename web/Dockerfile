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
RUN pnpm install --frozen-lockfile --filter @qnxg-recruit/web... --filter @qnxg-recruit/shared

FROM deps AS build
COPY shared ./shared
COPY server ./server
COPY web ./web
COPY tsconfig.base.json ./
WORKDIR /app/web
RUN pnpm run build

# nginx 托管静态产物 + 同域反代 /trpc 到 server
FROM nginx:1.27-alpine AS runner
COPY web/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/web/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
