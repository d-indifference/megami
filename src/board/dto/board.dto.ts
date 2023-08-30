/**
 * Board Dto
 */
export class BoardDto {
	/**
	 * Slug
	 */
	slug: string;

	/**
	 * Name
	 */
	name: string;

	constructor(slug: string, name: string) {
		this.slug = slug;
		this.name = name;
	}
}
