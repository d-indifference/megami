/**
 * Page template for html-paginator
 */
export type Page<T> = {
	/**
	 * Page elements
	 */
	elements: T[];

	/**
	 * Previous page number
	 */
	previous: string;

	/**
	 * Next page number
	 */
	next: string;

	/**
	 * Current page number
	 */
	current: string;

	/**
	 * Max page number
	 */
	total: string;

	/**
	 * HTML-string with paginator navbar
	 */
	paginatorTemplate: string; // Very dirty hack
};
