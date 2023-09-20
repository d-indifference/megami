import { PostDeletionStrategy } from '../contracts';
import { PrismaService } from '../../../prisma.service';
import { ConfigService } from '@nestjs/config';
import { LOG } from '../../../toolkit';
import { deleteFileFullPath } from '../../../toolkit/delete-file-full-path.function';
import * as path from 'path';

/**
 * All posts deletion strategy
 */
export class DeleteAllPostsStrategy implements PostDeletionStrategy {
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
		LOG.log(this, 'delete all posts by moderator', { ip, postId });

		const deleteCandidatesPosts = await this.prisma.comment.findMany({
			where: { posterIp: ip }
		});

		const deleteCandidatesFiles = deleteCandidatesPosts
			.filter(entity => entity.file !== null)
			.map(entity => entity.file);

		for (const file of deleteCandidatesFiles) {
			await deleteFileFullPath(
				path.join(
					process.cwd(),
					this.configService.get('MEGAMI_ASSETS_PUBLIC_DIR'),
					this.configService.get('MEGAMI_FILES_DIR'),
					file
				)
			);
		}

		for (const candidate of deleteCandidatesPosts) {
			if (!candidate.parentId) {
				LOG.log(this, 'find replies of candidate', {
					candidate: candidate.id
				});

				const candidateReplies = await this.prisma.comment.findMany({
					where: { parentId: candidate.id }
				});

				for (const candidateReply of candidateReplies) {
					if (candidateReply.file) {
						await deleteFileFullPath(
							path.join(
								process.cwd(),
								this.configService.get(
									'MEGAMI_ASSETS_PUBLIC_DIR'
								),
								this.configService.get('MEGAMI_FILES_DIR'),
								candidateReply.file
							)
						);
					}
				}

				await this.prisma.comment.deleteMany({
					where: { parentId: candidate.id }
				});

				LOG.log(this, 'replies of candidate deleted', {
					candidate: candidate.id
				});
			}
		}

		await this.prisma.comment.deleteMany({ where: { posterIp: ip } });

		LOG.log(this, 'all posts from this IP deleted', { ip });
	}
}
