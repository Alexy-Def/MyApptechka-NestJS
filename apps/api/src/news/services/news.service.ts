import { Injectable } from '@nestjs/common';

import { RedisService, CHANNELS } from '@modules/redis';

import { PUBLISH_NEWS_NOTIFICATION } from '../constants';
import { CreateNewsData } from '../types';

@Injectable()
export class NewsService {
  constructor(private readonly redisService: RedisService) {}

  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  async createNews(body: CreateNewsData): Promise<void> {
    // for example: save news in db

    await this.redisService.publish(CHANNELS.NEWS, PUBLISH_NEWS_NOTIFICATION);
  }
}
