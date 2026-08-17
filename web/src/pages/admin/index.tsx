import { Link } from "react-router-dom"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"

/**
 * 后台首页 / 概览 (需 admin)
 */
export function AdminHomePage() {
  return (
    <div className="flex flex-col gap-4 py-4">
      <h1 className="text-xl font-bold">管理后台</h1>
      <div className="grid gap-3 sm:grid-cols-2">
        <Link to="/admin/positions">
          <Card className="transition-colors hover:border-primary">
            <CardHeader><CardTitle>岗位管理</CardTitle></CardHeader>
          </Card>
        </Link>
        <Link to="/admin/applications">
          <Card className="transition-colors hover:border-primary">
            <CardHeader><CardTitle>投递管理</CardTitle></CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  )
}
