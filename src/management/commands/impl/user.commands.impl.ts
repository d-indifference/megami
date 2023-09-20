import { UserCommands } from '../user.commands.interface';
import { UserCreateDto } from '../../dto/user/user.create.dto';
import { CreationResultDto } from '../../../toolkit/creation-result.dto';
import { Inject, MethodNotAllowedException } from '@nestjs/common';
import { UserRepo } from '../../repo/user.repo.interface';
import { UserMapper } from '../../mappers/user.mapper.interface';
import { UserUpdateDto } from '../../dto/user/user.update.dto';
import { DeleteDto } from '../../../toolkit/delete.dto';
import { LOG } from '../../../toolkit';
import { UserUpdateRoleDto } from '../../dto/user/user-update-role.dto';

/**
 * Commands for User entity
 */
export class UserCommandsImpl implements UserCommands {
	constructor(
		@Inject(UserRepo)
		private readonly userRepo: UserRepo,
		@Inject(UserMapper)
		private readonly userMapper: UserMapper
	) {}

	/**
	 * Create new user
	 * @param dto Creation DTO
	 */
	public async create(
		dto: UserCreateDto
	): Promise<CreationResultDto<string>> {
		LOG.log(this, 'create user', dto);

		await this.applyUniquenessPolicy(dto);

		const createdUser = await this.userRepo.create(
			this.userMapper.create(dto)
		);

		const result = new CreationResultDto<string>(createdUser.id);

		LOG.logCreation(this, 'user created', result);

		return result;
	}

	/**
	 * Update a user
	 * @param dto update DTO
	 * @param id User UUID
	 */
	public async update(
		dto: UserUpdateDto,
		id: string
	): Promise<CreationResultDto<string>> {
		LOG.log(this, 'update user', dto);

		const entity = this.userMapper.update(dto);

		const updatedUser = await this.userRepo.update(entity, id);

		const result = new CreationResultDto<string>(updatedUser.id);

		LOG.logCreation(this, 'user updated', result);

		return result;
	}

	/**
	 * Update a user with role
	 * @param dto update DTO
	 * @param id User UUID
	 */
	public async updateRole(
		dto: UserUpdateRoleDto,
		id: string
	): Promise<CreationResultDto<string>> {
		LOG.log(this, 'update user with role', dto);

		const entity = this.userMapper.updateRole(dto);

		const foundUser = await this.userRepo.findById(id);

		entity.encryptedPassword = foundUser.encryptedPassword;

		const updatedUser = await this.userRepo.update(entity, id);

		const result = new CreationResultDto<string>(updatedUser.id);

		LOG.logCreation(this, 'user updated', result);

		return result;
	}

	/**
	 * Remove users
	 * @param dto Deletion DTO
	 */
	public async remove(dto: DeleteDto): Promise<void> {
		LOG.log(this, 'remove users', dto);

		const users = await this.userRepo.findByIds(dto.ids);

		if (users.length > 0) {
			await this.userRepo.remove(dto);

			LOG.log(this, 'users removed');
		}
	}

	/**
	 * Check if user email is unique
	 * @param dto Creation DTO
	 */
	private async applyUniquenessPolicy(dto: UserCreateDto): Promise<void> {
		const existedUser = await this.userRepo.findByEmail(dto.email);

		if (existedUser) {
			LOG.log(
				this,
				'user creation rejected, uniqueness policy applied',
				dto
			);
			throw new MethodNotAllowedException('User is already exists');
		}
	}
}
