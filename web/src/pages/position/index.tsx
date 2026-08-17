import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { Link } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useTRPC } from "@/utils/trpc"

/**
 * 岗位列表 (公开). 分页 size 默认 10
 */
export function PositionListPage() {
  const trpc = useTRPC()
  const [page, setPage] = useState(1)

  const { data, isLoading, isError } = useQuery(
    trpc.position.list.queryOptions({ page, size: 10 }),
  )

  if (isLoading)
    return <div className="py-16 text-center text-muted-foreground">加载中...</div>
  if (isError)
    return <div className="py-16 text-center text-destructive">加载失败, 请稍后重试</div>

  const items = data?.items ?? []
  const meta = data?.meta

  return (
    <div className="flex flex-col gap-4 py-4">
      <h1 className="text-xl font-bold">岗位列表</h1>
      {items.length === 0
        ? <p className="py-16 text-center text-muted-foreground">暂无招聘岗位</p>
        : (
            <ul className="flex flex-col gap-3">
              {items.map(position => (
                <li key={position.id}>
                  <Link to={`/position/${position.id}`}>
                    <Card className="transition-colors hover:border-primary">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          {position.title}
                          {position.hot && <span className="rounded bg-secondary px-1.5 py-0.5 text-xs text-secondary-foreground">热门</span>}
                        </CardTitle>
                        <CardDescription className="line-clamp-2">{position.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="text-xs text-muted-foreground">
                        截止:
                        {" "}
                        {new Date(position.deadline).toLocaleDateString("zh-CN")}
                      </CardContent>
                    </Card>
                  </Link>
                </li>
              ))}
            </ul>
          )}

      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-2 text-sm">
          <button type="button" disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="disabled:opacity-40">上一页</button>
          <span className="text-muted-foreground">
            {page}
            {" / "}
            {meta.totalPages}
          </span>
          <button type="button" disabled={page >= meta.totalPages} onClick={() => setPage(p => p + 1)} className="disabled:opacity-40">下一页</button>
        </div>
      )}
    </div>
  )
}
