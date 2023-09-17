import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ManagementModule } from '../management/management.module';
import { PrismaService } from '../prisma.service';
import { IpListsFileService } from './services/ip-lists-file.service';
import { IpFilterView } from './views/ip-filter.view.interface';
import { IpFilterViewImpl } from './views/impl/ip-filter.view.impl';
import { ModerationIpFilterController } from './controllers/moderation-ip-filter.controller';
import { SiteSettingsModule } from '../site-settings/site-settings.module';
import { IpFilterServiceWrapper } from '../ip-filter.service.wrapper';
import { IpFilter } from 'nestjs-ip-filter';
import { ipFilterConfig } from '../config/ip-filter.config';
import { ModerationRecentPostsController } from './controllers/moderation-recent-posts.controller';
import { RecentPostsView } from './views/recent-posts.view.interface';
import { RecentPostsViewImpl } from './views/impl/recent-posts.view.impl';
import { ThreadModule } from '../thread/thread.module';
import { RecentUploadsView } from './views/recent-uploads.view.interface';
import { RecentUploadsViewImpl } from './views/impl/recent-uploads.view.impl';
import { ModerationRecentUploadsController } from './controllers/moderation-recent-uploads.controller';
import { BanView } from './views/ban.view.interface';
import { BanViewImpl } from './views/impl/ban.view.impl';
import { ModerationBanController } from './controllers/moderation-ban.controller';
import { BanMapper } from './mappers/ban.mapper.interface';
import { BanMapperImpl } from './mappers/impl/ban.mapper.impl';
import { BanCommands } from './commands/ban.commands.interface';
import { BanCommandsImpl } from './commands/impl/ban.commands.impl';
import { BanRepo } from './repo/ban.repo.interface';
import { BanRepoImpl } from './repo/impl/ban.repo.impl';
import { BanQueries } from './queries/ban.queries.interface';
import { BanQueriesImpl } from './queries/impl/ban.queries.impl';

/**
 * Moderation module
 */
@Module({
	imports: [
		ConfigModule,
		ManagementModule,
		SiteSettingsModule,
		ThreadModule,
		IpFilter.registerAsync({
			// eslint-disable-next-line no-use-before-define
			imports: [ModerationModule],
			inject: [IpListsFileService],
			useFactory: ipFilterConfig
		})
	],
	providers: [
		PrismaService,
		IpListsFileService,
		IpFilterServiceWrapper,
		{
			provide: IpFilterView,
			useClass: IpFilterViewImpl
		},
		{
			provide: RecentPostsView,
			useClass: RecentPostsViewImpl
		},
		{
			provide: RecentUploadsView,
			useClass: RecentUploadsViewImpl
		},
		{
			provide: BanView,
			useClass: BanViewImpl
		},
		{
			provide: BanMapper,
			useClass: BanMapperImpl
		},
		{
			provide: BanCommands,
			useClass: BanCommandsImpl
		},
		{
			provide: BanRepo,
			useClass: BanRepoImpl
		},
		{
			provide: BanQueries,
			useClass: BanQueriesImpl
		}
	],
	controllers: [
		ModerationIpFilterController,
		ModerationRecentPostsController,
		ModerationRecentUploadsController,
		ModerationBanController
	],
	exports: [
		IpListsFileService,
		{
			provide: BanQueries,
			useClass: BanQueriesImpl
		}
	]
})
export class ModerationModule {}
