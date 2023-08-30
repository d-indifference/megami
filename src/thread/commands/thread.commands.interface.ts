import { CreationResultDto } from '../../toolkit/creation-result.dto';
import { ThreadCreateDto } from '../dto/thread.create.dto';
import { ThreadReplyCreateDto } from '../dto/thread-reply.create.dto';

/**
 * Commands for threads
 */
export interface ThreadCommands {
	createThread(
		slug: string,
		dto: ThreadCreateDto
	): Promise<CreationResultDto<string>>;

	createThreadReply(
		slug: string,
		parentNumber: number,
		dto: ThreadReplyCreateDto
	): Promise<CreationResultDto<string>>;

	deleteCommentsByPwd(
		slug: string,
		threadNumbers: bigint[],
		password: string
	): Promise<void>;

	clearFilesByPwd(
		slug: string,
		threadNumbers: bigint[],
		password: string
	): Promise<void>;
}

export const ThreadCommands = Symbol('ThreadCommands');
