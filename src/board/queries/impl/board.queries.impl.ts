import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { BoardRepo } from '../../repo/board.repo.interface';
import { BoardMapper } from '../../mappers/board.mapper.interface';
import { BoardQueries } from '../board.queries.interface';
import { BoardDto } from '../../dto/board.dto';
import { BoardItemDto } from '../../dto/board.item.dto';
import { ConfigService } from '@nestjs/config';
import { ThreadRepo } from '../../../thread/repo/thread.repo.interface';
import { LOG } from '../../../toolkit';

/**
 * Queries for Board entity
 */
@Injectable()
export class BoardQueriesImpl implements BoardQueries {
	constructor(
		@Inject(ConfigService)
		private readonly configService: ConfigService,
		@Inject(BoardRepo)
		private readonly repo: BoardRepo,
		@Inject(BoardMapper)
		private readonly mapper: BoardMapper,
		@Inject(ThreadRepo)
		private readonly threadRepo: ThreadRepo
	) {}

	/**
	 * Find all boards
	 */
	public async getAll(): Promise<BoardDto[]> {
		LOG.log(this, 'get all boards');

		return (await this.repo.findAll()).map(entity =>
			this.mapper.toDto(entity)
		);
	}

	/**
	 * Get board by slug. If it was not found, throws 404
	 * @param slug Board slug
	 */
	public async getBySlug(slug: string): Promise<BoardDto> {
		// TODO: add typescript-optional package

		LOG.log(this, 'get board', { slug });

		const board = await this.repo.findBySlug(slug);

		if (!board) {
			LOG.log(this, '[404] board was not found', { slug });
			throw new NotFoundException('Not found');
		}

		return this.mapper.toDto(board);
	}

	/**
	 * Get all boards as item dto
	 */
	public async findAllItems(): Promise<BoardItemDto[]> {
		LOG.log(this, 'get all boards as item DTO');
		const boards = await this.repo.findAll();

		const mappedBoards: BoardItemDto[] = [];

		for (const board of boards) {
			const mappedBoard = this.mapper.toItemDto(board);

			mappedBoard.commentsCount =
				await this.threadRepo.getTotalCommentsOnBoardCount(
					mappedBoard.slug
				);

			mappedBoard.filesCount =
				await this.threadRepo.getTotalFilesOnBoardCount(
					mappedBoard.slug
				);

			mappedBoards.push(mappedBoard);
		}

		return mappedBoards;
	}

	/**
	 * Find board by its UUID
	 * @param id board UUID
	 */
	public async findById(id: string): Promise<BoardItemDto> {
		LOG.log(this, 'get board by UUID', { id });
		return this.mapper.toItemDto(await this.repo.findById(id));
	}

	/**
	 * Get board count
	 */
	public async count(): Promise<number> {
		LOG.log(this, 'get boards count');
		return await this.repo.count();
	}
}
