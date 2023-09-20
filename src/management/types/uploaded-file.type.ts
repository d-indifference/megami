/**
 * Uploaded file in files list type
 */
export type UploadedFile = {
	/**
	 * Filename
	 */
	name: string;

	/**
	 * Displayed filename
	 */
	displayName: string;

	/**
	 * Filename in DB
	 */
	fileInDbName: string;

	/**
	 * File size (formatted)
	 */
	size: string;

	/**
	 * Upload date
	 */
	createdAt: Date | string;
};
