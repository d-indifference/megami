import { AdministrationPage } from '../types/administration-page.type';
import { SessionDto } from '../dto/session/session.dto';
import { AdministrationForm } from '../types/administration-form.type';
import { UserCreateDto } from '../dto/user/user.create.dto';
import { Response } from 'express';
import { UserUpdateRoleDto } from '../dto/user/user-update-role.dto';

/**
 * Administration staff view
 */
export interface AdministrationPageView {
	getPage(session: SessionDto): Promise<AdministrationPage>;

	getCreateForm(session: SessionDto): Promise<AdministrationForm>;

	getEditForm(session: SessionDto, id: string): Promise<AdministrationForm>;

	createNewStaffMember(dto: UserCreateDto, res: Response): Promise<void>;

	editStaffMember(
		id: string,
		dto: UserUpdateRoleDto,
		res: Response
	): Promise<void>;

	deleteStaffMember(id: string, res: Response): Promise<void>;
}

export const AdministrationPageView = Symbol('AdministrationPageView');
