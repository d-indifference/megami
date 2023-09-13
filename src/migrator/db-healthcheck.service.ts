import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';
import { LOG } from '../toolkit';

/**
 * Database healthcheck service
 */
@Injectable()
export class DbHealthCheckService {
	constructor(
		@Inject(PrismaService)
		private readonly prisma: PrismaService
	) {}

	/**
	 * Check if database is ready to accept connections
	 */
	public async isDatabaseAlive(): Promise<boolean> {
		try {
			const result = await this.prisma.$queryRaw(Prisma.sql`SELECT 1`);

			return Boolean(result);
		} catch (e) {
			LOG.error(this, e.message.trim());

			return false;
		}
	}
}
