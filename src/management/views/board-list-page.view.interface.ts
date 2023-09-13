import { BoardListPage } from '../types/board-list-page.type';
import { SessionDto } from '../dto/session/session.dto';
import { BoardFormPage } from '../types/board-form-page.type';
import { BoardDto } from '../../board/dto/board.dto';
import { Response } from 'express';

/**
 * Board list view
 */
export interface BoardListPageView {
	getPage(session: SessionDto): Promise<BoardListPage>;

	getNewBoardForm(session: SessionDto): Promise<BoardFormPage>;

	getBoardEditForm(id: string, session: SessionDto): Promise<BoardFormPage>;

	createNewBoard(dto: BoardDto, res: Response): Promise<void>;

	updateBoard(id: string, dto: BoardDto, res: Response): Promise<void>;

	deleteBoard(id: string, res: Response): Promise<void>;
}

export const BoardListPageView = Symbol('BoardListPageView');
