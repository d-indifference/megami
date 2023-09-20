import { Logger } from '@nestjs/common';
import { CreationResultDto } from './creation-result.dto';

/**
 * Wrapper for Nest.js logger
 */
export class LOG {
	/**
	 * Log common message
	 * @param context Logging context
	 * @param message Logging message
	 * @param dto dto for printing with message
	 */
	public static log(context: unknown, message: string, dto?: unknown): void {
		Logger.log(
			LOG.makeMessage(message, dto),
			context['constructor']['name']
		);
	}

	/**
	 * Log message with creation result
	 * @param context Logging context
	 * @param message Logging message
	 * @param dto Creation result DTO
	 */
	public static logCreation<T>(
		context: unknown,
		message: string,
		dto: CreationResultDto<T>
	): void {
		Logger.log(`${message}; ID: ${dto.id}`, context['constructor']['name']);
	}

	/**
	 * Log warning message
	 * @param context Logging context
	 * @param message Logging message
	 * @param dto dto for printing with message
	 */
	public static warn(context: unknown, message: string, dto?: unknown): void {
		Logger.warn(
			LOG.makeMessage(message, dto),
			context['constructor']['name']
		);
	}

	/**
	 * Log error message
	 * @param context Logging context
	 * @param message Logging message
	 * @param dto dto for printing with message
	 */
	public static error(
		context: unknown,
		message: string,
		dto?: unknown
	): void {
		Logger.error(
			LOG.makeMessage(message, dto),
			context['constructor']['name']
		);
	}

	private static makeMessage(message: string, dto?: unknown): string {
		let constructedMessage = `${message}`;

		if (dto) {
			const normalizedDto = dto as Record<string, unknown>;

			constructedMessage += '; DTO: ';

			for (const key in normalizedDto) {
				if (normalizedDto.hasOwnProperty(key)) {
					constructedMessage += `${key}: ${normalizedDto[key]}, `;
				}
			}

			constructedMessage = constructedMessage.slice(0, -2);
		}

		return constructedMessage;
	}
}
