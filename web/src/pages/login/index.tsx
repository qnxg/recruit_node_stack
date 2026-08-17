import type { LoginInput } from "@qnxg-recruit/shared"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginInputSchema } from "@qnxg-recruit/shared"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useLocation, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/hooks/auth"

interface LocationState {
  from?: string
}

/**
 * 登录页. 登录手段属业务待定, 此处先按 stuID + 凭据搭壳.
 * 登录成功回跳到触发登录的原状态
 */
export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, loginPending, isAuthenticated } = useAuth()
  const from = (location.state as LocationState | null)?.from ?? "/me"

  const { register, handleSubmit, formState: { errors }, setError } = useForm<LoginInput>({
    resolver: zodResolver(loginInputSchema),
    defaultValues: { stuID: "", password: "" },
  })

  useEffect(() => {
    if (isAuthenticated)
      navigate(from, { replace: true })
  }, [isAuthenticated, from, navigate])

  async function onSubmit(values: LoginInput) {
    try {
      await login(values)
    }
    catch (err) {
      setError("password", { message: err instanceof Error ? err.message : "登录失败" })
    }
  }

  return (
    <div className="flex justify-center py-12">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>登录</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
            <label className="flex flex-col gap-1 text-sm">
              学号
              <input
                className="h-10 rounded-md border border-input px-3"
                {...register("stuID")}
              />
              {errors.stuID && <span className="text-xs text-destructive">{errors.stuID.message}</span>}
            </label>
            <label className="flex flex-col gap-1 text-sm">
              凭据
              <input
                type="password"
                className="h-10 rounded-md border border-input px-3"
                {...register("password")}
              />
              {errors.password && <span className="text-xs text-destructive">{errors.password.message}</span>}
            </label>
            <Button type="submit" disabled={loginPending}>
              {loginPending ? "登录中..." : "登录"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
