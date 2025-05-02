/* eslint-disable no-console */
import { WebSocketGateway, WebSocketServer, OnGatewayInit } from '@nestjs/websockets';
import { Server } from 'socket.io';

import { RedisService, CHANNELS } from '@modules/redis';

@WebSocketGateway({ cors: true })
export class NotificationGateway implements OnGatewayInit {
  @WebSocketServer()
  server: Server;

  constructor(private readonly redisService: RedisService) {}

  afterInit(): void {
    this.redisService.subscribe(CHANNELS.NEWS, (message: string) => {
      this.server.emit(CHANNELS.NEWS, message);
    });
  }
}
