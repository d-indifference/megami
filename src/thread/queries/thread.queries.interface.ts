import { ThreadItemDto } from '../dto/thread.item.dto';
import { Page } from '../../toolkit/pagination/page.type';
import { ThreadOpenPostDto } from '../dto/thread-open-post.dto';
import { ThreadReplyDto } from '../dto/thread-reply.dto';
import { Comment } from '@prisma/client';
import { ThreadModerationDto } from '../dto/thread-moderation.dto';
import { ThreadFileModerationDto } from '../dto/thread-file-moderation.dto';

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
		numberOnBoard: bigint
	): Promise<ThreadOpenPostDto>;

	findThreadExact(
		slug: string,
		numberOnBoard: bigint
	): Promise<ThreadOpenPostDto>;

	findReplies(slug: string, numberOnBoard: bigint): Promise<ThreadReplyDto[]>;

	getFilesCount(slug: string, numberOnBoard: bigint): Promise<number>;

	findLastCommentByIp(ip: string): Promise<Comment>;

	findCommentsPostedLastHours(hours: number): Promise<ThreadModerationDto[]>;

	findUploadsPostedLastHours(
		hours: number
	): Promise<ThreadFileModerationDto[]>;

	count(): Promise<number>;

	getUniquePostersCountInThread(id: string): Promise<number>;

	findAllEntitiesByIds(ids: string[]): Promise<Comment[]>;
}

export const ThreadQueries = Symbol('ThreadQueries');
