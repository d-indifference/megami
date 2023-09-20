import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

/**
 * Update IP filter DTO
 */
export class IpListUpdateDto {
	/**
	 * IP blacklist
	 */
	@IsOptional()
	@IsString()
	blackList: string;

	/**
	 * IP whitelist
	 */
	@IsString()
	@IsNotEmpty()
	whiteList: string;
}
