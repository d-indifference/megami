import { ThreadOpenPostDto } from '../dto/thread-open-post.dto';
import { ThreadReplyDto } from '../dto/thread-reply.dto';

/**
 * Payload for thread creation page
 */
export type ThreadWithRepliesPage = {
	/**
	 * Page title
	 */
	title: string;

	/**
	 * Count of files
	 */
	filesCount: number;

	/**
	 * Open Post DTO
	 */
	openPost: ThreadOpenPostDto;

	/**
	 * Thread replies
	 */
	replies: ThreadReplyDto[];
};
