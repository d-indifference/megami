import { ThreadRepo } from '../thread.repo.interface';
import { Comment } from '@prisma/client';
import { PrismaService } from '../../../prisma.service';
import { Inject } from '@nestjs/common';
import { Page } from '../../../toolkit/pagination/page.type';

/**
 * DAO for Comment entity
 */
export class ThreadRepoImpl implements ThreadRepo {
	private readonly THREAD_PAGE_SIZE = 10;

	constructor(
		@Inject(PrismaService)
		private readonly prisma: PrismaService
	) {}

	/**
	 * Get count of messages in thread with files
	 * @param slug Board slug
	 * @param numbersOnBoard Numbers of comments on board
	 * @param password comment password
	 */
	public async findCommentsWithFileDeletionCandidates(
		slug: string,
		numbersOnBoard: bigint[],
		password: string
	): Promise<Comment[]> {
		return (await this.prisma.comment.findMany({
			where: {
				boardSlug: slug,
				password,
				numberOnBoard: { in: numbersOnBoard },
				file: { not: null }
			}
		})) as Comment[];
	}

	/**
	 * Get thread replies
	 * @param slug Board slug
	 * @param numberOnBoard Numbers of comment on board
	 */
	public async findReplies(
		slug: string,
		numberOnBoard: number
	): Promise<Comment[]> {
		const parent = await this.findBySlugAndNumber(slug, numberOnBoard);

		return (await this.prisma.comment.findMany({
			where: {
				boardSlug: slug,
				parentId: parent.id
			},
			orderBy: { createdAt: 'asc' }
		})) as Comment[];
	}

	/**
	 * Get comment by slug and number
	 * @param slug Board slug
	 * @param numberOnBoard Numbers of comment on board
	 */
	public async findBySlugAndNumber(
		slug: string,
		numberOnBoard: number
	): Promise<Comment> {
		return (await this.prisma.comment.findFirst({
			where: {
				boardSlug: slug,
				numberOnBoard: BigInt(numberOnBoard)
			}
		})) as Comment;
	}

	/**
	 * Create a thread
	 * @param thread Thread payload
	 */
	public async create(thread: Comment): Promise<Comment> {
		return (await this.prisma.comment.create({
			data: { ...thread }
		})) as Comment;
	}

	/**
	 * Find last comment written from IP
	 * @param ip Poster's IP
	 */
	public async findLastCommentByIp(ip: string): Promise<Comment> {
		const milliseconds24h = 24 * 60 * 60 * 1000;
		const lastDayStamp = Date.now() - milliseconds24h;
		const lastDay = new Date(lastDayStamp).toISOString();

		const postsFromIp = await this.prisma.comment.findMany({
			where: { AND: [{ posterIp: ip }, { createdAt: { gte: lastDay } }] },
			orderBy: { createdAt: 'desc' }
		});

		if (postsFromIp.length > 0) {
			return postsFromIp[0];
		}

		return null;
	}

	/**
	 * Find all threads by board slug
	 * @param slug Board slug
	 * @param page Page number
	 */
	public async findAllBySlug(
		slug: string,
		page: number
	): Promise<Page<Comment>> {
		const elementCount = (await this.prisma.comment.count({
			where: { boardSlug: slug }
		})) as number;

		const total = Math.floor(elementCount / this.THREAD_PAGE_SIZE) - 1;

		const elements = (await this.prisma.comment.findMany({
			where: { boardSlug: slug, parentId: null },
			orderBy: { lastHit: 'desc' },
			take: this.THREAD_PAGE_SIZE,
			skip: this.THREAD_PAGE_SIZE * page
		})) as Comment[];

		return {
			elements,
			current: page.toString(),
			total: total.toString(),
			previous: page - 1 >= 0 ? (page - 1).toString() : null,
			next: page + 1 <= total ? (page + 1).toString() : null,
			paginatorTemplate: ''
		};
	}

	/**
	 * Get count of replies by thread ID
	 * @param id Thread UUID
	 */
	public async getRepliesCount(id: string): Promise<number> {
		return (await this.prisma.comment.count({
			where: {
				parentId: id
			}
		})) as number;
	}

	/**
	 * Get count of replies with files by thread ID
	 * @param id Thread UUID
	 */
	public async getRepliesWithFiles(id: string): Promise<number> {
		return (await this.prisma.comment.count({
			where: {
				parentId: id,
				NOT: { file: null }
			}
		})) as number;
	}

	/**
	 * Get total comments count
	 */
	public async count(): Promise<number> {
		return (await this.prisma.comment.count()) as number;
	}

	/**
	 * Create a thread reply
	 * @param reply Comment payload
	 * @param parentUuid Parent UUID
	 */
	public async createReply(
		reply: Comment,
		parentUuid: string
	): Promise<Comment> {
		return (await this.prisma.comment.create({
			data: {
				...reply,
				parentId: parentUuid
			}
		})) as Comment;
	}

	/**
	 * Update a thread
	 * @param comment Comment payload
	 */
	public async update(comment: Comment): Promise<Comment> {
		return (await this.prisma.comment.update({
			data: { ...comment },
			where: { id: comment.id }
		})) as Comment;
	}

	/**
	 * Delete comments by password
	 * @param slug Board slug
	 * @param numberOnBoard Numbers of comments on board
	 * @param password comment password
	 */
	public async deleteCommentByPassword(
		slug: string,
		numberOnBoard: bigint,
		password: string
	): Promise<void> {
		const comment = await this.prisma.comment.findFirst({
			where: {
				boardSlug: slug,
				numberOnBoard,
				password
			}
		});

		if (comment) {
			if (!comment.parentId) {
				await this.prisma.comment.deleteMany({
					where: {
						parentId: comment.id
					}
				});
			}

			await this.prisma.comment.deleteMany({
				where: {
					boardSlug: slug,
					numberOnBoard,
					password
				}
			});
		}
	}

	/**
	 * Clear files in comments by password
	 * @param slug Board slug
	 * @param numbersOnBoard Numbers of comments on board
	 * @param password comment password
	 */
	public async clearFilesByPwd(
		slug: string,
		numbersOnBoard: bigint[],
		password: string
	): Promise<void> {
		await this.prisma.comment.updateMany({
			data: {
				file: null
			},
			where: {
				boardSlug: slug,
				password,
				numberOnBoard: { in: numbersOnBoard }
			}
		});
	}

	/**
	 * Get total count of comments on board
	 * @param slug Board slug
	 */
	public async getTotalCommentsOnBoardCount(slug: string): Promise<number> {
		return (await this.prisma.comment.count({
			where: { boardSlug: slug }
		})) as number;
	}

	/**
	 * Get total count of files on board
	 * @param slug Board slug
	 */
	public async getTotalFilesOnBoardCount(slug: string): Promise<number> {
		return (await this.prisma.comment.count({
			where: {
				boardSlug: slug,
				file: { not: null }
			}
		})) as number;
	}

	/**
	 * Clear files in comments
	 * @param files File list which should be cleared
	 */
	public async clearFilesIn(files: string[]): Promise<void> {
		await this.prisma.comment.updateMany({
			where: { file: { in: files } },
			data: { file: null }
		});
	}
}
