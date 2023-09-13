/**
 * DTO for user's password changing
 */
export class UserChangePasswordDto {
	/**
	 * Old password
	 */
	oldPassword: string;

	/**
	 * New password
	 */
	newPassword: string;

	/**
	 * New password confirmation
	 */
	confirmPassword: string;
}
