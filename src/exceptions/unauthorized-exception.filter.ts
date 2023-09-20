import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	UnauthorizedException
} from '@nestjs/common';
import { LOG } from '../toolkit';

/**
 * 401 Error Filter
 */
@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
	public catch(exception: UnauthorizedException, host: ArgumentsHost): void {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse();

		LOG.log(this, '[401] Unauthorized');

		response.render('401', {
			title: '401 Unauthorized',
			message: exception.message
		});
	}
}
