import type { Position, User } from "@prisma/client"
import type { ApplicationDto, PositionDto, UserDto } from "@qnxg-recruit/shared"
import type { ApplicationWithRelations } from "@/repos/application"

/**
 * Prisma 实体 → 对外 DTO 的映射. 移除内部字段 (外键 / 软删标记),
 * 时间已是 ms 时间戳 (Int), 直接透传
 */

export function toUserDto(user: User): UserDto {
  return {
    id: user.id,
    name: user.name,
    stuID: user.stuID,
  }
}

export function toPositionDto(position: Position): PositionDto {
  return {
    id: position.id,
    title: position.title,
    description: position.description,
    createdAt: position.createdAt,
    deadline: position.deadline,
    hot: position.hot,
    status: position.status,
  }
}

export function toApplicationDto(app: ApplicationWithRelations): ApplicationDto {
  return {
    id: app.id,
    status: app.status,
    createdAt: app.createdAt,
    updatedAt: app.updatedAt,
    user: toUserDto(app.user),
    position: toPositionDto(app.position),
  }
}
