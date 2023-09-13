import { ThreadsView } from '../threads.view.interface';
import { BoardPage } from '../../types/board-page.type';
import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';
import { BoardQueries } from '../../queries/board.queries.interface';
import { ThreadQueries } from '../../../thread/queries/thread.queries.interface';
import { makePaginatorTemplate } from '../../../toolkit/pagination/make-paginator-template.function';
import { SiteSettingsService } from '../../../site-settings/services/site-settings.service';
import { LOG } from '../../../toolkit';

/**
 * View for thread list page
 */
export class ThreadsViewImpl implements ThreadsView {
	constructor(
		@Inject(BoardQueries)
		private readonly boardQueries: BoardQueries,
		@Inject(ThreadQueries)
		private readonly threadQueries: ThreadQueries,
		@Inject(SiteSettingsService)
		private readonly siteSettingsServices: SiteSettingsService
	) {}

	/**
	 * Get thread page
	 * @param slug Board slug
	 * @param page Page number for thread list
	 */
	public async getBoardPage(slug: string, page = 0): Promise<BoardPage> {
		LOG.log(this, 'get board page', { slug, page });

		if (page < 0) {
			throw new BadRequestException('Page should be a positive number!');
		}

		const board = await this.boardQueries.getBySlug(slug);

		const threads = await this.threadQueries.findAllByBoardSlug(slug, page);

		if (page > 0 && threads.elements.length === 0) {
			throw new NotFoundException();
		}

		return {
			title: await this.siteSettingsServices.buildTitle(board.name),
			siteLogo: await this.siteSettingsServices.getTitle(),
			board,
			threads,
			paginatorTemplate: makePaginatorTemplate(threads)
		} as BoardPage;
	}
}
