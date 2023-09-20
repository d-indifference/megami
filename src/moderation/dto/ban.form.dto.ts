import {
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsString,
	IsUUID,
	Matches,
	MaxLength
} from 'class-validator';

/**
 * Post deletion options
 */
export enum DeleteOption {
	/**
	 * Nothing, only ban poster
	 */
	NOTHING = 'NOTHING',

	/**
	 * Delete this post
	 */
	THIS_POST = 'THIS_POST',

	/**
	 * Delete this file
	 */
	THIS_FILE = 'THIS_FILE',

	/**
	 * Delete all posts from banned IP
	 */
	ALL_POSTS = 'ALL_POSTS',

	/**
	 * Delete all files from banned IP
	 */
	ALL_FILES = 'ALL_FILES'
}

/**
 * Temporary ban form data DTO
 */
export class BanFormDto {
	/**
	 * IP which should be banned
	 */
	@IsString()
	@IsNotEmpty()
	@MaxLength(64)
	ip: string;

	/**
	 * Post id which became the reason of ban
	 */
	@IsString()
	@IsNotEmpty()
	@IsUUID()
	postId: string;

	/**
	 * Date of end of ban
	 */
	@IsString()
	@IsNotEmpty()
	@Matches(/^\d{4}-\d{2}-\d{2}/)
	banTill: string;

	/**
	 * Ban reason
	 */
	@IsOptional()
	@IsString()
	@MaxLength(1024)
	reason: string;

	/**
	 * Post deletion option
	 */
	@IsEnum(DeleteOption)
	@IsNotEmpty()
	deleteOption: DeleteOption;
}
