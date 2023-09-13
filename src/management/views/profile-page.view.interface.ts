import { SessionDto } from '../dto/session/session.dto';
import { ProfilePage } from '../types/profile-page.type';
import { UserChangePasswordDto } from '../dto/user/user.change-password.dto';
import { Response } from 'express';

/**
 * Profile page view
 */
export interface ProfilePageView {
	getPage(session: SessionDto): Promise<ProfilePage>;

	updateUser(
		session: SessionDto,
		dto: UserChangePasswordDto,
		res: Response
	): Promise<void>;

	deleteUser(session: SessionDto, res: Response): Promise<void>;
}

export const ProfilePageView = Symbol('ProfilePageView');
