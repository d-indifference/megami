import { UserRepo } from '../user.repo.interface';
import { User } from '@prisma/client';
import { DeleteDto } from '../../../toolkit/delete.dto';
import { Inject } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';

/**
 * DAO for User entity
 */
export class UserRepoImpl implements UserRepo {
	constructor(
		@Inject(PrismaService)
		private readonly prisma: PrismaService
	) {}

	/**
	 * Create a user
	 * @param entity User
	 */
	public async create(entity: User): Promise<User> {
		return (await this.prisma.user.create({
			data: {
				...entity
			}
		})) as User;
	}

	/**
	 * Find all users
	 */
	public async findAll(): Promise<User[]> {
		return (await this.prisma.user.findMany()) as User[];
	}

	/**
	 * Find many users by its UUIDs
	 * @param ids User's UUIDs
	 */
	public async findByIds(ids: string[]): Promise<User[]> {
		return (await this.prisma.user.findMany({
			where: {
				id: { in: ids }
			}
		})) as User[];
	}

	/**
	 * Find user by email
	 * @param email User's email
	 */
	public async findByEmail(email: string): Promise<User> {
		return (await this.prisma.user.findFirst({
			where: { email }
		})) as User;
	}

	/**
	 * Find user by email and encrypted password
	 * @param email Email
	 * @param encryptedPassword Encrypted password
	 */
	public async findByEmailAndPassword(
		email: string,
		encryptedPassword: string
	): Promise<User> {
		return (await this.prisma.user.findFirst({
			where: {
				email,
				encryptedPassword
			}
		})) as User;
	}

	/**
	 * Find user by ID
	 * @param id User UUID
	 */
	public async findById(id: string): Promise<User> {
		return (await this.prisma.user.findUnique({
			where: { id }
		})) as User;
	}

	/**
	 * Remove users by its IDs
	 * @param dto Deletion DTO
	 */
	public async remove(dto: DeleteDto): Promise<void> {
		await this.prisma.user.deleteMany({
			where: {
				id: { in: dto.ids }
			}
		});
	}

	/**
	 * Update user by its ID
	 * @param entity update data
	 * @param id User UUID
	 */
	public async update(entity: User, id: string): Promise<User> {
		return (await this.prisma.user.update({
			where: { id },
			data: { ...entity }
		})) as User;
	}

	/**
	 * Get total count of users
	 */
	public async totalCount(): Promise<number> {
		return (await this.prisma.user.count()) as number;
	}
}
