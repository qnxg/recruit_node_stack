/**
 * 品牌资产: 名称与图标 (易千网络文化工作室)
 *
 * 徽标提供两版:
 * - 长版 (200x60) 适合配合较大标题文字 (如主页 hero)
 * - 方版 (120x120) 适合紧凑场景 (如 navbar) 与浏览器 favicon
 *
 * SVG 源文件落在 `web/src/assets/brand/`, 通过 Vite 默认 import 拿到 URL.
 * 浏览器 favicon 走 `web/public/favicon.svg` (内容同方版), public 是浏览器
 * 独立请求的资源, 不走 import.
 */

/** 品牌名, 用于品牌区文字部分 */
export const BRAND_NAME = "易千工作室"

/** 长版徽标 URL (200x60) */
export const BRAND_LOGO_SRC = new URL("../assets/brand/logo-long.svg", import.meta.url).href

/** 方版徽标 URL (120x120) */
export const BRAND_LOGO_SRC_SQUARE = new URL("../assets/brand/logo-square.svg", import.meta.url).href
