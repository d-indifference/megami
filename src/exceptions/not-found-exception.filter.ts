import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	NotFoundException
} from '@nestjs/common';
import { LOG } from '../toolkit';

/**
 * 404 Error Filter
 */
@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
	public catch(exception: NotFoundException, host: ArgumentsHost): void {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse();

		LOG.log(this, '[404] Not found');

		response.render('404', {
			title: '404 Not found',
			message: exception.message
		});
	}
}
