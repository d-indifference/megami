/**
 * `package.json` structure type
 */
export type PackageJson = {
	/**
	 * Package name
	 */
	name: string;

	/**
	 * Package version
	 */
	version: string;

	/**
	 * Package description
	 */
	description: string;

	/**
	 * Package author
	 */
	author: string;

	/**
	 * Is package private
	 */
	private: boolean;

	/**
	 * Package license
	 */
	license: string;

	/**
	 * NPM scripts
	 */
	scripts: Record<string, string>;

	/**
	 * Package dependencies
	 */
	dependencies: Record<string, string>;

	/**
	 * Package dev dependencies
	 */
	devDependencies: Record<string, string>;
};
