import {
	Body,
	Controller,
	Get,
	Inject,
	Post,
	Render,
	Res,
	Session,
	UseGuards,
	UsePipes,
	ValidationPipe
} from '@nestjs/common';
import { SessionGuard } from '../../management/guards/session.guard';
import { SessionDto } from '../../management/dto/session/session.dto';
import { RecentUploadsPage } from '../types/recent-uploads-page.type';
import { RecentUploadsView } from '../views/recent-uploads.view.interface';
import { DeleteDto } from '../../toolkit/delete.dto';
import { Response } from 'express';

/**
 * Recent uploads page controller
 */
@Controller('megami/moderation')
export class ModerationRecentUploadsController {
	constructor(
		@Inject(RecentUploadsView)
		private readonly recentUploadsView: RecentUploadsView
	) {}

	/**
	 * Recent uploads page controller
	 */
	@Get('recent-uploads')
	@UseGuards(SessionGuard)
	@Render('admin-recent-uploads')
	public async index(
		@Session() session: SessionDto
	): Promise<RecentUploadsPage> {
		return await this.recentUploadsView.getPage(session);
	}

	/**
	 * Delete uploads by moderator's interface
	 */
	@Post('delete-uploads')
	@UseGuards(SessionGuard)
	@UsePipes(new ValidationPipe({ transform: true }))
	public async deleteUploads(
		@Body() dto: DeleteDto,
		@Res() res: Response
	): Promise<void> {
		await this.recentUploadsView.deleteUploads(dto, res);
	}
}
