import { RecentUploadsPage } from '../types/recent-uploads-page.type';
import { SessionDto } from '../../management/dto/session/session.dto';
import { DeleteDto } from '../../toolkit/delete.dto';
import { Response } from 'express';

export interface RecentUploadsView {
	getPage(session: SessionDto): Promise<RecentUploadsPage>;

	deleteUploads(dto: DeleteDto, res: Response): Promise<void>;
}

export const RecentUploadsView = Symbol('RecentUploadsView');
