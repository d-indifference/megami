import { ThreadOpenPostDto } from '../dto/thread-open-post.dto';
import { ThreadReplyDto } from '../dto/thread-reply.dto';
import { SessionPayloadDto } from '../../management/dto/session/session-payload.dto';

/**
 * Payload for thread creation page
 */
export type ThreadWithRepliesPage = {
	/**
	 * Page title
	 */
	title: string;

	/**
	 * Site logo
	 */
	siteLogo: string;

	/**
	 * Session Data
	 */
	session: SessionPayloadDto;

	/**
	 * Count of files
	 */
	filesCount: number;

	/**
	 * Count of posters
	 */
	postersCount: number;

	/**
	 * Open Post DTO
	 */
	openPost: ThreadOpenPostDto;

	/**
	 * Board bottom links
	 */
	boardBottomLinks: string;

	/**
	 * Thread replies
	 */
	replies: ThreadReplyDto[];
};
