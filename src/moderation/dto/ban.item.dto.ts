import { UserItemDto } from '../../management/dto/user/user.item.dto';

/**
 * Ban item DTO
 */
export class BanItemDto {
	/**
	 * Ban UUID
	 */
	id: string;

	/**
	 * Poster's IP
	 */
	ip: string;

	/**
	 * Created at
	 */
	createdAt: Date | string;

	/**
	 * End of ban
	 */
	banTill: Date | string;

	/**
	 * Admin or moderator who created this ban
	 */
	admin: UserItemDto;

	/**
	 * Ban reason
	 */
	reason: string;
}
