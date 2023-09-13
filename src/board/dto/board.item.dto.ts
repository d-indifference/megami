/**
 * Board item Dto
 */
export class BoardItemDto {
	/**
	 * UUID
	 */
	id: string;

	/**
	 * Board slug
	 */
	slug: string;

	/**
	 * Board name
	 */
	name: string;

	/**
	 * Count of comments on board
	 */
	commentsCount: number;

	/**
	 * Count of comment with files on board
	 */
	filesCount: number;
}
