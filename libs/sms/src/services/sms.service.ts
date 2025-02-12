import { Injectable } from '@nestjs/common';

import { SMS } from 'config';

import { SMS_ERRORS } from '../constants';

const RocketSMS = require('node-rocketsms-api');

@Injectable()
export class SmsService {
  private readonly smsClient: any;
  constructor() {
    this.smsClient = new RocketSMS({ username: SMS.USERNAME, password: SMS.PASSWORD });
  }

  public async send(phone: string, text: string): Promise<void> {
    try {
      await this.smsClient.send(phone, text, false);
    } catch (error) {
      throw new Error(SMS_ERRORS.SMS_NOT_SENT);
    }
  }
}
