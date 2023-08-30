import { NewThreadPage } from '../../types/new-thread-page.type';
import { NewThreadView } from '../new-thread.view.interface';
import { Inject } from '@nestjs/common';
import { BoardQueries } from '../../../board/queries/board.queries.interface';
import { ThreadCreateDto } from '../../dto/thread.create.dto';
import { Response } from 'express';
import { ThreadCommands } from '../../commands/thread.commands.interface';
import { ThreadQueries } from '../../queries/thread.queries.interface';
import { setPwdCookie } from '../../../toolkit/set-pwd-cookie.function';

/**
 * View for thread creation pages
 */
export class NewThreadViewImpl implements NewThreadView {
	constructor(
		@Inject(BoardQueries)
		private readonly queries: BoardQueries,
		@Inject(ThreadQueries)
		private readonly threadQueries: ThreadQueries,
		@Inject(ThreadCommands)
		private readonly threadCommands: ThreadCommands
	) {}

	/**
	 * Get the payload for thread creation page
	 * @param slug Board slug
	 */
	public async getViewPayload(slug: string): Promise<NewThreadPage> {
		const board = await this.queries.getBySlug(slug);

		return {
			title: `New thread in /${board.slug}/ — Megami Image Board`,
			board
		};
	}

	/**
	 * Create a thread
	 * @param slug Board slug
	 * @param dto Thread Creation Dto
	 * @param res Express.js response
	 */
	public async createThread(
		slug: string,
		dto: ThreadCreateDto,
		res: Response
	): Promise<void> {
		const newThread = await this.threadCommands.createThread(slug, dto);

		setPwdCookie(res, dto.password);

		const redirectPath = dto.stayIn
			? `/${slug}/res/${newThread.id}`
			: `/${slug}`;

		res.redirect(redirectPath);
	}
}
