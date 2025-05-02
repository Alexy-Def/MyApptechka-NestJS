import { Injectable, OnModuleInit } from '@nestjs/common';

import { SMS } from 'config';

import { SMS_ERRORS } from '../constants';

const RocketSMS = require('node-rocketsms-api');

@Injectable()
export class SmsService implements OnModuleInit {
  private readonly smsClient: any;
  constructor() {
    this.smsClient = new RocketSMS({ username: SMS.USERNAME, password: SMS.PASSWORD });
  }

  async onModuleInit(): Promise<void> {
    try {
      await this.getBalance();
    } catch (error) {
      throw new Error(SMS_ERRORS.WRONG_AUTH);
    }
  }

  public async sendSms(phone: string, text: string): Promise<void> {
    try {
      await this.smsClient.send(phone, text, false);
    } catch (error) {
      throw new Error(SMS_ERRORS.SMS_NOT_SENT);
    }
  }

  private async getBalance(): Promise<void> {
    await this.smsClient.balance();
  }
}
