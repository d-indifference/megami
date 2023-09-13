import { SessionPayloadDto } from '../dto/session/session-payload.dto';
import { BoardItemDto } from '../../board/dto/board.item.dto';

export type BoardListPage = {
	/**
	 * Page title
	 */
	title: string;

	/**
	 * Site logo
	 */
	siteLogo: string;

	/**
	 * Session data
	 */
	session: SessionPayloadDto;

	/**
	 * Board list
	 */
	boards: BoardItemDto[];
};
