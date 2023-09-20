import { BoardCommands } from '../board.commands.interface';
import { BoardDto } from '../../dto/board.dto';
import { CreationResultDto } from '../../../toolkit/creation-result.dto';
import { DeleteDto } from '../../../toolkit/delete.dto';
import { BoardRepo } from '../../repo/board.repo.interface';
import { Inject, MethodNotAllowedException } from '@nestjs/common';
import { BoardMapper } from '../../mappers/board.mapper.interface';
import * as fs from 'fs/promises';
import * as fsSync from 'fs';
import * as path from 'path';
import { Board } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import * as process from 'process';
import { LOG } from '../../../toolkit';
import { BoardUpdateDto } from '../../dto/board.update.dto';

/**
 * Commands for Board entity
 */
export class BoardCommandsImpl implements BoardCommands {
	constructor(
		@Inject(ConfigService)
		private readonly configService: ConfigService,
		@Inject(BoardRepo)
		private readonly boardRepo: BoardRepo,
		@Inject(BoardMapper)
		private readonly boardMapper: BoardMapper
	) {}

	/**
	 * Create a board
	 * @param dto Creation DTO
	 */
	public async create(dto: BoardDto): Promise<CreationResultDto<string>> {
		LOG.log(this, 'create board', dto);

		await this.applyUniquenessPolicy(dto);

		const board = this.boardMapper.toEntity(dto);

		const newBoard = await this.boardRepo.create(board);

		const creationResult = new CreationResultDto<string>(newBoard.id);

		LOG.logCreation(this, 'created board', creationResult);

		return creationResult;
	}

	/**
	 * Remove boards with comments and files
	 * @param dto Deletion DTO
	 */
	public async remove(dto: DeleteDto): Promise<void> {
		LOG.log(this, 'removing boards', dto);

		const boards: Board[] = [];

		for (const id of dto.ids) {
			boards.push(await this.boardRepo.findById(id));
		}

		await this.boardRepo.remove(dto);

		LOG.log(this, 'boards removed');

		await this.removeBoardDirectories(boards);
	}

	/**
	 * Update a board
	 * @param dto Update DTO
	 * @param id Board ID
	 */
	public async update(
		dto: BoardUpdateDto,
		id: string
	): Promise<CreationResultDto<string>> {
		LOG.log(this, `update board, id: ${id}`, dto);

		const board = this.boardMapper.update(dto);

		const newBoard = await this.boardRepo.update(board, id);

		const result = new CreationResultDto<string>(newBoard.id);

		LOG.logCreation(this, 'board updated', result);

		return result;
	}

	/**
	 * Apply policy of uniqueness. Slug should be unique
	 * @param dto Update DTO
	 */
	private async applyUniquenessPolicy(dto: BoardDto): Promise<void> {
		const existingBoard = await this.boardRepo.findBySlug(dto.slug);

		if (existingBoard) {
			LOG.log(
				this,
				'board creation rejected, uniqueness policy applied',
				dto
			);

			throw new MethodNotAllowedException('Board is already exists');
		}
	}

	/**
	 * Delete all uploaded files on deleted boards
	 * @param boards Deleted boards
	 */
	private async removeBoardDirectories(boards: Board[]): Promise<void> {
		const slugs = boards.map(board => board.slug);

		for (const slug of slugs) {
			const filesDirectory = path.join(
				process.cwd(),
				this.configService.get<string>('MEGAMI_ASSETS_PUBLIC_DIR'),
				this.configService.get<string>('MEGAMI_FILES_DIR'),
				slug
			);

			LOG.log(this, `removing of directory: ${filesDirectory}...`);

			const filesForRemove = await fs.readdir(filesDirectory);

			for (const file of filesForRemove) {
				const removingFilePath = path.join(filesDirectory, file);

				LOG.log(this, `remove file: ${removingFilePath}...`);

				await fs.unlink(removingFilePath);

				LOG.log(this, `file removed: ${removingFilePath}...`);
			}

			if (fsSync.existsSync(filesDirectory)) {
				await fs.rmdir(filesDirectory);

				LOG.log(this, `directory removed: ${filesDirectory}`);
			}
		}
	}
}
