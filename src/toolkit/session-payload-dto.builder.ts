import { SessionPayloadDto } from '../management/dto/session/session-payload.dto';
import { UserRole } from '@prisma/client';

/**
 * Session payload DTO builder
 */
export class SessionPayloadDtoBuilder {
	private readonly target: SessionPayloadDto;

	constructor() {
		this.target = new SessionPayloadDto();
	}

	public setEmail(email: string): SessionPayloadDtoBuilder {
		this.target.email = email;

		return this;
	}

	public setRole(role: UserRole): SessionPayloadDtoBuilder {
		this.target.role = role;

		return this;
	}

	public build(): SessionPayloadDto {
		return this.target;
	}
}
