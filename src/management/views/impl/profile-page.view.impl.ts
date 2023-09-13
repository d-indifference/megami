import { ProfilePageView } from '../profile-page.view.interface';
import { SessionDto } from '../../dto/session/session.dto';
import { ProfilePage } from '../../types/profile-page.type';
import { Inject, MethodNotAllowedException } from '@nestjs/common';
import { UserCommands } from '../../commands/user.commands.interface';
import { UserQueries } from '../../queries/user.queries.interface';
import { UserChangePasswordDto } from '../../dto/user/user.change-password.dto';
import { SignInDto } from '../../dto/sign-in.dto';
import { UserUpdateDto } from '../../dto/user/user.update.dto';
import { DeleteDto } from '../../../toolkit/delete.dto';
import { Response } from 'express';
import { SiteSettingsService } from '../../../site-settings/services/site-settings.service';
import { LOG } from '../../../toolkit';

/**
 * Profile page view
 */
export class ProfilePageViewImpl implements ProfilePageView {
	constructor(
		@Inject(UserQueries)
		private readonly userQueries: UserQueries,
		@Inject(UserCommands)
		private readonly userCommands: UserCommands,
		@Inject(SiteSettingsService)
		private readonly siteSettingsService: SiteSettingsService
	) {}

	/**
	 * Get profile page view payload
	 * @param session Session data
	 */
	public async getPage(session: SessionDto): Promise<ProfilePage> {
		LOG.log(this, 'get profile page statistics', session);

		return {
			title: await this.siteSettingsService.buildTitle('Profile'),
			session: session.payload,
			siteLogo: await this.siteSettingsService.getTitle()
		};
	}

	/**
	 * Update user
	 * @param session session payload
	 * @param dto User change password DTO
	 * @param res Express.js response
	 */
	public async updateUser(
		session: SessionDto,
		dto: UserChangePasswordDto,
		res: Response
	): Promise<void> {
		LOG.log(this, 'update user', session);

		const signInDto = new SignInDto(session.payload.email, dto.oldPassword);

		const user = await this.userQueries.findEntityForSignIn(signInDto);

		if (!user) {
			throw new MethodNotAllowedException();
		}

		if (dto.newPassword === dto.confirmPassword) {
			const userUpdateDto = new UserUpdateDto(
				session.payload.email,
				session.payload.role,
				dto.newPassword
			);

			await this.userCommands.update(userUpdateDto, user.id);

			res.redirect('/megami/profile');
		} else {
			throw new MethodNotAllowedException();
		}
	}

	/**
	 * Delete user
	 * @param session Session data
	 * @param res Express.js response
	 */
	public async deleteUser(session: SessionDto, res: Response): Promise<void> {
		LOG.log(this, 'delete user', session);

		const user = await this.userQueries.findEntityByEmail(
			session.payload.email
		);

		if (!user) {
			throw new MethodNotAllowedException();
		}

		const deleteDto = new DeleteDto();
		deleteDto.ids = [user.id];

		await this.userCommands.remove(deleteDto);

		res.redirect('/');
	}
}
