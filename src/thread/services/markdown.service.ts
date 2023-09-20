import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

/**
 * Markdown processor
 */
@Injectable()
export class MarkdownService {
	constructor(
		@Inject(PrismaService)
		private readonly prisma: PrismaService
	) {}

	/**
	 * Parse site markdown
	 * @param comment Comment with markdown
	 * @param slug current board slug
	 */
	public async processMarkdown(
		comment: string,
		slug: string
	): Promise<string> {
		return this.processLink(
			this.processCowText(
				this.processSpoiler(
					this.processStroke(
						this.processItalic(
							this.processBold(
								this.processCode(
									this.processShiftJis(
										this.processUnkfunc(
											await this.processReplyMarkdown(
												comment,
												slug
											)
										)
									)
								)
							)
						)
					)
				)
			)
		);
	}

	/**
	 * Parse `> quote` markdown
	 * @param comment Comment with markdown
	 */
	private processUnkfunc(comment: string): string {
		const regExp = /^(&#x3E;(?![\s]*&#x3E;(\d+))[^]*?)(\n|$)/g;

		const splitComment = comment.split('\r\n');

		let resultComment = '';

		splitComment.forEach(strFragment => {
			resultComment += `${strFragment.replaceAll(
				regExp,
				'<span class="custom-unkfunc">$1</span>'
			)}\r\n`;
		});

		return resultComment.trim();
	}

	/**
	 * Parse `%%spoiler%%` markdown
	 * @param comment Comment with markdown
	 */
	private processSpoiler(comment: string): string {
		const regExp = /%%([^*]+)%%/g;

		return comment
			.replaceAll(regExp, '<span class="custom-spoiler">$1</span>')
			.trim();
	}

	/**
	 * Parse `Shift_JIS` markdown
	 * @param comment Comment with markdown
	 */
	private processShiftJis(comment: string): string {
		const regExp = /&#x60;&#x60;&#x60;aa([^*]+)&#x60;&#x60;&#x60;/g;

		return comment
			.replaceAll(regExp, '<code class="custom-code-aa">$1</code>')
			.trim();
	}

	/**
	 * Parse `**bold**` markdown
	 * @param comment Comment with markdown
	 */
	private processBold(comment: string): string {
		const regExp = /\*\*([^*]+)\*\*/g;

		return comment.replaceAll(regExp, '<strong>$1</strong>').trim();
	}

	/**
	 * Parse `*italic*` markdown
	 * @param comment Comment with markdown
	 */
	private processItalic(comment: string): string {
		const regExp = /\*([^*]+)\*/g;

		return comment.replaceAll(regExp, '<i>$1</i>').trim();
	}

	/**
	 * Parse `code` markdown
	 * @param comment Comment with markdown
	 */
	private processCode(comment: string): string {
		const regExp = /&#x60;([^*]+)&#x60;/g;

		return comment.replaceAll(regExp, '<code>$1</code>').trim();
	}

	/**
	 * Parse `~~stroke~~` markdown
	 * @param comment Comment with markdown
	 */
	private processStroke(comment: string): string {
		const regExp = /~~([^*]+)~~/g;

		return comment.replaceAll(regExp, '<s>$1</s>').trim();
	}

	/**
	 * Parse `!~cow text~!` markdown
	 * @param comment Comment with markdown
	 */
	private processCowText(comment: string): string {
		const regExp = /!~([^*]+)~!/g;

		return comment
			.replaceAll(regExp, '<span class="custom-cow">$1</span>')
			.trim();
	}

	/**
	 * Parse http(s) / ftp / irc / mailto markdown
	 * @param comment Comment with markdown
	 */
	private processLink(comment: string): string {
		const regExp = /((https?|area|ftp|irc)\:\/\/\S+)(  )?/g;

		const commentWithLinks = comment
			.replaceAll(
				regExp,
				'<a href="$1" rel="noreferrer" target="_blank">$1</a>'
			)
			.trim();

		const mailToRegexp = /^(mailto\:([^"<>\s]+\@\S+))(  )?/g;

		return commentWithLinks.replaceAll(mailToRegexp, '<a href="$1">$1</a>');
	}

	/**
	 * Handler of post link markdown
	 * @param slug board slug
	 * @param match RegExp match
	 * @param digits Post digits on board
	 */
	private async replyMdHandler(
		slug: string,
		match: string,
		digits: unknown
	): Promise<string> {
		const comment = await this.prisma.comment.findFirst({
			where: { boardSlug: slug, numberOnBoard: BigInt(digits as string) }
		});

		if (!comment) {
			return match;
		}

		if (comment.parentId) {
			const parent = await this.prisma.comment.findUnique({
				where: { id: comment.parentId }
			});

			return `<a href="/${slug}/res/${parent.numberOnBoard}#${comment.numberOnBoard}">${match}</a>`;
		}

		return `<a href="/${slug}/res/${comment.numberOnBoard}#${comment.numberOnBoard}">${match}</a>`;
	}

	/**
	 * Parse `>>18000` post markdown
	 * @param comment Comment with markdown
	 * @param slug Current board slug
	 */
	private async processReplyMarkdown(
		comment: string,
		slug: string
	): Promise<string> {
		const regex = /&#x3E;&#x3E;(\d+)/g;
		const promises: Promise<string>[] = [];

		const tempResult = comment;

		tempResult.replaceAll(regex, (match, digits) => {
			const promise = this.replyMdHandler(slug, match, digits);
			promises.push(promise);

			return '';
		});

		const data = await Promise.all(promises);
		return comment.replaceAll(regex, () => data.shift());
	}
}
