import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { BanPolicyService } from './ban-policy.service';

/**
 * Module for bans
 */
@Module({
	providers: [PrismaService, BanPolicyService],
	exports: [BanPolicyService]
})
export class BanModule {}
