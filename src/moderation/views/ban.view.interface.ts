import { SessionDto } from '../../management/dto/session/session.dto';
import { BanFormPage } from '../types/ban-form-page.type';
import { BanFormDto } from '../dto/ban.form.dto';
import { Response } from 'express';
import { BanListPage } from '../types/ban-list-page.type';

/**
 * Ban view pages
 */
export interface BanView {
	getPage(
		ip: string,
		postId: string,
		session: SessionDto
	): Promise<BanFormPage>;

	getListPage(session: SessionDto): Promise<BanListPage>;

	createBan(
		dto: BanFormDto,
		session: SessionDto,
		res: Response
	): Promise<void>;

	removeBan(id: string, res: Response): Promise<void>;
}

export const BanView = Symbol('BanView');
