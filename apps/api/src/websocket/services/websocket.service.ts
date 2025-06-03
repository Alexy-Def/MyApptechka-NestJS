import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class WebSocketService {
  @WebSocketServer()
  server: Server;

  emit<T>(channel: string, data: T): void {
    this.server.emit(channel, data);
  }
}
