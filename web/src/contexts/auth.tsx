import type { AuthUser } from "@qnxg-recruit/shared"
import type { ReactNode } from "react"
import { createContext, useContext, useMemo, useState } from "react"

/**
 * auth 上下文只放最基本的状态与 setter, 复杂业务逻辑下沉到 hooks/auth
 */
interface AuthContextValue {
  /** 当前登录用户态, 未登录为 null */
  user: AuthUser | null
  setUser: (updater: (prev: AuthUser | null) => AuthUser | null) => void
  /** 是否仍在初始化 (首次拉取当前用户) */
  loading: boolean
  setLoading: (loading: boolean) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  const value = useMemo<AuthContextValue>(
    () => ({ user, setUser, loading, setLoading }),
    [user, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * 消费 auth 上下文, 未挂载 Provider 时抛错.
 * 与 Provider 同文件 (状态与消费入口聚合), 故豁免 react-refresh 单一导出规则
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx)
    throw new Error("useAuthContext 必须在 AuthProvider 内使用")
  return ctx
}
