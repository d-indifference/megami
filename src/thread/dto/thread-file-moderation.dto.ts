/**
 * Thread file moderation DTO
 */
export class ThreadFileModerationDto {
	/**
	 * Comment UUID
	 */
	id: string;

	/**
	 * Created at date
	 */
	createdAt: Date | string;

	/**
	 * Board slug
	 */
	boardSlug: string;

	/**
	 * Comment attached file
	 */
	file: string;

	/**
	 * Poster's IP
	 */
	posterIp: string;

	/**
	 * Link to post on thread page
	 */
	postLink: string;

	/**
	 * Is post opening of thread
	 */
	isThread: boolean;
}
