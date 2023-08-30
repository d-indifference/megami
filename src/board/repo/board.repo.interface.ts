import { Board } from '@prisma/client';

/**
 * DAO for Board entities
 */
export interface BoardRepo {
	findAll(): Promise<Board[]>;

	findBySlug(slug: string): Promise<Board>;

	updateBySlug(slug: string, board: Board): Promise<Board>;

	incrementLastPost(slug: string): Promise<Board>;
}

export const BoardRepo = Symbol('BoardRepo');
