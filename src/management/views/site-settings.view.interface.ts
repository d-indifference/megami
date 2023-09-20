import { SessionDto } from '../dto/session/session.dto';
import { SiteSettingsPage } from '../types/site-settings-page.type';
import { SiteSettings } from '../../site-settings/types/site-settings.type';
import { Response } from 'express';

/**
 * Site settings views
 */
export interface SiteSettingsView {
	getPage(session: SessionDto): Promise<SiteSettingsPage>;

	saveSettings(dto: SiteSettings, res: Response): Promise<void>;
}

export const SiteSettingsView = Symbol('SiteSettingsView');
