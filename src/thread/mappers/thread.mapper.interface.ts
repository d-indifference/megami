import { ThreadCreateDto } from '../dto/thread.create.dto';
import { Comment } from '@prisma/client';
import { ThreadItemDto } from '../dto/thread.item.dto';
import { ThreadOpenPostDto } from '../dto/thread-open-post.dto';
import { ThreadReplyDto } from '../dto/thread-reply.dto';

/**
 * Mapper for Thread entity
 */
export interface ThreadMapper {
	create(slug: string, dto: ThreadCreateDto, file: string): Comment;

	toItemDto(
		entity: Comment,
		repliesTotal: number,
		repliesWithFiles: number
	): ThreadItemDto;

	toOpenPostDto(entity: Comment): ThreadOpenPostDto;

	toReplyDto(entity: Comment): ThreadReplyDto;
}

export const ThreadMapper = Symbol('ThreadMapper');
