import { ThreadCreateDto } from '../dto/thread.create.dto';
import { Comment } from '@prisma/client';
import { ThreadItemDto } from '../dto/thread.item.dto';
import { ThreadOpenPostDto } from '../dto/thread-open-post.dto';
import { ThreadReplyDto } from '../dto/thread-reply.dto';
import { ThreadModerationDto } from '../dto/thread-moderation.dto';
import { ThreadFileModerationDto } from '../dto/thread-file-moderation.dto';

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

	toModerationDto(entity: Comment): ThreadModerationDto;

	toFileModerationDto(entity: Comment): ThreadFileModerationDto;
}

export const ThreadMapper = Symbol('ThreadMapper');
