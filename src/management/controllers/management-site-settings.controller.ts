import {
	Body,
	Controller,
	Get,
	Inject,
	Post,
	Render,
	Res,
	Session,
	UseGuards
} from '@nestjs/common';
import { SessionDto } from '../dto/session/session.dto';
import { SiteSettingsPage } from '../types/site-settings-page.type';
import { SiteSettingsView } from '../views/site-settings.view.interface';
import { SessionGuard } from '../guards/session.guard';
import { SiteSettings } from '../../site-settings/types/site-settings.type';
import { Response } from 'express';

/**
 * Site settings controller
 */
@Controller('megami')
export class ManagementSiteSettingsController {
	constructor(
		@Inject(SiteSettingsView)
		private readonly siteSettingsView: SiteSettingsView
	) {}

	/**
	 * Get settings page
	 */
	@Get('settings')
	@UseGuards(SessionGuard)
	@Render('admin-site-settings')
	public async index(
		@Session() session: SessionDto
	): Promise<SiteSettingsPage> {
		return await this.siteSettingsView.getPage(session);
	}

	/**
	 * Update settings
	 */
	@Post('settings')
	@UseGuards(SessionGuard)
	public async saveSettings(
		@Body() dto: SiteSettings,
		@Res() res: Response
	): Promise<void> {
		await this.siteSettingsView.saveSettings(dto, res);
	}
}
