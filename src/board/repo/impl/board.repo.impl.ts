import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { Board } from '@prisma/client';
import { BoardRepo } from '../board.repo.interface';
import { DeleteDto } from '../../../toolkit/delete.dto';

/**
 * DAO for Board entities
 */
@Injectable()
export class BoardRepoImpl implements BoardRepo {
	constructor(private readonly prisma: PrismaService) {}

	/**
	 * Find board by ID
	 * @param id board UUID
	 */
	public async findById(id: string): Promise<Board> {
		return (await this.prisma.board.findUnique({
			where: {
				id
			}
		})) as Board;
	}

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
	 * Get Board count
	 */
	public async count(): Promise<number> {
		return (await this.prisma.board.count()) as number;
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

	/**
	 * Create a board
	 * @param board new board data
	 */
	public async create(board: Board): Promise<Board> {
		return (await this.prisma.board.create({
			data: {
				slug: board.slug,
				name: board.name
			}
		})) as Board;
	}

	/**
	 * Remove a board with its comments
	 * @param dto deletion DTO
	 */
	public async remove(dto: DeleteDto): Promise<void> {
		const removeCandidates = await this.prisma.board.findMany({
			where: { id: { in: dto.ids } }
		});

		const slugs = removeCandidates.map(candidate => candidate.slug);

		await this.prisma.comment.deleteMany({
			where: { boardSlug: { in: slugs } }
		});

		await this.prisma.board.deleteMany({ where: { id: { in: dto.ids } } });
	}

	/**
	 * Update a board
	 * @param board new board data
	 * @param id Board ID
	 */
	public async update(board: Board, id: string): Promise<Board> {
		return (await this.prisma.board.update({
			where: { id },
			data: {
				name: board.name
			}
		})) as Board;
	}
}
