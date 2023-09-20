import { SessionPayloadDto } from '../../management/dto/session/session-payload.dto';
import { ThreadModerationDto } from '../../thread/dto/thread-moderation.dto';

/**
 * Recent posts page payload
 */
export type RecentPostsPage = {
	/**
	 * Page Title
	 */
	title: string;

	/**
	 * Site logo
	 */
	siteLogo: string;

	/**
	 * Session data
	 */
	session: SessionPayloadDto;

	/**
	 * Recent posts
	 */
	recentPosts: ThreadModerationDto[];
};
