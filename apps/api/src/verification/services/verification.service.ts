import { Injectable } from '@nestjs/common';

import { generateRandomSixDigits } from '@libs/helpers';
import { SmsService } from '@libs/sms';
import { ServiceError } from '@modules/core/exceptions';
import { RedisService } from '@modules/redis';

import {
  VERIFICATION_ERRORS,
  CODE_PLACEHOLDER,
  CACHE_KEY_NAME,
  SMS_CODE_CACHE_TTL,
  RANGE_POSITION,
} from '../constants';

@Injectable()
export class VerificationService {
  constructor(private readonly redisService: RedisService, private readonly smsService: SmsService) {}

  private getVerificationKey(phone: string): string {
    return `${CACHE_KEY_NAME.VERIFICATION}:${phone}`;
  }

  async sendVerificationCode(phone: string, textTemplate: string): Promise<void> {
    const code = generateRandomSixDigits();
    const text = textTemplate.replace(CODE_PLACEHOLDER, code.toString());
    const cacheKey = this.getVerificationKey(phone);
    await this.redisService.setListItem(cacheKey, code);
    await this.redisService.setCacheTtl(cacheKey, SMS_CODE_CACHE_TTL);
    await this.smsService.send(phone, text);
  }

  async verifyCode(phone: string, code: number): Promise<void> {
    const cacheKey = this.getVerificationKey(phone);
    const codes = await this.redisService.getListItems(cacheKey, RANGE_POSITION.START, RANGE_POSITION.END);

    if (!codes.includes(code)) {
      throw new ServiceError(VERIFICATION_ERRORS.INVALID_VERIFICATION_CODE);
    }
  }
}
