import antfu from "@antfu/eslint-config"

export default antfu({
  type: "app",
  typescript: true,
  react: true,
  stylistic: {
    indent: 2,
    quotes: "double",
  },
  formatters: {
    markdown: true,
    css: true,
  },
  ignores: [
    "**/dist/**",
    "**/lib/**",
    "**/node_modules/**",
    "server/prisma/generated/**",
    "web/src/components/ui/**",
  ],
})
