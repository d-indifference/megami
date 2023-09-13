import {
	Controller,
	Get,
	Inject,
	Query,
	Render,
	Session,
	UseGuards
} from '@nestjs/common';
import { SqlConsolePageView } from '../views/sql-console-page.view.interface';
import { SessionDto } from '../dto/session/session.dto';
import { SqlConsolePage } from '../types/sql-console-page.type';
import { SessionGuard } from '../guards/session.guard';

/**
 * SQL console controller
 */
@Controller('megami')
export class ManagementSqlConsoleController {
	constructor(
		@Inject(SqlConsolePageView)
		private readonly sqlConsolePageView: SqlConsolePageView
	) {}

	/**
	 * Get SQL console form
	 */
	@Get('sql-console')
	@UseGuards(SessionGuard)
	@Render('admin-sql-console')
	public async index(
		@Session() session: SessionDto,
		@Query('query') query?: string,
		@Query('password') password?: string
	): Promise<SqlConsolePage> {
		return await this.sqlConsolePageView.getSqlConsolePage(session, {
			query,
			password
		});
	}
}
