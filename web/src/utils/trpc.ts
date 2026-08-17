import type { AppRouter } from "@qnxg-recruit/server/router"
import { createTRPCContext } from "@trpc/tanstack-react-query"

/**
 * trpc v11 + tanstack-query v5 的 React 上下文.
 * 组件内用 `const trpc = useTRPC()` 拿到类型安全的 query/mutation options 工厂
 */
export const { TRPCProvider, useTRPC, useTRPCClient } = createTRPCContext<AppRouter>()
