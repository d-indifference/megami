import { ConfigService } from '@nestjs/config';
import { FileSystemStoredFile } from 'nestjs-form-data';
import * as path from 'path';
import * as process from 'process';

/**
 * Config for NestjsFormDataModule
 * @param configService ConfigService
 */
export const nestjsFormDataConfig = (configService: ConfigService) => ({
	storage: FileSystemStoredFile,
	fileSystemStoragePath: path.join(
		process.cwd(),
		configService.get('MEGAMI_ASSETS_PUBLIC_DIR'),
		configService.get('MEGAMI_ASSETS_VIEWS_DIR'),
		configService.get('MEGAMI_FILES_DIR')
	)
});
