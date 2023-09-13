import { DiskListPageView } from '../disk-list-page.view.interface';
import { DiskListPage, StatByBoard } from '../../types/disk-list-page.type';
import * as fs from 'fs/promises';
import * as path from 'path';
import { SessionDto } from '../../dto/session/session.dto';
import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { filesize } from 'filesize';
import { DiskDirectoryListPage } from 'src/management/types/disk-directory-list-page.type';
import { UploadedFile } from '../../types/uploaded-file.type';
import { FilesDeleteDto } from 'src/management/dto/disk/files.delete.dto';
import { ThreadCommands } from '../../../thread/commands/thread.commands.interface';
import * as process from 'process';
import { Response } from 'express';
import { SiteSettingsService } from '../../../site-settings/services/site-settings.service';
import { LOG } from '../../../toolkit';

/**
 * Stat by directory
 */
type DirectoryStat = {
	files: number;

	totalSize: number;
};

/**
 * Disk space usage view
 */
export class DiskListPageViewImpl implements DiskListPageView {
	constructor(
		@Inject(ConfigService)
		private readonly configService: ConfigService,
		@Inject(ThreadCommands)
		private readonly threadCommands: ThreadCommands,
		@Inject(SiteSettingsService)
		private readonly siteSettingsService: SiteSettingsService
	) {}

	/**
	 * Clear selected files from disk
	 * @param slug Board slug (directory name)
	 * @param dto Files deletion DTO
	 * @param res Express.js response
	 */
	public async clearFilesFromDisk(
		slug: string,
		dto: FilesDeleteDto,
		res: Response
	): Promise<void> {
		LOG.log(this, 'clear file from disk', dto);

		const publicDir = this.configService.get('MEGAMI_ASSETS_PUBLIC_DIR');
		const filesDir = this.configService.get('MEGAMI_FILES_DIR');

		const normalizedCandidates = this.normalizeDeleteCandidates(
			dto.filesForDelete
		);

		for (const file of normalizedCandidates) {
			const pathToFile = path.join(
				process.cwd(),
				publicDir,
				filesDir,
				file
			);

			LOG.log(this, 'unlink file', { pathToFile });

			await fs.unlink(pathToFile);

			LOG.log(this, 'file unlinked', { pathToFile });
		}

		await this.threadCommands.clearFilesIn(normalizedCandidates);

		res.redirect('/megami/disk');
	}

	/**
	 * Board directory page payload
	 * @param session Session data
	 * @param directoryPath Board directory path
	 */
	public async getBoardDirectoryView(
		session: SessionDto,
		directoryPath: string
	): Promise<DiskDirectoryListPage> {
		LOG.log(this, 'get directory path page', { directoryPath });

		const publicDir = this.configService.get('MEGAMI_ASSETS_PUBLIC_DIR');
		const filesDir = this.configService.get('MEGAMI_FILES_DIR');

		const pathToBoard = path.join(
			process.cwd(),
			publicDir,
			filesDir,
			directoryPath
		);

		const uploadedFiles = await this.getUploadedFiles(
			directoryPath,
			pathToBoard
		);

		return {
			title: await this.siteSettingsService.buildTitle(
				`Directory /${directoryPath}/`
			),
			session: session.payload,
			siteLogo: await this.siteSettingsService.getTitle(),
			pathToUploads: {
				public: publicDir,
				files: filesDir,
				boardDir: directoryPath
			},
			uploadedFiles: uploadedFiles.map(file => {
				return {
					...file,
					name: `/${filesDir}/${directoryPath}/${file.name}`
				};
			})
		};
	}

	/**
	 * Get disk space usage page payload
	 * @param session Session data
	 */
	public async getDiskListView(session: SessionDto): Promise<DiskListPage> {
		LOG.log(this, 'get disk list view', session);

		const publicDir = this.configService.get('MEGAMI_ASSETS_PUBLIC_DIR');
		const filesDir = this.configService.get('MEGAMI_FILES_DIR');

		const pathToUploads = path.join(process.cwd(), publicDir, filesDir);

		const boardDirs = await this.getBoardDirs(pathToUploads);

		const boardStats = await this.getStatByDirs(pathToUploads, boardDirs);

		const totalStat = this.getTotalStat(boardStats);

		totalStat.slug = null;
		totalStat.totalSize = filesize(totalStat.totalSizeBytes);

		return {
			title: await this.siteSettingsService.buildTitle(
				'Disk space usage'
			),
			session: session.payload,
			siteLogo: await this.siteSettingsService.getTitle(),
			pathToUploads: { public: publicDir, files: filesDir },
			boardStats,
			totalStat
		};
	}

	/**
	 * Get uploaded files by board
	 * @param boardSlug Board slug
	 * @param pathToBoard path to board directory
	 */
	private async getUploadedFiles(
		boardSlug: string,
		pathToBoard: string
	): Promise<UploadedFile[]> {
		LOG.log(this, 'get uploaded files stat', { boardSlug, pathToBoard });

		const uploadedFiles = await fs.readdir(pathToBoard);

		const result: UploadedFile[] = [];

		for (const file of uploadedFiles) {
			const stats = await fs.stat(path.join(pathToBoard, file));

			result.push({
				name: file,
				createdAt: stats.birthtime,
				size: filesize(stats.size),
				displayName: file,
				fileInDbName: `/${boardSlug}/${file}`
			});
		}

		return result;
	}

	/**
	 * Get files statistics by board dirs
	 * @param pathToUploads Path to uploads dir
	 * @param boardDirs board directories list
	 */
	private async getStatByDirs(
		pathToUploads: string,
		boardDirs: string[]
	): Promise<StatByBoard[]> {
		LOG.log(this, 'get stat by dir', { pathToUploads, boardDirs });

		const boardStats: StatByBoard[] = [];

		for (const dir of boardDirs) {
			const dirStat = await this.dirStat(path.join(pathToUploads, dir));

			boardStats.push({
				totalSizeBytes: dirStat.totalSize,
				totalSize: filesize(dirStat.totalSize),
				totalFiles: dirStat.files,
				slug: dir
			});
		}

		return boardStats;
	}

	/**
	 * Get total disk stat
	 * @param stats Statistics by every board
	 */
	private getTotalStat(stats: StatByBoard[]): StatByBoard {
		LOG.log(this, 'get total files stat', { stats });

		return stats.reduce(
			(accumulator, currentValue) => {
				return {
					totalFiles:
						accumulator.totalFiles + currentValue.totalFiles,
					totalSizeBytes:
						accumulator.totalSizeBytes + currentValue.totalSizeBytes
				};
			},
			{ totalFiles: 0, totalSizeBytes: 0 }
		);
	}

	/**
	 * Get all boards
	 * @param pathToFiles Path to /public/files dir
	 */
	private async getBoardDirs(pathToFiles: string): Promise<string[]> {
		LOG.log(this, 'get board directories', { pathToFiles });
		return await fs.readdir(pathToFiles);
	}

	/**
	 * Get statistics by directory
	 * @param pathToDir Path to directory
	 */
	private async dirStat(pathToDir: string): Promise<DirectoryStat> {
		LOG.log(this, 'get dir statistics', { pathToDir });

		const items = await fs.readdir(pathToDir);

		const result: DirectoryStat = {
			totalSize: 0,
			files: 0
		};

		for (const item of items) {
			const itemPath = path.join(pathToDir, item);
			const stats = await fs.stat(itemPath);

			result.totalSize += stats.size;
			result.files += 1;
		}

		return result;
	}

	/**
	 * Normalize delete candidates type to string array
	 * @param candidates Deletion candidate number
	 */
	private normalizeDeleteCandidates(candidates: string[] | string): string[] {
		if (!Array.isArray(candidates)) {
			return [candidates];
		}

		return candidates as string[];
	}
}
