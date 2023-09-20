import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

/**
 * DTO for user's password changing
 */
export class UserChangePasswordDto {
	/**
	 * Old password
	 */
	@IsString()
	@IsNotEmpty()
	oldPassword: string;

	/**
	 * New password
	 */
	@IsString()
	@IsNotEmpty()
	@MinLength(4)
	@MaxLength(128)
	newPassword: string;

	/**
	 * New password confirmation
	 */
	@IsString()
	@IsNotEmpty()
	@MinLength(4)
	@MaxLength(128)
	confirmPassword: string;
}
