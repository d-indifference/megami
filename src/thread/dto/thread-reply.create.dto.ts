import {
	FileSystemStoredFile,
	HasMimeType,
	IsFile,
	MaxFileSize
} from 'nestjs-form-data';
import {
	IsNotEmpty,
	IsOptional,
	IsString,
	MaxLength,
	MinLength
} from 'class-validator';

/**
 * Thread reply creation DTO
 */
export class ThreadReplyCreateDto {
	/**
	 * Poster's IP
	 */
	@IsString()
	@IsOptional()
	posterIp: string;

	/**
	 * Email
	 */
	@IsOptional()
	@IsString()
	email?: string;

	/**
	 * Name
	 */
	@IsOptional()
	@IsString()
	@MaxLength(256)
	name?: string;

	/**
	 * Subject
	 */
	@IsOptional()
	@IsString()
	@MaxLength(256)
	subject?: string;

	/**
	 * Comment
	 */
	@IsString()
	@IsNotEmpty()
	@MinLength(3)
	@MaxLength(15000)
	comment: string;

	/**
	 * File
	 */
	@IsOptional()
	@IsFile()
	@MaxFileSize(5e6, { message: 'Your file must be less than 5 mB in size' })
	@HasMimeType([
		'image/apng',
		'image/avif',
		'image/gif',
		'image/jpeg',
		'image/png',
		'image/svg+xml',
		'image/webp'
	])
	file?: FileSystemStoredFile;

	/**
	 * Password
	 */
	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	@MaxLength(8)
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
