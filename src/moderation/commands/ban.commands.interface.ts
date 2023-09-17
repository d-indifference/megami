import { CreationResultDto } from '../../toolkit/creation-result.dto';
import { BanCreateDto } from '../dto/ban.create.dto';
import { DeleteDto } from '../../toolkit/delete.dto';

/**
 * Ban commands
 */
export interface BanCommands {
	create(dto: BanCreateDto): Promise<CreationResultDto<string>>;

	remove(dto: DeleteDto): Promise<void>;
}

export const BanCommands = Symbol('BanCommands');
