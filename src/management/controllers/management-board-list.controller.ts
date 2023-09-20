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
import { BoardListPageView } from '../views/board-list-page.view.interface';
import { SessionDto } from '../dto/session/session.dto';
import { SessionGuard } from '../guards/session.guard';
import { BoardListPage } from '../types/board-list-page.type';
import { BoardFormPage } from '../types/board-form-page.type';
import { BoardDto } from '../../board/dto/board.dto';
import { Response } from 'express';
import { BoardUpdateDto } from '../../board/dto/board.update.dto';

/**
 * Board list controller
 */
@Controller('megami')
export class ManagementBoardListController {
	constructor(
		@Inject(BoardListPageView)
		private readonly boardListPageView: BoardListPageView
	) {}

	/**
	 * Get page of board list
	 */
	@Get('boards')
	@UseGuards(SessionGuard)
	@Render('admin-board-list')
	public async index(@Session() session: SessionDto): Promise<BoardListPage> {
		return await this.boardListPageView.getPage(session);
	}

	/**
	 * Get board creation form
	 */
	@Get('boards/edit')
	@UseGuards(SessionGuard)
	@Render('admin-board-form')
	public async getNewBoardForm(
		@Session() session: SessionDto
	): Promise<BoardFormPage> {
		return await this.boardListPageView.getNewBoardForm(session);
	}

	/**
	 * Get board edit form
	 */
	@Get('boards/edit/:id')
	@UseGuards(SessionGuard)
	@Render('admin-board-form')
	public async getBoardEditForm(
		@Param('id') id: string,
		@Session() session: SessionDto
	): Promise<BoardFormPage> {
		return await this.boardListPageView.getBoardEditForm(id, session);
	}

	/**
	 * Create new board
	 */
	@Post('boards/edit')
	@UseGuards(SessionGuard)
	@UsePipes(new ValidationPipe({ transform: true }))
	public async createNewBoard(
		@Body() dto: BoardDto,
		@Res() res: Response
	): Promise<void> {
		await this.boardListPageView.createNewBoard(dto, res);
	}

	/**
	 * Update a board
	 */
	@Post('boards/edit/:id')
	@UseGuards(SessionGuard)
	@UsePipes(new ValidationPipe({ transform: true }))
	public async updateBoard(
		@Param('id') id: string,
		@Body() dto: BoardUpdateDto,
		@Res() res: Response
	): Promise<void> {
		await this.boardListPageView.updateBoard(id, dto, res);
	}

	/**
	 * Delete boards by IDs
	 */
	@Post('boards/delete/:id')
	@UseGuards(SessionGuard)
	public async deleteBoard(
		@Param('id') id: string,
		@Res() res: Response
	): Promise<void> {
		await this.boardListPageView.deleteBoard(id, res);
	}
}
