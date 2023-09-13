import * as os from 'os';
import { SessionPayloadDto } from '../dto/session/session-payload.dto';

/**
 * Dashboard page payload
 */
export type DashboardPage = {
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
	 * Disk space used (formatted)
	 */
	diskSpaceUsed: string;

	/**
	 * Total posts
	 */
	totalPosts: number;

	/**
	 * Total boards
	 */
	totalBoards: number;

	/**
	 * Process uptime
	 */
	uptime?: number;

	/**
	 * Node.js CPU info
	 */
	cpu?: os.CpuInfo;

	/**
	 * Memory info
	 */
	memory?: {
		/**
		 * Total space
		 */
		total?: string;

		/**
		 * Memory in usage
		 */
		inUsage?: string;

		/**
		 * Free memory
		 */
		free?: string;
	};

	/**
	 * Current app internal port
	 */
	port?: number;

	/**
	 * App host (Docker container ID)
	 */
	host?: string;

	/**
	 * Node.js lib versions from `process.versions`
	 */
	processVersions?: Record<string, string>;

	/**
	 * PostgreSQL version
	 */
	postgresVersion?: string;

	/**
	 * Prisma version
	 */
	prismaVersion?: string;

	/**
	 * `@prisma/client` version
	 */
	prismaClientVersion?: string;

	/**
	 * Dependencies table from `package.json`
	 */
	dependencies?: Array<Array<Record<string, string>>>;

	/**
	 * Dev dependencies table from `package.json`
	 */
	devDependencies?: Array<Array<Record<string, string>>>;
};
