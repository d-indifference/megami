import {
	IsNotEmpty,
	IsString,
	Matches,
	MaxLength,
	MinLength
} from 'class-validator';

/**
 * Board Dto
 */
export class BoardDto {
	/**
	 * Slug
	 */
	@IsString()
	@IsNotEmpty()
	@MinLength(1)
	@MaxLength(32)
	@Matches(/^[a-z0-9]+$/)
	slug: string;

	/**
	 * Name
	 */
	@IsString()
	@IsNotEmpty()
	@MinLength(3)
	@MaxLength(64)
	name: string;

	constructor(slug: string, name: string) {
		this.slug = slug;
		this.name = name;
	}
}
