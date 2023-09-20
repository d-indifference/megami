import {
	Body,
	Controller,
	Get,
	Inject,
	Post,
	Render,
	Res,
	Session,
	UseGuards,
	UsePipes,
	ValidationPipe
} from '@nestjs/common';
import { SessionDto } from '../../management/dto/session/session.dto';
import { SessionGuard } from '../../management/guards/session.guard';
import { IpFilterPage } from '../types/ip-filter-page.type';
import { IpFilterView } from '../views/ip-filter.view.interface';
import { IpListUpdateDto } from '../dto/ip-list.update.dto';
import { Response } from 'express';

/**
 * IP Filter controller
 */
@Controller('megami/moderation')
export class ModerationIpFilterController {
	constructor(
		@Inject(IpFilterView)
		private readonly ipFilterView: IpFilterView
	) {}

	/**
	 * Get IP filter page
	 */
	@Get('ip-filter')
	@UseGuards(SessionGuard)
	@Render('admin-ip-filter')
	public async index(@Session() session: SessionDto): Promise<IpFilterPage> {
		return await this.ipFilterView.getPage(session);
	}

	/**
	 * Update IP filter
	 */
	@Post('ip-filter')
	@UseGuards(SessionGuard)
	@UsePipes(new ValidationPipe({ transform: true }))
	public async saveChangedLists(
		@Body() dto: IpListUpdateDto,
		@Res() res: Response
	): Promise<void> {
		await this.ipFilterView.saveChangedLists(dto, res);
	}
}
