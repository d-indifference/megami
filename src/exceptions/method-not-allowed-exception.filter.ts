import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	MethodNotAllowedException
} from '@nestjs/common';
import { LOG } from '../toolkit';

/**
 * 405 Error Filter
 */
@Catch(MethodNotAllowedException)
export class MethodNotAllowedExceptionFilter implements ExceptionFilter {
	public catch(
		exception: MethodNotAllowedException,
		host: ArgumentsHost
	): void {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse();

		LOG.log(this, '[405] Method Not Allowed');

		response.render('405', {
			title: '405 Method Not Allowed',
			message: exception.message
		});
	}
}
