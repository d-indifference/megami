import { SessionPayloadDto } from '../../management/dto/session/session-payload.dto';

/**
 * Ban form page payload
 */
export type BanFormPage = {
	/**
	 * Page Title
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
	 * Poster's IP
	 */
	ip: string;

	/**
	 * Post ID
	 */
	postId: string;

	/**
	 * Date of end of ban
	 */
	banTill: Date | string;
};
