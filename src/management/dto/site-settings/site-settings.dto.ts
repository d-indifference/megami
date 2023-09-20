import {
	IsNotEmpty,
	IsNumber,
	IsString,
	Max,
	MaxLength,
	Min,
	MinLength
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Site settings DTO
 */
export class SiteSettingsDto {
	/**
	 * Site title
	 */
	@IsString()
	@IsNotEmpty()
	@MinLength(1)
	@MaxLength(32)
	title: string;

	/**
	 * Site slogan
	 */
	@IsString()
	@IsNotEmpty()
	@MinLength(1)
	@MaxLength(128)
	slogan: string;

	/**
	 * Site description
	 */
	@IsString()
	@IsNotEmpty()
	@MinLength(1)
	@MaxLength(2048)
	description: string;

	/**
	 * Main page logo link
	 */
	@IsString()
	@IsNotEmpty()
	@MinLength(1)
	@MaxLength(1024)
	mainPageLogoAddress: string;

	/**
	 * Board bottom links
	 */
	@IsString()
	@IsNotEmpty()
	@MinLength(1)
	@MaxLength(2048)
	boardBottomLinks: string;

	/**
	 * Thread creation delay in seconds
	 */
	@Type(() => Number)
	@IsNumber()
	@IsNotEmpty()
	@Min(0)
	@Max(10000)
	threadCreationDelay: number;

	/**
	 * Thread reply delay in seconds
	 */
	@Type(() => Number)
	@IsNumber()
	@IsNotEmpty()
	@Min(0)
	@Max(10000)
	threadReplyDelay: number;

	/**
	 * Bump limit (min. 3)
	 */
	@Type(() => Number)
	@IsNumber()
	@IsNotEmpty()
	@Min(3)
	@Max(10000)
	bumpLimit: number;

	/**
	 * FAQ page
	 */
	@IsString()
	@IsNotEmpty()
	@MinLength(1)
	@MaxLength(20000)
	faqHtml: string;

	/**
	 * Rules page
	 */
	@IsString()
	@IsNotEmpty()
	@MinLength(1)
	@MaxLength(20000)
	rulesHtml: string;
}
