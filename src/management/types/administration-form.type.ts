import { SessionPayloadDto } from '../dto/session/session-payload.dto';
import { UserItemDto } from '../dto/user/user.item.dto';

/**
 * Administration staff member edit form data
 */
export type AdministrationForm = {
	/**
	 * Page title
	 */
	title: string;

	/**
	 * Site title
	 */
	siteLogo: string;

	/**
	 * Session data
	 */
	session: SessionPayloadDto;

	/**
	 * Staff member data
	 */
	staffMember?: UserItemDto;
};
