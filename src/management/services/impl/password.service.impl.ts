import { PasswordService } from '../password.service.interface';
import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CryptoUtils } from '../../../toolkit/crypto-utils';

/**
 * Password crypto service
 */
export class PasswordServiceImpl implements PasswordService {
	constructor(
		@Inject(ConfigService)
		private readonly configService: ConfigService
	) {}

	/**
	 * Decrypt a password
	 * @param password Encrypted password
	 */
	public decrypt(password: string): string {
		const cryptoUtils = new CryptoUtils(
			this.configService.get('MEGAMI_PRIVATE_KEY')
		);

		return cryptoUtils.decrypt(password);
	}

	/**
	 * Encrypt a password
	 * @param password User's password
	 */
	public encrypt(password: string): string {
		const cryptoUtils = new CryptoUtils(
			this.configService.get('MEGAMI_PRIVATE_KEY')
		);

		return cryptoUtils.encrypt(password);
	}
}
