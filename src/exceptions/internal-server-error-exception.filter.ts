import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	InternalServerErrorException
} from '@nestjs/common';
import { LOG } from '../toolkit';

/**
 * 500 Error Filter
 */
@Catch(InternalServerErrorException)
export class InternalServerErrorExceptionFilter implements ExceptionFilter {
	public catch(
		exception: InternalServerErrorException,
		host: ArgumentsHost
	): void {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse();

		LOG.error(this, '[500] Internal server error');

		response.render('500', {
			title: '500 Internal Server Error',
			message: exception.message
		});
	}
}
