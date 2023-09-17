import { BanFormDto } from '../dto/ban.form.dto';
import { BanCreateDto } from '../dto/ban.create.dto';
import { Ban } from '@prisma/client';
import { BanItemDto } from '../dto/ban.item.dto';

/**
 * Ban entity mapper
 */
export interface BanMapper {
	toCreateDto(form: BanFormDto): BanCreateDto;

	toItemDto(entity: Ban): BanItemDto;

	create(dto: BanCreateDto): Ban;
}

export const BanMapper = Symbol('BanMapper');
