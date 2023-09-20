import { IpListsFileService } from '../moderation/services/ip-lists-file.service';
import { IpFilterModuleOptions } from 'nestjs-ip-filter';

/**
 * IP Filter config
 * @param ipListsFileService `ipLists` file service
 */
export const ipFilterConfig = async (
	ipListsFileService: IpListsFileService
): Promise<IpFilterModuleOptions> => ({
	whitelist: await ipListsFileService.getWhiteList(),
	blacklist: await ipListsFileService.getBlackList(),
	useDenyException: true
});
