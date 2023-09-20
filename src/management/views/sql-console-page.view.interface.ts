import { SqlConsolePage } from '../types/sql-console-page.type';
import { SessionDto } from '../dto/session/session.dto';
import { SqlConsoleQuery } from '../types/sql-console-query.type';

/**
 * SQL console page views
 */
export interface SqlConsolePageView {
	getSqlConsolePage(
		session: SessionDto,
		query: SqlConsoleQuery
	): Promise<SqlConsolePage>;
}

export const SqlConsolePageView = Symbol('SqlConsolePageView');
