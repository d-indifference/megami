import { PostDeletionStrategy } from './contracts';

/**
 * Context for `PostDeletionStrategy`
 */
export class ModeratorPostDeletionContext {
	private postDeletionStrategy: PostDeletionStrategy;

	constructor(postDeletionStrategy: PostDeletionStrategy) {
		this.postDeletionStrategy = postDeletionStrategy;
	}

	/**
	 * Process posts deletions
	 * @param ip Poster's IP
	 * @param postId ID of posts which should be deleted
	 */
	public async processDeletion(ip: string, postId?: string): Promise<void> {
		await this.postDeletionStrategy.delete(ip, postId);
	}
}
