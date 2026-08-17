import { useQuery } from "@tanstack/react-query"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { APPLICATION_STATUS_LABEL } from "@/utils/labels"
import { useTRPC } from "@/utils/trpc"

/**
 * 投递管理 (需 admin). 状态推进 (初筛 / 面试 / 通过 / 拒绝) 后续随业务细化, 先列出
 */
export function AdminApplicationsPage() {
  const trpc = useTRPC()
  const { data, isLoading } = useQuery(trpc.application.listAll.queryOptions({ page: 1, size: 10 }))

  return (
    <div className="flex flex-col gap-4 py-4">
      <h1 className="text-xl font-bold">投递管理</h1>
      {isLoading
        ? <p className="text-muted-foreground">加载中...</p>
        : (
            <ul className="flex flex-col gap-3">
              {data?.items.map(app => (
                <li key={app.id}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">
                        {app.user?.name ?? "投递人"}
                        {" -> "}
                        {app.position?.title ?? "岗位"}
                      </CardTitle>
                      <CardDescription>{APPLICATION_STATUS_LABEL[app.status]}</CardDescription>
                    </CardHeader>
                  </Card>
                </li>
              ))}
            </ul>
          )}
    </div>
  )
}
