import { UserRole } from '@prisma/client';

/**
 * User creation DTO
 */
export class UserCreateDto {
	/**
	 * Email
	 */
	email: string;

	/**
	 * Password without encryption
	 */
	password: string;

	/**
	 * User's role
	 */
	role: UserRole;
}
