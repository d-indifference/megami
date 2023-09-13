import { SiteSettingsView } from '../site-settings.view.interface';
import { SessionDto } from '../../dto/session/session.dto';
import { SiteSettingsPage } from '../../types/site-settings-page.type';
import { Inject } from '@nestjs/common';
import { SiteSettingsService } from '../../../site-settings/services/site-settings.service';
import { SiteSettings } from '../../../site-settings/types/site-settings.type';
import e from 'express';
import { LOG } from '../../../toolkit';

/**
 * Site settings views
 */
export class SiteSettingsViewImpl implements SiteSettingsView {
	constructor(
		@Inject(SiteSettingsService)
		private readonly siteSettingsServices: SiteSettingsService
	) {}

	/**
	 * Get site settings page payload
	 * @param session Session data
	 */
	public async getPage(session: SessionDto): Promise<SiteSettingsPage> {
		LOG.log(this, 'get site settings page', session);

		return {
			title: await this.siteSettingsServices.buildTitle('Site Settings'),
			session: session.payload,
			siteLogo: await this.siteSettingsServices.getTitle(),
			siteSettings: await this.siteSettingsServices.getSiteSettings()
		};
	}

	/**
	 * Save site settings
	 * @param dto Site settings DTO
	 * @param res Express.js response
	 */
	public async saveSettings(
		dto: SiteSettings,
		res: e.Response
	): Promise<void> {
		LOG.log(this, 'update site settings', dto);

		await this.siteSettingsServices.updateSiteSettings(dto);

		res.redirect('/megami/settings');
	}
}
