import { BanRepo } from '../ban.repo.interface';
import { Ban } from '@prisma/client';
import { Inject } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { DeleteDto } from '../../../toolkit/delete.dto';

/**
 * DAO for ban entity
 */
export class BanRepoImpl implements BanRepo {
	constructor(
		@Inject(PrismaService)
		private readonly prisma: PrismaService
	) {}

	/**
	 * Create new ban
	 * @param entity New entity
	 */
	public async create(entity: Ban): Promise<Ban> {
		return (await this.prisma.ban.create({
			data: { ...entity }
		})) as Ban;
	}

	/**
	 * Check if active ban of this IP exists
	 * @param ip Poster's IP
	 */
	public async checkActiveBan(ip: string): Promise<boolean> {
		const now = new Date();

		const activeBans = await this.prisma.ban.findMany({
			where: { ip, banTill: { gte: now } }
		});

		return activeBans.length !== 0;
	}

	/**
	 * Find all active bans for all IP addresses
	 */
	public async findAllActive(): Promise<Ban[]> {
		const now = new Date();

		const activeBans = await this.prisma.ban.findMany({
			where: { banTill: { gte: now } },
			include: { admin: true },
			orderBy: { createdAt: 'desc' }
		});

		return activeBans as Ban[];
	}

	/**
	 * Find ban entity by ID
	 * @param id Entity UUID
	 */
	public async findById(id: string): Promise<Ban> {
		return (await this.prisma.ban.findUnique({ where: { id } })) as Ban;
	}

	/**
	 * Find last active ban for IP
	 * @param ip poster's IP
	 */
	public async findLastActive(ip: string): Promise<Ban> {
		const now = new Date();

		const activeBans = await this.prisma.ban.findMany({
			where: { ip, banTill: { gte: now } },
			include: { admin: true },
			orderBy: { createdAt: 'desc' }
		});

		if (activeBans.length > 0) {
			return activeBans[0];
		}

		return null;
	}

	/**
	 * Delete bans
	 * @param dto Deletion DTO
	 */
	public async remove(dto: DeleteDto): Promise<void> {
		await this.prisma.ban.deleteMany({ where: { id: { in: dto.ids } } });
	}

	/**
	 * Remove all inactive bans
	 */
	public async removeInactive(): Promise<void> {
		const now = new Date();

		await this.prisma.ban.deleteMany({
			where: { banTill: { lt: now } }
		});
	}
}
