import { BoardListPageView } from '../board-list-page.view.interface';
import { BoardListPage } from '../../types/board-list-page.type';
import { SessionDto } from '../../dto/session/session.dto';
import { BoardFormPage } from '../../types/board-form-page.type';
import { BoardDto } from '../../../board/dto/board.dto';
import { Response } from 'express';
import { Inject, MethodNotAllowedException } from '@nestjs/common';
import { BoardCommands } from '../../../board/commands/board.commands.interface';
import { BoardQueries } from '../../../board/queries/board.queries.interface';
import { DeleteDto } from '../../../toolkit/delete.dto';
import { SiteSettingsService } from '../../../site-settings/services/site-settings.service';
import { LOG } from '../../../toolkit';

/**
 * Board list view
 */
export class BoardListPageViewImpl implements BoardListPageView {
	constructor(
		@Inject(BoardCommands)
		private readonly boardCommands: BoardCommands,
		@Inject(BoardQueries)
		private readonly boardQueries: BoardQueries,
		@Inject(SiteSettingsService)
		private readonly siteSettingsService: SiteSettingsService
	) {}

	/**
	 * Board list view
	 * @param session Session data
	 */
	public async getPage(session: SessionDto): Promise<BoardListPage> {
		LOG.log(this, 'get board list page', session);

		const boardItems = await this.boardQueries.findAllItems();

		return {
			title: await this.siteSettingsService.buildTitle('Board List'),
			siteLogo: await this.siteSettingsService.getTitle(),
			session: session.payload,
			boards: boardItems
		};
	}

	/**
	 * New board form page view
	 * @param session Session data
	 */
	public async getNewBoardForm(session: SessionDto): Promise<BoardFormPage> {
		LOG.log(this, 'get board list page', session);

		return {
			title: await this.siteSettingsService.buildTitle(
				'Create new board'
			),
			siteLogo: await this.siteSettingsService.getTitle(),
			session: session.payload
		};
	}

	/**
	 * Create new board
	 * @param dto Board creation DTO
	 * @param res Express.js response
	 */
	public async createNewBoard(dto: BoardDto, res: Response): Promise<void> {
		LOG.log(this, 'create a board', dto);

		await this.boardCommands.create(dto);

		res.redirect('/megami/boards');
	}

	/**
	 * Get board edit page payload
	 * @param id Board UUID
	 * @param session Session data
	 */
	public async getBoardEditForm(
		id: string,
		session: SessionDto
	): Promise<BoardFormPage> {
		LOG.log(this, 'get board edit form', { id });

		const board = await this.boardQueries.findById(id);

		return {
			title: await this.siteSettingsService.buildTitle(
				`Edit board ${board.name}`
			),
			siteLogo: await this.siteSettingsService.getTitle(),
			session: session.payload,
			board
		};
	}

	/**
	 * Update board
	 * @param id Board UUID
	 * @param dto Update DTO
	 * @param res Express.js response
	 */
	public async updateBoard(
		id: string,
		dto: BoardDto,
		res: Response
	): Promise<void> {
		LOG.log(this, `update board, uuid=${id}`);

		const boardForUpdate = await this.boardQueries.findById(id);

		if (!boardForUpdate) {
			throw new MethodNotAllowedException();
		}

		dto.slug = boardForUpdate.slug;

		await this.boardCommands.update(dto, id);

		res.redirect('/megami/boards');
	}

	/**
	 * Delete board
	 * @param id Board UUID
	 * @param res Express.js response
	 */
	public async deleteBoard(id: string, res: Response): Promise<void> {
		LOG.log(this, `delete board, uuid=${id}`);

		const deleteDto = new DeleteDto();
		deleteDto.ids = [id];

		await this.boardCommands.remove(deleteDto);

		res.redirect('/megami/boards');
	}
}
