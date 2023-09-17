import { PostDeletionStrategy } from '../contracts';
import { PrismaService } from '../../../prisma.service';
import { ConfigService } from '@nestjs/config';
import { LOG } from '../../../toolkit';
import * as path from 'path';
import { deleteFileFullPath } from '../../../toolkit/delete-file-full-path.function';

/**
 * This file deletion strategy
 */
export class DeleteThisFileStrategy implements PostDeletionStrategy {
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
		LOG.log(this, 'delete file by moderator', { ip, postId });

		const deleteCandidatePost = await this.prisma.comment.findUnique({
			where: { id: postId }
		});

		if (deleteCandidatePost.file) {
			await deleteFileFullPath(
				path.join(
					process.cwd(),
					this.configService.get('MEGAMI_ASSETS_PUBLIC_DIR'),
					this.configService.get('MEGAMI_FILES_DIR'),
					deleteCandidatePost.file
				)
			);
		}

		await this.prisma.comment.update({
			where: { id: postId },
			data: { file: null }
		});

		LOG.log(this, 'file deleted', { ip, postId });
	}
}
