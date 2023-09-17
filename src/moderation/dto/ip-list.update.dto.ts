/**
 * Update IP filter DTO
 */
export class IpListUpdateDto {
	/**
	 * IP blacklist
	 */
	blackList: string;

	/**
	 * IP whitelist
	 */
	whiteList: string;
}
