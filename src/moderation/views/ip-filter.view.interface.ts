import { SessionDto } from '../../management/dto/session/session.dto';
import { IpFilterPage } from '../types/ip-filter-page.type';
import { IpListUpdateDto } from '../dto/ip-list.update.dto';
import { Response } from 'express';

/**
 * IP lists pages views
 */
export interface IpFilterView {
	getPage(session: SessionDto): Promise<IpFilterPage>;

	saveChangedLists(dto: IpListUpdateDto, res: Response): Promise<void>;
}

export const IpFilterView = Symbol('IpFilterView');
