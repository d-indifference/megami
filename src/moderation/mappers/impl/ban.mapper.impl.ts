import { BanMapper } from '../ban.mapper.interface';
import { BanCreateDto } from '../../dto/ban.create.dto';
import { Ban } from '@prisma/client';
import { BanFormDto } from '../../dto/ban.form.dto';
import { DateTime } from 'luxon';
import { BanItemDto } from '../../dto/ban.item.dto';
import { Inject } from '@nestjs/common';
import { UserMapper } from '../../../management/mappers/user.mapper.interface';

/**
 * Ban entity mapper
 */
export class BanMapperImpl implements BanMapper {
	constructor(
		@Inject(UserMapper)
		private readonly userMapper: UserMapper
	) {}

	/**
	 * Map creation DTO to entity
	 * @param dto Ban Creation DTO
	 */
	public create(dto: BanCreateDto): Ban {
		return {
			adminId: dto.adminId,
			ip: dto.ip,
			reason: dto.reason,
			banTill: dto.banTill
		} as Ban;
	}

	/**
	 * Map form DTO to creation DTO
	 * @param form Ban form DTO
	 */
	public toCreateDto(form: BanFormDto): BanCreateDto {
		const dto = new BanCreateDto();

		const luxonDate = DateTime.fromFormat(form.banTill, 'yyyy-MM-dd');

		dto.ip = form.ip;
		dto.reason = form.reason;
		dto.banTill = luxonDate.toJSDate();

		return dto;
	}

	/**
	 * Map Ban entity to item DTO
	 * @param entity Ban entity
	 */
	public toItemDto(entity: Ban): BanItemDto {
		const dto = new BanItemDto();
		dto.id = entity.id;
		dto.ip = entity.ip;
		dto.createdAt = DateTime.fromJSDate(entity.createdAt).toFormat(
			'dd.MM.yyyy HH:mm'
		);
		dto.banTill = DateTime.fromJSDate(entity.banTill).toFormat(
			'dd.MM.yyyy HH:mm'
		);
		dto.reason = entity.reason;

		if (entity.adminId) {
			dto.admin = this.userMapper.toItemDto(entity['admin']);
		}

		return dto;
	}
}
