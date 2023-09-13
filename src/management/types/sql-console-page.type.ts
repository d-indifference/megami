import { SessionPayloadDto } from '../dto/session/session-payload.dto';

/**
 * SQL console page payload
 */
export type SqlConsolePage = {
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
	 * SQL query result
	 */
	queryResult: unknown[];

	/**
	 * Possible SQL query exception
	 */
	exception?: string;
};
