import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  target: "es2023",
  platform: "node",
  outDir: "dist",
  clean: true,
  minify: false,
  sourcemap: true,
  // shared 现在是带 dist 的 npm 包形态, 走 node_modules 解析 (不再内联源码)
  // @prisma/client 保持外置
})
