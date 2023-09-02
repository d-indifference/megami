import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { DbHealthCheckService } from './db-healthcheck.service';
import { ConfigModule } from '@nestjs/config';
import { MigrationToolkitService } from './migration-toolkit.service';
import { MigratorService } from './migrator.service';

@Module({
	imports: [ConfigModule],
	providers: [
		PrismaService,
		DbHealthCheckService,
		MigrationToolkitService,
		MigratorService
	],
	exports: [MigrationToolkitService, MigratorService]
})
export class MigratorModule {}
