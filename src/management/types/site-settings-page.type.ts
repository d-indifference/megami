import { SessionPayloadDto } from '../dto/session/session-payload.dto';
import { SiteSettings } from '../../site-settings/types/site-settings.type';

/**
 * Site settings page
 */
export type SiteSettingsPage = {
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
	 * Site settings
	 */
	siteSettings: SiteSettings;
};
