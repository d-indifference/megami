import { Inject, Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as fsSync from 'fs';
import * as path from 'path';
import { SiteSettings } from '../types/site-settings.type';
import { ConfigService } from '@nestjs/config';
import * as process from 'process';
import { LOG } from '../../toolkit';
import { SiteSettingsDto } from '../../management/dto/site-settings/site-settings.dto';
import { makeInitialSettings } from '../toolkit/make-initial-settings.function';

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
			const defaultSettings: SiteSettings = makeInitialSettings();

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
		newSettings: SiteSettingsDto
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

	/**
	 * Get board bottom links
	 */
	public async getBoardBottomLinks(): Promise<string> {
		const settings = await this.getSiteSettings();

		return settings.boardBottomLinks;
	}

	/**
	 * Map site settings DTO to type
	 * @param dto Site settings DTO
	 */
	private mapDtoToType(dto: SiteSettingsDto): SiteSettings {
		return { ...dto };
	}
}
