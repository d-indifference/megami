import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DbHealthCheckService } from './db-healthcheck.service';
import { BooleanUtils } from '../toolkit/boolean-utils';
import { LOG } from '../toolkit';

/**
 * Tools for database Prisma migrations
 */
@Injectable()
export class MigrationToolkitService {
	constructor(
		@Inject(ConfigService)
		private readonly configService: ConfigService,
		@Inject(DbHealthCheckService)
		private readonly healthCheck: DbHealthCheckService
	) {}

	/**
	 * Check if database migration skip is set
	 */
	public isMigrationSkipped(): boolean {
		return BooleanUtils.normalizeBoolean(
			this.configService.get('MEGAMI_SKIP_DB_MIGRATION')
		);
	}

	/**
	 * Check if there is a connection to the database
	 */
	public async connectToDb(): Promise<boolean> {
		while (true) {
			const dbState = await this.healthCheck.isDatabaseAlive();

			if (dbState) {
				LOG.log(this, 'Successfully connected to database');
				break;
			}

			LOG.log(this, 'Connecting to database...');
		}

		return true;
	}
}
