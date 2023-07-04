import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';

const bootstrap = async () => {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);

	app.useStaticAssets(path.join(__dirname, '..', 'public')); // Если у вас есть статические ресурсы, такие как CSS или JavaScript, поместите их в папку "public"
	app.setBaseViewsDir(path.join(__dirname, '..', 'views')); // Папка, содержащая ваши шаблоны Handlebars
	app.setViewEngine('hbs');

	await app.listen(3000);
};

bootstrap().then();
