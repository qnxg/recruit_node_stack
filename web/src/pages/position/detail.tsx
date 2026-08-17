import { useMutation, useQuery } from "@tanstack/react-query"
import { useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/hooks/auth"
import { useTRPC } from "@/utils/trpc"

/**
 * 岗位信息 (公开). 未登录点击投递时页面内引导登录
 */
export function PositionDetailPage() {
  const trpc = useTRPC()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const positionID = Number(id)
  const { isAuthenticated } = useAuth()

  const { data: position, isLoading, isError } = useQuery(
    trpc.position.byId.queryOptions({ id: positionID }),
  )

  const applyMutation = useMutation(trpc.application.create.mutationOptions())

  if (isLoading)
    return <div className="py-16 text-center text-muted-foreground">加载中...</div>
  if (isError || !position)
    return <div className="py-16 text-center text-destructive">岗位不存在</div>

  function handleApply() {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/position/${positionID}` } })
      return
    }
    applyMutation.mutate({ positionID }, {
      onSuccess: () => navigate("/me"),
    })
  }

  return (
    <div className="flex flex-col gap-4 py-4">
      <Card>
        <CardHeader>
          <CardTitle>{position.title}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="whitespace-pre-wrap text-sm">{position.description}</p>
          <p className="text-xs text-muted-foreground">
            截止:
            {" "}
            {new Date(position.deadline).toLocaleDateString("zh-CN")}
          </p>
          <Button
            className="w-fit"
            disabled={position.status !== "recruiting" || applyMutation.isPending}
            onClick={handleApply}
          >
            {position.status === "recruiting" ? "投递该岗位" : "暂不可投递"}
          </Button>
          {applyMutation.isError && (
            <p className="text-sm text-destructive">{applyMutation.error.message}</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
