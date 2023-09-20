import { SessionPayloadDto } from '../../management/dto/session/session-payload.dto';
import { IpLists } from './ip-lists.type';

/**
 * IP Filter page payload
 */
export type IpFilterPage = {
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
	 * IP lists
	 */
	ipLists: IpLists;
};
