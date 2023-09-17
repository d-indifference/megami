import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { ConfigService } from '@nestjs/config';
import { DeleteOption } from '../../moderation/dto/ban.form.dto';
import { ModeratorPostDeletionContext } from './moderator-post-deletion.context';
import { PostDeletionStrategy } from './contracts';
import {
	DeleteAllFilesStrategy,
	DeleteAllPostsStrategy,
	DeleteThisFileStrategy,
	DeleteThisPostStrategy,
	SkipDeletionStrategy
} from './implementation';

/**
 * Context processor for PostDeletionStrategy
 */
@Injectable()
export class ModeratorPostDeletionContextProcessor {
	private deleteOption: DeleteOption;

	private context: ModeratorPostDeletionContext;

	private strategies: Map<DeleteOption, PostDeletionStrategy>;

	constructor(
		@Inject(PrismaService)
		private readonly prisma: PrismaService,
		@Inject(ConfigService)
		private readonly configService: ConfigService
	) {}

	/**
	 * Set delete option for post from banned IP
	 * @param deleteOption Delete option
	 */
	public setDeleteOption(deleteOption: DeleteOption): void {
		this.deleteOption = deleteOption;

		this.fillStrategiesList();

		this.context = new ModeratorPostDeletionContext(
			this.strategies.get(this.deleteOption)
		);
	}

	/**
	 * Process posts deletions
	 * @param ip Poster's IP
	 * @param postId ID of posts which should be deleted
	 */
	public async processDeletion(ip: string, postId?: string): Promise<void> {
		await this.context.processDeletion(ip, postId);
	}

	private fillStrategiesList(): void {
		this.strategies = new Map<DeleteOption, PostDeletionStrategy>();

		this.strategies.set(DeleteOption.NOTHING, new SkipDeletionStrategy());
		this.strategies.set(
			DeleteOption.THIS_POST,
			new DeleteThisPostStrategy(this.prisma, this.configService)
		);
		this.strategies.set(
			DeleteOption.THIS_FILE,
			new DeleteThisFileStrategy(this.prisma, this.configService)
		);
		this.strategies.set(
			DeleteOption.ALL_POSTS,
			new DeleteAllPostsStrategy(this.prisma, this.configService)
		);
		this.strategies.set(
			DeleteOption.ALL_FILES,
			new DeleteAllFilesStrategy(this.prisma, this.configService)
		);
	}
}
