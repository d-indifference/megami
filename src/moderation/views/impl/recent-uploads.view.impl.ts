import { RecentUploadsView } from '../recent-uploads.view.interface';
import { RecentUploadsPage } from '../../types/recent-uploads-page.type';
import { Inject } from '@nestjs/common';
import { SiteSettingsService } from '../../../site-settings/services/site-settings.service';
import { SessionDto } from '../../../management/dto/session/session.dto';
import { ThreadQueries } from '../../../thread/queries/thread.queries.interface';
import { DeleteDto } from '../../../toolkit/delete.dto';
import e from 'express';
import { ThreadCommands } from '../../../thread/commands/thread.commands.interface';
import { ConfigService } from '@nestjs/config';
import { LOG } from '../../../toolkit';
import * as path from 'path';
import * as fs from 'fs/promises';

export class RecentUploadsViewImpl implements RecentUploadsView {
	constructor(
		@Inject(SiteSettingsService)
		private readonly siteSettingsService: SiteSettingsService,
		@Inject(ThreadQueries)
		private readonly threadQueries: ThreadQueries,
		@Inject(ThreadCommands)
		private readonly threadCommands: ThreadCommands,
		@Inject(ConfigService)
		private readonly configService: ConfigService
	) {}

	/**
	 * Get recent uploads page
	 * @param session Session DTO
	 */
	public async getPage(session: SessionDto): Promise<RecentUploadsPage> {
		LOG.log(this, 'get recent uploads page', session.payload);

		const recentUploads =
			await this.threadQueries.findUploadsPostedLastHours(24);

		return {
			title: await this.siteSettingsService.buildTitle('Recent uploads'),
			siteLogo: await this.siteSettingsService.getTitle(),
			session: session.payload,
			recentUploads
		};
	}

	/**
	 * Delete uploaded files from moderator interface
	 * @param dto Deletion DTO
	 * @param res Express.js response
	 */
	public async deleteUploads(dto: DeleteDto, res: e.Response): Promise<void> {
		LOG.log(this, 'delete files from moderation interface', dto);

		const deleteCandidates = await this.threadQueries.findAllEntitiesByIds(
			dto.ids
		);

		const deleteCandidatesFiles = deleteCandidates.map(
			entity => entity.file
		);

		await this.threadCommands.clearFilesIn(deleteCandidatesFiles);

		await this.deleteFileFromDisk(deleteCandidatesFiles);

		res.redirect('/megami/moderation/recent-uploads');
	}

	/**
	 * Delete files form disk
	 * @param files Path to files with board slug
	 */
	private async deleteFileFromDisk(files: string[]): Promise<void> {
		for (const file of files) {
			LOG.log(this, 'unlink file', { file });

			const pathToFile = path.join(
				process.cwd(),
				this.configService.get('MEGAMI_ASSETS_PUBLIC_DIR'),
				this.configService.get('MEGAMI_FILES_DIR'),
				file
			);

			await fs.unlink(pathToFile);

			LOG.log(this, 'unlinked file', { file });
		}
	}
}
