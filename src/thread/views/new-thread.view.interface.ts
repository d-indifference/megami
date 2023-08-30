import { NewThreadPage } from '../types/new-thread-page.type';
import { ThreadCreateDto } from '../dto/thread.create.dto';
import { Response } from 'express';

/**
 * View for thread creation pages
 */
export interface NewThreadView {
	getViewPayload(slug: string): Promise<NewThreadPage>;

	createThread(
		slug: string,
		dto: ThreadCreateDto,
		res: Response
	): Promise<void>;
}

export const NewThreadView = Symbol('NewThreadView');
