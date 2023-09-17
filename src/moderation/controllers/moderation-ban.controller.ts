import {
	Body,
	Controller,
	Get,
	Inject,
	Param,
	Post,
	Query,
	Render,
	Res,
	Session,
	UseGuards
} from '@nestjs/common';
import { SessionGuard } from '../../management/guards/session.guard';
import { SessionDto } from '../../management/dto/session/session.dto';
import { BanView } from '../views/ban.view.interface';
import { BanFormPage } from '../types/ban-form-page.type';
import { BanFormDto } from '../dto/ban.form.dto';
import { Response } from 'express';
import { BanListPage } from '../types/ban-list-page.type';

/**
 * Moderation ban controller
 */
@Controller('megami/moderation')
export class ModerationBanController {
	constructor(
		@Inject(BanView)
		private readonly banView: BanView
	) {}

	/**
	 * Get ban creation form
	 */
	@Get('ban')
	@UseGuards(SessionGuard)
	@Render('admin-ban')
	public async getBanForm(
		@Query('ip') ip: string,
		@Query('postId') postId: string,
		@Session() session: SessionDto
	): Promise<BanFormPage> {
		return await this.banView.getPage(ip, postId, session);
	}

	/**
	 * Get ban list page
	 */
	@Get('bans')
	@UseGuards(SessionGuard)
	@Render('admin-ban-list')
	public async getBansList(
		@Session() session: SessionDto
	): Promise<BanListPage> {
		return await this.banView.getListPage(session);
	}

	/**
	 * Create new ban
	 */
	@Post('ban')
	@UseGuards(SessionGuard)
	public async createBan(
		@Body() dto: BanFormDto,
		@Session() session: SessionDto,
		@Res() res: Response
	): Promise<void> {
		await this.banView.createBan(dto, session, res);
	}

	/**
	 * Remove ban
	 */
	@Post('bans/delete/:id')
	@UseGuards(SessionGuard)
	public async removeBan(
		@Param('id') id: string,
		@Res() res: Response
	): Promise<void> {
		await this.banView.removeBan(id, res);
	}
}
