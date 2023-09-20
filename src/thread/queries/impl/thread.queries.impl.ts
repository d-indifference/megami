import { ThreadQueries } from '../thread.queries.interface';
import { ThreadItemDto } from '../../dto/thread.item.dto';
import { Inject, NotFoundException } from '@nestjs/common';
import { ThreadRepo } from '../../repo/thread.repo.interface';
import { ThreadMapper } from '../../mappers/thread.mapper.interface';
import { Page } from '../../../toolkit/pagination/page.type';
import { ThreadOpenPostDto } from '../../dto/thread-open-post.dto';
import { ThreadReplyDto } from '../../dto/thread-reply.dto';
import { Comment } from '@prisma/client';
import { LOG } from '../../../toolkit';
import { ThreadModerationDto } from '../../dto/thread-moderation.dto';
import { ThreadFileModerationDto } from '../../dto/thread-file-moderation.dto';

/**
 * Queries for thread entities
 */
export class ThreadQueriesImpl implements ThreadQueries {
	constructor(
		@Inject(ThreadRepo)
		private readonly threadRepo: ThreadRepo,
		@Inject(ThreadMapper)
		private readonly threadMapper: ThreadMapper
	) {}

	/**
	 * Find all threads by board slug
	 * @param slug Board slug
	 * @param page Page number
	 */
	public async findAllByBoardSlug(
		slug: string,
		page: number
	): Promise<Page<ThreadItemDto>> {
		LOG.log(this, 'get all threads', { slug, page });

		const threadEntities = await this.threadRepo.findAllBySlug(slug, page);

		const threads: ThreadItemDto[] = [];

		for (const thread of threadEntities.elements) {
			const threadDto = this.threadMapper.toItemDto(
				thread,
				await this.threadRepo.getRepliesCount(thread.id),
				await this.threadRepo.getRepliesWithFiles(thread.id)
			);

			threads.push(threadDto);
		}

		return { ...threadEntities, elements: threads };
	}

	/**
	 * Find thread open post
	 * @param slug Board slug
	 * @param numberOnBoard Number on board
	 */
	public async findOpenPostBySlugAndNumber(
		slug: string,
		numberOnBoard: bigint
	): Promise<ThreadOpenPostDto> {
		LOG.log(this, 'get thread by slug and number', { slug, numberOnBoard });

		const openingPost = await this.threadRepo.findBySlugAndNumber(
			slug,
			numberOnBoard
		);

		if (!openingPost) {
			throw new NotFoundException();
		}

		if (openingPost.parentId !== null) {
			throw new NotFoundException();
		}

		return this.threadMapper.toOpenPostDto(openingPost);
	}

	/**
	 * Get count of messages in thread with files
	 * @param slug Board slug
	 * @param numberOnBoard Number on board
	 */
	public async getFilesCount(
		slug: string,
		numberOnBoard: bigint
	): Promise<number> {
		LOG.log(this, 'get files count', { slug, numberOnBoard });

		const thread = await this.threadRepo.findBySlugAndNumber(
			slug,
			numberOnBoard
		);

		return await this.threadRepo.getRepliesWithFiles(thread.id);
	}

	/**
	 * Get thread replies
	 * @param slug Board slug
	 * @param numberOnBoard Number on board
	 */
	public async findReplies(
		slug: string,
		numberOnBoard: bigint
	): Promise<ThreadReplyDto[]> {
		LOG.log(this, 'get thread replies', { slug, numberOnBoard });

		return (await this.threadRepo.findReplies(slug, numberOnBoard)).map(
			entity => this.threadMapper.toReplyDto(entity)
		);
	}

	/**
	 * Get thread without 404 error
	 * @param slug Board slug
	 * @param numberOnBoard Number on board
	 */
	public async findThreadExact(
		slug: string,
		numberOnBoard: bigint
	): Promise<ThreadOpenPostDto> {
		LOG.log(this, 'get opening post exactly', { slug, numberOnBoard });

		const openingPost = await this.threadRepo.findBySlugAndNumber(
			slug,
			numberOnBoard
		);

		if (!openingPost) {
			return null;
		}

		return this.threadMapper.toOpenPostDto(openingPost);
	}

	/**
	 * Find last comment written from IP
	 * @param ip Poster's IP
	 */
	public async findLastCommentByIp(ip: string): Promise<Comment> {
		LOG.log(this, 'find last comment by IP', { ip });

		return await this.threadRepo.findLastCommentByIp(ip);
	}

	/**
	 * Get total comments count
	 */
	public async count(): Promise<number> {
		LOG.log(this, 'get total comments count');
		return await this.threadRepo.count();
	}

	/**
	 * Find all comments created in the last N hours
	 * @param hours Count of hours
	 */
	public async findCommentsPostedLastHours(
		hours: number
	): Promise<ThreadModerationDto[]> {
		LOG.log(this, 'get comments created last N hours', {
			hours
		});

		const entities = await this.threadRepo.findCommentsPostedLastHours(
			hours
		);

		return entities.map(entity =>
			this.threadMapper.toModerationDto(entity)
		);
	}

	/**
	 * Find all uploads created in the last N hours
	 * @param hours Count of hours
	 */
	public async findUploadsPostedLastHours(
		hours: number
	): Promise<ThreadFileModerationDto[]> {
		LOG.log(this, 'get uploads created last N hours', {
			hours
		});

		const entities = (
			await this.threadRepo.findCommentsPostedLastHours(hours)
		).filter(entity => entity.file !== null);

		return entities.map(entity =>
			this.threadMapper.toFileModerationDto(entity)
		);
	}

	/**
	 * Get count of unique posters in thread
	 * @param id Count of hours
	 */
	public async getUniquePostersCountInThread(id: string): Promise<number> {
		LOG.log(this, 'get count of unique posters in thread', {
			id
		});

		return await this.threadRepo.getUniquePostersCountInThread(id);
	}

	/**
	 * Get all posts by its UUIDs
	 * @param ids Posts UUIDs
	 */
	public async findAllEntitiesByIds(ids: string[]): Promise<Comment[]> {
		LOG.log(this, 'get all posts by its uuids', {
			ids
		});

		return (await this.threadRepo.findAllByIdIn(ids)) as Comment[];
	}
}
