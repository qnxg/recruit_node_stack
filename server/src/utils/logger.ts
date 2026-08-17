/* eslint-disable no-console */
import process from "node:process"

/**
 * 统一日志出口. 禁用散落的 console.log, 一律走此 logger
 */
type LogLevel = "debug" | "info" | "warn" | "error"

function emit(level: LogLevel, msg: string, meta?: unknown) {
  const time = new Date().toISOString()
  const line = `[${time}] [${level.toUpperCase()}] ${msg}`
  const sink = level === "error" || level === "warn" ? console.error : console.log
  if (meta !== undefined)
    sink(line, meta)
  else
    sink(line)
}

export const logger = {
  debug: (msg: string, meta?: unknown) => {
    if (process.env.NODE_ENV !== "production")
      emit("debug", msg, meta)
  },
  info: (msg: string, meta?: unknown) => emit("info", msg, meta),
  warn: (msg: string, meta?: unknown) => emit("warn", msg, meta),
  error: (msg: string, meta?: unknown) => emit("error", msg, meta),
}
