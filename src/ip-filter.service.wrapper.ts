import { Inject, Injectable } from '@nestjs/common';
import { IPFILTER_TOKEN, IpFilterService } from 'nestjs-ip-filter';
import { LOG } from './toolkit';

/**
 * Wrapper for `IpFilterService`
 */
@Injectable()
export class IpFilterServiceWrapper {
	constructor(
		@Inject(IPFILTER_TOKEN)
		private readonly ipFilterService: IpFilterService
	) {}

	/**
	 * Set app's IP whitelist
	 * @param whitelist IP whitelist
	 */
	public setWhiteList(whitelist: string[]): void {
		LOG.log(this, 'update app IP whitelist', { whitelist });

		this.ipFilterService.whitelist = whitelist;
	}

	/**
	 * Set app's IP blacklist
	 * @param blacklist IP blacklist
	 */
	public setBlackList(blacklist: string[]): void {
		LOG.log(this, 'update app IP blacklist', { blacklist });

		this.ipFilterService.blacklist = blacklist;
	}
}
