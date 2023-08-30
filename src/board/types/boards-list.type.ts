import { BoardDto } from '../dto/board.dto';

/**
 * Board list Page payload
 */
export type BoardsList = {
	/**
	 * Page title
	 */
	title: string;

	/**
	 * Boards
	 */
	boards: BoardDto[];
};
