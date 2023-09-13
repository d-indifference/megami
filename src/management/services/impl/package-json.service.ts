import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import { PackageJson } from '../../types/package-json.type';
import { LOG } from '../../../toolkit';

/**
 * Service for access to data in package.json file
 */
@Injectable()
export class PackageJsonService {
	/**
	 * Get package.json data
	 */
	public async get(): Promise<PackageJson> {
		LOG.log(this, 'getting package.json data');

		const packageJsonBuffer = await fs.readFile(
			path.join(process.cwd(), 'package.json')
		);

		const packageJson = JSON.parse(packageJsonBuffer.toString());

		return packageJson as PackageJson;
	}
}
