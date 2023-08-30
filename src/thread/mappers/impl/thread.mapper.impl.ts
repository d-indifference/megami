import { ThreadMapper } from '../thread.mapper.interface';
import { ThreadCreateDto } from '../../dto/thread.create.dto';
import { Comment } from '@prisma/client';
import { ThreadItemDto } from '../../dto/thread.item.dto';
import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ThreadOpenPostDto } from 'src/thread/dto/thread-open-post.dto';
import { ThreadReplyDto } from 'src/thread/dto/thread-reply.dto';

/**
 * Mapper for Thread entity
 */
export class ThreadMapperImpl implements ThreadMapper {
	constructor(
		@Inject(ConfigService)
		private readonly configService: ConfigService
	) {}

	/**
	 * Map entity to thread reply DTO
	 * @param entity source thread entity
	 */
	public toReplyDto(entity: Comment): ThreadReplyDto {
		return this.toOpenPostDto(entity);
	}

	/**
	 * Map entity to thread open post DTO
	 * @param entity source thread entity
	 */
	public toOpenPostDto(entity: Comment): ThreadOpenPostDto {
		const dto = new ThreadOpenPostDto();

		dto.createdAt = entity.createdAt;
		dto.boardSlug = entity.boardSlug;
		dto.numberOnBoard = entity.numberOnBoard;
		dto.comment = entity.comment.trim();

		if (entity.email) {
			dto.email = entity.email.trim();
		}

		if (entity.name) {
			dto.name = entity.name.trim();
		}

		if (entity.subject) {
			dto.subject = entity.subject.trim();
		}

		if (entity.file) {
			dto.file = `/${this.configService.get('MEGAMI_FILES_DIR')}${
				entity.file
			}`;
		}

		return dto;
	}

	/**
	 * Map Creation DTO to entity
	 * @param slug Board Slug
	 * @param dto Creation DTO
	 * @param file URL to applied file
	 */
	public create(slug: string, dto: ThreadCreateDto, file: string): Comment {
		return {
			boardSlug: slug,
			email: dto.email,
			name: dto.name,
			subject: dto.subject,
			comment: dto.comment,
			password: dto.password,
			file
		} as Comment;
	}

	/**
	 * Map entity to item DTO
	 * @param entity Comment entity
	 * @param repliesTotal Total thread replies
	 * @param repliesWithFiles Total thread replies with files
	 */
	public toItemDto(
		entity: Comment,
		repliesTotal: number,
		repliesWithFiles: number
	): ThreadItemDto {
		const dto = new ThreadItemDto(
			entity.boardSlug,
			entity.numberOnBoard,
			entity.comment,
			repliesTotal,
			repliesWithFiles
		);

		if (entity.subject) {
			dto.subject = entity.subject;
		}

		if (entity.file) {
			dto.file = `/${this.configService.get('MEGAMI_FILES_DIR')}${
				entity.file
			}`;
		}

		return dto;
	}
}
