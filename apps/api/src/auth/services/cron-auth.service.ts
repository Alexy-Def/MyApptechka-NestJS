import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LessThanOrEqual } from 'typeorm';

import { RefreshTokenRepository } from '../repositories';

@Injectable()
export class CronAuthService {
  constructor(private readonly refreshTokenRepository: RefreshTokenRepository) {}

  @Cron(CronExpression.EVERY_HOUR)
  public async deactivateExpiredTokens(): Promise<void> {
    const currentDate = new Date();
    await this.refreshTokenRepository.update({ expirationDate: LessThanOrEqual(currentDate) }, { isActive: false });
  }
}
