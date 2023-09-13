import { BoardDto } from '../dto/board.dto';
import { CreationResultDto } from '../../toolkit/creation-result.dto';
import { DeleteDto } from '../../toolkit/delete.dto';

/**
 * Commands for Board entity
 */
export interface BoardCommands {
	create(dto: BoardDto): Promise<CreationResultDto<string>>;

	update(dto: BoardDto, id: string): Promise<CreationResultDto<string>>;

	remove(dto: DeleteDto): Promise<void>;
}

export const BoardCommands = Symbol('BoardCommands');
