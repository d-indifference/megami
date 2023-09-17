import { SessionDto } from '../../management/dto/session/session.dto';
import { RecentPostsPage } from '../types/recent-posts-page.type';
import { DeleteDto } from '../../toolkit/delete.dto';
import { Response } from 'express';

/**
 * Recent posts pages view
 */
export interface RecentPostsView {
	getPage(session: SessionDto): Promise<RecentPostsPage>;

	deletePosts(dto: DeleteDto, res: Response): Promise<void>;
}

export const RecentPostsView = Symbol('RecentPostsView');
