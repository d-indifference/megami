import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DbHealthCheckService } from './db-healthcheck.service';

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
		return this.normalizeBoolean(
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
				Logger.log(
					'Successfully connected to database',
					this.constructor.name
				);
				break;
			}

			Logger.log('Connecting to database...', this.constructor.name);
		}

		return true;
	}

	/**
	 * Normalize boolean type if it can be string 'true' or 'false'
	 * @param str Boolean string value
	 */
	private normalizeBoolean(str: string | boolean): boolean {
		if (!str) {
			return false;
		}

		let enhancedString: string | boolean;

		if (typeof str === 'string') {
			enhancedString = str.toLowerCase().trim();
		} else {
			enhancedString = str;
		}

		if (enhancedString === 'true') {
			return true;
		} else if (enhancedString === 'false') {
			return false;
		}

		return Boolean(enhancedString);
	}
}
