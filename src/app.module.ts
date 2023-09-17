import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AppController } from './app.controller';
import { BoardModule } from './board/board.module';
import { ConfigModule } from '@nestjs/config';
import { ThreadModule } from './thread/thread.module';
import { MigratorModule } from './migrator/migrator.module';
import { ManagementModule } from './management/management.module';
import { SiteSettingsModule } from './site-settings/site-settings.module';
import { ModerationModule } from './moderation/moderation.module';
import { IpFilterDenyExceptionFilter } from './exceptions/ipfilter-exception.filter';
import { IpFilter } from 'nestjs-ip-filter';
import { IpListsFileService } from './moderation/services/ip-lists-file.service';
import { ipFilterConfig } from './config/ip-filter.config';
import { IpFilterServiceWrapper } from './ip-filter.service.wrapper';
import { BanModule } from './ban/ban.module';

/**
 * Main app module
 */
@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: '.env'
		}),
		BanModule,
		ManagementModule,
		BoardModule,
		ThreadModule,
		MigratorModule,
		SiteSettingsModule,
		ModerationModule,
		IpFilter.registerAsync({
			imports: [ModerationModule],
			inject: [IpListsFileService],
			useFactory: ipFilterConfig
		})
	],
	controllers: [AppController],
	providers: [
		{
			provide: APP_FILTER,
			useClass: IpFilterDenyExceptionFilter
		},
		IpFilterServiceWrapper
	]
})
export class AppModule {}
