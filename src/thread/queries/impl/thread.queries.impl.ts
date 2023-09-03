import { ThreadQueries } from '../thread.queries.interface';
import { ThreadItemDto } from '../../dto/thread.item.dto';
import { Inject, NotFoundException } from '@nestjs/common';
import { ThreadRepo } from '../../repo/thread.repo.interface';
import { ThreadMapper } from '../../mappers/thread.mapper.interface';
import { Page } from '../../../toolkit/pagination/page.type';
import { ThreadOpenPostDto } from '../../dto/thread-open-post.dto';
import { ThreadReplyDto } from '../../dto/thread-reply.dto';

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
		numberOnBoard: number
	): Promise<ThreadOpenPostDto> {
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
		numberOnBoard: number
	): Promise<number> {
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
		numberOnBoard: number
	): Promise<ThreadReplyDto[]> {
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
		numberOnBoard: number
	): Promise<ThreadOpenPostDto> {
		const openingPost = await this.threadRepo.findBySlugAndNumber(
			slug,
			numberOnBoard
		);

		if (!openingPost) {
			return null;
		}

		return this.threadMapper.toOpenPostDto(openingPost);
	}
}
