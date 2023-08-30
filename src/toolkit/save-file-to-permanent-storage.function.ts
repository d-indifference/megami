import { FileSystemStoredFile } from 'nestjs-form-data';
import * as fsSync from 'fs';
import * as fs from 'fs/promises';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import * as process from 'process';

/**
 * Create the directory, if not exists
 * @param dir Directory name
 */
const mkDirIfNotExists = async (dir: string): Promise<void> => {
	if (!fsSync.existsSync(dir)) {
		await fs.mkdir(dir);
	}
};

/**
 * Saving file to permanent storage
 * @param configService Nest.js config service,
 * @param slug board slug
 * @param file Posted file from form
 */
export const saveFileToPermanentStorage = async (
	configService: ConfigService,
	slug: string,
	file: FileSystemStoredFile
): Promise<string> => {
	if (!file) {
		return null;
	}

	const filename = file.path.split('/').at(-1);

	const pathToVolume = path.join(
		process.cwd(),
		configService.get('MEGAMI_ASSETS_PUBLIC_DIR'),
		configService.get('MEGAMI_FILES_DIR')
	);

	await mkDirIfNotExists(pathToVolume);

	const pathToBoardDirectory = path.join(pathToVolume, slug);

	await mkDirIfNotExists(pathToBoardDirectory);

	await fs.rename(file.path, path.join(pathToBoardDirectory, filename));

	return `/${slug}/${filename}`;
};
