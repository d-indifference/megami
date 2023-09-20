import { SignInPage } from '../types/sign-in-page.type';
import { SessionDto } from '../dto/session/session.dto';
import { SignInDto } from '../dto/sign-in.dto';
import { Request, Response } from 'express';

/**
 * Sign in page views
 */
export interface SignInPageView {
	getSignInPage(): Promise<SignInPage>;

	signIn(body: SignInDto, session: SessionDto, res: Response): Promise<void>;

	signOut(req: Request, res: Response): void;
}

export const SignInPageView = Symbol('SignInPageView');
