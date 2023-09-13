import { DashboardPage } from '../types/dashboard-page.type';
import * as os from 'os';
import { SessionPayloadDto } from '../dto/session/session-payload.dto';
import { filesize } from 'filesize';

/**
 * Dependency table cell on dashboard page
 */
type DependencyTableCell = {
	/**
	 * NPM Package name
	 */
	package: string;

	/**
	 * Package version
	 */
	version: string;
};

/**
 * Dashboard page payload builder
 */
export class DashboardPageBuilder {
	private readonly target: DashboardPage;

	constructor(title: string) {
		this.target = {
			title,
			session: null,
			cpu: null,
			uptime: null,
			diskSpaceUsed: '',
			siteLogo: '',
			totalBoards: 0,
			totalPosts: 0
		};
	}

	public setUptime(uptime: number) {
		this.target.uptime = uptime;

		return this;
	}

	public setSession(dto: SessionPayloadDto) {
		this.target.session = dto;

		return this;
	}

	public setTotalBoards(boards: number) {
		this.target.totalBoards = boards;

		return this;
	}

	public setTotalPosts(posts: number) {
		this.target.totalPosts = posts;

		return this;
	}

	public setSiteLogo(logo: string) {
		this.target.siteLogo = logo;

		return this;
	}

	public setDiskSpaceUsed(diskSpaceUsed: string) {
		this.target.diskSpaceUsed = diskSpaceUsed;

		return this;
	}

	public setCpu(cpu: os.CpuInfo) {
		this.target.cpu = cpu;

		return this;
	}

	public setMemory(total: number, free: number) {
		this.target.memory = {
			total: filesize(total, { base: 3, standard: 'jedec' }),
			free: filesize(free, { base: 3, standard: 'jedec' }),
			inUsage: filesize(total - free, { base: 3, standard: 'jedec' })
		};

		return this;
	}

	public setPort(port: number) {
		this.target.port = port;

		return this;
	}

	public setHost(host: string) {
		this.target.host = host;

		return this;
	}

	public setProcessVersions(processVersions: Record<string, string>) {
		this.target.processVersions = processVersions;

		return this;
	}

	public setPostgresVersion(version: string) {
		this.target.postgresVersion = version;

		return this;
	}

	public setPrismaVersion(version: string) {
		this.target.prismaVersion = version;

		return this;
	}

	public setPrismaClientVersion(version: string) {
		this.target.prismaClientVersion = version;

		return this;
	}

	public setDependencies(list: Record<string, string>) {
		this.target.dependencies = this.chunkDependenciesList(list);

		return this;
	}

	public setDevDependencies(list: Record<string, string>) {
		this.target.devDependencies = this.chunkDependenciesList(list);

		return this;
	}

	public build(): DashboardPage {
		return this.target;
	}

	/**
	 * Divide list of records on chunks
	 * @param list list for divide
	 * @param by max list chunk size
	 */
	private chunkDependenciesList(
		list: Record<string, string>,
		by = 5
	): DependencyTableCell[][] {
		const preparedArray: DependencyTableCell[] = [];

		for (const key in list) {
			if (list.hasOwnProperty(key)) {
				preparedArray.push({
					package: key,
					version: list[key]
				});
			}
		}

		const resultArray: DependencyTableCell[][] = [];

		for (let i = 0; i < preparedArray.length; i += by) {
			resultArray.push(preparedArray.slice(i, i + by));
		}

		return resultArray;
	}
}
