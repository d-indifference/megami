import { Comment } from '@prisma/client';
import { Page } from '../../toolkit/pagination/page.type';
import { DeleteDto } from '../../toolkit/delete.dto';

/**
 * DAO for Comment entity
 */
export interface ThreadRepo {
	create(thread: Comment): Promise<Comment>;

	createReply(reply: Comment, parentUuid: string): Promise<Comment>;

	update(comment: Comment): Promise<Comment>;

	findAllBySlug(slug: string, page: number): Promise<Page<Comment>>;

	findBySlugAndNumber(slug: string, numberOnBoard: bigint): Promise<Comment>;

	findReplies(slug: string, numberOnBoard: bigint): Promise<Comment[]>;

	findCommentsWithFileDeletionCandidates(
		slug: string,
		numbersOnBoard: bigint[],
		password: string
	): Promise<Comment[]>;

	findLastCommentByIp(ip: string): Promise<Comment>;

	findCommentsPostedLastHours(hours: number): Promise<Comment[]>;

	findAllByIdIn(ids: string[]): Promise<Comment[]>;

	findById(id: string): Promise<Comment>;

	getRepliesCount(id: string): Promise<number>;

	getRepliesWithFiles(id: string): Promise<number>;

	getTotalCommentsOnBoardCount(slug: string): Promise<number>;

	getTotalFilesOnBoardCount(slug: string): Promise<number>;

	count(): Promise<number>;

	getUniquePostersCountInThread(id: string): Promise<number>;

	deleteCommentByPassword(
		slug: string,
		numberOnBoard: bigint,
		password: string
	): Promise<void>;

	clearFilesByPwd(
		slug: string,
		numbersOnBoard: bigint[],
		password: string
	): Promise<void>;

	clearFilesIn(files: string[]): Promise<void>;

	deletePostsByIds(dto: DeleteDto): Promise<void>;

	deletePostsWhereParentId(id: string): Promise<void>;
}

export const ThreadRepo = Symbol('ThreadRepo');
