import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { Board } from '@prisma/client';
import { BoardRepo } from '../board.repo.interface';

/**
 * DAO for Board entities
 */
@Injectable()
export class BoardRepoImpl implements BoardRepo {
	constructor(private readonly prisma: PrismaService) {}

	/**
	 * Find all boards
	 */
	public async findAll(): Promise<Board[]> {
		return (await this.prisma.board.findMany({
			orderBy: { createdAt: 'asc' }
		})) as Board[];
	}

	/**
	 * Find board by slug
	 * @param slug Board slug
	 */
	public async findBySlug(slug: string): Promise<Board> | undefined {
		return (await this.prisma.board.findUnique({
			where: {
				slug
			}
		})) as Board;
	}

	/**
	 * Update board by its slug
	 * @param slug Board slug
	 * @param board New data for board
	 */
	public async updateBySlug(slug: string, board: Board): Promise<Board> {
		return (await this.prisma.board.update({
			where: { slug },
			data: { ...board }
		})) as Board;
	}

	/**
	 * Increment last post number on board
	 * @param slug Board slug
	 */
	public async incrementLastPost(slug: string): Promise<Board> {
		const board = await this.findBySlug(slug);

		return this.prisma.board.update({
			where: { slug },
			data: { lastCommentNumber: board.lastCommentNumber + 1n }
		});
	}
}
