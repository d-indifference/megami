/**
 * Thread item DTO
 */
export class ThreadItemDto {
	/**
	 * Board slug
	 */
	boardSlug: string;

	/**
	 * Thread number on board
	 */
	numberOnBoard: bigint;

	/**
	 * Thread subject
	 */
	subject?: string;

	/**
	 * Thread comment
	 */
	comment: string;

	/**
	 * Thread file
	 */
	file?: string;

	/**
	 * Total thread replies
	 */
	repliesTotal: number;

	/**
	 *  Thread replies with files
	 */
	repliesWithFiles: number;

	constructor(
		boardSlug: string,
		numberOnBoard: bigint,
		comment: string,
		repliesTotal: number,
		repliesWithFiles: number
	) {
		this.boardSlug = boardSlug;
		this.numberOnBoard = numberOnBoard;
		this.comment = comment;
		this.repliesTotal = repliesTotal;
		this.repliesWithFiles = repliesWithFiles;
	}
}
