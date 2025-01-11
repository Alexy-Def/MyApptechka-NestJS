import { CustomDecorator, SetMetadata } from '@nestjs/common';

import { AUTH_CONSTANTS } from '../constants';

export const Public = (): CustomDecorator<string> => SetMetadata(AUTH_CONSTANTS.IS_PUBLIC_KEY, true);
