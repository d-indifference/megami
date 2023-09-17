import { SessionPayloadDto } from '../dto/session/session-payload.dto';
import { UploadedFile } from './uploaded-file.type';

/**
 * Disk directory files list
 */
export type DiskDirectoryListPage = {
	/**
	 * Page title
	 */
	title: string;

	/**
	 * Site logo
	 */
	siteLogo: string;

	/**
	 * Session data
	 */
	session: SessionPayloadDto;

	/**
	 * Path to upload dir (breadcrumb)
	 */
	pathToUploads: { public: string; files: string; boardDir: string };

	/**
	 * Uploaded files list
	 */
	uploadedFiles: UploadedFile[];
};
