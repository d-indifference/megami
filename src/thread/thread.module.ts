import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma.service';
import { NewThreadView } from './views/new-thread.view.interface';
import { NewThreadViewImpl } from './views/impl/new-thread.view.impl';
import { BoardModule } from '../board/board.module';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { nestjsFormDataConfig } from '../config/nestjs-form-data.config';
import { ThreadCommands } from './commands/thread.commands.interface';
import { ThreadCommandsImpl } from './commands/impl/thread.commands.impl';
import { ThreadMapper } from './mappers/thread.mapper.interface';
import { ThreadMapperImpl } from './mappers/impl/thread.mapper.impl';
import { ThreadRepo } from './repo/thread.repo.interface';
import { ThreadRepoImpl } from './repo/impl/thread.repo.impl';
import { ThreadQueries } from './queries/thread.queries.interface';
import { ThreadQueriesImpl } from './queries/impl/thread.queries.impl';
import { ThreadController } from './thread.controller';
import { ThreadRepliesView } from './views/thread-replies.view.interface';
import { ThreadRepliesViewImpl } from './views/impl/thread-replies.view.impl';
import { SiteSettingsModule } from '../site-settings/site-settings.module';

/**
 * Module for threads and replies
 */
@Module({
	imports: [
		ConfigModule,
		forwardRef(() => BoardModule),
		NestjsFormDataModule.configAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: nestjsFormDataConfig
		}),
		SiteSettingsModule
	],
	providers: [
		PrismaService,
		{
			provide: NewThreadView,
			useClass: NewThreadViewImpl
		},
		{
			provide: ThreadCommands,
			useClass: ThreadCommandsImpl
		},
		{
			provide: ThreadQueries,
			useClass: ThreadQueriesImpl
		},
		{
			provide: ThreadMapper,
			useClass: ThreadMapperImpl
		},
		{
			provide: ThreadRepo,
			useClass: ThreadRepoImpl
		},
		{
			provide: ThreadRepliesView,
			useClass: ThreadRepliesViewImpl
		}
	],
	controllers: [ThreadController],
	exports: [
		{
			provide: ThreadQueries,
			useClass: ThreadQueriesImpl
		},
		{
			provide: ThreadRepo,
			useClass: ThreadRepoImpl
		},
		{
			provide: ThreadCommands,
			useClass: ThreadCommandsImpl
		}
	]
})
export class ThreadModule {}
