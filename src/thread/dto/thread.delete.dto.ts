import {
	IsBoolean,
	IsNotEmpty,
	IsOptional,
	IsString,
	MaxLength,
	MinLength
} from 'class-validator';

/**
 * Thread deletion DTO
 */
export class ThreadDeleteDto {
	/**
	 * Delete only files
	 */
	@IsOptional()
	@IsBoolean()
	@IsNotEmpty()
	fileOnly?: boolean;

	/**
	 * Comment password
	 */
	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	@MaxLength(8)
	password: string;

	/**
	 * Values for deletion
	 */
	@IsNotEmpty()
	delete: string[] | string;
}
