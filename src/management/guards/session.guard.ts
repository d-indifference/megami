import {
	CanActivate,
	ExecutionContext,
	Inject,
	Injectable
} from '@nestjs/common';
import { SessionDto } from '../dto/session/session.dto';
import { UserQueries } from '../queries/user.queries.interface';

/**
 * Guard for page which should be protected by session
 */
@Injectable()
export class SessionGuard implements CanActivate {
	constructor(
		@Inject(UserQueries)
		private readonly userQueries: UserQueries
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const req = context.switchToHttp().getRequest();
		const res = context.switchToHttp().getResponse();

		const session = req.session as SessionDto;

		if (session.payload !== undefined) {
			const user = await this.userQueries.findEntityByEmail(
				session.payload.email
			);

			if (user) {
				return true;
			}

			res.redirect('/megami/sign-in');
		}

		res.redirect('/megami/sign-in');
	}
}
