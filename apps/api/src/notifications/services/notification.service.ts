import { OnModuleInit } from '@nestjs/common';
import { WebSocketGateway } from '@nestjs/websockets';

import { RedisService, CHANNELS } from '@modules/redis';
import { WebSocketService } from '@modules/websocket';

@WebSocketGateway({ cors: true })
export class NotificationService implements OnModuleInit {
  constructor(private readonly redisService: RedisService, private readonly webSocketService: WebSocketService) {}

  onModuleInit(): void {
    this.subscribeToNewsChannel();
  }

  subscribeToNewsChannel(): void {
    this.redisService.subscribe(CHANNELS.NEWS, (message) => {
      this.webSocketService.emit(CHANNELS.NEWS, message);
    });
  }
}
