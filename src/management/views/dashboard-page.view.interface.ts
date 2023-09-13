import { DashboardPage } from '../types/dashboard-page.type';
import { SessionDto } from '../dto/session/session.dto';

/**
 * Dashboard pages views
 */
export interface DashboardPageView {
	getDashboardPage(session: SessionDto): Promise<DashboardPage>;
}

export const DashboardPageView = Symbol('DashboardPageView');
