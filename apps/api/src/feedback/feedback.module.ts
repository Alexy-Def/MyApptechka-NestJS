import { DynamicModule, Module } from '@nestjs/common';

import { SmsModule } from '@libs/sms';

import { FEEDBACK_OPTIONS } from './constants';
import { FeedbackService } from './services';
import { FeedbackModuleOptions } from './types';

@Module({})
export class FeedbackModule {
  static register(options: FeedbackModuleOptions): DynamicModule {
    return {
      module: FeedbackModule,
      imports: [SmsModule],
      providers: [
        {
          provide: FEEDBACK_OPTIONS,
          useValue: options,
        },
        FeedbackService,
      ],
      exports: [FeedbackService],
    };
  }
}
