import { UserCreateDto } from '../dto/user/user.create.dto';
import { CreationResultDto } from '../../toolkit/creation-result.dto';
import { UserUpdateDto } from '../dto/user/user.update.dto';
import { DeleteDto } from '../../toolkit/delete.dto';
import { UserUpdateRoleDto } from '../dto/user/user-update-role.dto';

/**
 * Commands for User entity
 */
export interface UserCommands {
	create(dto: UserCreateDto): Promise<CreationResultDto<string>>;

	update(dto: UserUpdateDto, id: string): Promise<CreationResultDto<string>>;

	updateRole(
		dto: UserUpdateRoleDto,
		id: string
	): Promise<CreationResultDto<string>>;

	remove(dto: DeleteDto): Promise<void>;
}

export const UserCommands = Symbol('UserCommands');
