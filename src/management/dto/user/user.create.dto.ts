import { UserRole } from '@prisma/client';
import {
	IsEmail,
	IsEnum,
	IsNotEmpty,
	IsString,
	MaxLength,
	MinLength
} from 'class-validator';

/**
 * User creation DTO
 */
export class UserCreateDto {
	/**
	 * Email
	 */
	@IsEmail()
	@IsNotEmpty()
	email: string;

	/**
	 * Password without encryption
	 */
	@IsString()
	@IsNotEmpty()
	@MinLength(4)
	@MaxLength(128)
	password: string;

	/**
	 * User's role
	 */
	@IsEnum(UserRole)
	@IsNotEmpty()
	role: UserRole;
}
