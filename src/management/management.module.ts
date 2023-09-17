import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { nestjsFormDataConfig } from '../config/nestjs-form-data.config';
import { SignInPageView } from './views/sign-in-page.view.interface';
import { SignInPageViewImpl } from './views/impl/sign-in-page.view.impl';
import { ManagementAuthController } from './controllers/management-auth.controller';
import { ManagementController } from './controllers/management.controller';
import { PasswordService } from './services/password.service.interface';
import { PasswordServiceImpl } from './services/impl/password.service.impl';
import { RootUserInitService } from './services/impl/root-user-init.service.impl';
import { UserCommands } from './commands/user.commands.interface';
import { UserCommandsImpl } from './commands/impl/user.commands.impl';
import { UserMapper } from './mappers/user.mapper.interface';
import { UserMapperImpl } from './mappers/impl/user.mapper.impl';
import { UserRepo } from './repo/user.repo.interface';
import { PrismaService } from '../prisma.service';
import { UserRepoImpl } from './repo/impl/user.repo.impl';
import { UserQueries } from './queries/user.queries.interface';
import { UserQueriesImpl } from './queries/impl/user.queries.impl';
import { DashboardPageView } from './views/dashboard-page.view.interface';
import { DashboardPageViewImpl } from './views/impl/dashboard-page.view.impl';
import { PackageJsonService } from './services/impl/package-json.service';
import { ManagementProfileController } from './controllers/management-profile.controller';
import { ProfilePageView } from './views/profile-page.view.interface';
import { ProfilePageViewImpl } from './views/impl/profile-page.view.impl';
import { BoardListPageView } from './views/board-list-page.view.interface';
import { BoardListPageViewImpl } from './views/impl/board-list-page.view.impl';
import { ManagementBoardListController } from './controllers/management-board-list.controller';
import { BoardModule } from '../board/board.module';
import { SqlConsolePageView } from './views/sql-console-page.view.interface';
import { ManagementSqlConsoleController } from './controllers/management-sql-console.controller';
import { SqlConsolePageViewImpl } from './views/impl/sql-console-page.view.impl';
import { DiskListPageView } from './views/disk-list-page.view.interface';
import { DiskListPageViewImpl } from './views/impl/disk-list-page.view.impl';
import { ManagementDiskController } from './controllers/management-disk.controller';
import { ThreadModule } from '../thread/thread.module';
import { SiteSettingsView } from './views/site-settings.view.interface';
import { SiteSettingsViewImpl } from './views/impl/site-settings.view.impl';
import { ManagementSiteSettingsController } from './controllers/management-site-settings.controller';
import { SiteSettingsModule } from '../site-settings/site-settings.module';
import { AdministrationPageView } from './views/administration-page.view.interface';
import { AdministrationPageViewImpl } from './views/impl/administration-page.view.impl';
import { ManagementStaffController } from './controllers/management-staff.controller';

/**
 * Management interface module
 */
@Module({
	imports: [
		ConfigModule,
		NestjsFormDataModule.configAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: nestjsFormDataConfig
		}),
		BoardModule,
		ThreadModule,
		SiteSettingsModule
	],
	providers: [
		PrismaService,
		RootUserInitService,
		PackageJsonService,
		{
			provide: SignInPageView,
			useClass: SignInPageViewImpl
		},
		{
			provide: PasswordService,
			useClass: PasswordServiceImpl
		},
		{
			provide: UserCommands,
			useClass: UserCommandsImpl
		},
		{
			provide: UserQueries,
			useClass: UserQueriesImpl
		},
		{
			provide: UserMapper,
			useClass: UserMapperImpl
		},
		{
			provide: UserRepo,
			useClass: UserRepoImpl
		},
		{
			provide: DashboardPageView,
			useClass: DashboardPageViewImpl
		},
		{
			provide: ProfilePageView,
			useClass: ProfilePageViewImpl
		},
		{
			provide: BoardListPageView,
			useClass: BoardListPageViewImpl
		},
		{
			provide: SqlConsolePageView,
			useClass: SqlConsolePageViewImpl
		},
		{
			provide: DiskListPageView,
			useClass: DiskListPageViewImpl
		},
		{
			provide: SiteSettingsView,
			useClass: SiteSettingsViewImpl
		},
		{
			provide: AdministrationPageView,
			useClass: AdministrationPageViewImpl
		}
	],
	controllers: [
		ManagementController,
		ManagementAuthController,
		ManagementProfileController,
		ManagementBoardListController,
		ManagementSqlConsoleController,
		ManagementDiskController,
		ManagementSiteSettingsController,
		ManagementStaffController
	],
	exports: [
		RootUserInitService,
		{
			provide: UserCommands,
			useClass: UserCommandsImpl
		},
		{
			provide: UserQueries,
			useClass: UserQueriesImpl
		},
		{
			provide: UserMapper,
			useClass: UserMapperImpl
		}
	]
})
export class ManagementModule {}
