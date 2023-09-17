import { SessionPayloadDto } from '../../management/dto/session/session-payload.dto';
import { ThreadFileModerationDto } from '../../thread/dto/thread-file-moderation.dto';

export type RecentUploadsPage = {
	title: string;

	siteLogo: string;

	session: SessionPayloadDto;

	recentUploads: ThreadFileModerationDto[];
};
