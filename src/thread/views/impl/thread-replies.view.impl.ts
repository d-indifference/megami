import { ThreadRepliesView } from '../thread-replies.view.interface';
import { ThreadWithRepliesPage } from '../../types/thread-with-replies-page.type';
import { Inject } from '@nestjs/common';
import { ThreadQueries } from '../../queries/thread.queries.interface';
import { BoardQueries } from '../../../board/queries/board.queries.interface';
import { ThreadReplyCreateDto } from '../../dto/thread-reply.create.dto';
import { ThreadCommands } from '../../commands/thread.commands.interface';
import { Response } from 'express';
import { setPwdCookie } from '../../../toolkit/set-pwd-cookie.function';
import { ThreadDeleteDto } from 'src/thread/dto/thread.delete.dto';
import { SiteSettingsService } from '../../../site-settings/services/site-settings.service';
import { LOG } from '../../../toolkit';
import { SessionDto } from '../../../management/dto/session/session.dto';
import { SessionPayloadDto } from '../../../management/dto/session/session-payload.dto';

/**
 * View for thread replies
 */
export class ThreadRepliesViewImpl implements ThreadRepliesView {
	constructor(
		@Inject(ThreadQueries)
		private readonly threadQueries: ThreadQueries,
		@Inject(ThreadCommands)
		private readonly threadCommands: ThreadCommands,
		@Inject(BoardQueries)
		private readonly boardQueries: BoardQueries,
		@Inject(SiteSettingsService)
		private readonly siteSettingsService: SiteSettingsService
	) {}

	/**
	 * Delete comments by password
	 * @param slug Board slug
	 * @param threadNumber Thread number
	 * @param dto comment deletion DTO
	 * @param res Express.js response object
	 */
	public async deleteCommentsByPwd(
		slug: string,
		threadNumber: bigint,
		dto: ThreadDeleteDto,
		res: Response
	): Promise<void> {
		LOG.log(this, `delete comments by password, slug=${slug}`, dto);

		if (!dto.delete) {
			res.redirect(`/${slug}/res/${threadNumber}`);
		} else {
			if (dto.fileOnly) {
				await this.threadCommands.clearFilesByPwd(
					slug,
					this.normalizeDeleteCandidates(dto.delete),
					dto.password
				);
			} else {
				await this.threadCommands.deleteCommentsByPwd(
					slug,
					this.normalizeDeleteCandidates(dto.delete),
					dto.password
				);
			}

			const thread = await this.threadQueries.findThreadExact(
				slug,
				threadNumber
			);

			if (!thread) {
				res.redirect(`/${slug}`);
			} else {
				res.redirect(`/${slug}/res/${threadNumber}`);
			}
		}
	}

	/**
	 * Get page with thread replies
	 * @param slug Board slug
	 * @param numberOnBoard Thread number
	 * @param session Session data
	 */
	public async getThreadRepliesPage(
		slug: string,
		numberOnBoard: bigint,
		session: SessionDto
	): Promise<ThreadWithRepliesPage> {
		LOG.log(this, 'get thread replies page', {
			slug,
			numberOnBoard
		});

		const openingPost =
			await this.threadQueries.findOpenPostBySlugAndNumber(
				slug,
				numberOnBoard
			);

		const board = await this.boardQueries.getBySlug(slug);

		const threadFiles = await this.threadQueries.getFilesCount(
			slug,
			numberOnBoard
		);

		const replies = await this.threadQueries.findReplies(
			slug,
			numberOnBoard
		);

		return {
			title: await this.siteSettingsService.buildTitle(board.name),
			openingPost,
			filesCount: threadFiles + 1,
			replies,
			siteLogo: await this.siteSettingsService.getTitle(),
			session: this.extractSessionPayload(session),
			postersCount:
				await this.threadQueries.getUniquePostersCountInThread(
					openingPost.id
				),
			boardBottomLinks:
				await this.siteSettingsService.getBoardBottomLinks()
		} as unknown as ThreadWithRepliesPage;
	}

	/**
	 * Create thread reply
	 * @param slug Board slug
	 * @param threadNumber Thread number
	 * @param dto comment creation DTO
	 * @param ip Poster's IP
	 * @param res Express.js response object
	 */
	public async createReply(
		slug: string,
		threadNumber: bigint,
		dto: ThreadReplyCreateDto,
		ip: string,
		res: Response
	): Promise<void> {
		LOG.log(this, `create new thread reply, ip=${ip}`, dto);

		const dtoWithIp = dto;
		dtoWithIp.posterIp = ip;

		const newReply = await this.threadCommands.createThreadReply(
			slug,
			threadNumber,
			dtoWithIp
		);

		setPwdCookie(res, dto.password);

		if (dto.stayIn) {
			res.redirect(newReply.id);
		} else {
			res.redirect(`/${slug}`);
		}
	}

	/**
	 * Normalize delete candidates type to bigint array
	 * @param candidates Deletion candidate number
	 */
	private normalizeDeleteCandidates(candidates: string[] | string): bigint[] {
		if (!Array.isArray(candidates)) {
			return [BigInt(candidates as string)];
		}

		return (candidates as string[]).map(candidate => BigInt(candidate));
	}

	private extractSessionPayload(session: SessionDto): SessionPayloadDto {
		if (!session) {
			return null;
		}

		if (!session.payload) {
			return null;
		}

		return session.payload;
	}
}
