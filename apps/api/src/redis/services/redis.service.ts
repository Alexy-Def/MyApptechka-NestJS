import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

import { InjectLogger, Logger } from '@libs/nestjs-logger';
import { ServiceError } from '@modules/core/exceptions';

import { REDIS_ERRORS, PROVIDER_TOKENS, SUBSCRIBE_EVENT_TYPE } from '../constants';

@Injectable()
export class RedisService implements OnModuleDestroy {
  @InjectLogger('redis-service') logger: Logger;
  constructor(
    @Inject(PROVIDER_TOKENS.REDIS_CACHE) private readonly cacheClient: Redis,
    @Inject(PROVIDER_TOKENS.REDIS_PUB) private readonly pubClient: Redis,
    @Inject(PROVIDER_TOKENS.REDIS_SUB) private readonly subClient: Redis,
  ) {}

  async setCacheTtl(key: string, ttl: number): Promise<void> {
    await this.cacheClient.expire(key, ttl);
  }

  async setListItem<T>(key: string, value: T): Promise<void> {
    await this.cacheClient.lpush(key, JSON.stringify(value));
  }

  async getListItems<T>(key: string, start: number, end: number): Promise<T[]> {
    const items = await this.cacheClient.lrange(key, start, end);

    return items.map((item) => JSON.parse(item));
  }

  async setCache<T>(key: string, value: T, ttl: number): Promise<void> {
    await this.cacheClient.set(key, JSON.stringify(value), 'EX', ttl);
  }

  async getCache<T>(key: string): Promise<T | null> {
    const value = await this.cacheClient.get(key);

    return value ? JSON.parse(value) : null;
  }

  async removeListItem(key: string, value: string): Promise<void> {
    await this.cacheClient.lrem(key, 1, value);
  }

  // for data now use object, but would be better to create certain type
  async publish(channel: string, data: string | object): Promise<void> {
    await this.pubClient.publish(channel, JSON.stringify(data));
  }

  subscribe(channel: string, handler: (message: string) => void): void {
    this.subClient.subscribe(channel, (err) => {
      if (err) {
        throw new ServiceError(REDIS_ERRORS.SUBSCRIBE_ERROR, { details: [{ key: channel }] });
      }
    });
    this.logger.log(`Subscribed to ${channel} successfully`);

    this.subClient.on(SUBSCRIBE_EVENT_TYPE.MESSAGE, (subscribedChannel, data) => {
      if (subscribedChannel === channel) {
        handler(JSON.parse(data));
      }
    });
  }

  async onModuleDestroy(): Promise<void> {
    await Promise.all([this.cacheClient.quit(), this.pubClient.quit(), this.subClient.quit()]);
  }
}
