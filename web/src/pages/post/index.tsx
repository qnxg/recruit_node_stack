import { Link } from "react-router-dom"
import { LoginPrompt } from "@/components/login-prompt"
import { buttonVariants } from "@/components/ui/button"
import { useAuth } from "@/hooks/auth"
import { cn } from "@/utils/cn"

/**
 * 投递页面 (需登录). 投递入口从岗位详情发起, 此处引导用户去岗位列表挑选
 */
export function PostPage() {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated)
    return <LoginPrompt hint="登录后投递岗位" />

  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <p className="text-muted-foreground">从岗位列表选择心仪岗位后投递</p>
      <Link to="/position" className={cn(buttonVariants())}>浏览岗位</Link>
    </div>
  )
}
