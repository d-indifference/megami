/**
 * Ban create DTO
 */
export class BanCreateDto {
	/**
	 * UUID of banner
	 */
	adminId: string;

	/**
	 * Poster's IP
	 */
	ip: string;

	/**
	 * Ban reason
	 */
	reason: string;

	/**
	 * Ban till
	 */
	banTill: Date;
}
