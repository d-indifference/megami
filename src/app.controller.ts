import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class AppController {
	@Get()
	@Render('index')
	getIndexPage() {
		return {};
	}

	@Get('boards')
	@Render('boards')
	getBoardsPage() {
		return {};
	}

	@Get('faq')
	@Render('info-page')
	getFAQ() {
		return {};
	}
}
