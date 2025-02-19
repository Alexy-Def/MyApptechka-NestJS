import { Inject, Injectable } from '@nestjs/common';

import { SmsService } from '@libs/sms';

import { FEEDBACK_OPTIONS } from '../constants';
import { FeedbackOptions, SmsFeedback } from '../types';

@Injectable()
export class FeedbackService {
  constructor(
    @Inject(FEEDBACK_OPTIONS) private readonly options: FeedbackOptions,
    private readonly smsService: SmsService,
  ) {}

  async sendSmsFeedback(data: SmsFeedback): Promise<void> {
    await this.smsService.send(this.options.feedbackPhone, data.message);
  }
}
