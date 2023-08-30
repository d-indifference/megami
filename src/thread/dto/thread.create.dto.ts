import { FileSystemStoredFile } from 'nestjs-form-data';

/**
 * Thread creation DTO
 */
export class ThreadCreateDto {
	/**
	 * Email
	 */
	email?: string;

	/**
	 * Name
	 */
	name?: string;

	/**
	 * Subject
	 */
	subject?: string;

	/**
	 * Comment
	 */
	comment: string;

	/**
	 * File
	 */
	file?: FileSystemStoredFile;

	/**
	 * Password
	 */
	password: string;

	/**
	 * Stay in thread after its creation
	 */
	stayIn: boolean;
}
