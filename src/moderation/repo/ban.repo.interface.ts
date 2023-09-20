import { Ban } from '@prisma/client';
import { DeleteDto } from '../../toolkit/delete.dto';

/**
 * DAO for ban entity
 */
export interface BanRepo {
	findAllActive(): Promise<Ban[]>;

	findById(id: string): Promise<Ban>;

	checkActiveBan(ip: string): Promise<boolean>;

	findLastActive(ip: string): Promise<Ban>;

	create(entity: Ban): Promise<Ban>;

	remove(dto: DeleteDto): Promise<void>;

	removeInactive(): Promise<void>;
}

export const BanRepo = Symbol('BanRepo');
