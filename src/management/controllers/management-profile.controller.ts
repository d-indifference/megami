import {
	Body,
	Controller,
	Get,
	Inject,
	Post,
	Render,
	Res,
	Session,
	UseGuards
} from '@nestjs/common';
import { SessionGuard } from '../guards/session.guard';
import { SessionDto } from '../dto/session/session.dto';
import { ProfilePageView } from '../views/profile-page.view.interface';
import { ProfilePage } from '../types/profile-page.type';
import { UserChangePasswordDto } from '../dto/user/user.change-password.dto';
import { Response } from 'express';

/**
 * Admin Profile controller
 */
@Controller('megami')
export class ManagementProfileController {
	constructor(
		@Inject(ProfilePageView)
		private readonly profilePageView: ProfilePageView
	) {}

	/**
	 * Get profile page
	 */
	@Get('profile')
	@UseGuards(SessionGuard)
	@Render('admin-profile')
	public async index(@Session() session: SessionDto): Promise<ProfilePage> {
		return await this.profilePageView.getPage(session);
	}

	/**
	 * Update a profile
	 */
	@Post('profile/update')
	@UseGuards(SessionGuard)
	public async updateUser(
		@Session() session: SessionDto,
		@Body() dto: UserChangePasswordDto,
		@Res() res: Response
	): Promise<void> {
		await this.profilePageView.updateUser(session, dto, res);
	}

	/**
	 * Delete profile
	 */
	@Post('profile/delete')
	@UseGuards(SessionGuard)
	public async deleteUser(
		@Session() session: SessionDto,
		@Res() res: Response
	): Promise<void> {
		await this.profilePageView.deleteUser(session, res);
	}
}
