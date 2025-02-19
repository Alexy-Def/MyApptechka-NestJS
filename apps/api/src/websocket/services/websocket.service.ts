import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class WebSocketService {
  @WebSocketServer()
  server: Server;

  emit(channel: string, message: string): void {
    this.server.emit(channel, message);
  }
}
