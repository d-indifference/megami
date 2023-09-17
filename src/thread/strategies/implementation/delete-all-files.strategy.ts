import { PostDeletionStrategy } from '../contracts';
import { PrismaService } from '../../../prisma.service';
import { ConfigService } from '@nestjs/config';
import { LOG } from '../../../toolkit';
import { deleteFileFullPath } from '../../../toolkit/delete-file-full-path.function';
import * as path from 'path';

/**
 * All files deletion strategy
 */
export class DeleteAllFilesStrategy implements PostDeletionStrategy {
	private prisma: PrismaService;

	private configService: ConfigService;

	constructor(prisma: PrismaService, configService: ConfigService) {
		this.prisma = prisma;
		this.configService = configService;
	}

	/**
	 * Delete post by ip and UUID
	 * @param ip Poster's IP
	 * @param postId post UUID
	 */
	public async delete(ip: string, postId?: string): Promise<void> {
		LOG.log(this, 'delete all files by moderator', { ip, postId });

		const deleteCandidatesPost = await this.prisma.comment.findMany({
			where: { posterIp: ip, file: { not: null } }
		});

		const deleteCandidatesFiles = deleteCandidatesPost.map(
			entity => entity.file
		);

		const pathToFiles = path.join(
			process.cwd(),
			this.configService.get('MEGAMI_ASSETS_PUBLIC_DIR'),
			this.configService.get('MEGAMI_FILES_DIR')
		);

		for (const file of deleteCandidatesFiles) {
			const fullPath = path.join(pathToFiles, file);

			await deleteFileFullPath(fullPath);
		}

		await this.prisma.comment.updateMany({
			where: { posterIp: ip },
			data: { file: null }
		});

		LOG.log(this, 'all files from this IP deleted', { ip });
	}
}
