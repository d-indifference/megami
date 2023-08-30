/**
 * Some utils for strings
 */
export class StringUtils {
	/**
	 * Return true if string null, undefined or ''
	 * @param str string
	 */
	public static isEmpty(str: string): boolean {
		if (str === undefined) {
			return true;
		}

		if (str === null) {
			return true;
		}

		return str === '';
	}
}
