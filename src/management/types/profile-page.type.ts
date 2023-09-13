import { SessionPayloadDto } from '../dto/session/session-payload.dto';

/**
 * Profile page payload
 */
export type ProfilePage = {
	/**
	 * Page title
	 */
	title: string;

	/**
	 * Session data
	 */
	session: SessionPayloadDto;

	/**
	 * Site logo
	 */
	siteLogo: string;
};
