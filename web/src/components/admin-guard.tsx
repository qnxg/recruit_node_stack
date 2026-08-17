import type { ReactNode } from "react"
import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "@/hooks/auth"

/**
 * 管理后台守卫: C 端引导式登录的唯一例外.
 * 非 admin 直接拦截重定向到登录页 (记录来源以便回跳), 不页面内引导
 */
export function AdminGuard({ children }: { children: ReactNode }) {
  const { isAdmin, loading } = useAuth()
  const location = useLocation()

  if (loading)
    return <div className="p-8 text-center text-muted-foreground">加载中...</div>

  if (!isAdmin)
    return <Navigate to="/login" replace state={{ from: location.pathname }} />

  return <>{children}</>
}
