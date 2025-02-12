import { Module } from '@nestjs/common';

import { SmsModule } from '@libs/sms';

import * as Services from './services';

@Module({
  imports: [SmsModule],
  providers: Object.values(Services),
  exports: Object.values(Services),
})
export class VerificationModule {}
