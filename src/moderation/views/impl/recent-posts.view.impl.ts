import { RecentPostsView } from '../recent-posts.view.interface';
import { SessionDto } from '../../../management/dto/session/session.dto';
import { RecentPostsPage } from '../../types/recent-posts-page.type';
import { Inject } from '@nestjs/common';
import { SiteSettingsService } from '../../../site-settings/services/site-settings.service';
import { ThreadQueries } from '../../../thread/queries/thread.queries.interface';
import { LOG } from '../../../toolkit';
import { DeleteDto } from '../../../toolkit/delete.dto';
import { Response } from 'express';
import { ThreadCommands } from '../../../thread/commands/thread.commands.interface';

/**
 * Recent posts pages view
 */
export class RecentPostsViewImpl implements RecentPostsView {
	constructor(
		@Inject(SiteSettingsService)
		private readonly siteSettingsService: SiteSettingsService,
		@Inject(ThreadQueries)
		private readonly threadQueries: ThreadQueries,
		@Inject(ThreadCommands)
		private readonly threadCommands: ThreadCommands
	) {}

	/**
	 * Get recent posts pages view
	 * @param session Session data
	 */
	public async getPage(session: SessionDto): Promise<RecentPostsPage> {
		LOG.log(this, 'get recent posts page', {
			email: session.payload.email
		});

		const recentPosts =
			await this.threadQueries.findCommentsPostedLastHours(24);

		return {
			title: await this.siteSettingsService.buildTitle('Recent posts'),
			siteLogo: await this.siteSettingsService.getTitle(),
			session: session.payload,
			recentPosts
		};
	}

	/**
	 * Delete posts from moderator interface
	 * @param dto Delete DTO
	 * @param res Express.js response
	 */
	public async deletePosts(dto: DeleteDto, res: Response): Promise<void> {
		LOG.log(this, 'delete posts by moderator interface', dto);

		await this.threadCommands.deleteCommentsByIds(dto);

		res.redirect('/megami/moderation/recent-posts');
	}
}
