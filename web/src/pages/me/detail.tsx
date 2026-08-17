import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import { LoginPrompt } from "@/components/login-prompt"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/hooks/auth"
import { APPLICATION_STATUS_LABEL } from "@/utils/labels"
import { useTRPC } from "@/utils/trpc"

/**
 * 投递详情 (需登录). 可撤回 (草稿 / 初筛 / 面试态)
 */
export function ApplicationDetailPage() {
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const { id } = useParams<{ id: string }>()
  const applicationID = Number(id)
  const { isAuthenticated } = useAuth()

  const { data: app, isLoading, isError } = useQuery({
    ...trpc.application.byId.queryOptions({ id: applicationID }),
    enabled: isAuthenticated,
  })

  const withdrawMutation = useMutation({
    ...trpc.application.withdraw.mutationOptions(),
    onSuccess: () => queryClient.invalidateQueries(),
  })

  if (!isAuthenticated)
    return <LoginPrompt hint="登录后查看投递详情" />
  if (isLoading)
    return <div className="py-16 text-center text-muted-foreground">加载中...</div>
  if (isError || !app)
    return <div className="py-16 text-center text-destructive">投递记录不存在</div>

  const canWithdraw = app.status === "draft" || app.status === "screening" || app.status === "interview"

  return (
    <div className="flex flex-col gap-4 py-4">
      <Card>
        <CardHeader>
          <CardTitle>{app.position?.title ?? "岗位"}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <p className="text-sm">
            当前状态:
            {" "}
            {APPLICATION_STATUS_LABEL[app.status]}
          </p>
          <p className="text-xs text-muted-foreground">
            投递时间:
            {" "}
            {new Date(app.createdAt).toLocaleString("zh-CN")}
          </p>
          {canWithdraw && (
            <Button
              variant="destructive"
              size="sm"
              className="w-fit"
              disabled={withdrawMutation.isPending}
              onClick={() => withdrawMutation.mutate({ id: applicationID })}
            >
              撤回投递
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
