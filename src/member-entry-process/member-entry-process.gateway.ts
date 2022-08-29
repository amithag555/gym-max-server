import { Logger } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MemberEntryProcessGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger: Logger = new Logger('MemberEntryProcessGateway');

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  afterInit(server: Server) {
    this.logger.log('Initialized!');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('memberEntryServer')
  memberEntry(@MessageBody() data: any): void {
    this.server.emit('memberEntryClient', data);
  }

  @SubscribeMessage('adminConfirmServer')
  adminConfirm(@MessageBody() memberSocketId: string): void {
    this.server.to(memberSocketId).emit('adminConfirmClient', memberSocketId);
  }

  @SubscribeMessage('adminUnconfirmedServer')
  adminUnconfirmed(@MessageBody() memberSocketId: string): void {
    this.server
      .to(memberSocketId)
      .emit('adminUnconfirmedClient', memberSocketId);
  }
}
