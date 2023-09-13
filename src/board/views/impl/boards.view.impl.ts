import { BoardsView } from '../boards.view.interface';
import { BoardsList } from '../../types/boards-list.type';
import { Inject } from '@nestjs/common';
import { BoardQueries } from '../../queries/board.queries.interface';
import { SiteSettingsService } from '../../../site-settings/services/site-settings.service';
import { LOG } from '../../../toolkit';

/**
 * View for board list page
 */
export class BoardsViewImpl implements BoardsView {
	constructor(
		@Inject(BoardQueries)
		private readonly queries: BoardQueries,
		@Inject(SiteSettingsService)
		private readonly siteSettingsServices: SiteSettingsService
	) {}

	/**
	 * Get all boards
	 */
	public async getBoardList(): Promise<BoardsList> {
		LOG.log(this, 'get board list view');

		return {
			title: await this.siteSettingsServices.buildTitle('Boards'),
			siteLogo: await this.siteSettingsServices.getTitle(),
			boards: await this.queries.getAll()
		};
	}
}
