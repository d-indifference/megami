import { BoardDto } from '../dto/board.dto';
import { CreationResultDto } from '../../toolkit/creation-result.dto';
import { DeleteDto } from '../../toolkit/delete.dto';
import { BoardUpdateDto } from '../dto/board.update.dto';

/**
 * Commands for Board entity
 */
export interface BoardCommands {
	create(dto: BoardDto): Promise<CreationResultDto<string>>;

	update(dto: BoardUpdateDto, id: string): Promise<CreationResultDto<string>>;

	remove(dto: DeleteDto): Promise<void>;
}

export const BoardCommands = Symbol('BoardCommands');
