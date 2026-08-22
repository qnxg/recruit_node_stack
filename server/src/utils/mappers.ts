import type { Position, User } from "@prisma/client"
import type { ApplicationDto, PositionDto, UserDto } from "@qnxg-recruit/shared"
import type { ApplicationWithRelations } from "@/repos/application"

/**
 * Prisma 实体 → 对外 DTO 的映射. 移除内部字段 (外键 / 软删标记).
 * 时间字段 Prisma 返回 bigint, 按时间约定 (见 utils/time) 转回 number 毫秒
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
    createdAt: Number(position.createdAt),
    deadline: Number(position.deadline),
    hot: position.hot,
    status: position.status,
  }
}

export function toApplicationDto(app: ApplicationWithRelations): ApplicationDto {
  return {
    id: app.id,
    status: app.status,
    createdAt: Number(app.createdAt),
    updatedAt: Number(app.updatedAt),
    user: toUserDto(app.user),
    position: toPositionDto(app.position),
  }
}
