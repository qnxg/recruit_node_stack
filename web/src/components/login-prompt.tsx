import { useLocation, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"

/**
 * C 端页面内登录引导 (非拦截跳转). 个人页 / 投递页未登录时展示,
 * 点击前往登录页并记录来源以便回跳
 */
export function LoginPrompt({ hint }: { hint?: string }) {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <p className="text-muted-foreground">{hint ?? "登录后查看此内容"}</p>
      <Button onClick={() => navigate("/login", { state: { from: location.pathname } })}>
        前往登录
      </Button>
    </div>
  )
}
