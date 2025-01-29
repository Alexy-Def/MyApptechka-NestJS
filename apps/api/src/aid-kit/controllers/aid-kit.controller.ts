import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UserId } from '@modules/auth/decorators';
import { ResponseInfo } from '@modules/core/api-responses';
import { USER_ROLE } from '@modules/users/constants';
import { Roles } from '@modules/users/decorators';

import { AidKitService } from '../services';

@Controller('aid-kit')
@ApiTags('aid-kit')
export class AidKitController {
  constructor(private readonly aidKitService: AidKitService) {}

  @Roles(USER_ROLE.ADMIN, USER_ROLE.USER)
  @Get()
  @ResponseInfo()
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  public async getMyAidKits(@UserId() userId: number): Promise<void> {
    // await this.aidKitService.getMyAidKits(userId);
  }
}
