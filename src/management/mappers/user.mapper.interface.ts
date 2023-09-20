import { UserCreateDto } from '../dto/user/user.create.dto';
import { User } from '@prisma/client';
import { UserItemDto } from '../dto/user/user.item.dto';
import { UserUpdateDto } from '../dto/user/user.update.dto';
import { UserUpdateRoleDto } from '../dto/user/user-update-role.dto';

/**
 * Mapper for User entity
 */
export interface UserMapper {
	create(dto: UserCreateDto): User;

	update(dto: UserUpdateDto): User;

	updateRole(dto: UserUpdateRoleDto): User;

	toItemDto(entity: User): UserItemDto;
}

export const UserMapper = Symbol('UserMapper');
