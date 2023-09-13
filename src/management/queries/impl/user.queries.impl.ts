import { UserQueries } from '../user.queries.interface';
import { Inject, NotFoundException } from '@nestjs/common';
import { UserRepo } from '../../repo/user.repo.interface';
import { UserMapper } from '../../mappers/user.mapper.interface';
import { User } from '@prisma/client';
import { SignInDto } from '../../dto/sign-in.dto';
import { PasswordService } from '../../services/password.service.interface';
import { LOG } from '../../../toolkit';
import { UserItemDto } from '../../dto/user/user.item.dto';

/**
 * Queries for User entity
 */
export class UserQueriesImpl implements UserQueries {
	constructor(
		@Inject(UserRepo)
		private readonly userRepo: UserRepo,
		@Inject(UserMapper)
		private readonly userMapper: UserMapper,
		@Inject(PasswordService)
		private readonly passwordService: PasswordService
	) {}

	/**
	 * Get total users count
	 */
	public async getTotalCount(): Promise<number> {
		LOG.log(this, 'get total user count');
		return await this.userRepo.totalCount();
	}

	/**
	 * Find user entity by its email
	 * @param email User email
	 */
	public async findEntityByEmail(email: string): Promise<User> {
		LOG.log(this, 'get user by email', { email });
		return await this.userRepo.findByEmail(email);
	}

	/**
	 * Find user entity for signing in
	 * @param dto Sign in DTO
	 */
	public async findEntityForSignIn(dto: SignInDto): Promise<User> {
		LOG.log(this, 'get user for signing in', dto);

		const signInCandidate = await this.userRepo.findByEmail(dto.email);

		if (signInCandidate) {
			const decryptedPassword = this.passwordService.decrypt(
				signInCandidate.encryptedPassword
			);

			if (decryptedPassword === dto.password) {
				return signInCandidate;
			}

			return null;
		}

		return null;
	}

	/**
	 * Find all users
	 */
	public async findAll(): Promise<UserItemDto[]> {
		LOG.log(this, 'find all users');

		const users = await this.userRepo.findAll();

		return users.map(user => this.userMapper.toItemDto(user));
	}

	/**
	 * Find user by ID
	 * @param id User's UUID
	 */
	public async findById(id: string): Promise<UserItemDto> {
		LOG.log(this, 'find user by uuid', { id });

		const user = await this.userRepo.findById(id);

		if (!user) {
			LOG.warn(this, '[404] user was not found', { id });
			throw new NotFoundException(`User with id ${id} was not found`);
		}

		return this.userMapper.toItemDto(user);
	}
}
