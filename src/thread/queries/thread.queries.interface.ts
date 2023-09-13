import { ThreadItemDto } from '../dto/thread.item.dto';
import { Page } from '../../toolkit/pagination/page.type';
import { ThreadOpenPostDto } from '../dto/thread-open-post.dto';
import { ThreadReplyDto } from '../dto/thread-reply.dto';
import { Comment } from '@prisma/client';

/**
 * Queries for thread entities
 */
export interface ThreadQueries {
	findAllByBoardSlug(
		slug: string,
		page: number
	): Promise<Page<ThreadItemDto>>;

	findOpenPostBySlugAndNumber(
		slug: string,
		numberOnBoard: number
	): Promise<ThreadOpenPostDto>;

	findThreadExact(
		slug: string,
		numberOnBoard: number
	): Promise<ThreadOpenPostDto>;

	findReplies(slug: string, numberOnBoard: number): Promise<ThreadReplyDto[]>;

	getFilesCount(slug: string, numberOnBoard: number): Promise<number>;

	findLastCommentByIp(ip: string): Promise<Comment>;

	count(): Promise<number>;
}

export const ThreadQueries = Symbol('ThreadQueries');
