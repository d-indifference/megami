import { SqlConsolePageView } from '../sql-console-page.view.interface';
import { SqlConsolePage } from '../../types/sql-console-page.type';
import { SessionDto } from '../../dto/session/session.dto';
import { SqlConsoleQuery } from '../../types/sql-console-query.type';
import { Inject, MethodNotAllowedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../prisma.service';
import { SiteSettingsService } from '../../../site-settings/services/site-settings.service';
import { LOG } from '../../../toolkit';

/**
 * SQL console page views
 */
export class SqlConsolePageViewImpl implements SqlConsolePageView {
	constructor(
		@Inject(ConfigService)
		private readonly configService: ConfigService,
		@Inject(PrismaService)
		private readonly prisma: PrismaService,
		@Inject(SiteSettingsService)
		private readonly siteSettingsServices: SiteSettingsService
	) {}

	/**
	 * Get SQL console page payload
	 * @param session Session data
	 * @param query SQL Query data
	 */
	public async getSqlConsolePage(
		session: SessionDto,
		query: SqlConsoleQuery
	): Promise<SqlConsolePage> {
		LOG.log(this, 'get SQL console page', session);

		try {
			const queryResult = await this.processSqlQuery(query);

			LOG.log(this, 'SQL query was successfully processed', {
				query: query.query
			});

			return {
				title: await this.siteSettingsServices.buildTitle(
					'SQL Console'
				),
				siteLogo: await this.siteSettingsServices.getTitle(),
				session: session.payload,
				queryResult,
				exception: null
			};
		} catch (e) {
			LOG.warn(this, 'SQL query throws exception', {
				query: query.query
			});

			LOG.warn(this, e.message, {
				query: query.query
			});

			return {
				title: await this.siteSettingsServices.buildTitle(
					'SQL Console'
				),
				siteLogo: await this.siteSettingsServices.getTitle(),
				session: session.payload,
				queryResult: null,
				exception: e.message
			};
		}
	}

	/**
	 * Check SQL console password, if it is not correct, throw 405 exception
	 * @param password SQL console password
	 */
	private checkSqlConsolePassword(password: string): void {
		const sqlPassword = this.configService.get<string>(
			'MEGAMI_SQL_CONSOLE_PASSWORD'
		);

		if (sqlPassword !== password) {
			throw new MethodNotAllowedException(
				'Incorrect SQL console password'
			);
		}
	}

	/**
	 * Run SQL query
	 * @param query SQL console query
	 */
	private async processSqlQuery(query: SqlConsoleQuery): Promise<unknown[]> {
		if (query.query && query.password) {
			this.checkSqlConsolePassword(query.password);

			return (await this.prisma.$queryRawUnsafe(
				query.query.trim()
			)) as unknown[];
		}

		return null;
	}
}
