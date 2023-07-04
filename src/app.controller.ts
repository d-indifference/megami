import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class AppController {
	@Get()
	@Render('index')
	getIndexPage() {
		return {
			title: 'Название вашей страницы',
			message: 'Привет, мир!'
		};
	}
}
