import { createBrowserRouter, Outlet } from "react-router-dom"
import { AdminGuard } from "@/components/admin-guard"
import { Layout } from "@/components/layout"
import { AdminHomePage } from "@/pages/admin"
import { AdminApplicationsPage } from "@/pages/admin/applications"
import { AdminPositionsPage } from "@/pages/admin/positions"
import { HomePage } from "@/pages/home"
import { LoginPage } from "@/pages/login"
import { MePage } from "@/pages/me"
import { ApplicationDetailPage } from "@/pages/me/detail"
import { PositionListPage } from "@/pages/position"
import { PositionDetailPage } from "@/pages/position/detail"
import { PostPage } from "@/pages/post"

/**
 * 路由表. C 端不做守卫 (未登录页面内引导), 仅 /admin/* 用 AdminGuard 守卫.
 *
 * 每条叶子路由通过 `handle.title` 声明浏览器标签标题; Layout 在路由切换时
 * 读取最深一条 match 的 title 写入 document.title (SPA 路由层同步, 无依赖).
 */
export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <HomePage />, handle: { title: "Hi ~ | 易千工作室" } },
      { path: "/position", element: <PositionListPage />, handle: { title: "岗位 | 易千工作室" } },
      { path: "/position/:id", element: <PositionDetailPage />, handle: { title: "详情 | 易千工作室" } },
      { path: "/post", element: <PostPage />, handle: { title: "投递 | 易千工作室" } },
      { path: "/me", element: <MePage />, handle: { title: "我的 - 易千工作室" } },
      { path: "/me/:id", element: <ApplicationDetailPage />, handle: { title: "记录 - 易千工作室" } },
      { path: "/login", element: <LoginPage />, handle: { title: "登录 - 易千工作室" } },
      {
        path: "/admin",
        element: (
          <AdminGuard>
            <Outlet />
          </AdminGuard>
        ),
        children: [
          { index: true, element: <AdminHomePage />, handle: { title: "后台 - 易千工作室" } },
          { path: "positions", element: <AdminPositionsPage />, handle: { title: "后台 - 易千工作室" } },
          { path: "applications", element: <AdminApplicationsPage />, handle: { title: "后台 - 易千工作室" } },
        ],
      },
    ],
  },
])
