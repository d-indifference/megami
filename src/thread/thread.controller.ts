import {
	Body,
	Controller,
	Get,
	Inject,
	Param,
	Post,
	Render,
	Res
} from '@nestjs/common';
import { ThreadsView } from '../board/views/threads.view.interface';
import { BoardPage } from '../board/types/board-page.type';
import { NewThreadView } from './views/new-thread.view.interface';
import { NewThreadPage } from './types/new-thread-page.type';
import { ThreadCreateDto } from './dto/thread.create.dto';
import { FormDataRequest } from 'nestjs-form-data';
import { Response } from 'express';
import { ThreadRepliesView } from './views/thread-replies.view.interface';
import { ThreadReplyCreateDto } from './dto/thread-reply.create.dto';
import { ThreadWithRepliesPage } from './types/thread-with-replies-page.type';
import { ThreadDeleteDto } from './dto/thread.delete.dto';
import { RealIP } from 'nestjs-real-ip';

/**
 * Controller for threads
 */
@Controller(':board')
export class ThreadController {
	constructor(
		@Inject(ThreadsView)
		private readonly threadsView: ThreadsView,
		@Inject(NewThreadView)
		private readonly newThreadView: NewThreadView,
		@Inject(ThreadRepliesView)
		private readonly threadRepliesView: ThreadRepliesView
	) {}

	/**
	 * Get thread creation page
	 */
	@Get('new-thread')
	@Render('new-thread')
	public async newThread(
		@Param('board') slug: string
	): Promise<NewThreadPage> {
		return await this.newThreadView.getViewPayload(slug);
	}

	/**
	 * Post thread creation
	 */
	@Post('new-thread')
	@FormDataRequest()
	public async createNewThread(
		@Param('board') slug: string,
		@Body() dto: ThreadCreateDto,
		@RealIP() ip: string,
		@Res() res: Response
	): Promise<void> {
		await this.newThreadView.createThread(slug, dto, ip, res);
	}

	/**
	 * Thread replies page
	 */
	@Get('res/:threadNumber')
	@Render('thread')
	public async getThread(
		@Param('board') board: string,
		@Param('threadNumber') threadNumber: number
	): Promise<ThreadWithRepliesPage> {
		return await this.threadRepliesView.getThreadRepliesPage(
			board,
			Number(threadNumber)
		);
	}

	/**
	 * Create thread reply
	 */
	@Post('res/:threadNumber')
	@FormDataRequest()
	public async replyToThread(
		@Param('board') slug: string,
		@Param('threadNumber') threadNumber: number,
		@Body() dto: ThreadReplyCreateDto,
		@RealIP() ip: string,
		@Res() res: Response
	): Promise<void> {
		await this.threadRepliesView.createReply(
			slug,
			threadNumber,
			dto,
			ip,
			res
		);
	}

	/**
	 * Delete comments
	 */
	@Post('res/:threadNumber/delete')
	@FormDataRequest()
	public async deleteComments(
		@Param('board') slug: string,
		@Param('threadNumber') threadNumber: number,
		@Body() dto: ThreadDeleteDto,
		@Res() res: Response
	): Promise<void> {
		await this.threadRepliesView.deleteCommentsByPwd(
			slug,
			threadNumber,
			dto,
			res
		);
	}

	/**
	 * Board page with page number
	 */
	@Get(':page')
	@Render('board')
	public async getBoardByPageNumber(
		@Param('board') board: string,
		@Param('page') page: number
	): Promise<BoardPage> {
		return await this.threadsView.getBoardPage(board, Number(page));
	}
}
