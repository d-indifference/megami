import { BoardDto } from '../../board/dto/board.dto';

/**
 * Payload for thread creation page
 */
export type NewThreadPage = {
	/**
	 * Page title
	 */
	title: string;

	/**
	 * Site logo
	 */
	siteLogo: string;

	/**
	 * Board DTO
	 */
	board: BoardDto;
};
