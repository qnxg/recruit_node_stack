import { useQuery } from "@tanstack/react-query"
import { Link } from "react-router-dom"
import { LoginPrompt } from "@/components/login-prompt"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/hooks/auth"
import { APPLICATION_STATUS_LABEL } from "@/utils/labels"
import { useTRPC } from "@/utils/trpc"

/**
 * 个人页 (需登录, 未登录页面内引导): 基础信息 + 投递列表
 */
export function MePage() {
  const trpc = useTRPC()
  const { user, isAuthenticated, logout } = useAuth()

  const { data, isLoading } = useQuery({
    ...trpc.application.list.queryOptions({ page: 1, size: 10 }),
    enabled: isAuthenticated,
  })

  if (!isAuthenticated)
    return <LoginPrompt hint="登录后查看个人信息与投递记录" />

  return (
    <div className="flex flex-col gap-6 py-4">
      <Card>
        <CardHeader>
          <CardTitle>{user?.name}</CardTitle>
          <CardDescription>
            学号:
            {" "}
            {user?.stuID}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" size="sm" onClick={logout}>退出登录</Button>
        </CardContent>
      </Card>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">我的投递</h2>
        {isLoading
          ? <p className="text-muted-foreground">加载中...</p>
          : (data?.items.length ?? 0) === 0
              ? <p className="text-muted-foreground">还没有投递记录</p>
              : (
                  <ul className="flex flex-col gap-3">
                    {data?.items.map(app => (
                      <li key={app.id}>
                        <Link to={`/me/${app.id}`}>
                          <Card className="transition-colors hover:border-primary">
                            <CardHeader>
                              <CardTitle className="text-sm">{app.position?.title ?? "岗位"}</CardTitle>
                              <CardDescription>{APPLICATION_STATUS_LABEL[app.status]}</CardDescription>
                            </CardHeader>
                          </Card>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
      </section>
    </div>
  )
}
