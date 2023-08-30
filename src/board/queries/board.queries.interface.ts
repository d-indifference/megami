import { BoardDto } from '../dto/board.dto';

/**
 * Queries for Board entity
 */
export interface BoardQueries {
	getAll(): Promise<BoardDto[]>;

	getBySlug(slug: string): Promise<BoardDto>;
}

export const BoardQueries = Symbol('BoardQueries');
