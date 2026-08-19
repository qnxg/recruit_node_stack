import { Link } from "react-router-dom"
import { buttonVariants } from "@/components/ui/button"
import { BRAND_LOGO_SRC, BRAND_NAME } from "@/utils/brand"
import { cn } from "@/utils/cn"

/**
 * 主页 (公开)
 */
export function HomePage() {
  return (
    <div className="flex flex-col gap-6 py-8">
      <header className="flex flex-col gap-2">
        <h1 className="flex items-center gap-2 text-2xl font-bold text-primary">
          <img src={BRAND_LOGO_SRC} alt="" className="h-7 w-auto" />
          <span>{BRAND_NAME}</span>
        </h1>
        <p className="text-muted-foreground">湖南大学易千网络文化工作室招新季, 欢迎加入我们.</p>
      </header>
      <Link to="/position" className={cn(buttonVariants(), "w-fit")}>
        浏览岗位
      </Link>
    </div>
  )
}
