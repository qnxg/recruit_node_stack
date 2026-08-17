import { useQuery } from "@tanstack/react-query"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { POSITION_STATUS_LABEL } from "@/utils/labels"
import { useTRPC } from "@/utils/trpc"

/**
 * 岗位管理 (需 admin). 增删改与状态流转后续随业务细化, 先列出
 */
export function AdminPositionsPage() {
  const trpc = useTRPC()
  const { data, isLoading } = useQuery(trpc.position.list.queryOptions({ page: 1, size: 10 }))

  return (
    <div className="flex flex-col gap-4 py-4">
      <h1 className="text-xl font-bold">岗位管理</h1>
      {isLoading
        ? <p className="text-muted-foreground">加载中...</p>
        : (
            <ul className="flex flex-col gap-3">
              {data?.items.map(position => (
                <li key={position.id}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between text-sm">
                        {position.title}
                        <span className="text-xs text-muted-foreground">{POSITION_STATUS_LABEL[position.status]}</span>
                      </CardTitle>
                    </CardHeader>
                  </Card>
                </li>
              ))}
            </ul>
          )}
    </div>
  )
}
