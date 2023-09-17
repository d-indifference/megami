import { PostDeletionStrategy } from '../contracts';
import { LOG } from '../../../toolkit';

/**
 * Skip posts deletion strategy
 */
export class SkipDeletionStrategy implements PostDeletionStrategy {
	/**
	 * Delete post by ip and UUID
	 * @param ip Poster's IP
	 * @param postId post UUID
	 */
	public delete(ip: string, postId?: string): Promise<void> {
		LOG.log(this, `no post will be deleted, only ip=${ip} will be banned`);

		return Promise.resolve(undefined);
	}
}
