import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SiteSettingsService } from './services/site-settings.service';

/**
 * Site settings module
 */
@Module({
	imports: [ConfigModule],
	providers: [SiteSettingsService],
	exports: [SiteSettingsService]
})
export class SiteSettingsModule {}
