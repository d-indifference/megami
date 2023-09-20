import { Board } from '@prisma/client';
import { BoardDto } from '../dto/board.dto';
import { BoardItemDto } from '../dto/board.item.dto';
import { BoardUpdateDto } from '../dto/board.update.dto';

/**
 * Mapper for Board entity
 */
export interface BoardMapper {
	toDto(entity: Board): BoardDto;

	toItemDto(entity: Board): BoardItemDto;

	toEntity(dto: BoardDto): Board;

	toExistingEntity(dto: BoardDto, entity: Board): Board;

	update(dto: BoardUpdateDto): Board;
}

export const BoardMapper = Symbol('BoardMapper');
