import { BoardMapper } from '../board.mapper.interface';
import { Board } from '@prisma/client';
import { BoardDto } from '../../dto/board.dto';
import { Injectable } from '@nestjs/common';
import { BoardItemDto } from 'src/board/dto/board.item.dto';

/**
 * Mapper for Board entity
 */
@Injectable()
export class BoardMapperImpl implements BoardMapper {
	/**
	 * Map entity to DTO
	 * @param entity Board entity
	 */
	public toDto(entity: Board): BoardDto {
		return new BoardDto(entity.slug, entity.name);
	}

	/**
	 * Map entity to item DTO
	 * @param entity Board entity
	 */
	public toItemDto(entity: Board): BoardItemDto {
		const dto = new BoardItemDto();
		dto.id = entity.id;
		dto.name = entity.name;
		dto.slug = entity.slug;
		dto.filesCount = null;

		return dto;
	}

	/**
	 * Map DTO to entity
	 * @param dto Board DTO
	 */
	public toEntity(dto: BoardDto): Board {
		return {
			slug: dto.slug,
			name: dto.name
		} as Board;
	}

	/**
	 * Map DTO to existing entity
	 * @param dto Board DTO
	 * @param entity existing entity
	 */
	public toExistingEntity(dto: BoardDto, entity: Board): Board {
		return { ...entity, ...dto };
	}
}
