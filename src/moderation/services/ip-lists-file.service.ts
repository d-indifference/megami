import { Inject, Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as fsSync from 'fs';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';
import * as process from 'process';
import { IpLists } from '../types/ip-lists.type';
import { LOG } from '../../toolkit';

/**
 * Service for working with IP lists
 */
@Injectable()
export class IpListsFileService {
	constructor(
		@Inject(ConfigService)
		private readonly configService: ConfigService
	) {}

	private readonly ipListsFileName: string = 'ipLists';

	private readonly defaultLists: IpLists = {
		blackList: [],
		whiteList: [
			'^(([1-9]?\\d|[12]\\d\\d)\\.){3}([1-9]?\\d|[12]\\d\\d)$',
			'(^::1)'
		]
	};

	/**
	 * Create `ipLists` file if not exists
	 */
	public async createIpListsFileIfNotExists(): Promise<void> {
		const pathToBlackList = path.join(
			process.cwd(),
			this.configService.get('MEGAMI_VOLUMES_DIR'),
			this.configService.get('MEGAMI_SETTINGS_VOLUME_NAME'),
			this.ipListsFileName
		);

		if (!fsSync.existsSync(pathToBlackList)) {
			LOG.log(this, 'creating ipLists file...');

			await fs.writeFile(
				pathToBlackList,
				JSON.stringify(this.defaultLists),
				{
					flag: 'w'
				}
			);

			LOG.log(this, 'ipLists file has been created');
		}
	}

	/**
	 * Get `ipLists` file data
	 */
	public async getIpLists(): Promise<IpLists> {
		LOG.log(this, 'reading ipLists file...');

		const pathToIpLists = path.join(
			process.cwd(),
			this.configService.get('MEGAMI_VOLUMES_DIR'),
			this.configService.get('MEGAMI_SETTINGS_VOLUME_NAME'),
			this.ipListsFileName
		);

		if (!fsSync.existsSync(pathToIpLists)) {
			LOG.log(this, 'ipLists file was not found, returns default data');

			return this.defaultLists;
		}

		const serializedData = await fs.readFile(pathToIpLists);

		return JSON.parse(serializedData.toString()) as IpLists;
	}

	/**
	 * Get IP blacklist
	 */
	public async getBlackList(): Promise<string[]> {
		const lists = await this.getIpLists();

		return lists.blackList;
	}

	/**
	 * Get IP whitelist
	 */
	public async getWhiteList(): Promise<string[]> {
		const lists = await this.getIpLists();

		return lists.whiteList;
	}

	/**
	 * Set IP lists
	 * @param lists Blacklist or whitelist
	 */
	public async setIpLists(lists: {
		blackList?: string[];
		whiteList?: string[];
	}): Promise<void> {
		LOG.log(this, 'ipLists file will be updated', lists);

		const deserializedFile = await this.getIpLists();

		const filePayloadNewData: IpLists = {
			blackList: deserializedFile.blackList,
			whiteList: deserializedFile.whiteList
		};

		if (lists.blackList) {
			filePayloadNewData.blackList = lists.blackList;
		}

		if (lists.whiteList) {
			filePayloadNewData.whiteList = lists.whiteList;
		}

		const pathToBlackList = path.join(
			process.cwd(),
			this.configService.get('MEGAMI_VOLUMES_DIR'),
			this.configService.get('MEGAMI_SETTINGS_VOLUME_NAME'),
			this.ipListsFileName
		);

		await fs.writeFile(
			pathToBlackList,
			JSON.stringify(filePayloadNewData),
			{ flag: 'w' }
		);

		LOG.log(this, 'ipLists file has been updated');
	}

	/**
	 * Set IP blacklist
	 * @param blackList IP blacklist
	 */
	public async setBlackList(blackList: string[]): Promise<void> {
		await this.setIpLists({ blackList });
	}

	/**
	 * Set IP whitelist
	 * @param whiteList IP whitelist
	 */
	public async setWhiteList(whiteList: string[]): Promise<void> {
		await this.setIpLists({ whiteList });
	}
}
