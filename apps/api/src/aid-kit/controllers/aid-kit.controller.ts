import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ResponseInfo } from '@modules/core/api-responses';

import { SendFeedbackBodyDTO } from '../dtos';
import { AidKitService } from '../services';

@Controller('aid-kit')
@ApiTags('aid-kit')
export class AidKitController {
  constructor(private readonly aidKitService: AidKitService) {}

  @Post('feedback')
  @ResponseInfo()
  public async sendFeedback(@Body() body: SendFeedbackBodyDTO): Promise<void> {
    await this.aidKitService.sendFeedback(body);
  }
}
