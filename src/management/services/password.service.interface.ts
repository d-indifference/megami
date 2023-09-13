/**
 * Password crypto service
 */
export interface PasswordService {
	encrypt(password: string): string;

	decrypt(password: string): string;
}

export const PasswordService = Symbol('PasswordService');
