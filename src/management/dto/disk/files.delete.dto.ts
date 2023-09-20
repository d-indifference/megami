import { IsNotEmpty } from 'class-validator';

/**
 * Delete files DTO
 */
export class FilesDeleteDto {
	/**
	 * Deletion candidates
	 */
	@IsNotEmpty()
	filesForDelete: string[];
}
