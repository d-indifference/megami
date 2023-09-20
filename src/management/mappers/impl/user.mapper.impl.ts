import { UserMapper } from '../user.mapper.interface';
import { UserCreateDto } from '../../dto/user/user.create.dto';
import { User } from '@prisma/client';
import { UserItemDto } from '../../dto/user/user.item.dto';
import { Inject } from '@nestjs/common';
import { PasswordService } from '../../services/password.service.interface';
import { UserUpdateDto } from '../../dto/user/user.update.dto';
import { UserUpdateRoleDto } from '../../dto/user/user-update-role.dto';

/**
 * Mapper for User entity
 */
export class UserMapperImpl implements UserMapper {
	constructor(
		@Inject(PasswordService)
		private readonly passwordService: PasswordService
	) {}

	/**
	 * Map creation DTO to entity
	 * @param dto Creation DTO
	 */
	public create(dto: UserCreateDto): User {
		const encryptedPassword = this.passwordService.encrypt(dto.password);

		return {
			email: dto.email,
			encryptedPassword,
			role: dto.role
		} as User;
	}

	/**
	 * Map entity to item DTO
	 * @param entity User entity
	 */
	public toItemDto(entity: User): UserItemDto {
		const dto = new UserItemDto();
		dto.id = entity.id;
		dto.email = entity.email;
		dto.role = entity.role;

		return dto;
	}

	/**
	 * Map update DTO to User entity
	 * @param dto User update DTO
	 */
	public update(dto: UserUpdateDto): User {
		const encryptedPassword = this.passwordService.encrypt(dto.password);

		return {
			email: dto.email,
			encryptedPassword
		} as User;
	}

	/**
	 * Map update role DTO to User entity
	 * @param dto User update role DTO
	 */
	public updateRole(dto: UserUpdateRoleDto): User {
		return {
			email: dto.email,
			role: dto.role
		} as User;
	}
}
