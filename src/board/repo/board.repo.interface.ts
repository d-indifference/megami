import { Board } from '@prisma/client';
import { DeleteDto } from '../../toolkit/delete.dto';

/**
 * DAO for Board entities
 */
export interface BoardRepo {
	findAll(): Promise<Board[]>;

	findById(id: string): Promise<Board>;

	findBySlug(slug: string): Promise<Board>;

	count(): Promise<number>;

	updateBySlug(slug: string, board: Board): Promise<Board>;

	incrementLastPost(slug: string): Promise<Board>;

	create(board: Board): Promise<Board>;

	update(board: Board, id: string): Promise<Board>;

	remove(dto: DeleteDto): Promise<void>;
}

export const BoardRepo = Symbol('BoardRepo');
