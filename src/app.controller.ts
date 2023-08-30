import { Controller, Get, Inject, Param, Render } from '@nestjs/common';
import { BoardPage } from './board/types/board-page.type';
import { ThreadsView } from './board/views/threads.view.interface';
import { IndexPage } from './types/index-page.type';
import { BoardsView } from './board/views/boards.view.interface';
import { BoardsList } from './board/types/boards-list.type';

/**
 * Main Application Controller
 */
@Controller()
export class AppController {
	constructor(
		@Inject(ThreadsView)
		private readonly threadsView: ThreadsView,
		@Inject(BoardsView)
		private readonly boardsView: BoardsView
	) {}

	/**
	 * Index page
	 */
	@Get()
	@Render('index')
	public index(): IndexPage {
		return {
			title: 'Megami Image Board'
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
