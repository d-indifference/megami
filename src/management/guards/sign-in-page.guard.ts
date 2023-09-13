import {
	CanActivate,
	ExecutionContext,
	Inject,
	Injectable
} from '@nestjs/common';
import { SessionDto } from '../dto/session/session.dto';
import { UserQueries } from '../queries/user.queries.interface';

/**
 * Guard for sign in page
 */
@Injectable()
export class SignInPageGuard implements CanActivate {
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
				res.redirect('/megami/home');
			} else {
				return true;
			}
		} else {
			return true;
		}
	}
}
