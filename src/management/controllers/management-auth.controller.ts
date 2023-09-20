import {
	Body,
	Controller,
	Get,
	Inject,
	Post,
	Render,
	Req,
	Res,
	Session,
	UseGuards,
	UsePipes,
	ValidationPipe
} from '@nestjs/common';
import { SignInPage } from '../types/sign-in-page.type';
import { SignInPageView } from '../views/sign-in-page.view.interface';
import { SignInPageGuard } from '../guards/sign-in-page.guard';
import { FormDataRequest } from 'nestjs-form-data';
import { SignInDto } from '../dto/sign-in.dto';
import { SessionDto } from '../dto/session/session.dto';
import { Request, Response } from 'express';

/**
 * Management panel authentication controller
 */
@Controller('megami')
export class ManagementAuthController {
	constructor(
		@Inject(SignInPageView)
		private readonly signInPageView: SignInPageView
	) {}

	/**
	 * Sign in page
	 */
	@Get('sign-in')
	@UseGuards(SignInPageGuard)
	@Render('sign-in')
	public async signInPage(): Promise<SignInPage> {
		return await this.signInPageView.getSignInPage();
	}

	/**
	 * Sign out address
	 */
	@Get('sign-out')
	public signOut(@Req() req: Request, @Res() res: Response): void {
		this.signInPageView.signOut(req, res);
	}

	/**
	 * Sign in handler
	 */
	@Post('sign-in')
	@FormDataRequest()
	@UsePipes(new ValidationPipe({ transform: true }))
	public async signIn(
		@Body() body: SignInDto,
		@Session() session: SessionDto,
		@Res() res: Response
	): Promise<void> {
		await this.signInPageView.signIn(body, session, res);
	}
}
