const TOKEN_KEY = "qnxg_recruit_token"

/**
 * token 本地持久化. 客户端持有 JWT (见 server-design 鉴权)
 */
export const authStorage = {
  get: (): string | null => localStorage.getItem(TOKEN_KEY),
  set: (token: string): void => localStorage.setItem(TOKEN_KEY, token),
  clear: (): void => localStorage.removeItem(TOKEN_KEY),
}
