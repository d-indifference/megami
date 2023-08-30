import { BoardsView } from '../boards.view.interface';
import { BoardsList } from '../../types/boards-list.type';
import { Inject } from '@nestjs/common';
import { BoardQueries } from '../../queries/board.queries.interface';

/**
 * View for board list page
 */
export class BoardsViewImpl implements BoardsView {
	constructor(
		@Inject(BoardQueries)
		private readonly queries: BoardQueries
	) {}

	/**
	 * Get all boards
	 */
	public async getBoardList(): Promise<BoardsList> {
		return {
			title: 'Boards — Megami Image Board',
			boards: await this.queries.getAll()
		};
	}
}
