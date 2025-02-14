import { Module } from '@nestjs/common';

import * as Gateways from './gateways';

@Module({
  providers: Object.values(Gateways),
  exports: Object.values(Gateways),
})
export class NotificationModule {}
