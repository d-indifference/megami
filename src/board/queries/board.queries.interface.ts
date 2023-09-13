import { BoardDto } from '../dto/board.dto';
import { BoardItemDto } from '../dto/board.item.dto';

/**
 * Queries for Board entity
 */
export interface BoardQueries {
	getAll(): Promise<BoardDto[]>;

	findAllItems(): Promise<BoardItemDto[]>;

	getBySlug(slug: string): Promise<BoardDto>;

	findById(id: string): Promise<BoardItemDto>;

	count(): Promise<number>;
}

export const BoardQueries = Symbol('BoardQueries');
