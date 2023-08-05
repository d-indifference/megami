import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';
import * as hbs from 'hbs';
import { Logger } from '@nestjs/common';

const bootstrap = async () => {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);

	app.useStaticAssets(path.join(__dirname, '..', 'public'));
	app.setBaseViewsDir(path.join(__dirname, '..', 'views'));

	hbs.registerPartials(path.join(__dirname, '..', 'views/partials'));
	app.setViewEngine('hbs');

	await app.listen(3000);
};

bootstrap().then(() => {
	Logger.log('Server is started on http://localhost:3000/', 'main');
});
