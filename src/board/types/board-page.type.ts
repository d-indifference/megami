import { BoardDto } from '../dto/board.dto';
import { ThreadItemDto } from '../../thread/dto/thread.item.dto';
import { Page } from '../../toolkit/pagination/page.type';

/**
 * Board page payload
 */
export type BoardPage = {
	/**
	 * Page title
	 */
	title: string;

	/**
	 * Current Board Info
	 */
	board: BoardDto;

	/**
	 * Pageable list with threads
	 */
	threads: Page<ThreadItemDto>;
};
