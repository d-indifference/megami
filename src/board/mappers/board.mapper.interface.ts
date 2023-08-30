import { Board } from '@prisma/client';
import { BoardDto } from '../dto/board.dto';

/**
 * Mapper for Board entity
 */
export interface BoardMapper {
	toDto(entity: Board): BoardDto;

	toEntity(dto: BoardDto): Board;

	toExistingEntity(dto: BoardDto, entity: Board): Board;
}

export const BoardMapper = Symbol('BoardMapper');
