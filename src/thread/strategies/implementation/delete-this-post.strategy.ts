import { PostDeletionStrategy } from '../contracts';
import { PrismaService } from '../../../prisma.service';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import { LOG } from '../../../toolkit';
import { deleteFileFullPath } from '../../../toolkit/delete-file-full-path.function';

/**
 * This posts deletion strategy
 */
export class DeleteThisPostStrategy implements PostDeletionStrategy {
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
		LOG.log(this, 'delete post by moderator', { ip, postId });

		const deleteCandidatePost = await this.prisma.comment.findUnique({
			where: { id: postId }
		});

		if (!deleteCandidatePost.parentId) {
			LOG.log(this, 'delete replies', { postId });

			const replies = await this.prisma.comment.findMany({
				where: { parentId: deleteCandidatePost.id }
			});

			for (const reply of replies) {
				if (reply.file) {
					await deleteFileFullPath(
						path.join(
							process.cwd(),
							this.configService.get('MEGAMI_ASSETS_PUBLIC_DIR'),
							this.configService.get('MEGAMI_FILES_DIR'),
							reply.file
						)
					);
				}
			}

			await this.prisma.comment.deleteMany({
				where: { parentId: deleteCandidatePost.id }
			});

			LOG.log(this, 'replies deleted', { postId });
		}

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

		await this.prisma.comment.delete({ where: { id: postId } });

		LOG.log(this, 'post deleted', { ip, postId });
	}
}
