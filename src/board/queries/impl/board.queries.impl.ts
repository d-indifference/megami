import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { BoardRepo } from '../../repo/board.repo.interface';
import { BoardMapper } from '../../mappers/board.mapper.interface';
import { BoardQueries } from '../board.queries.interface';
import { BoardDto } from '../../dto/board.dto';

/**
 * Queries for Board entity
 */
@Injectable()
export class BoardQueriesImpl implements BoardQueries {
	constructor(
		@Inject(BoardRepo)
		private readonly repo: BoardRepo,
		@Inject(BoardMapper)
		private readonly mapper: BoardMapper
	) {}

	/**
	 * Find all boards
	 */
	public async getAll(): Promise<BoardDto[]> {
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

		const board = await this.repo.findBySlug(slug);

		if (!board) {
			throw new NotFoundException('Not found');
		}

		return this.mapper.toDto(board);
	}
}
