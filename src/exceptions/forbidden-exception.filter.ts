import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	ForbiddenException
} from '@nestjs/common';
import { LOG } from '../toolkit';

/**
 * 500 Error Filter
 */
@Catch(ForbiddenException)
export class ForbiddenExceptionFilter implements ExceptionFilter {
	public catch(exception: ForbiddenException, host: ArgumentsHost): void {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse();

		LOG.warn(this, '[403] Forbidden');

		response.render('403', {
			title: '403 Forbidden',
			message: exception.message
		});
	}
}
