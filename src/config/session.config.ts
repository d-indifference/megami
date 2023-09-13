import { ConfigService } from '@nestjs/config';
import { SessionOptions } from 'express-session';

/**
 * Config for express-session
 * @param configService ConfigService
 */
export const sessionConfig = (configService: ConfigService): SessionOptions => {
	return {
		secret: configService.get('MEGAMI_SESSION_SECRET'),
		resave: false,
		saveUninitialized: false
	};
};
