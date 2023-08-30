import { BoardsList } from '../types/boards-list.type';

/**
 * View for board list page
 */
export interface BoardsView {
	getBoardList(): Promise<BoardsList>;
}

export const BoardsView = Symbol('BoardsView');
