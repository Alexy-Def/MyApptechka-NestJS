import { Injectable } from '@nestjs/common';

import { FeedbackService, SmsFeedback } from '@modules/feedback';
import { UserService } from '@modules/users/services';

@Injectable()
export class AidKitService {
  constructor(private readonly userService: UserService, private readonly feedbackService: FeedbackService) {}

  // public async getMyAidKits(userId: number): Promise<void> {}

  public async sendFeedback(body: SmsFeedback): Promise<void> {
    await this.feedbackService.sendSmsFeedback(body);
  }
}
