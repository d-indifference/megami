import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserCommands } from '../../commands/user.commands.interface';
import { UserCreateDto } from '../../dto/user/user.create.dto';
import { UserQueries } from '../../queries/user.queries.interface';
import { BooleanUtils } from '../../../toolkit/boolean-utils';
import { LOG } from '../../../toolkit';
import { UserRole } from '@prisma/client';

/**
 * Service for root user initialization
 */
@Injectable()
export class RootUserInitService {
	constructor(
		@Inject(ConfigService)
		private readonly configService: ConfigService,
		@Inject(UserCommands)
		private readonly userCommands: UserCommands,
		@Inject(UserQueries)
		private readonly userQueries: UserQueries
	) {}

	/**
	 * Initialize a root user
	 */
	public async initRootUser(): Promise<void> {
		if (
			BooleanUtils.normalizeBoolean(
				this.configService.get('MEGAMI_SKIP_ROOT_USER_CREATION')
			)
		) {
			LOG.log(this, 'Root user creation skipped');
		} else {
			const usersCount = await this.userQueries.getTotalCount();

			if (usersCount === 0) {
				const userCreateDto = this.makeUserCreateDto();

				LOG.log(
					this,
					`Root user with '${userCreateDto.email}' will be created`
				);

				const createdRootUser = await this.userCommands.create(
					userCreateDto
				);

				LOG.log(
					this,
					`Root user with id: '${createdRootUser.id}' was successfully created`
				);
			} else {
				LOG.log(this, 'There is no need to create a root user');
			}
		}
	}

	/**
	 * Build root user creation DTO
	 */
	private makeUserCreateDto(): UserCreateDto {
		const userCreateDto = new UserCreateDto();
		userCreateDto.email = this.configService.get('MEGAMI_ROOT_USER_EMAIL');
		userCreateDto.password = this.configService.get(
			'MEGAMI_ROOT_USER_PASSWORD'
		);
		userCreateDto.role = UserRole.ADMIN;

		return userCreateDto;
	}
}
