import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	InternalServerErrorException
} from '@nestjs/common';

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

		response.render('500', {
			title: '500 Internal Server Error',
			message: exception.message
		});
	}
}
