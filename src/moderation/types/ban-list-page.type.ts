import { SessionPayloadDto } from '../../management/dto/session/session-payload.dto';
import { BanItemDto } from '../dto/ban.item.dto';

/**
 * Ban list page
 */
export type BanListPage = {
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
	 * Ban items
	 */
	bans: BanItemDto[];
};
