/**
 * Post deletion options
 */
export enum DeleteOption {
	/**
	 * Nothing, only ban poster
	 */
	NOTHING = 'NOTHING',

	/**
	 * Delete this post
	 */
	THIS_POST = 'THIS_POST',

	/**
	 * Delete this file
	 */
	THIS_FILE = 'THIS_FILE',

	/**
	 * Delete all posts from banned IP
	 */
	ALL_POSTS = 'ALL_POSTS',

	/**
	 * Delete all files from banned IP
	 */
	ALL_FILES = 'ALL_FILES'
}

/**
 * Temporary ban form data DTO
 */
export class BanFormDto {
	/**
	 * IP which should be banned
	 */
	ip: string;

	/**
	 * Post id which became the reason of ban
	 */
	postId: string;

	/**
	 * Date of end of ban
	 */
	banTill: string;

	/**
	 * Ban reason
	 */
	reason: string;

	/**
	 * Post deletion option
	 */
	deleteOption: DeleteOption;
}
