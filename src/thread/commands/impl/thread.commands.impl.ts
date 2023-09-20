import { ThreadCommands } from '../thread.commands.interface';
import { ThreadCreateDto } from '../../dto/thread.create.dto';
import { CreationResultDto } from '../../../toolkit/creation-result.dto';
import { saveFileToPermanentStorage } from '../../../toolkit/save-file-to-permanent-storage.function';
import { ConfigService } from '@nestjs/config';
import {
	BadRequestException,
	Inject,
	MethodNotAllowedException
} from '@nestjs/common';
import { BoardRepo } from '../../../board/repo/board.repo.interface';
import { ThreadMapper } from '../../mappers/thread.mapper.interface';
import { ThreadRepo } from '../../repo/thread.repo.interface';
import { StringUtils } from '../../../toolkit/string-utils';
import { ThreadReplyCreateDto } from 'src/thread/dto/thread-reply.create.dto';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as process from 'process';
import { SiteSettingsService } from '../../../site-settings/services/site-settings.service';
import { LOG } from '../../../toolkit';
import { DeleteDto } from '../../../toolkit/delete.dto';
import { BanPolicyService } from '../../../ban/ban-policy.service';
import { MarkdownService } from '../../services/markdown.service';

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
		private readonly threadRepo: ThreadRepo,
		@Inject(SiteSettingsService)
		private readonly siteSettingsService: SiteSettingsService,
		@Inject(BanPolicyService)
		private readonly banService: BanPolicyService,
		@Inject(MarkdownService)
		private readonly markdownService: MarkdownService
	) {}

	/**
	 * Create comment - thread reply
	 * @param slug Board slug
	 * @param parentNumber Number on board of parent comment
	 * @param dto Thread reply creation DTO
	 */
	public async createThreadReply(
		slug: string,
		parentNumber: bigint,
		dto: ThreadReplyCreateDto
	): Promise<CreationResultDto<string>> {
		LOG.log(
			this,
			`create thread reply, parentNumber=${parentNumber}, slug=${slug}`,
			dto
		);

		await this.banService.applyBanPolicy(dto.posterIp);

		await this.applyDelayPolicy(
			dto.posterIp,
			(
				await this.siteSettingsService.getSiteSettings()
			).threadReplyDelay,
			'reply in threads'
		);

		const bumpLimit = (await this.siteSettingsService.getSiteSettings())
			.bumpLimit;

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

		reply.comment = await this.markdownService.processMarkdown(
			reply.comment,
			reply.boardSlug
		);

		if (reply.comment.length < 3) {
			throw new BadRequestException(
				'Please write a normal comment without forbidden markdown'
			);
		}

		const parent = await this.threadRepo.findBySlugAndNumber(
			slug,
			parentNumber
		);

		reply.numberOnBoard = board.lastCommentNumber + 1n;

		const currentPostsInThread = await this.threadRepo.getRepliesCount(
			parent.id
		);

		if (!dto.dontHit && currentPostsInThread <= bumpLimit) {
			parent.lastHit = new Date();
		}

		if (StringUtils.isEmpty(reply.name)) {
			reply.name = 'Anonymous';
		}

		const newReply = await this.threadRepo.createReply(reply, parent.id);

		await this.threadRepo.update(parent);

		await this.boardRepo.incrementLastPost(slug);

		LOG.log(this, 'new reply created', { id: newReply.id });

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
		LOG.log(this, `create thread , slug=${slug}`, dto);

		await this.banService.applyBanPolicy(dto.posterIp);

		await this.applyDelayPolicy(
			dto.posterIp,
			(
				await this.siteSettingsService.getSiteSettings()
			).threadCreationDelay,
			'create threads'
		);

		const savedFilePath = await saveFileToPermanentStorage(
			this.configService,
			slug,
			dto.file
		);

		const thread = this.threadMapper.create(slug, dto, savedFilePath);

		if (thread.comment.length < 3) {
			throw new BadRequestException(
				'Please write a normal comment without forbidden markdown'
			);
		}

		thread.comment = await this.markdownService.processMarkdown(
			thread.comment,
			thread.boardSlug
		);

		const board = await this.boardRepo.findBySlug(slug);

		thread.numberOnBoard = board.lastCommentNumber + 1n;
		thread.lastHit = new Date();

		if (StringUtils.isEmpty(thread.name)) {
			thread.name = 'Anonymous';
		}

		const newThread = await this.threadRepo.create(thread);

		await this.boardRepo.incrementLastPost(slug);

		LOG.log(this, 'new thread created', { id: newThread.id });

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
		LOG.log(this, 'delete comments by password', {
			slug,
			threadNumbers,
			password
		});

		for (const commentId of threadNumbers) {
			await this.threadRepo.deleteCommentByPassword(
				slug,
				commentId,
				password
			);
		}

		LOG.log(this, 'comments was deleted');
	}

	/**
	 * Delete comments by UUIDs
	 * @param dto Delete DTO
	 */
	public async deleteCommentsByIds(dto: DeleteDto): Promise<void> {
		LOG.log(this, 'delete comments by ids', dto);

		const deleteCandidates = await this.threadRepo.findAllByIdIn(dto.ids);

		for (const candidate of deleteCandidates) {
			if (!candidate.parentId) {
				LOG.log(this, `delete thread, id=${candidate.id}`);

				LOG.log(this, 'finding thread replies...');

				const repliesOfDeleteCandidate =
					await this.threadRepo.findReplies(
						candidate.boardSlug,
						candidate.numberOnBoard
					);

				for (const reply of repliesOfDeleteCandidate) {
					LOG.log(this, 'reply found', {
						id: reply.id,
						parentId: reply.parentId
					});

					if (reply.file) {
						await this.deleteFileFromDisk(reply.file);
					}
				}

				await this.threadRepo.deletePostsWhereParentId(candidate.id);

				LOG.log(this, 'replies deleted');
			}

			if (candidate.file) {
				await this.deleteFileFromDisk(candidate.file);
			}
		}

		await this.threadRepo.deletePostsByIds(dto);

		LOG.log(this, 'comments deleted');
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
		LOG.log(this, `clear files by password, password=${password}`, {
			threadNumbers
		});

		await this.threadRepo.clearFilesByPwd(slug, threadNumbers, password);

		await this.removeFilesByPwd(slug, threadNumbers, password);
	}

	/**
	 * Clear files set in list from comments
	 * @param files File which should be cleared from comments
	 */
	public async clearFilesIn(files: string[]): Promise<void> {
		LOG.log(this, 'clear files in list', {
			files
		});

		await this.threadRepo.clearFilesIn(files);

		LOG.log(this, 'files was cleared');
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
		LOG.log(this, 'remove files by password', {
			threadNumbers,
			password
		});

		const candidates =
			await this.threadRepo.findCommentsWithFileDeletionCandidates(
				slug,
				threadNumbers,
				password
			);

		const files = candidates.map(candidate => candidate.file);

		for (const file of files) {
			const unlinkCandidatePath = path.join(
				process.cwd(),
				this.configService.get('MEGAMI_ASSETS_PUBLIC_DIR'),
				this.configService.get('MEGAMI_FILES_DIR'),
				file
			);

			LOG.log(this, 'unlink file...', {
				unlinkCandidatePath
			});

			await fs.unlink(unlinkCandidatePath);

			LOG.log(this, 'file unlinked', {
				unlinkCandidatePath
			});
		}
	}

	/**
	 * Apply delay policy
	 * @param ip Poster's IP
	 * @param secondsDelay Number of seconds, how long the delay between actions should last
	 * @param messagePart Part of message which should be displayed on error page
	 */
	private async applyDelayPolicy(
		ip: string,
		secondsDelay: number,
		messagePart: string
	) {
		const millisecondsDelay = secondsDelay * 1000;
		const lastPost = await this.threadRepo.findLastCommentByIp(ip);

		if (lastPost) {
			const lastPostDate = lastPost.createdAt.valueOf();
			const currentDate = new Date().valueOf();

			if (currentDate - lastPostDate <= millisecondsDelay) {
				LOG.log(
					this,
					'comment creation rejected, delay policy applied',
					{
						ip
					}
				);

				throw new MethodNotAllowedException(
					`You can ${messagePart} every ${secondsDelay} seconds`
				);
			}
		}
	}

	/**
	 * Delete files form disk
	 * @param file Path to file with board slug
	 */
	private async deleteFileFromDisk(file: string): Promise<void> {
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
