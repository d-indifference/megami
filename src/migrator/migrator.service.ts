import { Inject, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';
import * as path from 'path';
import * as fs from 'fs/promises';
import { exec } from 'child_process';

/**
 * Prisma migrations runner
 */
@Injectable()
export class MigratorService {
	constructor(
		@Inject(PrismaService)
		private readonly prisma: PrismaService
	) {}

	/**
	 * Run Prisma migrations exactly
	 */
	public async runPrismaMigrations(): Promise<void> {
		Logger.log('Checking database migrations...', this.constructor.name);

		const needToFirstTimeMigrate = await this.isNeedToFirstTimeMigrate();

		if (needToFirstTimeMigrate) {
			Logger.log(
				'Database migrations will be applied at first time',
				this.constructor.name
			);

			await this.promisifyProcess('npm run prisma:migrate');
		} else {
			const availableMigrationsCount =
				await this.getAvailableMigrationsCount();
			const appliedMigrationsCount =
				await this.getAppliedMigrationsCount();

			if (availableMigrationsCount > appliedMigrationsCount) {
				Logger.log('News database migrations will be applied', 'main');

				await this.promisifyProcess('npm run prisma:migrate');
			} else {
				Logger.log('All database migrations are up to date', 'main');
			}
		}
	}

	/**
	 * Get applied in DB migrations count
	 */
	private async getAppliedMigrationsCount(): Promise<number> {
		const migrationsCount = await this.prisma.$queryRaw(
			Prisma.sql`SELECT COUNT(*) as "migrationsCount" FROM _prisma_migrations;`
		);

		return Number(migrationsCount[0].migrationsCount);
	}

	/**
	 * Get all available migrations count
	 */
	private async getAvailableMigrationsCount(): Promise<number> {
		const migrationsPath = path.join(process.cwd(), 'prisma', 'migrations');
		return (await fs.readdir(migrationsPath)).length - 1;
	}

	/**
	 * Check if first migration is need
	 */
	private async isNeedToFirstTimeMigrate(): Promise<boolean> {
		const exists = await this.prisma.$queryRaw(Prisma.sql`
			SELECT EXISTS (
				SELECT FROM 
					pg_tables
				WHERE 
					schemaname = 'public' AND 
					tablename  = '_prisma_migrations'
			);`);

		return !exists[0].exists;
	}

	/**
	 * Run command and get its result as promise
	 * @param command Shell command
	 */
	private promisifyProcessNoOutput(command: string): Promise<string> {
		return new Promise((resolve, reject) => {
			exec(command, (error, stdout, stderr) => {
				if (error) {
					reject(error);
				} else {
					console.error(stderr.trim());
					resolve(stdout.trim());
				}
			});
		});
	}

	/**
	 * Run command as promise and print its result
	 * @param command Shell command
	 */
	private promisifyProcess(command: string): Promise<void> {
		return new Promise((resolve, reject) => {
			this.promisifyProcessNoOutput(command)
				.then(result => {
					console.log(result);
					resolve(null);
				})
				.catch(e => {
					console.error(e.message);
					reject(e);
				});
		});
	}
}
