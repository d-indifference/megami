import { FileSystemStoredFile } from 'nestjs-form-data';

/**
 * Thread reply creation DTO
 */
export class ThreadReplyCreateDto {
	/**
	 * Poster's IP
	 */
	posterIp: string;

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

	/**
	 * Don't hit the thread
	 */
	dontHit: boolean;
}
