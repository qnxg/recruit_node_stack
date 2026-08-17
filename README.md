# recruit

湖南大学易千网络文化工作室 (代号 qnxg) 招新季招聘系统, pnpm monorepo 全栈工程.

## 技术栈

- **前端** recruit-web: Vite + React + Tailwind 4 + shadcn + react-router
- **后端** recruit-server: Node + Express + trpc v11 + Prisma + PostgreSQL
- **通信**: trpc + `@tanstack/react-query` v5, 前后端共享 zod 契约
- **工程化**: pnpm monorepo, antfu eslint, husky + commitlint, GitHub Actions

## 快速开始

```bash
# 装依赖
pnpm install

# 配置后端环境变量
cp server/.env.example server/.env   # 填 DATABASE_URL / JWT_SECRET

# 生成 Prisma client 并迁移
pnpm --filter @qnxg-recruit/server run db:generate
pnpm --filter @qnxg-recruit/server run db:migrate

# 一键启动前后端
pnpm dev
```

- web: <http://localhost:5173>
- server: <http://localhost:3000>

## 部署

```bash
cp .env.example .env   # 填生产 JWT_SECRET 等
docker compose up -d --build
```

三 service (postgres + server + web/nginx) 一起起, nginx 同域反代 `/trpc` 到 server.

## 更多

协作规范, 目录约定与架构要点见 [AGENTS.md](./AGENTS.md).
