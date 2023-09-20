import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

/**
 * Board Update Dto
 */
export class BoardUpdateDto {
	/**
	 * Name
	 */
	@IsString()
	@IsNotEmpty()
	@MinLength(3)
	@MaxLength(64)
	name: string;
}
