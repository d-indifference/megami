/**
 * Site settings
 */
export type SiteSettings = {
	/**
	 * Site title
	 */
	title: string;

	/**
	 * Site slogan
	 */
	slogan: string;

	/**
	 * Site description
	 */
	description: string;

	/**
	 * Main page logo link
	 */
	mainPageLogoAddress: string;

	/**
	 * Thread creation delay in seconds
	 */
	threadCreationDelay: number;

	/**
	 * Thread reply delay in seconds
	 */
	threadReplyDelay: number;

	/**
	 * Bump limit (min. 3)
	 */
	bumpLimit: number;
};
