import { BanCommands } from '../ban.commands.interface';
import { BanCreateDto } from '../../dto/ban.create.dto';
import { CreationResultDto } from '../../../toolkit/creation-result.dto';
import {
	Inject,
	MethodNotAllowedException,
	NotFoundException
} from '@nestjs/common';
import { BanMapper } from '../../mappers/ban.mapper.interface';
import { LOG } from '../../../toolkit';
import { BanRepo } from '../../repo/ban.repo.interface';
import { DeleteDto } from '../../../toolkit/delete.dto';

/**
 * Ban commands
 */
export class BanCommandsImpl implements BanCommands {
	constructor(
		@Inject(BanMapper)
		private readonly banMapper: BanMapper,
		@Inject(BanRepo)
		private readonly banRepo: BanRepo
	) {}

	/**
	 * Create new ban
	 * @param dto Creation DTO
	 */
	public async create(dto: BanCreateDto): Promise<CreationResultDto<string>> {
		LOG.log(this, 'create new ban', dto);

		await this.applyUniquenessPolicy(dto);

		const ban = this.banMapper.create(dto);

		const newBan = await this.banRepo.create(ban);

		const creationResult = new CreationResultDto(newBan.id);

		LOG.logCreation(this, 'new ban created', creationResult);

		await this.banRepo.removeInactive();

		return creationResult;
	}

	/**
	 * Remove ban
	 * @param dto Deletion DTO
	 */
	public async remove(dto: DeleteDto): Promise<void> {
		LOG.log(this, 'remove ban', dto);

		for (const banId of dto.ids) {
			const ban = await this.banRepo.findById(banId);

			if (!ban) {
				throw new NotFoundException(
					`Ban with id=${banId} was not found`
				);
			}
		}

		await this.banRepo.remove(dto);

		await this.banRepo.removeInactive();

		LOG.log(this, 'ban removed', dto);
	}

	/**
	 * Throw 405 if ip has active bans
	 * @param dto Ban Creation DTO
	 */
	private async applyUniquenessPolicy(dto: BanCreateDto): Promise<void> {
		if (await this.banRepo.checkActiveBan(dto.ip)) {
			LOG.log(this, 'ip is already banned, uniqueness policy applied', {
				ip: dto.ip
			});

			throw new MethodNotAllowedException(
				'This IP address is already banned'
			);
		}
	}
}
