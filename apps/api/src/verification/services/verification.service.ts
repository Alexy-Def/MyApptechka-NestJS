import { Injectable } from '@nestjs/common';

import { generateRandomSixDigits } from '@libs/helpers';
import { SmsService } from '@libs/sms';
import { ServiceError } from '@modules/core/exceptions';

import { VERIFICATION_ERRORS, CODE_PLACEHOLDER } from '../constants';

import { RedisService } from './redis.service';

@Injectable()
export class VerificationService {
  constructor(private readonly redisService: RedisService, private readonly smsService: SmsService) {}

  async sendVerificationCode(phone: string, textTemplate: string): Promise<void> {
    const code = generateRandomSixDigits();
    const text = textTemplate.replace(CODE_PLACEHOLDER, code.toString());
    await this.redisService.saveCode(phone, code);
    await this.smsService.send(phone, text);
  }

  async verifyCode(phone: string, code: number): Promise<void> {
    const codes = await this.redisService.getCodes(phone);

    if (!codes.includes(code.toString())) {
      throw new ServiceError(VERIFICATION_ERRORS.INVALID_VERIFICATION_CODE);
    }
  }
}
