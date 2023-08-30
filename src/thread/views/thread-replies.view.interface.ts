import { ThreadWithRepliesPage } from '../types/thread-with-replies-page.type';
import { Response } from 'express';
import { ThreadReplyCreateDto } from '../dto/thread-reply.create.dto';
import { ThreadDeleteDto } from '../dto/thread.delete.dto';

/**
 * View for thread replies
 */
export interface ThreadRepliesView {
	getThreadRepliesPage(
		slug: string,
		numberOnBoard: number
	): Promise<ThreadWithRepliesPage>;

	createReply(
		slug: string,
		threadNumber: number,
		dto: ThreadReplyCreateDto,
		res: Response
	): Promise<void>;

	deleteCommentsByPwd(
		slug: string,
		threadNumber: number,
		dto: ThreadDeleteDto,
		res: Response
	): Promise<void>;
}

export const ThreadRepliesView = Symbol('ThreadRepliesView');
