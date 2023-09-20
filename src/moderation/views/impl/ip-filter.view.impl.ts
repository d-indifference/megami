import { IpFilterView } from '../ip-filter.view.interface';
import { SessionDto } from '../../../management/dto/session/session.dto';
import { IpFilterPage } from '../../types/ip-filter-page.type';
import { Inject } from '@nestjs/common';
import { SiteSettingsService } from '../../../site-settings/services/site-settings.service';
import { IpListsFileService } from '../../services/ip-lists-file.service';
import { IpListUpdateDto } from '../../dto/ip-list.update.dto';
import e from 'express';
import { IpFilterServiceWrapper } from '../../../ip-filter.service.wrapper';
import { LOG } from '../../../toolkit';

/**
 * IP lists pages views
 */
export class IpFilterViewImpl implements IpFilterView {
	constructor(
		@Inject(SiteSettingsService)
		private readonly siteSettingsService: SiteSettingsService,
		@Inject(IpListsFileService)
		private readonly ipListsFileService: IpListsFileService,
		@Inject(IpFilterServiceWrapper)
		private readonly ipFilterService: IpFilterServiceWrapper
	) {}

	/**
	 * Get IP lists page
	 * @param session Session data
	 */
	public async getPage(session: SessionDto): Promise<IpFilterPage> {
		LOG.log(this, 'get ip filter page', { payload: session.payload });

		const ipLists = await this.ipListsFileService.getIpLists();

		return {
			title: await this.siteSettingsService.buildTitle(
				'IP addresses filter'
			),
			siteLogo: await this.siteSettingsService.getTitle(),
			session: session.payload,
			ipLists
		};
	}

	/**
	 * Save changed `ipLists` file
	 * @param dto update DTO
	 * @param res Express.js response
	 */
	public async saveChangedLists(
		dto: IpListUpdateDto,
		res: e.Response
	): Promise<void> {
		LOG.log(this, 'save ip lists', dto);

		await this.ipListsFileService.getIpLists();

		const blackList = this.mapDtoFieldToArray(dto.blackList);
		const whiteList = this.mapDtoFieldToArray(dto.whiteList);

		this.ipFilterService.setBlackList(blackList);
		this.ipFilterService.setWhiteList(whiteList);

		await this.ipListsFileService.setIpLists({
			blackList,
			whiteList
		});

		res.redirect('/megami/moderation/ip-filter');
	}

	/**
	 * Map string with `\r\n` symbols to string array
	 * @param dtoField field of DTO
	 */
	private mapDtoFieldToArray(dtoField: string): string[] {
		return dtoField
			.trim()
			.split('\r\n')
			.filter(val => val !== '');
	}
}
