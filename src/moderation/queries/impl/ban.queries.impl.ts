import { BanQueries } from '../ban.queries.interface';
import { BanItemDto } from '../../dto/ban.item.dto';
import { Inject } from '@nestjs/common';
import { BanRepo } from '../../repo/ban.repo.interface';
import { BanMapper } from '../../mappers/ban.mapper.interface';
import { LOG } from '../../../toolkit';

/**
 * Queries for bans
 */
export class BanQueriesImpl implements BanQueries {
	constructor(
		@Inject(BanRepo)
		private readonly banRepo: BanRepo,
		@Inject(BanMapper)
		private readonly banMapper: BanMapper
	) {}

	/**
	 * Check if active ban of this IP exists
	 * @param ip Poster's IP
	 */
	public async checkActiveBan(ip: string): Promise<boolean> {
		LOG.log(this, 'check active bans', { ip });

		return await this.banRepo.checkActiveBan(ip);
	}

	/**
	 * Find all active bans
	 */
	public async findAllActive(): Promise<BanItemDto[]> {
		LOG.log(this, 'find all active bans');

		const bans = await this.banRepo.findAllActive();

		return bans.map(entity => this.banMapper.toItemDto(entity));
	}

	/**
	 * Find last active ban
	 * @param ip Poster's IP
	 */
	public async findLastActiveBan(ip: string): Promise<BanItemDto> {
		LOG.log(this, 'find active ban on IP', { ip });

		const ban = await this.banRepo.findLastActive(ip);

		if (ban) {
			LOG.log(this, 'active bans found', { ip });

			return this.banMapper.toItemDto(
				await this.banRepo.findLastActive(ip)
			);
		}

		return null;
	}
}
