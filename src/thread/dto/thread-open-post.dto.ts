/**
 * Full Thread open post DTO
 */
export class ThreadOpenPostDto {
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
