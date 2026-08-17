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
  // shared 直供 .ts 源码, 打进 bundle; @prisma/client 保持外置
  noExternal: [/@qnxg-recruit\/shared/],
})
