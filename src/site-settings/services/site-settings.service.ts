import { Inject, Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as fsSync from 'fs';
import * as path from 'path';
import { SiteSettings } from '../types/site-settings.type';
import { ConfigService } from '@nestjs/config';
import * as process from 'process';
import { LOG } from '../../toolkit';

/**
 * Site settings service
 */
@Injectable()
export class SiteSettingsService {
	constructor(
		@Inject(ConfigService)
		private readonly configService: ConfigService
	) {}

	private readonly siteSettingsFile: string = 'settings';

	/**
	 * Read settings file and get parsed values
	 */
	public async getSiteSettings(): Promise<SiteSettings> {
		const pathToSettings = path.join(
			process.cwd(),
			this.configService.get('MEGAMI_VOLUMES_DIR'),
			this.configService.get('MEGAMI_SETTINGS_VOLUME_NAME'),
			this.siteSettingsFile
		);

		const readSettingsFile = await fs.readFile(pathToSettings);

		const extractedSettings = JSON.parse(readSettingsFile.toString());

		return extractedSettings as SiteSettings;
	}

	/**
	 * Create site settings sile if not exists
	 */
	public async createSiteSettings(): Promise<void> {
		LOG.log(this, 'megami settings file will be created');

		const pathToSettings = path.join(
			process.cwd(),
			this.configService.get('MEGAMI_VOLUMES_DIR'),
			this.configService.get('MEGAMI_SETTINGS_VOLUME_NAME'),
			this.siteSettingsFile
		);

		if (!fsSync.existsSync(pathToSettings)) {
			const defaultSettings: SiteSettings = {
				title: 'Megami Image Board',
				slogan: 'Modern image board engine',
				description: `Some description for this site. 
It fully supports HTML5 markdown + <a href="https://getbootstrap.com/">Boostrap</a>`,
				threadCreationDelay: 30,
				threadReplyDelay: 5,
				mainPageLogoAddress: '/img/logo-512.png',
				bumpLimit: 100
			};

			await fs.writeFile(
				pathToSettings,
				JSON.stringify(defaultSettings),
				{
					flag: 'w'
				}
			);

			LOG.log(this, 'megami settings file successfully created');
		}
	}

	/**
	 * Update site settings
	 * @param newSettings New settings data
	 */
	public async updateSiteSettings(
		newSettings: Partial<SiteSettings>
	): Promise<void> {
		LOG.log(this, 'update settings file', newSettings);

		const pathToSettings = path.join(
			process.cwd(),
			this.configService.get('MEGAMI_VOLUMES_DIR'),
			this.configService.get('MEGAMI_SETTINGS_VOLUME_NAME'),
			this.siteSettingsFile
		);

		const currentFileData = await this.getSiteSettings();

		const newData: SiteSettings = {
			...currentFileData,
			...newSettings
		};

		if (!newData.threadCreationDelay) {
			newData.threadCreationDelay = 0;
		}

		if (!newData.threadReplyDelay) {
			newData.threadReplyDelay = 0;
		}

		if (!newData.bumpLimit) {
			newData.bumpLimit = 3;
		}

		await fs.writeFile(pathToSettings, JSON.stringify(newData), {
			flag: 'w'
		});

		LOG.log(this, 'megami settings file successfully update');
	}

	/**
	 * Build page title with main site title
	 * @param title Page title
	 */
	public async buildTitle(title: string): Promise<string> {
		const settings = await this.getSiteSettings();

		return `${title} — ${settings.title}`;
	}

	/**
	 * Get site title
	 */
	public async getTitle(): Promise<string> {
		const settings = await this.getSiteSettings();

		return settings.title;
	}
}
