export class BooleanUtils {
	/**
	 * Normalize boolean type if it can be string 'true' or 'false'
	 * @param str Boolean string value
	 */
	public static normalizeBoolean(str: string | boolean): boolean {
		if (!str) {
			return false;
		}

		let enhancedString: string | boolean;

		if (typeof str === 'string') {
			enhancedString = str.toLowerCase().trim();
		} else {
			enhancedString = str;
		}

		if (enhancedString === 'true') {
			return true;
		} else if (enhancedString === 'false') {
			return false;
		}

		return Boolean(enhancedString);
	}
}
