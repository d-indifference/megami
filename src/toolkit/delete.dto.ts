import { IsNotEmpty } from 'class-validator';

/**
 * Deletion DTO
 */
export class DeleteDto {
	/**
	 * UUIDs for deletion
	 */
	@IsNotEmpty()
	ids: string[];
}
