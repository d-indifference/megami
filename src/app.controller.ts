import { Controller, Get, Inject, Param, Render } from '@nestjs/common';
import { BoardPage } from './board/types/board-page.type';
import { ThreadsView } from './board/views/threads.view.interface';
import { IndexPage } from './types/index-page.type';
import { BoardsView } from './board/views/boards.view.interface';
import { BoardsList } from './board/types/boards-list.type';
import { SiteSettingsService } from './site-settings/services/site-settings.service';

/**
 * Main Application Controller
 */
@Controller()
export class AppController {
	constructor(
		@Inject(ThreadsView)
		private readonly threadsView: ThreadsView,
		@Inject(BoardsView)
		private readonly boardsView: BoardsView,
		@Inject(SiteSettingsService)
		private readonly siteSettingsService: SiteSettingsService
	) {}

	/**
	 * Index page
	 */
	@Get()
	@Render('index')
	public async index(): Promise<IndexPage> {
		return {
			title: await this.siteSettingsService.getTitle(),
			siteLogo: await this.siteSettingsService.getTitle(),
			slogan: (await this.siteSettingsService.getSiteSettings()).slogan,
			description: (await this.siteSettingsService.getSiteSettings())
				.description,
			mainLogo: (await this.siteSettingsService.getSiteSettings())
				.mainPageLogoAddress
		};
	}

	/**
	 * Board List Page
	 */
	@Get('boards')
	@Render('boards')
	public async boards(): Promise<BoardsList> {
		return await this.boardsView.getBoardList();
	}

	/**
	 * Board page
	 * @param board Board slug
	 */
	@Get(':board')
	@Render('board')
	public async board(@Param('board') board: string): Promise<BoardPage> {
		return await this.threadsView.getBoardPage(board, 0);
	}
}
