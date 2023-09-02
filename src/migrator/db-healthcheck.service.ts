import { Inject, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';

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
			Logger.error(e.message.trim(), this.constructor.name);

			return false;
		}
	}
}
