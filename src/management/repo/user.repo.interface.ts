import { User } from '@prisma/client';
import { DeleteDto } from '../../toolkit/delete.dto';

/**
 * DAO for User entity
 */
export interface UserRepo {
	create(entity: User): Promise<User>;

	update(entity: User, id: string): Promise<User>;

	findAll(): Promise<User[]>;

	findByIds(ids: string[]): Promise<User[]>;

	findById(id: string): Promise<User>;

	findByEmail(email: string): Promise<User>;

	findByEmailAndPassword(
		email: string,
		encryptedPassword: string
	): Promise<User>;

	remove(dto: DeleteDto): Promise<void>;

	totalCount(): Promise<number>;
}

export const UserRepo = Symbol('UserRepo');
