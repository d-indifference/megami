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
	email: string;

	/**
	 * Password
	 */
	password: string;
}
