import { SignInPageView } from '../sign-in-page.view.interface';
import { SignInPage } from '../../types/sign-in-page.type';
import { SignInDto } from '../../dto/sign-in.dto';
import { SessionDto } from '../../dto/session/session.dto';
import { Request, Response } from 'express';
import {
	Inject,
	InternalServerErrorException,
	UnauthorizedException
} from '@nestjs/common';
import { SessionPayloadDto } from '../../dto/session/session-payload.dto';
import { UserQueries } from '../../queries/user.queries.interface';
import { SessionPayloadDtoBuilder } from '../../../toolkit/session-payload-dto.builder';
import { SiteSettingsService } from '../../../site-settings/services/site-settings.service';
import { LOG } from '../../../toolkit';

/**
 * Sign in page views
 */
export class SignInPageViewImpl implements SignInPageView {
	constructor(
		@Inject(UserQueries)
		private readonly userQueries: UserQueries,
		@Inject(SiteSettingsService)
		private readonly siteSettingsServices: SiteSettingsService
	) {}

	/**
	 * Get payload for sign in page
	 */
	public async getSignInPage(): Promise<SignInPage> {
		LOG.log(this, 'get sign in page');

		return {
			title: await this.siteSettingsServices.buildTitle('Sign in'),
			siteLogo: await this.siteSettingsServices.getTitle()
		};
	}

	/**
	 * Sign in handler
	 * @param body Sign in form data
	 * @param session Session data
	 * @param res Express.js response
	 */
	public async signIn(
		body: SignInDto,
		session: SessionDto,
		res: Response
	): Promise<void> {
		LOG.log(this, 'sign in', body);

		session.payload = await this.getSessionPayloadData(body);

		res.redirect('/megami/home');
	}

	/**
	 * Sign out handler
	 * @param req Express.js request
	 * @param res Express.js response
	 */
	public signOut(req: Request, res: Response): void {
		LOG.log(this, 'sign out', { email: req.session['payload']['email'] });

		req.session.destroy(err => {
			if (err) {
				LOG.error(this, 'sign out error', {
					email: req.session['payload']['email']
				});
				throw new InternalServerErrorException(err);
			}
		});

		res.redirect('/megami/sign-in');
	}

	/**
	 * Get session payload data
	 * @param dto Sign in data DTO
	 */
	private async getSessionPayloadData(
		dto: SignInDto
	): Promise<SessionPayloadDto> {
		LOG.log(this, 'get session payload data', dto);

		const foundUser = await this.userQueries.findEntityForSignIn(dto);

		if (foundUser) {
			const payloadBuilder = new SessionPayloadDtoBuilder();

			LOG.log(this, 'user can sign in', dto);

			return payloadBuilder
				.setEmail(dto.email)
				.setRole(foundUser.role)
				.build();
		}

		LOG.log(this, 'user cannot sign in', dto);

		throw new UnauthorizedException();
	}
}
