import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

import { REDIS } from 'config';

import { REDIS_KEY_NAME, RANGE_POSITION, CACHE_TTL } from '../constants';

@Injectable()
export class RedisService {
  private readonly client: Redis;

  constructor() {
    this.client = new Redis({
      host: REDIS.HOST,
      port: REDIS.PORT,
    });
  }

  public async saveCode(phone: string, code: number): Promise<void> {
    const key = `${REDIS_KEY_NAME.VERIFICATION}:${phone}`;
    await this.client.lpush(key, code);
    await this.client.expire(key, CACHE_TTL);
  }

  public async getCodes(phone: string): Promise<string[]> {
    const key = `${REDIS_KEY_NAME.VERIFICATION}:${phone}`;

    try {
      const codes = await this.client.lrange(key, RANGE_POSITION.START, RANGE_POSITION.END);

      return codes;
    } catch (error) {
      return [];
    }
  }

  async removeCode(phone: string, code: string): Promise<void> {
    const key = `${REDIS_KEY_NAME.VERIFICATION}:${phone}`;
    await this.client.lrem(key, 1, code);
  }
}
