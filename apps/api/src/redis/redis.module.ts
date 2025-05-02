import { Global, Module } from '@nestjs/common';
import Redis from 'ioredis';

import { REDIS } from 'config';

import { PROVIDER_TOKENS } from './constants';
import { RedisService } from './services';

@Global()
@Module({
  providers: [
    RedisService,
    {
      provide: PROVIDER_TOKENS.REDIS_CACHE,
      useFactory: (): Redis => new Redis({ host: REDIS.HOST, port: REDIS.PORT }),
    },
    {
      provide: PROVIDER_TOKENS.REDIS_PUB,
      useFactory: (): Redis => new Redis({ host: REDIS.HOST, port: REDIS.PORT }),
    },
    {
      provide: PROVIDER_TOKENS.REDIS_SUB,
      useFactory: (): Redis => new Redis({ host: REDIS.HOST, port: REDIS.PORT }),
    },
  ],
  exports: [RedisService],
})
export class RedisModule {}
