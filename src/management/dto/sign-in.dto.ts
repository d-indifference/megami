import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

/**
 * DTO for sign in form
 */
export class SignInDto {
	constructor(email?: string, password?: string) {
		this.email = email;
		this.password = password;
	}

	/**
	 * Email
	 */
	@IsEmail()
	@IsNotEmpty()
	email: string;

	/**
	 * Password
	 */
	@IsString()
	@IsNotEmpty()
	password: string;
}
