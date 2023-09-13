import { AdministrationPageView } from '../administration-page.view.interface';
import { AdministrationPage } from '../../types/administration-page.type';
import { Inject } from '@nestjs/common';
import { SiteSettingsService } from '../../../site-settings/services/site-settings.service';
import { SessionDto } from '../../dto/session/session.dto';
import { LOG } from '../../../toolkit';
import { UserQueries } from '../../queries/user.queries.interface';
import { AdministrationForm } from '../../types/administration-form.type';
import { UserCreateDto } from '../../dto/user/user.create.dto';
import e from 'express';
import { UserUpdateRoleDto } from '../../dto/user/user-update-role.dto';
import { UserCommands } from '../../commands/user.commands.interface';
import { DeleteDto } from '../../../toolkit/delete.dto';

/**
 * Administration staff view
 */
export class AdministrationPageViewImpl implements AdministrationPageView {
	constructor(
		@Inject(SiteSettingsService)
		private readonly siteSettingsService: SiteSettingsService,
		@Inject(UserQueries)
		private readonly userQueries: UserQueries,
		@Inject(UserCommands)
		private readonly userCommands: UserCommands
	) {}

	/**
	 * Get all users
	 * @param session Session data
	 */
	public async getPage(session: SessionDto): Promise<AdministrationPage> {
		LOG.log(this, 'get all users', session.payload);

		const users = await this.userQueries.findAll();

		return {
			title: await this.siteSettingsService.buildTitle(
				'Administration staff'
			),
			siteLogo: await this.siteSettingsService.getTitle(),
			session: session.payload,
			users
		};
	}

	/**
	 * Get user creation form
	 * @param session Session data
	 */
	public async getCreateForm(
		session: SessionDto
	): Promise<AdministrationForm> {
		LOG.log(this, 'get user creation form', session.payload);

		return {
			title: await this.siteSettingsService.buildTitle(
				'New administration staff member'
			),
			siteLogo: await this.siteSettingsService.getTitle(),
			session: session.payload
		};
	}

	/**
	 * Get user edit form
	 * @param session Session data
	 * @param id User's UUID
	 */
	public async getEditForm(
		session: SessionDto,
		id: string
	): Promise<AdministrationForm> {
		LOG.log(this, 'get user edit form', {
			id,
			email: session.payload.email
		});

		const user = await this.userQueries.findById(id);

		return {
			title: await this.siteSettingsService.buildTitle(
				`Edit user ${user.email}`
			),
			siteLogo: await this.siteSettingsService.getTitle(),
			session: session.payload,
			staffMember: user
		};
	}

	/**
	 * Create new staff member
	 * @param dto User creation DTO
	 * @param res Express.js response
	 */
	public async createNewStaffMember(
		dto: UserCreateDto,
		res: e.Response
	): Promise<void> {
		LOG.log(this, 'create new user', dto);

		await this.userCommands.create(dto);

		res.redirect('/megami/staff');
	}

	/**
	 * Update staff member
	 * @param id User's UUID
	 * @param dto User creation DTO
	 * @param res Express.js response
	 */
	public async editStaffMember(
		id: string,
		dto: UserUpdateRoleDto,
		res: e.Response
	): Promise<void> {
		LOG.log(this, `update user, id=${id}`, dto);

		const foundUser = await this.userQueries.findById(id);

		LOG.log(this, `user was found, id=${foundUser.id}`, dto);

		await this.userCommands.updateRole(dto, id);

		res.redirect('/megami/staff');
	}

	/**
	 * Delete staff member
	 * @param id Staff member which should be deleted
	 * @param res Express.js response
	 */
	public async deleteStaffMember(id: string, res: e.Response): Promise<void> {
		LOG.log(this, `delete user, id=${id}`);

		const foundUser = await this.userQueries.findById(id);

		LOG.log(this, `user was found, id=${foundUser.id}`);

		const deleteDto = new DeleteDto();
		deleteDto.ids = [id];

		await this.userCommands.remove(deleteDto);

		res.redirect('/megami/staff');
	}
}
