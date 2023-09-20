import { DashboardPageView } from '../dashboard-page.view.interface';
import { DashboardPage } from '../../types/dashboard-page.type';
import { DashboardPageBuilder } from '../../classes/dashboard-page-builder';
import * as os from 'os';
import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as process from 'process';
import { PrismaService } from '../../../prisma.service';
import { Prisma } from '@prisma/client';
import { PackageJsonService } from '../../services/impl/package-json.service';
import { DiskListPageView } from '../disk-list-page.view.interface';
import { SessionDto } from '../../dto/session/session.dto';
import { SiteSettingsService } from '../../../site-settings/services/site-settings.service';
import { BoardQueries } from '../../../board/queries/board.queries.interface';
import { ThreadQueries } from '../../../thread/queries/thread.queries.interface';
import { LOG } from '../../../toolkit';

/**
 * Dashboard pages views
 */
export class DashboardPageViewImpl implements DashboardPageView {
	constructor(
		@Inject(ConfigService)
		private readonly configService: ConfigService,
		@Inject(PrismaService)
		private readonly prisma: PrismaService,
		@Inject(PackageJsonService)
		private readonly packageJsonService: PackageJsonService,
		@Inject(DiskListPageView)
		private readonly diskListPageView: DiskListPageView,
		@Inject(SiteSettingsService)
		private readonly siteSettingsService: SiteSettingsService,
		@Inject(BoardQueries)
		private readonly boardQueries: BoardQueries,
		@Inject(ThreadQueries)
		private readonly threadQueries: ThreadQueries
	) {}

	/**
	 * Get dashboard pages payload
	 * @param session Session data
	 */
	public async getDashboardPage(session: SessionDto): Promise<DashboardPage> {
		LOG.log(this, 'get dashboard page', session);

		const postgresVersion = await this.getPostgresVersion();

		const packageJson = await this.packageJsonService.get();

		return new DashboardPageBuilder(
			await this.siteSettingsService.buildTitle('Management')
		)
			.setSession(session.payload)
			.setSiteLogo(await this.siteSettingsService.getTitle())
			.setTotalBoards(await this.boardQueries.count())
			.setTotalPosts(await this.threadQueries.count())
			.setDiskSpaceUsed(
				(await this.diskListPageView.getDiskListView(session)).totalStat
					.totalSize
			)
			.setCpu(os.cpus()[0])
			.setUptime(os.uptime())
			.setMemory(os.totalmem(), os.freemem())
			.setPort(this.configService.get<number>('MEGAMI_INTERNAL_PORT'))
			.setHost(os.hostname())
			.setProcessVersions(process.versions)
			.setPostgresVersion(postgresVersion)
			.setPrismaVersion(packageJson.devDependencies['prisma'])
			.setPrismaClientVersion(packageJson.dependencies['@prisma/client'])
			.setDependencies(packageJson.dependencies)
			.setDevDependencies(packageJson.devDependencies)
			.build();
	}

	/**
	 * Get PostgreSQL version
	 */
	private async getPostgresVersion(): Promise<string> {
		LOG.log(this, 'get postgres version');

		const postgresVersionQuery = await this.prisma.$queryRaw(
			Prisma.sql`SELECT VERSION();`
		);

		return postgresVersionQuery[0]['version'];
	}
}
