import {
	Controller,
	Get,
	Inject,
	Render,
	Session,
	UseGuards
} from '@nestjs/common';
import { SessionGuard } from '../guards/session.guard';
import { DashboardPageView } from '../views/dashboard-page.view.interface';
import { DashboardPageViewImpl } from '../views/impl/dashboard-page.view.impl';
import { DashboardPage } from '../types/dashboard-page.type';
import { SessionDto } from '../dto/session/session.dto';

/**
 * Main management panel controller
 */
@Controller('megami')
export class ManagementController {
	constructor(
		@Inject(DashboardPageView)
		private readonly dashboardPageView: DashboardPageViewImpl
	) {}

	/**
	 * Home page
	 */
	@Get('home')
	@UseGuards(SessionGuard)
	@Render('admin-home')
	public async index(@Session() session: SessionDto): Promise<DashboardPage> {
		return await this.dashboardPageView.getDashboardPage(session);
	}
}
