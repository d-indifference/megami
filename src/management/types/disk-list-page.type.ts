import { SessionPayloadDto } from '../dto/session/session-payload.dto';

/**
 * Disk stats by board
 */
export type StatByBoard = {
	/**
	 * Board slug
	 */
	slug?: string;

	/**
	 * Total file count
	 */
	totalFiles: number;

	/**
	 * Total files size
	 */
	totalSizeBytes: number;

	/**
	 * Total files size (formatted)
	 */
	totalSize?: string;
};

/**
 * Disk space usage page payload
 */
export type DiskListPage = {
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
	 * Path to uploads directory (breadcrumbs)
	 */
	pathToUploads: {
		/**
		 * `public` directory name
		 */
		public: string;

		/**
		 * `public/files` directory name
		 */
		files: string;
	};

	/**
	 * Disk stats by every board
	 */
	boardStats: Array<StatByBoard>;

	/**
	 * Total disk stat
	 */
	totalStat: StatByBoard;
};
