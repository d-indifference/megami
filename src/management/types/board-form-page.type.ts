import { SessionPayloadDto } from '../dto/session/session-payload.dto';
import { BoardItemDto } from '../../board/dto/board.item.dto';

/**
 * Board form page
 */
export type BoardFormPage = {
	/**
	 * Site title
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
	 * Board data
	 */
	board?: BoardItemDto;
};
