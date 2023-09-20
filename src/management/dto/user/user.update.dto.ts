import { UserRole } from '@prisma/client';

/**
 * User update DTO
 */
export class UserUpdateDto {
	constructor(email?: string, role?: UserRole, password?: string) {
		this.email = email;
		this.role = role;
		this.password = password;
	}

	/**
	 * Email
	 */
	email: string;

	/**
	 * User's role
	 */
	role: UserRole;

	/**
	 * Password without encryption
	 */
	password: string;
}
