import { FileSystemStoredFile } from 'nestjs-form-data';
import * as fsSync from 'fs';
import * as fs from 'fs/promises';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import * as process from 'process';
import { move } from 'fs-extra';
import { Logger } from '@nestjs/common';

/**
 * Create the directory, if not exists
 * @param dir Directory name
 */
const mkDirIfNotExists = async (dir: string): Promise<void> => {
	if (!fsSync.existsSync(dir)) {
		Logger.log(
			`directory ${dir} is not exist and will be created`,
			'saveFileToPermanentStorage'
		);

		await fs.mkdir(dir);

		Logger.log(
			`directory ${dir} has been created`,
			'saveFileToPermanentStorage'
		);
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

	const targetPath = path.join(pathToBoardDirectory, filename);

	Logger.log(
		`save file to permanent store, file=${filename}, targetPath=${targetPath}`,
		'saveFileToPermanentStorage'
	);

	await move(file.path, path.join(pathToBoardDirectory, filename));

	const newFileName = `/${slug}/${filename}`;

	Logger.log(
		`file saved, newPath=${newFileName}`,
		'saveFileToPermanentStorage'
	);

	return newFileName;
};
