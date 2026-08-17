import { IconBriefcase, IconHome, IconUser } from "@tabler/icons-react"
import { NavLink, Outlet } from "react-router-dom"
import { cn } from "@/utils/cn"

/**
 * 导航项: 主页 / 岗位列表 / 个人页
 */
const NAV_ITEMS = [
  { to: "/", label: "易千", icon: IconHome, end: true },
  { to: "/position", label: "岗位", icon: IconBriefcase, end: false },
  { to: "/me", label: "我的", icon: IconUser, end: false },
]

/**
 * 应用外壳: 占满视口, 根不滚动, 滚动只发生在 main.
 * 移动端底部 tabbar, 桌面端 (>= sm) 顶部 navbar (左 logo 标题, 右导航按钮)
 */
export function Layout() {
  return (
    <div className="flex h-[100dvh] w-screen flex-col">
      {/* 桌面端顶部导航栏 */}
      <header className="hidden shrink-0 border-b sm:block">
        <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <div className="text-lg font-semibold text-primary">易千招新</div>
          <div className="flex items-center gap-1">
            {NAV_ITEMS.map(item => (
              <NavItem key={item.to} {...item} />
            ))}
          </div>
        </nav>
      </header>

      {/* 主滚动区 */}
      <main className="min-w-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl p-4 pb-24 sm:pb-4">
          <Outlet />
        </div>
      </main>

      {/* 移动端底部 tabbar */}
      <nav className="fixed inset-x-0 bottom-0 z-10 flex border-t bg-background sm:hidden">
        {NAV_ITEMS.map(item => (
          <TabItem key={item.to} {...item} />
        ))}
      </nav>
    </div>
  )
}

interface NavEntry {
  to: string
  label: string
  icon: typeof IconHome
  end: boolean
}

function NavItem({ to, label, icon: Icon, end }: NavEntry) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) => cn(
        "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        isActive ? "bg-primary/10 text-primary" : "text-foreground hover:bg-accent",
      )}
    >
      <Icon className="size-4" />
      {label}
    </NavLink>
  )
}

function TabItem({ to, label, icon: Icon, end }: NavEntry) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) => cn(
        "flex flex-1 flex-col items-center gap-0.5 py-2 text-xs",
        isActive ? "text-primary" : "text-muted-foreground",
      )}
    >
      <Icon className="size-5" />
      {label}
    </NavLink>
  )
}
