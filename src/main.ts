import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';
import * as hbs from 'hbs';
import { Logger } from '@nestjs/common';
import { NotFoundExceptionFilter } from './exceptions/not-found-exception.filter';
import { InternalServerErrorExceptionFilter } from './exceptions/internal-server-error-exception.filter';
import { ConfigService } from '@nestjs/config';
import { compareHandlebarsHelper } from './handlebars/compare.handlebars.helper';
import { mathHandlebarsHelper } from './handlebars/math.handlebars.helper';
import * as cookieParser from 'cookie-parser';
import { PrismaService } from './prisma.service';
import { MigrationToolkitService } from './migrator/migration-toolkit.service';
import { MigratorService } from './migrator/migrator.service';
import * as session from 'express-session';
import { sessionConfig } from './config/session.config';
import { RootUserInitService } from './management/services/impl/root-user-init.service.impl';
import { UnauthorizedExceptionFilter } from './exceptions/unauthorized-exception.filter';
import { MethodNotAllowedExceptionFilter } from './exceptions/method-not-allowed-exception.filter';
import { SiteSettingsService } from './site-settings/services/site-settings.service';
import { eqHandlebarsHelper } from './handlebars/eq.handlebars.helper';

let internalPort = 3000;

/**
 * Application Entry Point
 */
const bootstrap = async () => {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);

	const configService = app.get(ConfigService);
	const migrationToolkit = app.get(MigrationToolkitService);
	const migrator = app.get(MigratorService);
	const rootUserInitService = app.get(RootUserInitService);
	const siteSettingsService = app.get(SiteSettingsService);

	internalPort = configService.get('MEGAMI_INTERNAL_PORT');

	const viewsDir = configService.get('MEGAMI_ASSETS_VIEWS_DIR');

	const isMigrationSkipped = migrationToolkit.isMigrationSkipped();
	const canContinueInit = await migrationToolkit.connectToDb();

	if (canContinueInit) {
		if (!isMigrationSkipped) {
			Logger.log('Database migrations are not skipped', 'main');

			await migrator.runPrismaMigrations();
		} else {
			Logger.log('Database migrations skipped', 'main');
		}

		const prismaService = app.get(PrismaService);
		prismaService.enableShutdownHooks(app);

		app.useStaticAssets(
			path.join(
				__dirname,
				'..',
				configService.get('MEGAMI_ASSETS_PUBLIC_DIR')
			)
		);
		app.setBaseViewsDir(path.join(__dirname, '..', viewsDir));

		hbs.registerPartials(
			path.join(__dirname, '..', `${viewsDir}/partials`)
		);
		hbs.registerHelper('compare', compareHandlebarsHelper);
		hbs.registerHelper('calc', mathHandlebarsHelper);
		hbs.registerHelper('eq', eqHandlebarsHelper);
		app.setViewEngine('hbs');

		app.useGlobalFilters(new NotFoundExceptionFilter());
		app.useGlobalFilters(new InternalServerErrorExceptionFilter());
		app.useGlobalFilters(new UnauthorizedExceptionFilter());
		app.useGlobalFilters(new MethodNotAllowedExceptionFilter());

		app.use(cookieParser());
		app.use(session(sessionConfig(configService)));

		await rootUserInitService.initRootUser();

		await siteSettingsService.createSiteSettings();

		await app.listen(internalPort);
	}
};

bootstrap().then(() => {
	Logger.log('ｷﾀ━━━(ﾟ∀ﾟ)━━━!!', 'main');
	Logger.log(
		`🚀 Server is started on http://localhost:${internalPort}/`,
		'main'
	);
});
