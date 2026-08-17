# AGENTS.md

qnxg 招新招聘系统全栈 monorepo 的协作入口. 湖南大学易千网络文化工作室 (代号 qnxg) 招新季项目.

## 速览

pnpm monorepo 四包, 全栈 Node 22 + 全 ESM, tsconfig `target: ES2023`:

| 目录      | 包名                   | 角色                                                                   |
| --------- | ---------------------- | ---------------------------------------------------------------------- |
| `/`       | `@qnxg-recruit/root`   | workspace 根: 公用 lint/format, husky, commitlint, 一键启停 script     |
| `/shared` | `@qnxg-recruit/shared` | 前后端共享契约: zod schema / DTO 类型 / 枚举 (不构建, 直供 `.ts` 源码) |
| `/server` | `@qnxg-recruit/server` | recruit-server: Node + Express + trpc v11 + Prisma                     |
| `/web`    | `@qnxg-recruit/web`    | recruit-web: Vite + React + Tailwind 4 + shadcn                        |

## 命令

根目录一键命令:

- `pnpm dev` —— 并行拉起 web (5173) + server (3000)
- `pnpm dev:web` / `pnpm dev:server` —— 单独启动
- `pnpm build` —— server (tsup) + web (vite) 生产构建
- `pnpm check` —— 递归各包 `tsc --noEmit`
- `pnpm lint` / `pnpm fix` —— eslint 检查 / 自动修复

server 专属 (`pnpm --filter @qnxg-recruit/server run <script>`):

- `db:generate` —— 生成 Prisma client
- `db:migrate` —— 开发迁移 (`prisma migrate dev`)
- `db:deploy` —— 部署迁移 (`prisma migrate deploy`)

首次开发前: 复制 `server/.env.example` 为 `server/.env` 并填 `DATABASE_URL` / `JWT_SECRET` (缺失会 fail-fast).

## 规范

- **提交**: Conventional Commits, 描述用中文, 如 `feat(web): 完成岗位列表页`. 不直接提交 main.
- **代码风格**: antfu eslint —— 双引号, 2 空格缩进, 无分号. 启用 react + typescript + formatters.
- **标点**: 注释 / 文档用中文, 标点统一英文半角且尾随空格, 中英文之间留空格 (盘古之白). 禁用全角符号.
- **命名**: 非结构化命名, 按路径分类 (如 `contexts/auth.tsx` + `hooks/auth.ts`, 而非 `auth-context.tsx`).
- **注释**: 公共类型 / 函数 / Hook 写 JSDoc / TSDoc. 后端禁用 `console.log`, 走 `utils/logger`.

## 目录约定

### web (按页聚合)

- 通用内容放 `src/` 顶层: `components/` `contexts/` `hooks/` `utils/` `pages/`.
- 某页专用内容下沉到该页目录 (`pages/xxx/components/` 等).
- 状态业务分离: Context 只放基本状态 + setter, 业务逻辑下沉对应 Hook; Provider 的 `value` 用 `useMemo` 稳定, 消费用 `useXxxContext` 并对未挂载抛错.
- C 端不做路由守卫 (未登录页面内引导); 仅 `/admin/*` 用 `AdminGuard` 守卫.

### server (trpc procedure -> service -> repo 三层)

- `src/trpc/`: router / procedure 定义 + 入参 zod 校验 + 鉴权中间件 (`protectedProcedure` / `adminProcedure`).
- `src/services/`: 业务逻辑, 唯一写业务的地方, 不裸调 Prisma.
- `src/repos/`: 收拢 Prisma 调用; 投递记录每次 get 顺带做失效检测.
- 跨包被 web 消费的源码用相对导入 (不用 `@/` 别名, 否则跨包编译解析错位).

## 架构要点

- **通信**: trpc v11 + `@tanstack/react-query` v5. web 从 `@qnxg-recruit/server/router` 推导 `AppRouter` 类型契约.
- **时间**: 对外 / DTO 用毫秒级 Unix 时间戳 (number); 前端用 `@twisuki/ohday` 本地化展示.
- **鉴权**: JWT 只存 userID (有效期 1 天, 不续期); 是否 admin 后端每次查库判定.
- **DTO**: 对外用拓展 DTO, 移除外键, 按需嵌套关联对象, 不直接暴露 Prisma 实体.
- **部署**: docker-compose 三 service (postgres + server + web); web 用 nginx 同域反代 `/trpc` 到 server.
