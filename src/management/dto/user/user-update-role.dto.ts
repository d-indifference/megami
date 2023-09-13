import { UserRole } from '@prisma/client';

/**
 * User update DTO
 */
export class UserUpdateRoleDto {
	/**
	 * Email
	 */
	email: string;

	/**
	 * User's role
	 */
	role: UserRole;
}
