/**
 * Comment moderation DTO
 */
export class ThreadModerationDto {
	/**
	 * Comment UUID
	 */
	id: string;

	/**
	 * Comment attached file
	 */
	file: string;

	/**
	 * Poster's IP
	 */
	posterIp: string;

	/**
	 * Subject
	 */
	subject: string;

	/**
	 * Comment
	 */
	comment: string;

	/**
	 * Created at date
	 */
	createdAt: Date | string;

	/**
	 * Link to post on thread page
	 */
	postLink: string;

	/**
	 * Is post opening of thread
	 */
	isThread: boolean;
}
