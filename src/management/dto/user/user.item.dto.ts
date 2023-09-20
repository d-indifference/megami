import { UserRole } from '@prisma/client';

/**
 * User Item DTO
 */
export class UserItemDto {
	/**
	 * User ID
	 */
	id: string;

	/**
	 * User email
	 */
	email: string;

	/**
	 * User's role
	 */
	role: UserRole;
}
