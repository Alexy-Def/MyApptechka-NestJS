export enum PROVIDER_TOKENS {
  REDIS_CACHE = 'REDIS_CACHE',
  REDIS_PUB = 'REDIS_PUB',
  REDIS_SUB = 'REDIS_SUB',
}

export enum SUBSCRIBE_EVENT_TYPE {
  MESSAGE = 'message',
  PMESSAGE = 'pmessage',
}

export const CHANNELS = {
  NEWS: 'news_channel',
};
