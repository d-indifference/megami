import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Ban } from '@prisma/client';
import { LOG } from '../toolkit';

/**
 * Ban policy service
 */
@Injectable()
export class BanPolicyService {
	constructor(
		@Inject(PrismaService)
		private readonly prisma: PrismaService
	) {}

	/**
	 * Throw 403 if active bans found for IP address
	 * @param ip Poster's IP
	 */
	public async applyBanPolicy(ip: string): Promise<void> {
		const now = new Date();

		const activeBans = (await this.prisma.ban.findMany({
			where: { ip, banTill: { gte: now } },
			include: { admin: true },
			orderBy: { createdAt: 'desc' }
		})) as Ban[];

		if (activeBans.length > 0) {
			LOG.log(this, 'ip in ban, ban policy applied', { ip });

			let message = `You're in ban till ${activeBans[0].banTill}`;

			if (activeBans[0].reason) {
				if (activeBans[0].reason.length > 0) {
					message += `<br>Reason: ${activeBans[0].reason}`;
				}
			}

			throw new ForbiddenException(message);
		}
	}
}
