import * as he from 'he';

/**
 * Sanitize and clean HTML tags from user's input
 * @param str User's input
 */
export const clearSanitizeHtml = (str: string): string => {
	if (str) {
		return he.encode(str.trim());
	}

	return '';
};
