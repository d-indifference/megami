import { ThreadCommands } from '../thread.commands.interface';
import { ThreadCreateDto } from '../../dto/thread.create.dto';
import { CreationResultDto } from '../../../toolkit/creation-result.dto';
import { saveFileToPermanentStorage } from '../../../toolkit/save-file-to-permanent-storage.function';
import { ConfigService } from '@nestjs/config';
import { Inject } from '@nestjs/common';
import { BoardRepo } from '../../../board/repo/board.repo.interface';
import { ThreadMapper } from '../../mappers/thread.mapper.interface';
import { ThreadRepo } from '../../repo/thread.repo.interface';
import { StringUtils } from '../../../toolkit/string-utils';
import { ThreadReplyCreateDto } from 'src/thread/dto/thread-reply.create.dto';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as process from 'process';

/**
 * Commands for threads
 */
export class ThreadCommandsImpl implements ThreadCommands {
	constructor(
		@Inject(ConfigService)
		private readonly configService: ConfigService,
		@Inject(BoardRepo)
		private readonly boardRepo: BoardRepo,
		@Inject(ThreadMapper)
		private readonly threadMapper: ThreadMapper,
		@Inject(ThreadRepo)
		private readonly threadRepo: ThreadRepo
	) {}

	/**
	 * Create comment - thread reply
	 * @param slug Board slug
	 * @param parentNumber Number on board of parent comment
	 * @param dto Thread reply creation DTO
	 */
	public async createThreadReply(
		slug: string,
		parentNumber: number,
		dto: ThreadReplyCreateDto
	): Promise<CreationResultDto<string>> {
		const BUMP_LIMIT = 5;

		let savedFilePath = null;

		if (dto.file) {
			savedFilePath = await saveFileToPermanentStorage(
				this.configService,
				slug,
				dto.file
			);
		}

		const board = await this.boardRepo.findBySlug(slug);

		const reply = this.threadMapper.create(slug, dto, savedFilePath);

		const parent = await this.threadRepo.findBySlugAndNumber(
			slug,
			parentNumber
		);

		reply.numberOnBoard = board.lastCommentNumber + 1n;

		const currentPostsInThread = await this.threadRepo.getRepliesCount(
			parent.id
		);

		if (!dto.dontHit && currentPostsInThread <= BUMP_LIMIT) {
			parent.lastHit = new Date();
		}

		if (StringUtils.isEmpty(reply.name)) {
			reply.name = 'Anonymous';
		}

		const newReply = await this.threadRepo.createReply(reply, parent.id);

		await this.threadRepo.update(parent);

		await this.boardRepo.incrementLastPost(slug);

		return new CreationResultDto<string>(
			`/${slug}/res/${parentNumber}#${newReply.numberOnBoard}`
		);
	}

	/**
	 * Create new thread
	 * @param slug Board slug
	 * @param dto Board Creation DTO
	 */
	public async createThread(
		slug: string,
		dto: ThreadCreateDto
	): Promise<CreationResultDto<string>> {
		const savedFilePath = await saveFileToPermanentStorage(
			this.configService,
			slug,
			dto.file
		);

		const thread = this.threadMapper.create(slug, dto, savedFilePath);

		const board = await this.boardRepo.findBySlug(slug);

		thread.numberOnBoard = board.lastCommentNumber + 1n;
		thread.lastHit = new Date();

		if (StringUtils.isEmpty(thread.name)) {
			thread.name = 'Anonymous';
		}

		const newThread = await this.threadRepo.create(thread);

		await this.boardRepo.incrementLastPost(slug);

		return new CreationResultDto<string>(`${newThread.numberOnBoard}`);
	}

	/**
	 * Delete comments by its password
	 * @param slug Board slug
	 * @param threadNumbers Comments that should be deleted
	 * @param password Comments password
	 */
	public async deleteCommentsByPwd(
		slug: string,
		threadNumbers: bigint[],
		password: string
	): Promise<void> {
		for (const commentId of threadNumbers) {
			await this.threadRepo.deleteCommentByPassword(
				slug,
				commentId,
				password
			);
		}
	}

	/**
	 * Clear files from comments by its password
	 * @param slug Board slug
	 * @param threadNumbers Comments with files which should be cleared
	 * @param password Comments password
	 */
	public async clearFilesByPwd(
		slug: string,
		threadNumbers: bigint[],
		password: string
	): Promise<void> {
		await this.threadRepo.clearFilesByPwd(slug, threadNumbers, password);

		await this.removeFilesByPwd(slug, threadNumbers, password);
	}

	/**
	 * Remove comment files from disk by password
	 * @param slug Board slug
	 * @param threadNumbers Comments with files which should be removed
	 * @param password Comments password
	 */
	private async removeFilesByPwd(
		slug: string,
		threadNumbers: bigint[],
		password: string
	): Promise<void> {
		const candidates =
			await this.threadRepo.findCommentsWithFileDeletionCandidates(
				slug,
				threadNumbers,
				password
			);

		const files = candidates.map(candidate => candidate.file);

		for (const file of files) {
			await fs.unlink(
				path.join(
					process.cwd(),
					this.configService.get('MEGAMI_ASSETS_PUBLIC_DIR'),
					this.configService.get('MEGAMI_FILES_DIR'),
					file
				)
			);
		}
	}
}
