/**
 * Full Thread open post DTO
 */
export class ThreadOpenPostDto {
	/**
	 * Comment ID
	 */
	id: string;

	/**
	 * Poster IP
	 */
	posterIp: string;

	/**
	 * Created at
	 */
	createdAt: Date;

	/**
	 * Board slug
	 */
	boardSlug: string;

	/**
	 * Number on Board
	 */
	numberOnBoard: bigint;

	/**
	 * Email
	 */
	email?: string;

	/**
	 * Name
	 */
	name?: string;

	/**
	 * Subject
	 */
	subject?: string;

	/**
	 * Comment
	 */
	comment: string;

	/**
	 * File
	 */
	file?: string;
}
