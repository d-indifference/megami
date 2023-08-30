import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from '../prisma.service';
import { BoardRepoImpl } from './repo/impl/board.repo.impl';
import { BoardMapperImpl } from './mappers/impl/board.mapper.impl';
import { BoardQueriesImpl } from './queries/impl/board.queries.impl';
import { BoardsViewImpl } from './views/impl/boards.view.impl';
import { BoardRepo } from './repo/board.repo.interface';
import { BoardsView } from './views/boards.view.interface';
import { BoardQueries } from './queries/board.queries.interface';
import { BoardMapper } from './mappers/board.mapper.interface';
import { ThreadsView } from './views/threads.view.interface';
import { ThreadsViewImpl } from './views/impl/threads.view.impl';
import { ThreadModule } from '../thread/thread.module';

/**
 * Module for boards
 */
@Module({
	imports: [ConfigModule, forwardRef(() => ThreadModule)],
	controllers: [],
	providers: [
		PrismaService,
		{
			provide: BoardRepo,
			useClass: BoardRepoImpl
		},
		{
			provide: BoardMapper,
			useClass: BoardMapperImpl
		},
		{
			provide: BoardQueries,
			useClass: BoardQueriesImpl
		},
		{
			provide: BoardsView,
			useClass: BoardsViewImpl
		},
		{
			provide: ThreadsView,
			useClass: ThreadsViewImpl
		}
	],
	exports: [
		{
			provide: BoardsView,
			useClass: BoardsViewImpl
		},
		{
			provide: ThreadsView,
			useClass: ThreadsViewImpl
		},
		{
			provide: BoardQueries,
			useClass: BoardQueriesImpl
		},
		{
			provide: BoardRepo,
			useClass: BoardRepoImpl
		}
	]
})
export class BoardModule {}
