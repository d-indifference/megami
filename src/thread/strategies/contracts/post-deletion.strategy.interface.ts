/**
 * Post deletion strategy
 */
export interface PostDeletionStrategy {
	/**
	 * Delete post by ip and UUID
	 * @param ip Poster's IP
	 * @param postId post UUID
	 */
	delete(ip: string, postId?: string): Promise<void>;
}
