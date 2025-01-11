import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UserId } from '@modules/auth/decorators';
import { ResponseInfo } from '@modules/core/api-responses';
import { USER_ROLE } from '@modules/users/constants';
import { Roles } from '@modules/users/decorators';

import { FirstAidKidService } from '../services';

@Controller('first-aid-kid')
@ApiTags('first-aid-kid')
export class FirstAidKidsController {
  constructor(private readonly firstAidKidService: FirstAidKidService) {}

  @Roles(USER_ROLE.ADMIN, USER_ROLE.USER)
  @Get()
  @ResponseInfo()
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  public async getMyFirstAidKids(@UserId() userId: number): Promise<void> {
    // await this.firstAidKidService.getMyFirstAidKids(userId);
  }
}
