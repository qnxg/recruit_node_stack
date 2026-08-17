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
 * 路由表. C 端不做守卫 (未登录页面内引导), 仅 /admin/* 用 AdminGuard 守卫
 */
export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/position", element: <PositionListPage /> },
      { path: "/position/:id", element: <PositionDetailPage /> },
      { path: "/post", element: <PostPage /> },
      { path: "/me", element: <MePage /> },
      { path: "/me/:id", element: <ApplicationDetailPage /> },
      { path: "/login", element: <LoginPage /> },
      {
        path: "/admin",
        element: (
          <AdminGuard>
            <Outlet />
          </AdminGuard>
        ),
        children: [
          { index: true, element: <AdminHomePage /> },
          { path: "positions", element: <AdminPositionsPage /> },
          { path: "applications", element: <AdminApplicationsPage /> },
        ],
      },
    ],
  },
])
