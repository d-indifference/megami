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
import { RecentPostsView } from '../views/recent-posts.view.interface';
import { SessionGuard } from '../../management/guards/session.guard';
import { SessionDto } from '../../management/dto/session/session.dto';
import { RecentPostsPage } from '../types/recent-posts-page.type';
import { DeleteDto } from '../../toolkit/delete.dto';
import { Response } from 'express';

/**
 * Recent posts page controller
 */
@Controller('megami/moderation')
export class ModerationRecentPostsController {
	constructor(
		@Inject(RecentPostsView)
		private readonly recentPostsView: RecentPostsView
	) {}

	/**
	 * Recent posts page controller
	 */
	@Get('recent-posts')
	@UseGuards(SessionGuard)
	@Render('admin-recent-posts')
	public async index(
		@Session() session: SessionDto
	): Promise<RecentPostsPage> {
		return await this.recentPostsView.getPage(session);
	}

	/**
	 * Delete posts by moderator's interface
	 */
	@Post('delete-posts')
	@UseGuards(SessionGuard)
	public async deletePostsByModerator(
		@Body() dto: DeleteDto,
		@Res() res: Response
	): Promise<void> {
		await this.recentPostsView.deletePosts(dto, res);
	}
}
