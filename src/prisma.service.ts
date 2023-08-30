import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * Service for Prisma Connection
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
	/**
	 * Connect to Prisma
	 */
	public async onModuleInit(): Promise<void> {
		await this.$connect();
	}

	/**
	 * Handling the application exit event and closing the Prisma connection
	 * @param app Application
	 */
	public enableShutdownHooks(app: INestApplication): void {
		this.$on('beforeExit', async () => {
			await app.close();
		});
	}
}
