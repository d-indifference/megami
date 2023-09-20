import { ThreadWithRepliesPage } from '../types/thread-with-replies-page.type';
import { Response } from 'express';
import { ThreadReplyCreateDto } from '../dto/thread-reply.create.dto';
import { ThreadDeleteDto } from '../dto/thread.delete.dto';
import { SessionDto } from '../../management/dto/session/session.dto';

/**
 * View for thread replies
 */
export interface ThreadRepliesView {
	getThreadRepliesPage(
		slug: string,
		numberOnBoard: bigint,
		session: SessionDto
	): Promise<ThreadWithRepliesPage>;

	createReply(
		slug: string,
		threadNumber: bigint,
		dto: ThreadReplyCreateDto,
		ip: string,
		res: Response
	): Promise<void>;

	deleteCommentsByPwd(
		slug: string,
		threadNumber: bigint,
		dto: ThreadDeleteDto,
		res: Response
	): Promise<void>;
}

export const ThreadRepliesView = Symbol('ThreadRepliesView');
