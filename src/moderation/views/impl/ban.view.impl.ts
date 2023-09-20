import { BanView } from '../ban.view.interface';
import { SessionDto } from '../../../management/dto/session/session.dto';
import { BanFormPage } from '../../types/ban-form-page.type';
import { Inject } from '@nestjs/common';
import { SiteSettingsService } from '../../../site-settings/services/site-settings.service';
import { BanFormDto } from '../../dto/ban.form.dto';
import { Response } from 'express';
import { LOG } from '../../../toolkit';
import { BanMapper } from '../../mappers/ban.mapper.interface';
import { UserQueries } from '../../../management/queries/user.queries.interface';
import { BanCommands } from '../../commands/ban.commands.interface';
import { ModeratorPostDeletionContextProcessor } from '../../../thread/strategies';
import { BanListPage } from '../../types/ban-list-page.type';
import { BanQueries } from '../../queries/ban.queries.interface';
import { DeleteDto } from '../../../toolkit/delete.dto';
import { ThreadCommands } from '../../../thread/commands/thread.commands.interface';

/**
 * Ban view pages
 */
export class BanViewImpl implements BanView {
	constructor(
		@Inject(SiteSettingsService)
		private readonly siteSettingsService: SiteSettingsService,
		@Inject(BanMapper)
		private readonly banMapper: BanMapper,
		@Inject(BanCommands)
		private readonly banCommands: BanCommands,
		@Inject(BanQueries)
		private readonly banQueries: BanQueries,
		@Inject(UserQueries)
		private readonly userQueries: UserQueries,
		@Inject(ModeratorPostDeletionContextProcessor)
		private readonly moderatorPostDeletionContextProcessor: ModeratorPostDeletionContextProcessor,
		@Inject(ThreadCommands)
		private readonly threadCommands: ThreadCommands
	) {}

	/**
	 * Get ban form page
	 * @param ip Poster's IP
	 * @param postId Post's ID
	 * @param session Session data
	 */
	public async getPage(
		ip: string,
		postId: string,
		session: SessionDto
	): Promise<BanFormPage> {
		LOG.log(this, 'get new ban form', { email: session.payload.email });

		const banTill = this.getDateAfterDays(7);

		const formattedBanTill = `${banTill.getFullYear()}-${this.formatMonth(
			banTill.getMonth() + 1
		)}-${banTill.getDate()}`;

		return {
			title: await this.siteSettingsService.buildTitle('Create new ban'),
			siteLogo: await this.siteSettingsService.getTitle(),
			session: session.payload,
			ip,
			postId,
			banTill: formattedBanTill
		};
	}

	/**
	 * Get ban list page
	 * @param session Session data
	 */
	public async getListPage(session: SessionDto): Promise<BanListPage> {
		LOG.log(this, 'get ban list page', { email: session.payload.email });

		return {
			title: await this.siteSettingsService.buildTitle('Bans'),
			siteLogo: await this.siteSettingsService.getTitle(),
			session: session.payload,
			bans: await this.banQueries.findAllActive()
		};
	}

	/**
	 * Create new ban
	 * @param dto Ban form data DTo
	 * @param session Session data
	 * @param res Express.js response data
	 */
	public async createBan(
		dto: BanFormDto,
		session: SessionDto,
		res: Response
	): Promise<void> {
		LOG.log(this, 'create new ban', dto);

		const createDto = this.banMapper.toCreateDto(dto);
		createDto.adminId = (
			await this.userQueries.findEntityByEmail(session.payload.email)
		).id;

		const newBan = await this.banCommands.create(createDto);

		if (newBan.id) {
			this.moderatorPostDeletionContextProcessor.setDeleteOption(
				dto.deleteOption
			);

			await this.moderatorPostDeletionContextProcessor.processDeletion(
				dto.ip,
				dto.postId
			);
		}

		res.redirect('/megami/moderation/bans');
	}

	/**
	 * Remove ban
	 * @param id Ban ID
	 * @param res Express.js response
	 */
	public async removeBan(id: string, res: Response): Promise<void> {
		LOG.log(this, 'remove ban', { id });

		const dto = new DeleteDto();
		dto.ids = [id];

		await this.banCommands.remove(dto);

		res.redirect('/megami/moderation/bans');
	}

	/**
	 * Remove post
	 * @param id Comment UUID
	 * @param res Express.js response
	 */
	public async removePost(id: string, res: Response): Promise<void> {
		LOG.log(this, 'remove post', { id });

		const dto = new DeleteDto();
		dto.ids = [id];

		await this.threadCommands.deleteCommentsByIds(dto);

		LOG.log(this, 'post removed', { id });

		res.redirect('/megami/moderation/recent-posts');
	}

	/**
	 * Get date after N days
	 * @param days Count of days
	 */
	private getDateAfterDays(days: number): Date {
		const now = new Date();

		const result = now;

		result.setDate(now.getDate() + days);

		return result;
	}

	/**
	 * Format month digit value
	 * @param month Month value
	 */
	private formatMonth(month: number): string {
		if (month < 10) {
			return `0${month}`;
		}

		return `${month}`;
	}
}
