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

	@Get('b')
	@Render('board')
	getBoardPage() {
		return {};
	}

	@Get('new-thread')
	@Render('new_thread')
	getNewThreadPage() {
		return {};
	}

	@Get('thread')
	@Render('thread')
	getThreadPage() {
		return {};
	}
}
