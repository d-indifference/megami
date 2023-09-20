import { UserRole } from '@prisma/client';
import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';

/**
 * User update DTO
 */
export class UserUpdateRoleDto {
	/**
	 * Email
	 */
	@IsEmail()
	@IsNotEmpty()
	email: string;

	/**
	 * User's role
	 */
	@IsEnum(UserRole)
	@IsNotEmpty()
	role: UserRole;
}
