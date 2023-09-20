import {
	Body,
	Controller,
	Get,
	Inject,
	Param,
	Post,
	Render,
	Res,
	Session,
	UseGuards,
	UsePipes,
	ValidationPipe
} from '@nestjs/common';
import { DiskListPageView } from '../views/disk-list-page.view.interface';
import { SessionGuard } from '../guards/session.guard';
import { SessionDto } from '../dto/session/session.dto';
import { DiskListPage } from '../types/disk-list-page.type';
import { DiskDirectoryListPage } from '../types/disk-directory-list-page.type';
import { FilesDeleteDto } from '../dto/disk/files.delete.dto';
import { Response } from 'express';

/**
 * Disk space usage controller
 */
@Controller('megami')
export class ManagementDiskController {
	constructor(
		@Inject(DiskListPageView)
		private readonly diskListPageView: DiskListPageView
	) {}

	/**
	 * Get boards directories
	 */
	@Get('disk')
	@UseGuards(SessionGuard)
	@Render('admin-disk-space-usage')
	public async index(@Session() session: SessionDto): Promise<DiskListPage> {
		return await this.diskListPageView.getDiskListView(session);
	}

	/**
	 * Get all files in board directory
	 */
	@Get('disk/:directoryPath')
	@UseGuards(SessionGuard)
	@Render('admin-disk-directory')
	public async getDirectoryFilesList(
		@Param('directoryPath') directoryPath: string,
		@Session() session: SessionDto
	): Promise<DiskDirectoryListPage> {
		return await this.diskListPageView.getBoardDirectoryView(
			session,
			directoryPath
		);
	}

	/**
	 * Delete files from disk
	 */
	@Post('disk/:slug/delete')
	@UseGuards(SessionGuard)
	@UsePipes(new ValidationPipe({ transform: true }))
	public async deleteFilesFromDisk(
		@Param('slug') slug: string,
		@Body() dto: FilesDeleteDto,
		@Res() res: Response
	): Promise<void> {
		await this.diskListPageView.clearFilesFromDisk(slug, dto, res);
	}
}
