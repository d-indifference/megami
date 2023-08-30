import { Response } from 'express';

/**
 * Set cookie for megami password
 * @param res Express.js response
 * @param value password value
 */
export const setPwdCookie = (res: Response, value: string) => {
	const expiredDate = new Date();
	expiredDate.setMonth(expiredDate.getMonth() + 1);

	res.cookie('megamiPass', value, {
		sameSite: true,
		expires: expiredDate
	});
};
