import { User } from '@prisma/client';
import { SignInDto } from '../dto/sign-in.dto';
import { UserItemDto } from '../dto/user/user.item.dto';

/**
 * Queries for User entity
 */
export interface UserQueries {
	getTotalCount(): Promise<number>;

	findEntityByEmail(email: string): Promise<User>;

	findEntityForSignIn(dto: SignInDto): Promise<User>;

	findAll(): Promise<UserItemDto[]>;

	findById(id: string): Promise<UserItemDto>;
}

export const UserQueries = Symbol('UserQueries');
