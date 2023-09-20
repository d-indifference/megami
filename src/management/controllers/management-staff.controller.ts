import {
	Body,
	Controller,
	Get,
	Inject,
	Param,
	Post,
	Render,
	Res,
	Session,
	UseGuards,
	UsePipes,
	ValidationPipe
} from '@nestjs/common';
import { AdministrationPageView } from '../views/administration-page.view.interface';
import { SessionGuard } from '../guards/session.guard';
import { SessionDto } from '../dto/session/session.dto';
import { AdministrationPage } from '../types/administration-page.type';
import { AdministrationForm } from '../types/administration-form.type';
import { UserCreateDto } from '../dto/user/user.create.dto';
import { Response } from 'express';
import { UserUpdateRoleDto } from '../dto/user/user-update-role.dto';

/**
 * Administration staff controller
 */
@Controller('megami')
export class ManagementStaffController {
	constructor(
		@Inject(AdministrationPageView)
		private readonly administrationPageView: AdministrationPageView
	) {}

	/**
	 * Get administration staff page
	 */
	@Get('staff')
	@UseGuards(SessionGuard)
	@Render('admin-staff-list')
	public async index(
		@Session() session: SessionDto
	): Promise<AdministrationPage> {
		return await this.administrationPageView.getPage(session);
	}

	/**
	 * Get new staff member form
	 */
	@Get('staff/edit')
	@UseGuards(SessionGuard)
	@Render('admin-staff-edit')
	public async getNewStaffMemberPage(
		@Session() session: SessionDto
	): Promise<AdministrationForm> {
		return await this.administrationPageView.getCreateForm(session);
	}

	/**
	 * Get staff member edit form
	 */
	@Get('staff/edit/:id')
	@UseGuards(SessionGuard)
	@Render('admin-staff-edit')
	public async getStaffMemberEditPage(
		@Param('id') id: string,
		@Session() session: SessionDto
	): Promise<AdministrationForm> {
		return await this.administrationPageView.getEditForm(session, id);
	}

	/**
	 * Create new staff member
	 */
	@Post('staff/edit')
	@UseGuards(SessionGuard)
	@UsePipes(new ValidationPipe({ transform: true }))
	public async createStaffMember(
		@Body() dto: UserCreateDto,
		@Res() res: Response
	): Promise<void> {
		await this.administrationPageView.createNewStaffMember(dto, res);
	}

	/**
	 * Edit staff member
	 */
	@Post('staff/edit/:id')
	@UseGuards(SessionGuard)
	@UsePipes(new ValidationPipe({ transform: true }))
	public async editStaffMember(
		@Param('id') id: string,
		@Body() dto: UserUpdateRoleDto,
		@Res() res: Response
	): Promise<void> {
		await this.administrationPageView.editStaffMember(id, dto, res);
	}

	/**
	 * Delete staff member
	 */
	@Post('staff/delete/:id')
	@UseGuards(SessionGuard)
	public async deleteStaffMember(
		@Param('id') id: string,
		@Res() res: Response
	): Promise<void> {
		await this.administrationPageView.deleteStaffMember(id, res);
	}
}
