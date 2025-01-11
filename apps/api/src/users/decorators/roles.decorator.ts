import { SetMetadata } from '@nestjs/common';

import { ROLE_CONSTANTS, USER_ROLE } from '../constants';

export const Roles = (...roles: USER_ROLE[]) => SetMetadata(ROLE_CONSTANTS.KEY, roles);
