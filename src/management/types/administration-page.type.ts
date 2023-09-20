import { SessionPayloadDto } from '../dto/session/session-payload.dto';
import { UserItemDto } from '../dto/user/user.item.dto';

export type AdministrationPage = {
	title: string;

	siteLogo: string;

	session: SessionPayloadDto;

	users: UserItemDto[];
};
