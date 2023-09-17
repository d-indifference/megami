import { LOG } from './logger-wrapper';
import * as fs from 'fs/promises';
import * as fsSync from 'fs';

export const deleteFileFullPath = async (filePath: string): Promise<void> => {
	if (fsSync.existsSync(filePath)) {
		LOG.log(this, 'delete file by moderator', { filePath });

		await fs.unlink(filePath);

		LOG.log(this, 'file deleted', { filePath });
	}
};
