import { BanItemDto } from '../dto/ban.item.dto';

/**
 * Queries for bans
 */
export interface BanQueries {
	findAllActive(): Promise<BanItemDto[]>;

	checkActiveBan(ip: string): Promise<boolean>;

	findLastActiveBan(ip: string): Promise<BanItemDto>;
}

export const BanQueries = Symbol('BanQueries');
