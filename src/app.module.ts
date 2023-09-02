import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { BoardModule } from './board/board.module';
import { ConfigModule } from '@nestjs/config';
import { ThreadModule } from './thread/thread.module';
import { MigratorModule } from './migrator/migrator.module';

/**
 * Main app module
 */
@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: '.env'
		}),
		BoardModule,
		ThreadModule,
		MigratorModule
	],
	controllers: [AppController],
	providers: []
})
export class AppModule {}
