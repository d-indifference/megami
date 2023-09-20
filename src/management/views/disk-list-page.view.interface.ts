import { DiskListPage } from '../types/disk-list-page.type';
import { SessionDto } from '../dto/session/session.dto';
import { DiskDirectoryListPage } from '../types/disk-directory-list-page.type';
import { FilesDeleteDto } from '../dto/disk/files.delete.dto';
import { Response } from 'express';

/**
 * Disk space usage view
 */
export interface DiskListPageView {
	getDiskListView(session: SessionDto): Promise<DiskListPage>;

	getBoardDirectoryView(
		session: SessionDto,
		directoryPath: string
	): Promise<DiskDirectoryListPage>;

	clearFilesFromDisk(
		slug: string,
		dto: FilesDeleteDto,
		res: Response
	): Promise<void>;
}

export const DiskListPageView = Symbol('DiskListPageView');
