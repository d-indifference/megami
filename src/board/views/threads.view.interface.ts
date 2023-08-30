import { BoardPage } from '../types/board-page.type';

/**
 * View for thread list page
 */
export interface ThreadsView {
	getBoardPage(slug: string, page: number): Promise<BoardPage>;
}

export const ThreadsView = Symbol('ThreadsView');
