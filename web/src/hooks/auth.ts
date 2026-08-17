import type { LoginInput } from "@qnxg-recruit/shared"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useEffect } from "react"
import { useAuthContext } from "@/contexts/auth"
import { authStorage } from "@/utils/auth-storage"
import { useTRPC } from "@/utils/trpc"

/**
 * 鉴权业务 hook: 封装登录 / 登出 / 当前用户拉取.
 * 状态存于 contexts/auth, 这里只写业务逻辑
 */
export function useAuth() {
  const trpc = useTRPC()
  const { user, setUser, loading, setLoading } = useAuthContext()

  const hasToken = authStorage.get() !== null

  // 有 token 时拉取当前用户态; 无 token 直接置为未登录
  const meQuery = useQuery({
    ...trpc.auth.me.queryOptions(),
    enabled: hasToken,
    retry: false,
  })

  useEffect(() => {
    if (!hasToken) {
      setUser(() => null)
      setLoading(false)
      return
    }
    if (meQuery.isSuccess) {
      setUser(() => meQuery.data)
      setLoading(false)
    }
    else if (meQuery.isError) {
      // token 失效: 清理并置未登录
      authStorage.clear()
      setUser(() => null)
      setLoading(false)
    }
  }, [hasToken, meQuery.isSuccess, meQuery.isError, meQuery.data, setUser, setLoading])

  const loginMutation = useMutation(trpc.auth.login.mutationOptions())

  /**
   * 登录: 拿 token 存本地, 触发用户态刷新
   */
  async function login(input: LoginInput): Promise<void> {
    const { token } = await loginMutation.mutateAsync(input)
    authStorage.set(token)
    setLoading(true)
    await meQuery.refetch()
  }

  /**
   * 登出: 清 token 与用户态
   */
  function logout(): void {
    authStorage.clear()
    setUser(() => null)
  }

  return {
    user,
    isAuthenticated: user !== null,
    isAdmin: user?.isAdmin ?? false,
    loading,
    login,
    logout,
    loginPending: loginMutation.isPending,
  }
}
