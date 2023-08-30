/**
 * Thread deletion DTO
 */
export class ThreadDeleteDto {
	/**
	 * Delete only files
	 */
	fileOnly?: boolean;

	/**
	 * Comment password
	 */
	password: string;

	/**
	 * Values for deletion
	 */
	delete: string[] | string;
}
