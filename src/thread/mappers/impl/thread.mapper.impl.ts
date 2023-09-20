import { ThreadMapper } from '../thread.mapper.interface';
import { ThreadCreateDto } from '../../dto/thread.create.dto';
import { Comment } from '@prisma/client';
import { ThreadItemDto } from '../../dto/thread.item.dto';
import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ThreadOpenPostDto } from 'src/thread/dto/thread-open-post.dto';
import { ThreadReplyDto } from 'src/thread/dto/thread-reply.dto';
import { ThreadModerationDto } from '../../dto/thread-moderation.dto';
import { DateTime } from 'luxon';
import { ThreadFileModerationDto } from '../../dto/thread-file-moderation.dto';
import { clearSanitizeHtml } from '../../../toolkit/clear-sanitize-html.function';

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

		dto.id = entity.id;
		dto.posterIp = entity.posterIp;
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
			posterIp: dto.posterIp,
			boardSlug: slug,
			email: clearSanitizeHtml(dto.email),
			name: clearSanitizeHtml(dto.name),
			subject: clearSanitizeHtml(dto.subject),
			comment: clearSanitizeHtml(dto.comment),
			password: clearSanitizeHtml(dto.password),
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

	/**
	 * Map entity to moderation DTO
	 * @param entity Comment entity
	 */
	public toModerationDto(entity: Comment): ThreadModerationDto {
		const dto = new ThreadModerationDto();

		dto.id = entity.id;
		dto.file = entity.file;
		dto.posterIp = entity.posterIp;
		dto.subject = entity.subject;
		dto.comment = entity.comment;
		dto.createdAt = DateTime.fromJSDate(entity.createdAt).toFormat(
			'dd.MM.yyyy HH:mm'
		);

		if (entity.parentId) {
			dto.isThread = false;
			dto.postLink = `/${entity.boardSlug}/res/${entity['parent'].numberOnBoard}#${entity.numberOnBoard}`;
		} else {
			dto.isThread = true;
			dto.postLink = `/${entity.boardSlug}/res/${entity.numberOnBoard}`;
		}

		return dto;
	}

	/**
	 * Map entity to file moderation DTO
	 * @param entity Comment entity
	 */
	public toFileModerationDto(entity: Comment): ThreadFileModerationDto {
		const dto = new ThreadFileModerationDto();

		dto.id = entity.id;
		dto.createdAt = DateTime.fromJSDate(entity.createdAt).toFormat(
			'dd.MM.yyyy HH:mm'
		);
		dto.boardSlug = entity.boardSlug;
		dto.file = entity.file;
		dto.posterIp = entity.posterIp;

		if (entity.parentId) {
			dto.isThread = false;
			dto.postLink = `/${entity.boardSlug}/res/${entity['parent'].numberOnBoard}#${entity.numberOnBoard}`;
		} else {
			dto.isThread = true;
			dto.postLink = `/${entity.boardSlug}/res/${entity.numberOnBoard}`;
		}

		if (entity.file) {
			dto.file = `/${this.configService.get('MEGAMI_FILES_DIR')}${
				entity.file
			}`;
		}

		return dto;
	}
}
