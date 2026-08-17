import type { AppRouter } from "@qnxg-recruit/server/router"
import type { ReactNode } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { createTRPCClient, httpBatchLink } from "@trpc/client"
import { useState } from "react"
import { AuthProvider } from "@/contexts/auth"
import { authStorage } from "@/utils/auth-storage"
import { TRPCProvider } from "@/utils/trpc"

/**
 * 全局 provider 组合: react-query + trpc client + auth.
 * trpc client 每次请求带上本地 token (Bearer)
 */
export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: { staleTime: 30 * 1000, retry: 1 },
    },
  }))

  const [trpcClient] = useState(() => createTRPCClient<AppRouter>({
    links: [
      httpBatchLink({
        url: "/trpc",
        headers() {
          const token = authStorage.get()
          return token ? { authorization: `Bearer ${token}` } : {}
        },
      }),
    ],
  }))

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        <AuthProvider>{children}</AuthProvider>
      </TRPCProvider>
    </QueryClientProvider>
  )
}
